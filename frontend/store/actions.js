// frontend/store/actions.js
import axios from 'axios';
import { setData } from './store';

export const fetchData = (symbol) => async (dispatch) => {
  const response = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
  dispatch(setData(response.data));
};
