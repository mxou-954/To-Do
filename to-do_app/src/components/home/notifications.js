import React, { useState, useEffect } from "react";

export default function Notifications() {
  const [notifAmis, setNotifAmis] = useState([]);
  const [nonVue, setNonVue] = useState(() => {
    // Récupérer l'état depuis localStorage lors de l'initialisation
    const savedState = localStorage.getItem("nonVue");
    return savedState ? JSON.parse(savedState) : {};
  });

  useEffect(() => {
    const checkNotification = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/notification", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setNotifAmis(data);
        } else {
          const errorData = await response.json();
          console.log("Erreur de la réponse :", errorData.err);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la connexion :", err);
      }
    };
    checkNotification();
  }, []);

  const handleNotifVue = (id) => {
    setNonVue((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id],
      };
      // Enregistrer le nouvel état dans localStorage
      localStorage.setItem("nonVue", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="div_generale">
      <div className="container_mesTasks">
        <h1>Vos Notifications :</h1>
        <div className="container_notifs_details">
          {notifAmis.length === 0 ? (
            <p>Aucune notification</p>
          ) : (
            notifAmis.map((notif) => (
              <div className="NotificationContainer" key={notif._id}>
                <div
                  className="notifs"
                  onClick={() => handleNotifVue(notif._id)}
                >
                  <div className="notif-header">
                    <div
                      className={`notif-icon ${
                        nonVue[notif._id] ? "true" : "false"
                      }`}
                    >
                      <i className="fas fa-bell"></i>
                    </div>
                    <div className="notif-content">
                      <div className="notif-title">{notif.nom}</div>
                      <div className="notif-message">{notif.message}</div>
                    </div>
                  </div>
                  <div className="notif-time">
                    {new Date(notif.date).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}