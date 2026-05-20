const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://new-shoe-brand.myshopify.com/'
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('OZEV API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});