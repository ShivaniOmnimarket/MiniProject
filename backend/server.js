const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost:27017/FFDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const stockSchema = new mongoose.Schema({
  symbol: String,
  price: Number,
  timestamp: { type: Date, default: Date.now },
});

const Stock = mongoose.model('Stock', stockSchema);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/stocks/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const data = await Stock.find({ symbol }).sort({ timestamp: -1 }).limit(20);
  res.json(data);
});

const fetchCryptoPrice = async (symbol) => {
  const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
    params: {
      ids: symbol.toLowerCase(),
      vs_currencies: 'usd'
    }
  });
  return response.data[symbol.toLowerCase()].usd;
};

const fetchStockPrice = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const response = await axios.get(`https://www.alphavantage.co/query`, {
    params: {
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
      apikey: apiKey
    }
  });
  return response.data['Global Quote']['05. price'];
};

const fetchData = async () => {
  const symbols = ['GOOG', 'AAPL']; // Stocks
  const cryptoSymbols = ['bitcoin', 'ethereum']; // Cryptocurrencies

  for (const symbol of symbols) {
    try {
      const price = await fetchStockPrice(symbol);
      const newEntry = new Stock({ symbol, price });
      await newEntry.save();
    } catch (error) {
     // console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  for (const symbol of cryptoSymbols) {
    try {
      const price = await fetchCryptoPrice(symbol);
      const newEntry = new Stock({ symbol, price });
      await newEntry.save();
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }
};

setInterval(fetchData, 5000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
