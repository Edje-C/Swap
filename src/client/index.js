import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';

ReactDOM.hydrate(
  <BrowserRouter>
    <App {...window.__APP_INITIAL_STATE__}/>
  </BrowserRouter>,
  document.getElementById('root')
);