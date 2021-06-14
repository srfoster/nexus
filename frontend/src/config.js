if(process.env.REACT_APP_API_ENDPOINT.includes('8000')){
  console.log('ENDPOINT: Local host');
} else {
  console.log('ENDPOINT: Production');
}

export default {
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
  TOKEN_KEY: process.env.REACT_APP_TOKEN_KEY,
  LANG_SERVER: process.env.REACT_APP_LANG_SERVER
}