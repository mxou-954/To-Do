import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";
import Home from "./components/home/home";
import Inscription from "./components/home/inscription";
import Connexion from "./components/home/connexion";
import { UserProvider } from "./UserContext";
import Navbar from "./components/home/navbar";
import Amis from "./components/home/amis";
import Historique from "./components/home/historique";
import Taches from "./components/home/taches";
import Calendrier from "./components/home/calendrier";
import Profil from "./components/home/profil";
import ResetPassword from "./components/home/reset-password";
import Newpassword from "./components/home/newpassword";
import MesAmis from "./components/home/mes-taches";
import TachesPartagees from "./components/home/taches-partagees";
import Statistiques from "./components/home/statistiques";
import Chart_etatTache from "./components/home/chartetatTache";
import Notifications from "./components/home/notifications";
import TacheDetail from "./components/home/tacheDetail";
import Contacter from "./components/home/contacter";

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/newpassword/:token" element={<Newpassword />} />
              <Route path="/mes-taches" element={<MesAmis />} />
              <Route path="/taches-partagees" element={<TachesPartagees />} />
              <Route path="/statistiques" element={<Statistiques />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/chart" element={<Chart_etatTache />} />
              <Route path="/tache/:tacheId" element={<TacheDetail />} />
              <Route path="/amis" element={<Amis />} />
              <Route path="/aide-support" element={<Contacter />} />
              <Route path="/historique" element={<Historique />} />
              <Route path="/taches/:tacheId" element={<Taches />} />
              <Route path="/calendrier" element={<Calendrier />} />
              <Route path="/profil" element={<Profil />} />
            </Routes>
          </main>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
