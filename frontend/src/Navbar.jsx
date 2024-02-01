import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

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
    <>
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard/${user}" className="navbar-logo" onClick={closeMobileMenu}>
                  
                  <p><i class="fa-solid fa-code"></i>&nbsp;
                        BizChina   &nbsp;
                        <i class="fa-solid fa-code"></i>
                  </p>
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                  <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
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
    </>
  );
}

export default Navbar