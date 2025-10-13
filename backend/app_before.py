from flask import Flask, request, jsonify, redirect, url_for, session
from flask import send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from uuid import uuid4
from dotenv import load_dotenv
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from main import agent_executor,HumanMessage,AIMessage

# Load environment variables
load_dotenv()

# Flask setup
app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'supersecretkey')

# Uploads config
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Database setup
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)
users = mongo.db.Users
sessions= mongo.db.Sessions

# Allow CORS (for frontend)
CORS(app, supports_credentials=True)

# OAuth setup
app.config['SERVER_NAME'] = 'localhost:5000'

oauth = OAuth(app)
CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'

google = oauth.register(
    name='google',
    client_id=os.environ.get('GOOGLE_CLIENT_ID'),
    client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
    server_metadata_url=CONF_URL,
    client_kwargs={'scope': 'openid email profile'}
)

# Optional explicit redirect URI (useful in dev)
REDIRECT_URI = os.environ.get('REDIRECT_URI')
FRONTEND_URL = os.environ.get('FRONTEND_URL')
CORS_ORIGINS = os.environ.get('CORS_ORIGINS').split(',')
#CORS(app, resources={r"/*/*": {"origins": CORS_ORIGINS}}, supports_credentials=True)

# Session cookie settings for local dev
app.config['SESSION_COOKIE_SAMESITE'] = os.environ.get('SESSION_COOKIE_SAMESITE', 'Lax')
app.config['SESSION_COOKIE_SECURE'] = os.getenv('SESSION_COOKIE_SECURE', 'False').lower() in ('true', '1')

# -------------------- ROUTES --------------------


@app.route("/")
def home():
    return "🏁 Welcome to the Formula 1 Agent API!"


@app.route('/google/')
def google_login():
    """Redirect user to Google for authentication"""
    redirect_uri = REDIRECT_URI or url_for('google_auth', _external=True)
    print(f"Redirecting to Google OAuth: {redirect_uri}")
    # Generate and store a nonce for OIDC validation
    oidc_nonce = str(uuid4())
    session['oidc_nonce'] = oidc_nonce
    return google.authorize_redirect(redirect_uri, nonce=oidc_nonce,prompt="consent")


@app.route('/google/auth/')
def google_auth():
    """Handle Google callback and store user info, create a chat session and redirect to frontend"""
    print("Received callback from Google...")

    token = google.authorize_access_token()

    # Validate ID token with stored nonce
    oidc_nonce = session.pop('oidc_nonce', None)
    try:
        user_info = google.parse_id_token(token, nonce=oidc_nonce)
    except Exception as e:
        print(f"ID token parsing failed: {e}. Falling back to userinfo endpoint.")
        resp = google.get('https://openidconnect.googleapis.com/v1/userinfo')
        user_info = resp.json() if resp else None

    if not user_info:
        return jsonify({"error": "Authentication failed"}), 400

    print("Google user info received:", user_info)

    # Extract relevant info
    email = user_info.get('email')
    name = user_info.get('name')

    if not email:
        return jsonify({"error": "Missing email in Google data"}), 400

    # Check if user already exists
    existing_user = users.find_one({"email": email})

    if existing_user:
        print("User already exists in database.")
        user_data = existing_user
        # Backfill profile image from Google if not set
        if user_info.get('picture') and not user_data.get('photo_url'):
            users.update_one({"_id": user_data["_id"]}, {"$set": {"photo_url": user_info.get('picture')}})
    else:
        # Create a new user entry
        user_data = {
            "user_id": str(uuid4()),
            "user_name": name,
            "email": email,
            "created_at": datetime.utcnow(),
            "photo_url": user_info.get('picture'),
            "favorite_driver": None,
            "favorite_team": None
        }
        users.insert_one(user_data)
        print("New user added to database:", user_data)

    # Save user session (Flask session)
    session['user'] = {
        "user_id": user_data["user_id"],
        "user_name": user_data["user_name"],
        "email": user_data["email"]
    }



    # Redirect to frontend chat UI with session_id query param
    redirect_url = f"{FRONTEND_URL}"
    return redirect(redirect_url)


@app.route('/logout/')
def logout():
    """Logout user"""
    session.pop('user', None)
    return jsonify({"message": "Logged out successfully."})

# Create a new session
@app.route("/api/session", methods=["POST"])
def create_session_api():
    session_id = str(uuid4())
    owner_id = None
    user = session.get('user')
    if user:
        owner_id = user.get('user_id')

    doc = {
        "_id": session_id,
        "created_at": datetime.utcnow(),
        "messages": [],
        "visible": True
    }
    if owner_id:
        doc["user_id"] = owner_id

    sessions.insert_one(doc)
    return jsonify({"session_id": session_id})

# Chat with the bot
# Chat with the bot (API)
@app.route("/api/chat", methods=["POST"])
def chat_api():
    data = request.json
    session_id = data.get("session_id")
    query = data.get("query")

    if not session_id or not query:
        return jsonify({"error": "session_id and query are required"}), 400

    s = sessions.find_one({"_id": session_id, "visible": True})
    if not s:
        return jsonify({"error": "Session does not exist. Please create a session first."}), 404

    response = agent_executor.invoke(
        {"messages": [HumanMessage(content=query)]},
        config={"configurable": {"thread_id": session_id}}
    )
    agent_reply = response["messages"][-1].content

    # Set title if not set yet
    if "title" not in s:
        sessions.update_one(
            {"_id": session_id},
            {"$set": {"title": query[:50]}}  # limit length
        )

    # Push both messages in one call
    sessions.update_one(
        {"_id": session_id},
        {
            "$push": {
                "messages": {
                    "$each": [
                        {"role": "user", "content": query},
                        {"role": "agent", "content": agent_reply}
                    ]
                }
            }
        }
    )

    return jsonify({"response": agent_reply})


