import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './images/bizchinalogo.webp';

function Navbar({ user }) {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const showButton = () => {
    if(window.innerWidth <= 960) {
      setButton(false);
    } else{
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <nav className="navbar">
            <div className="navbar-container">
                <Link to={`/dashboard/${user}`} className="navbar-logo" onClick={closeMobileMenu}>
                  
                  <img src={logo} id='bizchinalogo'></img>
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                <ion-icon name="grid-outline" color="light"></ion-icon>

                </div>
                <ul className={click ? 'nav-menu active': 'nav-menu'}>
                  <li className='nav-item'>
                    <Link to={`/chat/${user}`} className='nav-links' onClick={closeMobileMenu}>
                      Chat
                    </Link>
                  </li>

                  <li className='nav-item'>
                    <Link to={`/calendar/${user}`} className='nav-links' onClick={closeMobileMenu}>
                      Calendar
                    </Link>
                  </li>

                
                  </ul>
                  
            </div>
        </nav>
  )};
export default Navbar
