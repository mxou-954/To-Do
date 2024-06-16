import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function NewPassword() {
  const { token } = useParams();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPassword2, setConfirmPassword2] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/check_token/${token}`, {
          method: "GET",
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Erreur lors de la vérification du token:", errorData);
          setMessage(`Erreur: ${errorData.err}`);
        } else {
          console.log("Token valide:", token);
        }
      } catch (err) {
        console.log("Problème lors de l'envoi ou la réception des données:", err);
        setMessage("Problème lors de l'envoi ou la réception des données");
      }
    };
    checkTokenValidity();
  }, [token]);

  const handleNewPassword = async (event) => {
    event.preventDefault();

    if (confirmPassword !== confirmPassword2) {
      return setMessage("Les mots de passe ne correspondent pas");
    }

    const donnees = { confirmPassword, confirmPassword2 };

    try {
      const response = await fetch(`http://localhost:3000/api/reset_password/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donnees),
      });

      if (response.ok) {
        setMessage("Mot de passe mis à jour avec succès");
        console.log("Mot de passe mis à jour avec succès pour le token:", token);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        console.log("Erreur lors de la mise à jour du mot de passe:", errorData);
        setMessage(`Erreur: ${errorData.err}`);
      }
    } catch (err) {
      console.log("Problème lors de l'envoi ou la réception des données:", err);
      setMessage("Problème lors de l'envoi ou la réception des données");
    }
  };

  return (
    <div className="div_generale">
      <div className="form-container">
        <h2>Créer un nouveau mot de passe</h2>
        <form onSubmit={handleNewPassword}>
          <div className="form-group">
            <label htmlFor="confirmPassword">Nouveau mot de passe :</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword2">Confirmez le mot de passe :</label>
            <input
              type="password"
              id="confirmPassword2"
              name="confirmPassword2"
              required
              value={confirmPassword2}
              onChange={(e) => setConfirmPassword2(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn-submit">
            Réinitialiser le mot de passe
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
