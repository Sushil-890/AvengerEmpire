import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App'
import axios from 'axios'
import './index.css'

// Configure Axios Base URL for Production
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

// Razorpay SDK Load
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
script.async = true;
document.body.appendChild(script);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
