import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { RootState } from "../store";
const Header: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const role = localStorage.getItem('role')
  const handleLogOut = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.clear()
    dispatch(logout());

    navigate("/login");
  }
  const handleAdminPanel = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin-panel");
  }
  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  }

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-logo">Emergency Help </div>
        <ul className="navbar-links">
          {role && role == 'admin' && <li><button type="button" onClick={handleAdminPanel} className="navbar-button">Admin Panel</button></li>}
          {token ? <li><button type="button" onClick={handleLogOut} className="navbar-button">Log Out</button></li> :
            <li><button type="button" onClick={handleLogIn} className="navbar-button">Log In</button></li>}

        </ul>
        <button className="navbar-toggle" aria-label="Toggle navigation">
          ☰
        </button>
      </nav>
    </header>
  );
};

export default Header;
