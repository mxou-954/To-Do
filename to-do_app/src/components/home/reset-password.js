import React, { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendEmail = async (event) => {
    event.preventDefault();

    const donnees = { email };

    try {
      const response = await fetch("http://localhost:3000/api/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donnees),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage("Un email de réinitialisation a été envoyé.");
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.err}`);
      }
    } catch (err) {
      setMessage("Problème lors de l'envoi ou la réception des données");
    }
  };

  return (
    <div className="div_generale">
      <div className="reinitialisation_password">
        <h2>
          Si vous appuyez sur ce button, vous consentez à recevoir un email de réinitialisation à l'adresse suivante :
        </h2>
        <form onSubmit={handleSendEmail}>
          <div className="form-group">
            <label htmlFor="email">Entrez votre email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Je ne me souviens plus de mon mot de passe</button>
          </div>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
