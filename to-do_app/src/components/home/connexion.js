import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [etatConnexion, setEtatConnexion] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const checkConnexion = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/etatConnexion",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.userId) {
            setEtatConnexion(true);
            setName(data.username);
          }
          console.log(data);
        } else {
          setEtatConnexion(false);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la connexion :", err);
      }
    };
    checkConnexion();
  }, []);

  const handleConnexion = async (event) => {
    event.preventDefault();

    const donneesSend = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:3000/api/connexion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donneesSend),
        credentials: "include", // Ajoutez cette ligne
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setName(data.username);
        setEtatConnexion(true);
      } else {
        const errorData = await response.json();
        console.log(errorData.err);
      }
    } catch (err) {
      console.log("Problème lors de l'envoi ou la réception des données:", err);
    }
  };

  const handleDeconnexion = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/deconnexion", {
            method: "DELETE",
            credentials: "include",
        });

        if (response.ok) {
            // Déconnexion réussie, mettez à jour l'état local
            setEtatConnexion(false);
            setName("");
            console.log("Déconnexion réussie");
        } else {
            const errorData = await response.json();
            console.log(errorData.err);
        }
    } catch (err) {
        console.log("Problème lors de la déconnexion :", err);
    }
};

  if (etatConnexion === true) {
    return (
      <div className="div_generale">
        <div className="welcome-container">
          <p className="welcome-message">Vous êtes connecté. Bienvenue sur votre TaskManager {name}.</p>
          <p className="info-message">
            Désormais, vous pouvez accéder à votre tableau de bord, créer des
            tâches, ajouter des amis et améliorer votre organisation.
          </p>
          <button className="btn-deconnexion" onClick={handleDeconnexion}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="div_generale">
        <div className="form-container">
          <h2>Connexion</h2>
          <form onSubmit={handleConnexion}>
            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe :</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-submit">
              Se connecter
            </button>
            <div className="liens_affiliees_inscription">
              <Link to="/inscription">Inscription</Link>
              <Link to="/reset-password">Mot de passe oublié ?</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
