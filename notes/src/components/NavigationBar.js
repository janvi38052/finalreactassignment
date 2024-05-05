import React from 'react';
import { NavLink } from 'react-router-dom';
import { AuthData } from '../auth/AuthWrapper';
import './NavigationBar.css'; // Import CSS file

const NavigationBar = ({ handleLogout }) => {
  const { user } = AuthData();

  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/dashboard" activeClassName="active">
            Dashboard
          </NavLink>
        </li>
      </ul>
      <div className="user-info">
        <p>Welcome, {user.name}!</p>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
