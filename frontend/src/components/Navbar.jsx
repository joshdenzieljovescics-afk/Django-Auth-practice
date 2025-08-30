import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const {isAuthorized, logout} = useAuth();
  

  const handleLogout = () =>{
    logout();
    navigate('/');
  };

  return (
    <div className="navbar">
      <Link>
        <img src={logo} alt="Logo" className="navbar-logo-link" />
      </Link>
      <ul className="navbar-menu-left">
        <li>
          <Link to="/why">Why Us?</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <ul className="navbar-menu-right">
        {isAuthorized ? (
          <>
          <li className="dashboard-icon">
            <Link to = "/dashboard">DB</Link>
          </li>
          <li>
            <Link onClick={handleLogout} to="/logout" className="button-link">
              Logout
            </Link>
          </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="button-link-login">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="button-link">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
