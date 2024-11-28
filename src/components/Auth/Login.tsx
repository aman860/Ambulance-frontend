import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../../store/authSlice';
import api from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { getRoleFromToken } from '../../utils/auth';
import { RootState } from '../../store';
const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      dispatch(loginSuccess(response.data.token));
      const role = getRoleFromToken(response.data.token);
      console.log(role, "role")
      if (role == "admin") {
        navigate("/adminPanel")
      } else {
        navigate("/emergency-home")
      }
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    }
  };

  useEffect(() => {

    if (token) {
      const role = getRoleFromToken(token);
      if (role == "admin") {
        navigate("/adminPanel")
      } else {
        navigate("/emergency-home")
      }
    }

  }, [])
  return (
    <div className="auth-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="text" placeholder="Username" required value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" required value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        <div className="auth-buttons">
          <button type="button" onClick={() => navigate("/register")}>
            Register
          </button>
          <button type="button" onClick={() => navigate("/emergency-home")}>
            Enter Without Login
          </button>
        </div>
      </form>
    </div>
    // <div>
    //   <h2>Login</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       placeholder="Username"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     <button type="submit">Login</button>
    //   </form>
    // </div>
  );
};

export default Login;
