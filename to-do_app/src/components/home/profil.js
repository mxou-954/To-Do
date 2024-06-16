import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Profil() {
  const [etatConnexion, setEtatConnexion] = useState(false);
  const [name, setName] = useState("");
  const [aboutMe, setAboutMe] = useState('Description about me...');
  const [completedTasks, setCompletedTasks] = useState(10);
  const [ongoingProjects, setOngoingProjects] = useState(5);
  const [averageTimePerTask, setAverageTimePerTask] = useState('2 hours');
  const [modify, setModify] = useState(false);

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

  const handlemodify = (event) => {
    setModify(true);
    console.log(modify);
  };

  const handleFinishModify = (event) => {
    setModify(false);
  };

  if (modify === true) {
    return (
      <div className="div_generale_Profile">
        <div className="modification">
          <div className="modifsImage">
            <Link to={"/#"}>
              <div className="modifsBaniere"></div>
            </Link>
            <div className="referenceProfil">
              <Link to={"/#"}>
                <div className="imageProfil"></div>
              </Link>
            </div>
          </div>

          <div className="profileContainer">
            <button onClick={handleFinishModify}>Valider les changements</button>
            <div className="modifsTextuelles">
              <h2>Qui suis je :</h2>
              <div className="modifsUsername">
              <p>Nom :</p>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="modifApropos">
              <p>A propos de moi :</p>
                <textarea 
                  value={aboutMe} 
                  onChange={(e) => setAboutMe(e.target.value)}
                >
                </textarea>
              </div>
              
              <div className="modifsPassword">
                <Link to={"/#"}>Modifier mon mot de passe</Link>
              </div>
            </div>

            <div className="modifsTextuelles">
              <h2>Statistiques Personnelles</h2>
              <p>Tâches complétées : {completedTasks}</p>
              <p>Projets en cours : {ongoingProjects}</p>
              <p>Temps moyen par tâche : {averageTimePerTask}</p>
            </div>

            <div className="modifsTextuelles">
              <h2>Calendrier Personnel</h2>
            </div>

            <div className="modifsTextuelles">
              <h2>Réseaux Sociaux</h2>
              <p>
                <a href="https://www.linkedin.com">LinkedIn</a> |
                <a href="https://www.twitter.com">Twitter</a> |
                <a href="https://www.github.com">GitHub</a>
              </p>
            </div>

            <div className="modifsTextuelles">
              <h2>Activité Récente</h2>
              <ul>
                <li>Activité 1</li>
                <li>Activité 2</li>
              </ul>
            </div>

            <div className="modifsTextuelles">
              <h2>Notifications</h2>
              <ul>
                <li>Notification 1</li>
                <li>Notification 2</li>
              </ul>
            </div>

            <div className="modifsTextuelles">
              <h2>Contact Rapide</h2>
              <p>
                <Link to={"/#"}>Envoyer un message</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="div_generale_Profile">
        <div className="modification">
          <div className="modifsImage">
            <Link to={"/#"}>
              <div className="modifsBaniere"></div>
            </Link>
            <div className="referenceProfil">
              <Link to={"/#"}>
                <div className="imageProfil"></div>
              </Link>
            </div>
          </div>

          <div className="profileContainer">
            <button onClick={handlemodify}>Modifier Mon Profil</button>
            <div className="modifsTextuelles">
              <h2>Qui suis je :</h2>
              <div className="modifsUsername">
                <Link to={"/#"}>Nom : {name}</Link>
              </div>
              <div className="modifApropos">
                <p>A propos de moi :</p>
              </div>
            </div>

            <div className="modifsTextuelles">
              <h2>Statistiques Personnelles</h2>
              <p>Tâches complétées : {}</p>
              <p>Projets en cours : {}</p>
              <p>Temps moyen par tâche : {}</p>
            </div>

            <div className="modifsTextuelles">
              <h2>Calendrier Personnel</h2>
            </div>

            <div className="modifsTextuelles">
              <h2>Réseaux Sociaux</h2>
              <p>
                <a href="https://www.linkedin.com">LinkedIn</a> |
                <a href="https://www.twitter.com">Twitter</a> |
                <a href="https://www.github.com">GitHub</a>
              </p>
            </div>

            <div className="modifsTextuelles">
              <h2>Activité Récente</h2>
              <ul>
                <li>Activité 1</li>
                <li>Activité 2</li>
              </ul>
            </div>

            <div className="modifsTextuelles">
              <h2>Notifications</h2>
              <ul>
                <li>Notification 1</li>
                <li>Notification 2</li>
              </ul>
            </div>

            <div className="modifsTextuelles">
              <h2>Contact Rapide</h2>
              <p>
                <Link to={"/#"}>Envoyer un message</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
