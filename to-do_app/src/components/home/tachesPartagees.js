import React, { useState, useEffect } from "react";

export default function TachesPartagees() {
  const [etatConnexion, setEtatConnexion] = useState(false);
  const [name, setName] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    dateEnvoie: new Date().toISOString().slice(0, 10), // Valeur par défaut pour la date d'envoi
    dateFin: new Date().toISOString().slice(0, 10), // Valeur par défaut pour la date de fin
    importance: "D",
    etat: "Nouvelle",
    amis: "",
  });
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmitTaskPartagees = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/tachePartagees", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Tâche créée:", data);
      } else {
        const errorData = await response.json();
        console.error("Erreur:", errorData.err);
      }
    } catch (err) {
      console.error(
        "Problème lors de l'envoi ou la réception des données:",
        err
      );
    }
  };

  return (
    <form onSubmit={handleSubmitTaskPartagees} className="task-form">
      <div className="form-group">
        <label>
          Nom:
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Description:
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Date d'envoie:
          <input
            type="date"
            name="dateEnvoie"
            value={formValues.dateEnvoie}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Date de fin:
          <input
            type="date"
            name="dateFin"
            value={formValues.dateFin}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Importance:
          <select
            name="importance"
            value={formValues.importance}
            onChange={handleChange}
          >
            <option value="A">A (Très important)</option>
            <option value="B">B (Important)</option>
            <option value="C">C (À faire)</option>
            <option value="D">D (Faut bien le faire un jour)</option>
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          État:
          <select name="etat" value={formValues.etat} onChange={handleChange}>
            <option value="Nouvelle tache">Nouvelle tache</option>
            <option value="En cours">En cours</option>
            <option value="Terminee">Terminée</option>
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          Partager à :
          <select name="amis" value={formValues.amis} onChange={handleChange}>
                          <option> - </option>
{friends.map((friend, index) => (
              <option key={index} value={friend}>
                {friend}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" className="submit-button">
        Ajouter
      </button>
    </form>
  );
}
