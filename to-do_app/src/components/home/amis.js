import React, { useEffect, useState } from "react";

export default function Friends() {
  const [email, setEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");

  const handleFriend = async (event) => {
    event.preventDefault();

    const donnees = {
      email,
    };

    try {
      const response = await fetch("http://localhost:3000/api/addFriend", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donnees),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Ami ajouté avec succès:", data);
      } else {
        const errorData = await response.json();
        console.log("Erreur de la réponse :", errorData.err);
      }
    } catch (err) {
      console.error("Erreur lors de la vérification de la connexion :", err);
    }
  };

  useEffect(() => {
    const checkFriends = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/myfriends", {
          credentials: "include",
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setFriends(data);
          } else {
            setMessage("Aucun amis");
          }
        } else {
          const errorData = await response.json();
          console.log("Erreur de la réponse :", errorData.err);
          setMessage("Erreur de la réponse : " + errorData.err);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la connexion :", err);
        setMessage("Erreur lors de la vérification de la connexion");
      }
    };
    checkFriends();
  }, []);

  return (
    <div className="div_generale">
      <div className="general_friend">
        <h1>Ajoutez des amis</h1>
        <form id="signupForm" onSubmit={handleFriend}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Ajouter</button>
        </form>
        
      </div><div className="listeAmis">
          <h2>Mes amis</h2>
          <ul>
            {friends.map((friend, index) => (
              <li key={index}>{friend}</li>
            ))}
          </ul>
          <p>{message}</p>
        </div>
    </div>

  );
}
