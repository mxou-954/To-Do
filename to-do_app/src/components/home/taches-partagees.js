import React, { useState, useEffect } from "react";
import TachesPartagees from "./tachesPartagees";


export default function MesTaches() {
    const [tachesPartagees, setTachesPartagees] = useState([]); 
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
    
      useEffect(() => {
        console.log("useEffect triggered"); // Ajout d'un log pour vérifier si useEffect est déclenché
    
        const checkTasksPartagees = async () => {
          try {
            const response = await fetch(
              "http://localhost:3000/api/getTachesPartagees",
              {
                credentials: "include",
                method: "GET",
              }
            );
    
            console.log("Response status:", response.status); // Log du statut de la réponse
    
            if (response.ok) {
              const data = await response.json(); // Attendre la conversion en JSON
              console.log("Réponse des tâches personnelles :", data);
              setTachesPartagees(data);
            } else {
              const errorData = await response.json();
              console.log("Erreur de la réponse :", errorData.err);
            }
          } catch (err) {
            console.error("Erreur lors de la vérification de la connexion :", err);
          }
        };
    
        checkTasksPartagees();
      }, []);

  return (
    <div className="div_generale">
      <div className="container_mesTasks">
          <h1>Les taches partagées avec moi :</h1>
        <div className="container_task_details">
              {tachesPartagees.length === 0 ? (
                <p>Aucune tâche personnelle trouvée.</p>
              ) : (
                tachesPartagees.map((taches) => (
                  <div className="tachePerso" key={taches._id}>
                    <h3>{taches.name}</h3>
                    <p>{taches.description}</p>
                    <p>{taches.dateFin}</p>
                    <p>{taches.importance}</p>
                    <p>{taches.etat}</p>
                  </div>
                ))
              )}
          </div>
      </div>
    </div>
  );
}