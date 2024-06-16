import "../styles/styles.css"; // Assurez-vous que le chemin d'accès est correct et que vous utilisez .css à la fin.
import React, { useState, useEffect } from "react";
import TachesPerso from "./tachesPerso";
import TachesPartagees from "./tachesPartagees";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [etatConnexion, setEtatConnexion] = useState(false);
  const [name, setName] = useState("");
  const [toggleState, setToggleState] = useState(false);
  const [tachesPersos, setTachesPersos] = useState([]);
  const [tachesPartagees, setTachesPartagees] = useState([]);

  const [tacheCritiqueperso, setTacheCritiqueperso] = useState([]);
  const [tacheImportanteperso, setTacheImportanteperso] = useState([]);
  const [tacheModereeperso, setTacheModereeperso] = useState([]);
  const [tacheFaibleperso, setTacheFaibleperso] = useState([]);

  const [tacheCritiquepartagee, setTacheCritiquepartagee] = useState([]);
  const [tacheImportantepartagee, setTacheImportantepartagee] = useState([]);
  const [tacheModereepartagee, setTacheModereepartagee] = useState([]);
  const [tacheFaiblepartagee, setTacheFaiblepartagee] = useState([]);

  const [value, setValue] = useState(new Date());
  const [filter, setFilter] = useState('');
  const [selectedTache, setSelectedTache] = useState(null);
  const navigate = useNavigate();



  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleButtonAddTask = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleToggleChange = (event) => {
    setToggleState(event.target.checked);
  };

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

          const nombreTachesCritiquesPerso = data.filter(
            (tache) => tache.importance === "A"
          ).length;
          setTacheCritiqueperso(nombreTachesCritiquesPerso);

          const nombreTachesImportantePerso = data.filter(
            (tache) => tache.importance === "B"
          ).length;
          setTacheImportanteperso(nombreTachesImportantePerso);

          const nombreTachesmodereePerso = data.filter(
            (tache) => tache.importance === "C"
          ).length;
          setTacheModereeperso(nombreTachesmodereePerso);

          const nombreTachesFaiblePerso = data.filter(
            (tache) => tache.importance === "D"
          ).length;
          setTacheFaibleperso(nombreTachesFaiblePerso);
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

          const nombreTachesCritiquespartagee = data.filter(
            (tache) => tache.importance === "A"
          ).length;
          setTacheCritiquepartagee(nombreTachesCritiquespartagee);

          const nombreTachesImportantepartagee = data.filter(
            (tache) => tache.importance === "B"
          ).length;
          setTacheImportantepartagee(nombreTachesImportantepartagee);

          const nombreTachesmodereepartagee = data.filter(
            (tache) => tache.importance === "C"
          ).length;
          setTacheModereepartagee(nombreTachesmodereepartagee);

          const nombreTachesFaiblepartagee = data.filter(
            (tache) => tache.importance === "D"
          ).length;
          setTacheFaiblepartagee(nombreTachesFaiblepartagee);
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




  const handleSelectChange = (event) => {
    setFilter(event.target.value);
  };


  const handleClickTache = (tacheId) => {
    navigate(`/tache/${tacheId}`);
  };




  console.log("État des tâches personnelles :", tachesPersos);

  return (
    <div className="home-container">
      <main className="home-main">
        <div className="partTopSite">
          <div className="calendar">
            <h2>Calendrier</h2>
            <Calendar onChange={handleChange} value={value} />
          </div>

          <div className="statistics">
            <h2>Statistiques</h2>
            <div className="stats">
              <p>
                Taches Critique :{" "}
                <span className="badge tache-critique">
                  {tacheCritiqueperso + tacheCritiquepartagee}
                </span>
              </p>
              <p>
                Taches Importante :{" "}
                <span className="badge tache-importante">
                  {tacheImportanteperso + tacheImportantepartagee}
                </span>
              </p>
              <p>
                Taches Modérée :{" "}
                <span className="badge tache-moderee">
                  {tacheModereeperso + tacheModereepartagee}
                </span>
              </p>
              <p>
                Taches Faible :{" "}
                <span className="badge tache-faible">
                  {tacheFaibleperso + tacheFaiblepartagee}
                </span>
              </p>
            </div>
          </div>

          <div className="addTask">
            <button className="add-task-button" onClick={handleButtonAddTask}>
              Ajouter une tache
            </button>

            <div className="filter-container">
        <label htmlFor="importanceFilter" className="filter-label">Filtrer par importance: </label>
        <select id="importanceFilter" className="filter-select" value={filter} onChange={handleSelectChange}>
          <option value="">Toutes</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="Nouvelle">Nouvelle</option>
          <option value="En cours">En cours</option>
          <option value="Terminee">Terminee</option>
        </select>
      </div>
          </div>
        </div>

        <div className="partBottomSite">
          <div className="shared-tasks_container">
            <div className="shared-tasks">
              <h3>Taches Partagées</h3>
            </div>
            <div className="taches_perso_detail">
              {tachesPersos.length === 0 ? (
                <p>Aucune tâche personnelle trouvée.</p>
              ) : (
                tachesPartagees
                .filter(tache => filter === '' || tache.importance === filter)
                .filter(tache => filter === '' || tache.etat === filter)
                .map((tache) => (
                  <div className="tachePerso" key={tache._id} onClick={() => handleClickTache(tache._id)}>
  <h3>{tache.name}</h3>
  <p className="description"><strong>Description :</strong> {tache.description}</p>
  <p className="date_fin"><strong>Fin :</strong> {new Date(tache.dateFin).toLocaleDateString('fr-FR')}</p>
  <p className="etat"><strong>État :</strong> {tache.etat}</p>
  <span className={`importance_tache_badge ${tache.importance === 'D' ? 'blue' : tache.importance === 'C' ? 'green' : tache.importance === 'B' ? 'yellow' : 'red'}`}>{tache.importance}</span>
</div>
                ))
              )}
            </div>
          </div>

          <div className="personal-tasks_container">
            <div className="personal-tasks">
              <h3>Taches Perso</h3>
            </div>
            <div className="taches_perso_detail">
              {tachesPersos.length === 0 ? (
                <p>Aucune tâche personnelle trouvée.</p>
              ) : (
                tachesPersos
                .filter(tache => filter === '' || tache.importance === filter)
                .filter(tache => filter === '' || tache.etat === filter)
                .map((tache) => (
                  <div className="tachePerso" key={tache._id} onClick={() => handleClickTache(tache._id)}>
  <h3>{tache.name}</h3>
  <p className="description"><strong>Description :</strong> {tache.description}</p>
  <p className="date_fin"><strong>Fin :</strong> {new Date(tache.dateFin).toLocaleDateString('fr-FR')}</p>
  <p className="etat"><strong>État :</strong> {tache.etat}</p>
  <span className={`importance_tache_badge ${tache.importance === 'D' ? 'blue' : tache.importance === 'C' ? 'green' : tache.importance === 'B' ? 'yellow' : 'red'}`}>{tache.importance}</span>
</div>
                ))
              )}
            </div>
          </div>

          <div className="today-tasks_container">
            <div className="today-tasks">
              <h3>A faire aujourd'hui</h3>
            </div>
            <div className="taches_dayly_detail">
              <p>Une tache du jour</p>
            </div>
          </div>
        </div>
      </main>

      {/* New div that slides in from the left */}
      <div className={`side-panel ${isOpen ? "open" : ""}`}>
        <div className="taskcontainer">
          <h2>Nouvelle Tache</h2>
          <div className="switchcontainer">
            <p>Taches Personnelles</p>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={toggleState}
                onChange={handleToggleChange}
              />
              <div className="toggle-switch-background">
                <div className="toggle-switch-handle"></div>
              </div>
            </label>
            <p>Taches Partagées</p>
          </div>

          {toggleState ? <TachesPartagees /> : <TachesPerso />}
        </div>
      </div>
    </div>
  );
}
