# Render Deployment Guide

## Quick Start Deployment

### Step 1: Prepare Your Repository
1. Make sure all files are committed to Git
2. Push to GitHub (or GitLab/Bitbucket)

### Step 2: Deploy to Render

#### Option A: Using Blueprint (render.yaml) - Easiest
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically:
   - Detect the `render.yaml` file
   - Create a web service
   - Set up build and start commands
   - Configure environment variables

#### Option B: Manual Setup
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure settings:
   - **Name:** `portfolio-backend` (or your preferred name)
   - **Environment:** `Node`
   - **Region:** Choose closest to your audience
   - **Branch:** `main` (or your default branch)
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
5. Click "Create Web Service"

### Step 3: Configure Environment Variables
After deployment, go to your service settings:

1. Navigate to "Environment" tab
2. Add these variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (Render will override this with their own PORT)
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail App Password

**Important:** For Gmail, you need an "App Password":
1. Enable 2-Step Verification on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this 16-character password as `EMAIL_PASS`

### Step 4: Update Frontend API URL
Once deployed, your backend URL will be something like:
`https://portfolio-backend.onrender.com`

Update the `js/contact-form.js` file if needed:
```javascript
// Change this line if your backend has a different URL
const API_URL = 'https://portfolio-backend.onrender.com/api';
```

## Testing Your Deployment

### 1. Health Check
Visit: `https://your-service.onrender.com/api/health`
Should return: `{"status":"ok","message":"Backend is running"}`

### 2. Test Contact Form
1. Open your portfolio website
2. Fill out the contact form
3. Submit and check:
   - Success message appears
   - You receive a confirmation email
   - You receive a notification email

## Common Issues & Solutions

### Issue: "Failed to send message"
**Solution:**
1. Check Render logs for errors
2. Verify email credentials are correct
3. Ensure you're using Gmail App Password, not regular password

### Issue: Backend not starting
**Solution:**
1. Check build logs in Render
2. Verify `package.json` has correct start script
3. Ensure all dependencies are in `package.json`

### Issue: CORS errors
**Solution:**
The backend already has CORS enabled. If you still get errors:
1. Check that frontend is using correct API URL
2. Verify backend is accessible (test health endpoint)

## Monitoring & Maintenance

### View Logs
1. Go to your Render service
2. Click "Logs" tab
3. Monitor for errors or issues

### Environment Variables
Keep sensitive data in Render environment variables, never in code.

### Updates
To update your deployment:
1. Push changes to GitHub
2. Render will automatically redeploy
3. Monitor logs for any issues

## Cost & Scaling

### Free Tier
- Render offers a free tier with:
  - 750 hours/month (enough for 24/7 operation)
  - 512 MB RAM
  - Shared CPU

### Upgrading
If you need more resources:
1. Go to service settings
2. Click "Change Plan"
3. Choose appropriate tier

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Enable automatic updates** for dependencies
4. **Monitor logs** regularly for suspicious activity
5. **Use HTTPS** - Render provides SSL automatically

## Support
- Render Documentation: https://render.com/docs
- Node.js on Render: https://render.com/docs/deploy-node-js
- Email setup help: Check Render community forums

## Next Steps
1. Set up a custom domain (optional)
2. Add monitoring/alerting
3. Implement rate limiting
4. Add database for contact form submissions
5. Set up automated backups
## Local Development Port Conflict

If you get `EADDRINUSE: address already in use :::3000` error:

### Solution 1: Use the provided scripts
Run `start-server.bat` (Windows) or `start-server.sh` (Mac/Linux) in the backend folder.

### Solution 2: Manually kill the process
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Solution 3: Change the port
The backend now uses port 3001 by default to avoid conflicts with other common services.