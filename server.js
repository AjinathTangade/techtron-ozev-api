const express = require('express');
const cors = require('cors');
require('dotenv').config();

const installerRoutes = require('./routes/installerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    const allowed = [
      /\.myshopify\.com$/,
      /\.shopify\.com$/,
      /^https:\/\/new-shoe-brand\.myshopify\.com$/,
    ];

    const isAllowed = allowed.some(pattern =>
      typeof pattern === 'string'
        ? origin === pattern
        : pattern.test(origin)
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

app.use('/api/installers', installerRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('OZEV API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
