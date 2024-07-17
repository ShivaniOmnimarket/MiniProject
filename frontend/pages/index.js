// frontend/pages/index.js
import React from 'react';
import { wrapper } from '../store/store';
import StockTable from '../components/StockTable';

const Home = () => {
  return (
    <div>
      <h1>Real-Time Stock/Crypto Prices</h1>
      <StockTable />
    </div>
  );
};

export default wrapper.withRedux(Home);
