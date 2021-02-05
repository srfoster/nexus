import './App.css';
import React, { useState } from 'react';
import AuthApiService from './Services/auth-api-service';

const LoginForm = (props) => {
  const [error, setError] = useState(null);

  const handleSubmitJwtAuth = (e) => {
    e.preventDefault()

    const { username, password } = e.target;

    AuthApiService.postLogin({
      username: username.value,
      password: password.value,
    })
      .then(user => {
        // console.log("Existing user logging in");
        username.value = ''
        password.value = ''
        // props.onLoginSuccess()
      })
      .catch(res => {
        setError(res.error);
      })
    }

    return (
    <>
      <div>
        <form
          className="LoginForm"
          onSubmit={(e) => handleSubmitJwtAuth(e)}
        >
          <label htmlFor="userName">Username: </label><br/>
          <input className='username' type='text' required id='username'></input>

          <label htmlFor="password">Password:</label><br/>
          <input className='password' type='password' required id='password'></input>

          <input type="submit" value="Log In" className="formButton"/>
        </form>

      </div>
      <div role='alert'>
        {error ? <p className='red'>{error}</p> : null}
      </div>
    </>
  )
};

function App() {
  return (
    <div className="App">
      <LoginForm />
    </div>
  );
}

export default App;
