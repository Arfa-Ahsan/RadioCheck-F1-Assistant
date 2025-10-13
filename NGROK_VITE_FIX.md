# 🔧 Ngrok + Vite Configuration Guide

## ❌ Error You're Seeing

```
Blocked request. This host ("a92732efffc9.ngrok-free.app") is not allowed.
To allow this host, add "a92732efffc9.ngrok-free.app" to `server.allowedHosts` in vite.config.js.
```

---

## 🔍 What This Means

**Vite Security Feature:** Vite blocks unknown hosts by default to prevent DNS rebinding attacks. When you access your app through ngrok's URL, Vite doesn't recognize it as a trusted host and blocks the request.

---

## ✅ Solution Applied

I've updated your `vite.config.js` to allow ngrok domains:

```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,
    strictPort: false,
    hmr: {
      clientPort: 443, // Use HTTPS port for HMR over ngrok
    },
    allowedHosts: [
      ".ngrok-free.app", // ✅ Allow all ngrok free domains
      ".ngrok.io", // ✅ Allow all ngrok paid domains
      "localhost", // ✅ Allow localhost
      "127.0.0.1", // ✅ Allow local IP
    ],
  },
});
```

---

## 🚀 Next Steps (IMPORTANT!)

### Step 1: Restart Your Frontend Server

**You MUST restart Vite for changes to take effect!**

```powershell
# Stop current frontend server (Ctrl+C in the terminal)
# Then restart:
cd D:\F1_chatbot\frontend
npm run dev
```

### Step 2: Verify Ngrok URLs

Make sure your ngrok tunnels are still running:

```powershell
# In backend directory
cd D:\F1_chatbot\backend
.venv\Scripts\activate
python live.py
```

You should see something like:

```
Backend:  https://abc123.ngrok-free.app
Frontend: https://xyz456.ngrok-free.app
```

### Step 3: Access Your App

**Use the ngrok URLs:**

- Frontend: `https://xyz456.ngrok-free.app`
- Backend API: `https://abc123.ngrok-free.app`

---

## 🔧 What Each Setting Does

### `host: true`

- Allows Vite to accept connections from network interfaces (not just localhost)
- Required for ngrok tunnels to work

### `allowedHosts`

- Whitelist of domains that can access your Vite server
- `.ngrok-free.app` - Wildcard for all ngrok free domains
- `.ngrok.io` - Wildcard for all ngrok paid domains

### `hmr.clientPort: 443`

- Hot Module Replacement (HMR) port
- Set to 443 (HTTPS) for ngrok compatibility
- Allows live reload to work through ngrok tunnel

---

## 🧪 Testing

### Test 1: Local Access (Should Still Work)

```
http://localhost:5173
```

✅ Should work as before

### Test 2: Ngrok URL (Should Now Work)

```
https://YOUR-NGROK-URL.ngrok-free.app
```

✅ Should now display your app (no more blocked error)

### Test 3: HMR/Live Reload

1. Open your app via ngrok URL
2. Edit a React component
3. Save the file
   ✅ Page should auto-reload with changes

---

## ⚠️ Common Issues After Fix

### Issue 1: Still Getting Blocked Error

**Cause:** Vite server wasn't restarted  
**Fix:** Stop frontend (Ctrl+C) and restart with `npm run dev`

### Issue 2: Ngrok Warning Screen

**What you see:** "Visit Site" button with ngrok branding  
**Fix:** This is normal for free ngrok accounts. Just click "Visit Site"

### Issue 3: Mixed Content Warnings

**What you see:** Some resources blocked due to HTTP/HTTPS mix  
**Fix:** Make sure both frontend and backend use HTTPS ngrok URLs

### Issue 4: API Calls Failing

**Cause:** Frontend trying to call localhost backend instead of ngrok backend  
**Fix:** Update your API base URL to use ngrok backend URL

---

## 🔄 For Future Use

Every time you start ngrok, you get **new random URLs**. Your vite.config.js now uses **wildcards** (`.ngrok-free.app`), so you don't need to update the config each time!

**Workflow:**

1. Start backend: `python app.py` (port 5000)
2. Start frontend: `npm run dev` (port 5173)
3. Start ngrok: `python live.py`
4. Copy ngrok URLs
5. Access via frontend ngrok URL
6. ✅ Everything should work!

---

## 📝 Alternative: Use Specific Domain

If you want to allow only YOUR specific ngrok domain:

```javascript
allowedHosts: [
  'a92732efffc9.ngrok-free.app',  // Your specific domain
  'localhost',
],
```

**But wildcards are better** because ngrok URLs change each time!

---

## 🔒 Security Note

**Why Vite blocks unknown hosts:**

- Prevents DNS rebinding attacks
- Protects against malicious requests
- Standard security practice

**Is it safe to allow ngrok?**

- ✅ Yes, for development/testing
- ✅ Ngrok provides encrypted tunnels
- ⚠️ Don't use in production
- ⚠️ Be careful what you expose publicly

---

## 🎯 Quick Fix Summary

1. ✅ **Updated `vite.config.js`** - Added ngrok to allowedHosts
2. 🔄 **Restart frontend** - Run `npm run dev` again
3. 🌐 **Access via ngrok URL** - Use the URL from `live.py`
4. ✅ **Should work now!**

---

## 💡 Pro Tips

### Tip 1: Check Current Ngrok URLs

```powershell
# If you forgot your ngrok URLs
curl http://localhost:4040/api/tunnels
```

### Tip 2: Persistent Ngrok Subdomain

With a paid ngrok account, you can get a permanent subdomain:

```powershell
ngrok http --subdomain=my-f1-app 5173
```

### Tip 3: Environment Variables

Consider using environment variables for API URLs:

```javascript
// .env.local
VITE_API_URL=https://your-backend.ngrok-free.app
```

Then use in your code:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

---

## 🆘 Still Not Working?

**Check these:**

1. **Vite server restarted?**

   ```powershell
   # Must see this after restart:
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

2. **Ngrok still running?**

   ```powershell
   python live.py
   # Should show active tunnels
   ```

3. **Using correct URL?**

   - Use the **frontend** ngrok URL (not backend)
   - Example: `https://xyz456.ngrok-free.app` (NOT `abc123.ngrok-free.app`)

4. **Browser cache?**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private window

---

**After restarting your frontend, the error should be gone!** 🎉
