import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../../store/authSlice';
import api from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { getRoleFromToken } from '../../utils/auth';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make a POST request to register the user
      const response = await api.post('/auth/register', { username, password });

      // On success, log in the user automatically
      console.log(response,"response::::::::::")
      dispatch(loginSuccess(response.data.token)); 
      const role = getRoleFromToken(response.data.token);
      if(role == "admin"){
        navigate("/adminPanel")
      } else {
        navigate("/emergency-home")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      dispatch(loginFailure(err.response?.data?.message || "Registration failed"));
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required  value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Email" required value={password}
        onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
