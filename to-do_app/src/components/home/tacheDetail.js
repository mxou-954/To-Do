import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TacheDetail() {
  const { tacheId } = useParams();
  const [tache, setTache] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState([]);

  useEffect(() => {
    const checkTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/tachePerso/${tacheId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setTache(data);
        } else {
          const errorData = await response.json();
          console.log("Erreur de la réponse :", errorData.err);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la connexion :", err);
      }
    };

    checkTasks();
  }, [tacheId]);

  useEffect(() => {
    const checkMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/getmessages/${tacheId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setMsg(data);
        } else {
          const errorData = await response.json();
          console.log("Erreur de la réponse :", errorData.err);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la connexion :", err);
      }
    };
    checkMessages();
  }, [tacheId]);

  const handleDelete = async (id) => {
    if (typeof id !== "string") {
      console.error("Invalid tacheId:", id);
      return;
    }

    // Afficher une alerte de confirmation
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette tâche ?"
    );

    if (!confirmation) {
      // Si l'utilisateur clique sur "Annuler", ne pas procéder à la suppression
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/delete/tachePerso/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Tâche supprimée avec succès:", data.message);
        // Rediriger après la suppression
        navigate(`/`);
      } else {
        const errorData = await response.json();
        console.log("Erreur de la réponse :", errorData.err);
      }
    } catch (err) {
      console.error("Erreur lors de la vérification de la connexion :", err);
    }
  };

  const handleSendMessage = async (id) => {
    const donnees = {
      message,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/message/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donnees),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        const errorData = await response.json();
        console.log("Erreur de la réponse :", errorData.err);
      }
    } catch (err) {
      console.error("Erreur lors de la vérification de la connexion :", err);
    }
  };

  if (!tache) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="div_generaletask">
      <div className="container_mesTasksDetails">
        <h1>{tache.name}</h1>
        <div className="container_tache_details">
        <div className="wrapper_titleandimportance">
        <div className="taskdetail_title">
          <h2 className="task_title">Détails de la tâche</h2>
        </div>
        <div className="taskdetail_importance">
        <span className={`importance_tache_badge ${tache.importance === 'D' ? 'blue' : tache.importance === 'C' ? 'green' : tache.importance === 'B' ? 'yellow' : 'red'}`}>{tache.importance}</span>
        </div>
        </div>
          <div className="task_content">
            <div className="task_detail">
              <p>
                <strong>Description :</strong> {tache.description}
              </p>
              <p>
                <strong>Fin :</strong>{" "}
                {new Date(tache.dateFin).toLocaleDateString("fr-FR")}
              </p>
              <p>
                <strong>État :</strong> {tache.etat}
              </p>
            </div>
          </div>
          <div className="wrapper-task-actions">
            <div className="task-api-calendrier">
              <button className="calendrier_button_windows">
                Ajouter à mon calendrier
              </button>
            </div>
            <div className="task_actions">
              <button className="delete" onClick={() => handleDelete(tacheId)}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="chat_task">
        <div className="messages">
          {msg.length === 0 ? (
            <p>Aucun message trouvé.</p>
          ) : (
            msg.map((message) => (
              <div className="messages_detail" key={message._id}>
                <p>{message.message}</p>
                <p className="date">
                  {new Date(message.date).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="input_message">
          <form onClick={() => handleSendMessage(tacheId)}>
            <input
              placeholder="Envoyez un message "
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></input>
            <button type="submit">Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  );
}
