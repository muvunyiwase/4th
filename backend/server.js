const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure nodemailer transporter (only if email credentials are provided)
let transporter;
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Test email configuration
  transporter.verify((error, success) => {
    if (error) {
      console.log('Email configuration error:', error);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} else {
  console.log('⚠️  Email not configured. Running in test mode.');
  console.log('   To enable email, set EMAIL_USER and EMAIL_PASS in .env file');
  
  // Create a dummy transporter that won't actually send emails
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('📧 Mock email sent:', {
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      return { messageId: 'mock-message-id' };
    }
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, website, branding, ecommerce, seo, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    // Determine selected services
    const selectedServices = [];
    if (website === '1') selectedServices.push('Websites');
    if (branding === '1') selectedServices.push('Branding');
    if (ecommerce === '1') selectedServices.push('Ecommerce');
    if (seo === '1') selectedServices.push('Database Administrator');

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Selected Services:</strong> ${selectedServices.length > 0 ? selectedServices.join(', ') : 'None selected'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>This message was sent from your portfolio website contact form.</p>
      `
    };

    // Check if email is configured
    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    
    if (isEmailConfigured) {
      // Send email
      await transporter.sendMail(mailOptions);

      // Also send confirmation to the user
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting Aboubakal',
        html: `
          <h2>Thank you for your message, ${name}!</h2>
          <p>I have received your contact form submission and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <p>${message}</p>
          <hr>
          <p>Best regards,</p>
          <p>Aboubakal</p>
          <p>Full Stack Developer</p>
          <p>Email: muvunyiwasea@gmail.com</p>
          <p>Phone: +250 784 993 92</p>
        `
      };

      await transporter.sendMail(userMailOptions);

      res.json({ 
        success: true, 
        message: 'Message sent successfully! Check your email for confirmation.' 
      });
    } else {
      // Email not configured - just log and return success
      console.log('Contact form submission (email not configured):', {
        name, email, selectedServices, message
      });
      
      res.json({ 
        success: true, 
        message: 'Message received successfully! (Test mode - email not configured)',
        data: { name, email, selectedServices, message }
      });
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // If email fails but we have other data, still return success
    if (error.code === 'EAUTH' || error.code === 'EENVELOPE') {
      // Email authentication error
      console.log('Email not configured, but form data received:', {
        name, email, selectedServices, message
      });
      
      res.json({ 
        success: true, 
        message: 'Message received! (Email not configured - test mode)',
        data: { name, email, selectedServices, message }
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to process message. Please try again later.' 
      });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📧 Email configured: ${process.env.EMAIL_USER ? 'Yes' : 'No'}`);
});