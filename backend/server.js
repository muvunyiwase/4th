const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, website, branding, ecommerce, seo, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }

  const services = [];
  if (website === '1') services.push('Websites');
  if (branding === '1') services.push('Branding');
  if (ecommerce === '1') services.push('Ecommerce');
  if (seo === '1') services.push('Database Administrator');

  const { error } = await supabase
    .from('contacts')
    .insert([{ name, email, services, message }]);

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save message. Please try again.' });
  }

  res.json({ success: true, message: 'Message sent successfully!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
