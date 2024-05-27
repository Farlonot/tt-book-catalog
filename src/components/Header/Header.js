import React from "react";
import './Header.css'
import imageName from '../../img/logo.png'

function Header(){
    return(
        <div className="Header">
            <div className="btn">
                <h1>Каталог книг</h1>
            </div>
            
            <div className="company">
                Сфера Синергии
            </div>
            <div className="logo">
                <img src={imageName} alt="logo"/>
            </div>
        </div>
    )   
}

export default Header;