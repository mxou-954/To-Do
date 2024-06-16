import React, { useState, useEffect } from "react";
import TachesPerso from "./tachesPerso";


export default function MesTaches() {
    const [tachesPersos, setTachesPersos] = useState([]); 
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
    
        const checkTasksPersonnelles = async () => {
          try {
            const response = await fetch(
              "http://localhost:3000/api/getTachesPersos",
              {
                credentials: "include",
                method: "GET",
              }
            );
    
            console.log("Response status:", response.status); // Log du statut de la réponse
    
            if (response.ok) {
              const data = await response.json(); // Attendre la conversion en JSON
              console.log("Réponse des tâches personnelles :", data);
              setTachesPersos(data);
            } else {
              const errorData = await response.json();
              console.log("Erreur de la réponse :", errorData.err);
            }
          } catch (err) {
            console.error("Erreur lors de la vérification de la connexion :", err);
          }
        };
    
        checkTasksPersonnelles();
      }, []);
  return (
    <div className="div_generale">
      <div className="container_mesTasks">
          <h1>Mes taches :</h1>
        <div className="container_task_details">
            {tachesPersos.length === 0 ? (
              <p>Aucune tâche personnelle trouvée.</p>
            ) : (
              tachesPersos.map((tache) => (
                <div className="tachePerso" key={tache._id}>
                  <h3>{tache.name}</h3>
                  <p>{tache.description}</p>
                  <p>{tache.dateFin}</p>
                  <p>{tache.importance}</p>
                  <p>{tache.etat}</p>
                </div>
              ))
            )}
          </div>
      </div>
    </div>
  );
}