@app.route("/api/sessions", methods=["GET"])
def list_sessions_api():
    user = session.get('user')
    query_filter = {"visible": True}
    if user:
        query_filter["user_id"] = user.get('user_id')
    else:
        # if no logged-in user, return empty list to avoid exposing others' sessions
        return jsonify([])

    all_sessions = sessions.find(query_filter, {"_id": 1, "title": 1}).sort("created_at", -1)

    session_list = []
    for s in all_sessions:
        session_list.append({
            "session_id": s["_id"],
            "name": s.get("title", "Unnamed Session")
        })

    return jsonify(session_list)

# Who am I (login check)
@app.route("/api/me/", methods=["GET"])  # allow trailing slash
def me_api():
    user = session.get('user')
    if not user:
        return jsonify({"logged_in": False}), 200
    # augment minimal session payload with profile fields
    db_user = users.find_one({"user_id": user.get('user_id')})
    profile = None
    if db_user:
        profile = {
            "user_id": db_user.get('user_id'),
            "user_name": db_user.get('user_name'),
            "email": db_user.get('email'),
            "photo_url": db_user.get('photo_url'),
            "favorite_driver": db_user.get('favorite_driver'),
            "favorite_team": db_user.get('favorite_team'),
        }
    return jsonify({"logged_in": True, "user": profile or user}), 200

# Static serving for uploaded files
@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Get profile
@app.route('/api/profile', methods=['GET'])
def get_profile():
    user = session.get('user')
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    db_user = users.find_one({"user_id": user.get('user_id')})
    if not db_user:
        return jsonify({"error": "Not found"}), 404
    return jsonify({
        "user_id": db_user.get('user_id'),
        "user_name": db_user.get('user_name'),
        "email": db_user.get('email'),
        "photo_url": db_user.get('photo_url'),
        "favorite_driver": db_user.get('favorite_driver'),
        "favorite_team": db_user.get('favorite_team'),
    })

# Update profile (favorites only)
@app.route('/api/profile', methods=['PUT'])
def update_profile():
    user = session.get('user')
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json or {}
    update = {}
    if 'favorite_driver' in data:
        update['favorite_driver'] = data.get('favorite_driver')
    if 'favorite_team' in data:
        update['favorite_team'] = data.get('favorite_team')
    if not update:
        return jsonify({"message": "Nothing to update"})
    users.update_one({"user_id": user.get('user_id')}, {"$set": update})
    return jsonify({"message": "Profile updated"})

# Upload profile photo
@app.route('/api/profile/photo', methods=['POST'])
def upload_profile_photo():
    user = session.get('user')
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    f = request.files['file']
    if f.filename == '':
        return jsonify({"error": "No selected file"}), 400
    ext = os.path.splitext(f.filename)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        return jsonify({"error": "Invalid file type. Allowed: png, jpg, jpeg"}), 400
    fname = secure_filename(f"{user.get('user_id')}{ext}")
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], fname)
    f.save(save_path)
    public_url = url_for('serve_upload', filename=fname, _external=True)
    users.update_one({"user_id": user.get('user_id')}, {"$set": {"photo_url": public_url}})
    return jsonify({"photo_url": public_url})

# Get message history of a session
@app.route("/api/session/<session_id>", methods=["GET"])
def get_history_api(session_id):
    s = sessions.find_one({"_id": session_id, "visible": True})
    if not s:
        return jsonify({"error": "Session not found"}), 404
    return jsonify({"messages": s["messages"]})

# Delete a session
@app.route("/api/session/<session_id>", methods=["DELETE"])
def delete_session_api(session_id):
    result = sessions.update_one({"_id": session_id}, {"$set": {"visible": False}})

    if result.matched_count > 0:
        return jsonify({"message": f"Session {session_id} deleted successfully."})
    else:
        return jsonify({"error": "Session not found."}), 404

@app.route("/api/check_session/<session_id>", methods=["GET"])
def check_session_api(session_id):
    s = sessions.find_one({"_id": session_id})
    if s:
        return jsonify({"found": True, "session": s})
    else:
        return jsonify({"found": False, "message": "Session not found"})
    
# Rename a session
@app.route("/api/session/<session_id>/rename", methods=["PUT"])
def rename_session_api(session_id):
    data = request.json
    new_title = data.get("title", "").strip()

    if not new_title:
        return jsonify({"error": "New title is required"}), 400

    result = sessions.update_one(
        {"_id": session_id},
        {"$set": {"title": new_title[:50]}}  # Limit length
    )

    if result.modified_count == 1:
        return jsonify({"message": "Session renamed successfully."})
    else:
        return jsonify({"error": "Session not found or unchanged."}), 404


# Global error handler for unhandled exceptions
@app.errorhandler(Exception)
def handle_exception(e):
    # Log the real error for debugging
    import traceback
    print("Internal server error:", traceback.format_exc())
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)#,use_reloader=False)