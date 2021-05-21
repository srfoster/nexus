import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {SpellContextProvider} from './Components/Context';
import ReactGA from 'react-ga';
ReactGA.initialize('G-J6N2NMKYC9'); // add your tracking id here.
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  // <SpellContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  // </SpellContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
