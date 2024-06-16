import "../styles/styles.css"; // Assurez-vous que le chemin d'accès est correct et que vous utilisez .css à la fin.
import React, { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';


export default function Statistiques() {
  const [etatConnexion, setEtatConnexion] = useState(false);
  const [name, setName] = useState("");
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

  const [tachesPartageesAuxAutres, setTachesPartageesAuxAutres] = useState([]);
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

  useEffect(() => {
    const checkDonneesUtilisateur = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/profils_utilisateurs",
          {
            credentials: "include",
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(
            "Voici le data que l'on recois",
            JSON.stringify(data, null, 2)
          );

          const nombreTachespartagee = data.tachesPartageesAuxAutres.length;
          setTachesPartageesAuxAutres(nombreTachespartagee);
        } else {
          const errorData = await response.json();
          console.log("Erreur de la réponse :", errorData.err);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la connexion :", err);
      }
    };

    checkDonneesUtilisateur();
  }, []);

  const nouvellesTaches = tachesPersos.filter(
    (tache) => tache.etat === "Nouvelle"
  ).length;
  const tachesEnCours = tachesPersos.filter(
    (tache) => tache.etat === "En cours"
  ).length;
  const tachesTerminees = tachesPersos.filter(
    (tache) => tache.etat === "Terminee"
  ).length;

  const nouvellesTachesPartagee = tachesPartagees.filter(
    (tache) => tache.etat === "Nouvelle"
  ).length;
  const tachesEnCoursPartagee = tachesPartagees.filter(
    (tache) => tache.etat === "En cours"
  ).length;
  const tachesTermineesPartagee = tachesPartagees.filter(
    (tache) => tache.etat === "Terminee"
  ).length;




  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  const tachesEnRetard = tachesPersos.filter(
    (tache) =>
      new Date(tache.dateFin) < new Date() &&
      tache.etat !== "Terminee" &&
      tache.importance === "D"
  ).length;

  const tachesEnRetardPartagee = tachesPartagees.filter(
    (tache) =>
      new Date(tache.dateFin) < new Date() &&
      tache.etat !== "Terminee" &&
      tache.importance === "D"
  ).length;

  const tachesEnRetardcritiques = tachesPersos.filter(
    (tache) =>
      new Date(tache.dateFin) < new Date() &&
      tache.etat !== "Terminee" &&
      tache.importance === "A"
  ).length;

  const tachesEnRetardPartageecritiques = tachesPartagees.filter(
    (tache) =>
      new Date(tache.dateFin) < new Date() &&
      tache.etat !== "Terminee" &&
      tache.importance === "A"
  ).length;

  const tachesEnRetardimportante = tachesPersos.filter(
    (tache) =>
      new Date(tache.dateFin) < new Date() &&
      tache.etat !== "Terminee" &&
      tache.importance === "B"
  ).length;

  const tachesEnRetardPartageeimportante = tachesPartagees.filter(
    (tache) =>
      new Date(tache.dateFin) < new Date() &&
      tache.etat !== "Terminee" &&
      tache.importance === "B"
  ).length;

  const tachesEnRetardmoderee = tachesPersos.filter(
    (tache) =>
      new Date(tache.dateFin) < new Date() &&
      tache.etat !== "Terminee" &&
      tache.importance === "C"
  ).length;

  const tachesEnRetardPartageemoderee = tachesPartagees.filter(
    (tache) =>
      new Date(tache.dateFin) < new Date() &&
      tache.etat !== "Terminee" &&
      tache.importance === "C"
  ).length;

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance) {
      chartInstance.destroy();
    }

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Critique', 'Importante', 'Modérée', 'Faible'],
        datasets: [{
          label: 'Toutes Vos Taches',
          data: [
            tacheCritiqueperso + tacheCritiquepartagee,
            tacheImportanteperso + tacheImportantepartagee,
            tacheModereeperso + tacheModereepartagee,
            tacheFaibleperso + tacheFaiblepartagee
          ],
          backgroundColor: [
            '#d32f2f', // Critique
            '#fbc02d', // Importante
            '#388e3c', // Modérée
            '#1976d2'  // Faible
          ],
          borderWidth: 1,
          borderRadius: 10,
          barPercentage: 1,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(
              tacheCritiqueperso + tacheCritiquepartagee,
              tacheImportanteperso + tacheImportantepartagee,
              tacheModereeperso + tacheModereepartagee,
              tacheFaibleperso + tacheFaiblepartagee
            ) + 2, // Ajouter de l'espace au-dessus des barres
            ticks: {
              font: {
                size: 14,
              },
              color: '#333',
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.2)',
            }
          },
          x: {
            ticks: {
              font: {
                size: 14,
              },
              color: '#333',
            },
            grid: {
              display: false,
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 16,
              },
              color: '#333',
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: {
              size: 16,
            },
            bodyFont: {
              size: 14,
            },
            footerFont: {
              size: 12,
            },
            cornerRadius: 4,
          },
        }
      }
    });

    setChartInstance(newChartInstance);

    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [
    tacheCritiqueperso,
    tacheCritiquepartagee,
    tacheImportanteperso,
    tacheImportantepartagee,
    tacheModereeperso,
    tacheModereepartagee,
    tacheFaibleperso,
    tacheFaiblepartagee
  ]);

  return (
    <div className="div_generale">
      <div className="container_mesTasks">
        <h1>Statistiques :</h1>
        <div className="container_stat_details">
          <div className="total_Task">
          <h2>Total de vos taches GRAPHIQUE</h2>
          <canvas ref={chartRef}></canvas>

          </div>

          <div className="textuelles">
            <p className="main-text">
              Toutes mes taches :{" "}
              <span className="highlight-text">
                {tacheCritiqueperso +
                  tacheCritiquepartagee +
                  tacheImportanteperso +
                  tacheImportantepartagee +
                  tacheModereeperso +
                  tacheModereepartagee +
                  tacheFaibleperso +
                  tacheFaiblepartagee}
              </span>
            </p>
            <p className="sub-text">
              Dont personnelles :{" "}
              {tacheCritiqueperso +
                tacheImportanteperso +
                tacheModereeperso +
                tacheFaibleperso}
            </p>
            <p className="sub-text">
              Dont partagées a moi :{" "}
              {tacheCritiquepartagee +
                tacheImportantepartagee +
                tacheModereepartagee +
                tacheFaiblepartagee}
            </p>
            <p className="sub-text">
              Dont que j'ai partagées : {tachesPartageesAuxAutres}
            </p>
          </div>

          <div className="textuelles2">
          <h2>Total de vos taches</h2>
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

          <div className="textuelles3">
            <p className="main-text">
              Nouvelles Tâches : {nouvellesTaches + nouvellesTachesPartagee}
            </p>
            <p className="main-text">
              Tâches En cours : {tachesEnCours + tachesEnCoursPartagee}
            </p>
            <p className="main-text">
              Tâches Terminées : {tachesTerminees + tachesTermineesPartagee}
            </p>
            <p className="main-text">
              Tâches En retard totales:{" "}
              {tachesEnRetard +
                tachesEnRetardPartagee +
                tachesEnRetardcritiques +
                tachesEnRetardPartageecritiques +
                tachesEnRetardimportante +
                tachesEnRetardPartageeimportante +
                tachesEnRetardmoderee +
                tachesEnRetardPartageemoderee}
            </p>
            <p className="sub-text">
              Dont Critique :
              <span className="badge tache-critique">
                {tachesEnRetardcritiques + tachesEnRetardPartageecritiques}
              </span>
            </p>
            <p className="sub-text">
              Dont Importante :
              <span className="badge tache-importante">
              {tachesEnRetardimportante + tachesEnRetardPartageeimportante}
              </span>
            </p>
            <p className="sub-text">
              Dont Modérée :
              <span className="badge tache-moderee">
              {tachesEnRetardmoderee + tachesEnRetardPartageemoderee}
              </span>
            </p>
            <p className="sub-text">
              Dont Faible : 
              <span className="badge tache-faible">
              {tachesEnRetard + tachesEnRetardPartagee}
              </span>
            </p>
          </div>
          <div className="textuelles4">
            <button className="task-button">Generer des graphiques</button>
          </div>
        </div>
      </div>
    </div>
  );
}
