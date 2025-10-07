# RadioCheck-F1-Assistant 🏎️📻

**RadioCheck-F1-Assistant** is an AI-powered assistant that delivers real-time Formula 1 insights through natural conversation. Ask about driver and constructor standings, championship odds with Monte Carlo simulations, race weather forecasts, and watch official YouTube highlights—all presented in a clean, interactive interface. Built with React, Python agents powered by Google Gemini, and orchestrated through LangGraph, RadioCheck brings the paddock to your fingertips.

![Formula 1 Chatbot](frontend/src/assets/singapore%20grand%20prix.jpg)

## ✨ Features

### 🏆 **Driver & Constructor Standings**

Get real-time F1 championship standings with detailed points breakdowns for drivers and teams.

### 📊 **Championship Predictions**

Ask about any driver's championship chances and get Monte Carlo simulation-based probability estimates with detailed race-by-race projections.

### 🌤️ **Race Weather Forecasts**

Check weather conditions for upcoming or past Grand Prix locations with conversational, human-readable summaries.

### 🎥 **YouTube Highlights**

Watch official Formula 1 race highlights directly through the chat interface. Supports event-specific searches with year filtering.

### 💬 **Rich Chat Interface**

- **Markdown rendering** with tables, links, and formatting
- **Authentication** with Google Sign-In
- **Session management** to track conversation history
- **Responsive design** optimized for desktop and mobile

### 🔧 **AI-Powered Agent System**

- Built with **LangGraph** for intelligent agent orchestration
- Powered by **Google Gemini** for natural language understanding
- Modular agent architecture for easy extensibility

---

## 🚀 Tech Stack

### Frontend

- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **React Markdown** for rich text rendering
- **Axios** for API communication

### Backend

- **Python 3.12+** with FastAPI
- **LangGraph** for agent orchestration
- **Google Gemini API** for LLM capabilities
- **YouTube Data API v3** for video search
- **OpenWeather API** for weather data
- **Web scraping** for F1 standings data

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** 3.12+
- **npm** or **yarn**
- API Keys:
  - Google Gemini API Key
  - YouTube Data API v3 Key
  - OpenWeather API Key

### 1. Clone the Repository

```bash
git clone https://github.com/Arfa-Ahsan/RadioCheck-F1-Assistant.git
cd RadioCheck-F1-Assistant
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and add your API keys
# See .env.example for required variables
```

**Environment Variables** (create a `.env` file in the `backend/` directory):

```env
GEMINI_API_KEY=your_gemini_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
.venv\Scripts\activate  # Windows
python main.py
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns).

---

## 🎯 Usage

1. **Sign in** with your Google account
2. **Ask questions** like:
   - "Give me the driver standings"
   - "What chance does Max Verstappen have to win the championship?"
   - "Show me highlights of the Monaco Grand Prix 2024"
   - "What is the weather at the Singapore Grand Prix?"
3. **View results** formatted with tables, links, and rich text
4. **Browse sessions** to revisit previous conversations

---

## 🗂️ Project Structure

```
RadioCheck-F1-Assistant/
├── backend/
│   ├── agents/                  # AI agent modules
│   │   ├── standings_agent.py   # Driver/constructor standings
│   │   ├── champ_estimate.py    # Championship predictions
│   │   ├── weather_agent.py     # Weather forecasts
│   │   └── youtube_highlights_agent.py  # YouTube search
│   ├── scraped_data/            # F1 standings JSON data
│   ├── web_scraping/            # Data scraping scripts
│   ├── uploads/                 # User uploaded files
│   ├── main.py                  # FastAPI + LangGraph orchestrator
│   ├── app.py                   # Additional backend logic
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Environment variables (not committed)
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ChatAssistant.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── GoogleSignIn.jsx
│   │   │   └── ProfileModal.jsx
│   │   ├── api/                 # API client
│   │   ├── assets/              # Images and static files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🤖 Agents Overview

### **Standings Agent**

Fetches and formats driver and constructor championship standings from scraped F1 data.

### **Championship Estimator**

Uses Monte Carlo simulations to predict championship probabilities based on current points, remaining races, and historical performance.

### **Weather Agent**

Provides location-based weather forecasts for Grand Prix circuits using OpenWeather API and F1 circuit location data.

### **YouTube Highlights Agent**

Searches the official Formula 1 YouTube channel for race highlights with:

- Event-specific queries (e.g., "Monza Grand Prix")
- Year filtering and extraction
- Relevance-based ordering with date fallback
- Event alias mapping (Monza ↔ Italian Grand Prix)

---

## 🛠️ Development

### Run Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Build for Production

**Frontend:**

```bash
cd frontend
npm run build
```

**Backend:**
Deploy with your preferred Python hosting service (e.g., Railway, Render, AWS Lambda).

---

## 🔒 Security Notes

- Never commit `.env` files or API keys
- Use environment variables for all secrets
- Backend validates authentication tokens
- CORS is configured for frontend origin only

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Formula 1** for the sport and data
- **Google Gemini** for LLM capabilities
- **LangChain/LangGraph** for agent orchestration
- **OpenWeather** for weather data
- **YouTube Data API** for video search

---

## 📧 Contact

**Arfa Ahsan**

- GitHub: [@Arfa-Ahsan](https://github.com/Arfa-Ahsan)
- Repository: [RadioCheck-F1-Assistant](https://github.com/Arfa-Ahsan/RadioCheck-F1-Assistant)

---

## 🏁 Roadmap

- [ ] Add support for driver/team comparison
- [ ] Implement real-time race updates
- [ ] Add lap time analysis
- [ ] Support for historical season data
- [ ] Voice input support

---

**Built with ❤️ for Formula 1 fans by fans.**
