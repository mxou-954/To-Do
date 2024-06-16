import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Inscription() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmitInscription = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const donnees = { username, email, password };

    try {
      const response = await fetch("http://localhost:3000/api/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donnees),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Utilisateur créé avec succès:", data);
        alert("Votre compte a bien été créer. Veuillez vous connecter ;)")
      } else {
        const errorData = await response.json();
        console.log("Erreur:", errorData.err);
      }
    } catch (err) {
      console.log("Problème lors de l'envoi ou la réception des données:", err);
    }
  };


  return (
    <div className="div_generale">
      <div className="form-container">
        <h2>Inscription</h2>
        <form onSubmit={handleSubmitInscription}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirm-password">
              Confirmer le mot de passe :
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-submit">
            S'inscrire
          </button>
          <div className="liens_affiliees_inscription">
            <Link to="/connexion">Connexion</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

