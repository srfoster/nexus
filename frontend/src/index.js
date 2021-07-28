import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import {SpellContextProvider} from './Components/Context';
import ReactPlayer from 'react-player'
import { Container } from '@material-ui/core';
// import Level3 from './Components/NewUserFlow/Level3';

function App(props) {
  return (
    <Container maxWidth="sm">
      <p>helloooooo</p>
      <ReactPlayer
        width={"100%"}
        url={"https://codespells-org.s3.amazonaws.com/NexusVideos/2.3.ogv"}
        controls={true}
        style={{}}
        progressInterval={100}
        onProgress={(p) => { }}
        onEnded={() => {
        }}
      />

    </Container>

  )
}

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
