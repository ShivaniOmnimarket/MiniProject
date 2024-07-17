// frontend/components/StockTable.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, setSymbol } from '../store/actions';

const StockTable = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.stocks.data);
  const symbol = useSelector((state) => state.stocks.symbol) || 'GOOG';

  useEffect(() => {
    dispatch(fetchData(symbol));
    const interval = setInterval(() => {
      dispatch(fetchData(symbol));
    }, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div>
      <button onClick={() => dispatch(setSymbol(prompt('Enter symbol (e.g., GOOG, bitcoin):', symbol)))}>
        Change Symbol
      </button>
      <table>
        <thead>
          <tr>
            <th>Price</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.price}</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
