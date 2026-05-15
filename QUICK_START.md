# Quick Start Guide

## Your Backend is Ready for Render Deployment!

### Current Status
✅ Backend structure created  
✅ Contact form JavaScript updated  
✅ Render configuration ready  
✅ Port conflict issues resolved  

### How to Test Locally

1. **Start the backend** (in one terminal):
   ```bash
   cd backend
   npm run simple
   ```
   Server will start on port 3000 (or next available port: 3000 → 3001 → 3002 → etc.)

2. **Open the frontend**:
   - Open `index.html` in your browser
   - The contact form will connect to `http://localhost:3000/api` (or detected port)

3. **Test the contact form**:
   - Fill out the form
   - Click "Send"
   - You should see a success message

### How to Deploy to Render

#### Option A: Easy Blueprint Deployment
1. Push all files to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically deploy using `render.yaml`

#### Option B: Manual Deployment
1. Push to GitHub
2. On Render: "New +" → "Web Service"
3. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Health Check Path:** `/api/health`

### Email Setup (Required for Production)

1. **Enable 2FA on Gmail**
2. **Generate App Password**:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Generate password for "Mail"
3. **Add to Render Environment Variables**:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: The 16-character app password

### Files Created

#### Backend (`backend/`)
- `server.js` - Main server with email functionality (for production)
- `simple-server.js` - Simple test server (use `npm run simple` for local testing)
- `package.json` - Dependencies and scripts

#### Frontend Updates
- `js/contact-form.js` - Handles form submission
- Updated `index.html` - Uses JavaScript form handler

#### Deployment
- `render.yaml` - Render blueprint configuration
- `README.md` - Full documentation
- `DEPLOYMENT_GUIDE.md` - Step-by-step Render guide

### Troubleshooting

#### Port Already in Use
If you see `EADDRINUSE` error:
- Use `npm run simple` (auto-finds available port: 3000 → 3001 → 3002 → etc.)
- The simple server automatically finds the next available port

#### Form Not Working
1. Check browser console (F12 → Console)
2. Verify backend is running: `http://localhost:3000/api/health` (or detected port)
3. Check network tab for API requests

#### Email Not Sending (Production)
1. Verify Gmail app password is correct
2. Check Render logs for errors
3. Test with simple server first

### Next Steps

1. **Test locally** with `npm run simple`
2. **Deploy to Render** using the blueprint
3. **Configure email** in Render environment variables
4. **Test deployed version** with real form submissions

### Support
- Render Docs: https://render.com/docs
- Node.js on Render: https://render.com/docs/deploy-node-js
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

Your backend is now ready for production deployment on Render! 🚀