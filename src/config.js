
let sslState = '';

if(process.env.REACT_APP_API_ENDPOINT.includes('8000')){
  console.log('ENDPOINT: Local host');
  sslState = '';
} else {
  console.log('ENDPOINT: Heroku');
  sslState = process.env.REACT_APP_SSL;
}

export default {
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
  TOKEN_KEY: process.env.REACT_APP_TOKEN_KEY,
  SSL_STATUS: sslState,
}