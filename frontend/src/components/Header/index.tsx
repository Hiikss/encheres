import React from 'react';
import {Link} from "react-router-dom";
import './index.css'

const Header = () => {

    return (
        <header>
            <div>
                <h1>
                    <Link to="/">ENI-Enchères</Link>
                </h1>
                <div className="links">
                    <Link to="/login">Se connecter</Link>
                    <Link to="/register">S'inscrire</Link>
                </div>
            </div>
        </header>
    )
}

export default Header;