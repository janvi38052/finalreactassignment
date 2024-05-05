import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthData } from '../auth/AuthWrapper';
import './LoginForm.css';

const LoginForm = () => {
  const { login } = AuthData(); // use AuthData hook to access context
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const doLogin = async () => {
    try {
      if (userName === 'Janvi' && password === 'password') {
        await login(userName, password);
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login page</h2>
        <div className="form-group">
          <input
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="form-group">
          <button className="btn-login" onClick={doLogin}>Log in</button>
        </div>
        {errorMessage && <div className="error">{errorMessage}</div>}
        <div className="form-group">
          <p>Forgot your password? <a href="/forgotpassword">Reset it here</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
