import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {SpellContextProvider} from './Components/Context';
// import { ThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";


// const darkTheme = createMuiTheme({
//   palette: {
//     type: 'dark'
//   }
// }); 

// const lightTheme = createMuiTheme({})

ReactDOM.render(
  // <SpellContextProvider>
      // <ThemeProvider theme={darkTheme ? darkTheme : lightTheme}>
      //   <CssBaseline />
      //   <BrowserRouter>
      //     <App />
      //   </BrowserRouter>,
      // </ThemeProvider>,
    <HashRouter>
      <App />
    </HashRouter>,
  // </SpellContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
