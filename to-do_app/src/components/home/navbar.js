import React, { useState } from "react";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleTasksMenu = () => {
    setIsTasksOpen(!isTasksOpen);
  };

  const handleLinkClick = () => {
    if (isOpen) {
      toggleNavbar();
    }
  };

  return (
    <nav className="navbar">
      <Link to='/' className="navbar-brand"><span>T</span>ask<span>M</span>anager</Link>
      <ul className={isOpen ? "open" : ""}>
        <li><Link to="/connexion" onClick={handleLinkClick}>Connexion</Link></li>
        <li><Link to="/" onClick={handleLinkClick}>Tableau de Bord</Link></li>
        <li><Link to="/calendrier" onClick={handleLinkClick}>Calendrier</Link></li>
        <li className="dropdown">
          <button className="dropdown-toggle" onClick={toggleTasksMenu}>
            Tâches <i className={`fas fa-chevron-${isTasksOpen ? "up" : "down"}`}></i>
          </button>
          <ul className={isTasksOpen ? "open" : ""}>
            <li><Link to="/mes-taches" onClick={handleLinkClick}>Mes Tâches</Link></li>
            <li><Link to="/taches-partagees" onClick={handleLinkClick}>Tâches Partagées</Link></li>
          </ul>
        </li>
        <li><Link to="/statistiques" onClick={handleLinkClick}>Statistiques</Link></li>
        <li><Link to="/notifications" onClick={handleLinkClick}>Notifications
        <div className="notificate">
        </div></Link></li>
        <li><Link to="/amis" onClick={handleLinkClick}>Amis</Link></li>
        <li><Link to="/aide-support" onClick={handleLinkClick}>Aide/Support</Link></li>
      </ul>
      <button className="navbar-toggler" onClick={toggleNavbar}>
        <span></span>
      </button>
    </nav>
  );
}
