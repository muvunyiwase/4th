# Portfolio Website with Backend API

This is a portfolio website with a contact form backend that can be deployed on Render.

## Project Structure

- `index.html` - Main portfolio website
- `css/` - CSS stylesheets
- `js/` - JavaScript files including contact form handler
- `images/` - Image assets
- `backend/` - Node.js backend API
- `render.yaml` - Render deployment configuration

## Backend Setup

The backend is a Node.js/Express application that handles contact form submissions via email.

### Prerequisites

1. Node.js 18+ installed
2. A Gmail account for sending emails
3. Render account for deployment

### Local Development

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Gmail credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

   **Note:** For Gmail, you need to use an "App Password" instead of your regular password. Enable 2-factor authentication on your Google account, then generate an app password.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. The backend will be available at `http://localhost:3001`

### API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Contact form submission endpoint

## Frontend Setup

The frontend is a static HTML portfolio website. The contact form will automatically detect whether it's running locally or in production and use the appropriate API URL.

### Local Development

1. Make sure the backend is running on `http://localhost:3001`
2. Open `index.html` in your browser
3. The contact form will connect to the local backend

## Deployment to Render

### Method 1: Using render.yaml (Recommended)

1. Push your code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the `render.yaml` file and deploy the service

### Method 2: Manual Deployment

1. Push your code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name:** portfolio-backend
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Health Check Path:** `/api/health`
6. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail app password
7. Click "Create Web Service"

### Setting Up Email on Render

1. After deployment, go to your service settings on Render
2. Navigate to "Environment" section
3. Add the following environment variables:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail app password
4. Redeploy the service

## Testing the Contact Form

1. After deployment, visit your Render service URL (e.g., `https://portfolio-backend.onrender.com`)
2. Navigate to the contact form on your portfolio website
3. Fill out the form and submit
4. You should receive:
   - A confirmation email in your inbox (sent to the submitter)
   - An email notification in your Gmail account (sent to you)

## Troubleshooting

### Email Not Sending
1. Verify your Gmail credentials are correct
2. Make sure you're using an "App Password" not your regular password
3. Check Render logs for any email errors

### Form Submission Fails
1. Check browser console for JavaScript errors
2. Verify the backend is running and accessible
3. Test the health endpoint: `https://your-service.onrender.com/api/health`

### CORS Issues
The backend is configured with CORS enabled. If you encounter CORS issues:
1. Check that the frontend is using the correct API URL
2. Verify the backend CORS configuration in `server.js`

## Security Notes

1. Never commit `.env` files to version control
2. Use environment variables for sensitive data
3. Consider adding rate limiting to the contact endpoint
4. Add input validation and sanitization
5. Consider using a dedicated email service like SendGrid for production

## License

This project is based on a TemplateMo template. See the original template for licensing information.