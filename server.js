const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/api/articles', async (req, res) => {
  const { category, page, query } = req.query;
  let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}&pageSize=10&page=${page}`;
  
  if (query) {
    url = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;
  } else if (category) {
    url += `&category=${category}`;
  }

  console.log(`Fetching URL: ${url}`);

  try {
    const response = await axios.get(url);
    console.log('API response data:', response.data);
    res.json(response.data.articles);
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      res.status(error.response.status).json({
        message: 'Error fetching articles from NewsAPI',
        error: error.response.data,
      });
    } else if (error.request) {
      console.error('Request data:', error.request);
      res.status(500).json({ message: 'No response received from NewsAPI' });
    } else {
      console.error('Error message:', error.message);
      res.status(500).json({ message: 'Error in setting up the request' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
