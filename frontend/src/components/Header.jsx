import React from "react";
import "../styles/Header.css";
import bgwomen from "../assets/bg-woman.jpg";

const Header = () => {
    return (
        <header className="header">
            <img src={bgwomen} alt="Background Woman" className="header-bg"/>
            <div className="header-content">
                 <h1>Put your money to work</h1>
                 <h3>Buy from us now!</h3>
                 <button>Start Buying</button>
            </div>
        </header>
    )
}

export default Header;
