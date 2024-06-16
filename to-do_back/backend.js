const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const helmet = require("helmet");
const path = require("path");
const { userInfo, type } = require("os");
const { stat } = require("fs");

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Device-Remember-Token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
      "userid",
    ],
    exposedHeaders: ["X-Photo-Title", "X-Photo-Description"],
  })
);

app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:"], // Autoriser les images en ligne de base64
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

const uri = "mongodb://localhost:27017/To-Do";

mongoose
  .connect(uri)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.error("Échec de la connexion à MongoDB", err));

app.use(
  session({
    secret: "test",
    credentials: true,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 80000000,
    },
    store: MongoStore.create({ mongoUrl: uri }),
  })
);

app.use((req, res, next) => {
  next();
});

function checkAuth(req, res, next) {
  if (req.session.userId && req.session.username) {
    next();
  } else {
    res.status(401).send({ message: "Non authentifié" });
  }
}

const UtilisateurSchema = new mongoose.Schema({
  userId: { type: String },
  username: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  apropos: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  profileBaniere: { type: String },
  createdAt: { type: Date, default: Date.now },
  friends: [{ type: String }],
  tachesPersonnellesCrees: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Tache" },
  ],
  tachesPartageesAuxAutres: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Tache" },
  ],
  tachesPartageesParLesAutres: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Tache" },
  ],
});

const Utilisateur = mongoose.model("Utilisateur", UtilisateurSchema);

const TachesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dateEnvoie: { type: Date, default: Date.now },
  dateFin: { type: Date },
  importance: { type: String, enum: ["A", "B", "C", "D"], default: "D" },
  etat: {
    type: String,
    enum: ["Nouvelle", "En cours", "Terminee"],
    default: "Nouvelle",
  },
  creerParUser: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" },
  partageeAUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const Tache = mongoose.model("Tache", TachesSchema);

const NotificationSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  envoyeur: { type: String, required: true },
  destinataire: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date },
});

const Notification = mongoose.model("Notification", NotificationSchema);

const MessageSchema = mongoose.Schema({
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  tacheAffiliee: { type: mongoose.Schema.Types.ObjectId, ref: "Tache" },
});

const Message = mongoose.model("Message", MessageSchema);

app.post("/api/inscription", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send({ err: "Il manque des données..." });
  }

  try {
    const existingUser = await Utilisateur.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ err: "L'utilisateur avec cet email existe déjà." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    userId = req.session.userId;

    const newUser = new Utilisateur({
      userId,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).send(newUser);
  } catch (err) {
    res
      .status(500)
      .send({ err: "Impossible d'enregistrer le nouvel utilisateur" });
  }
});

app.post("/api/connexion", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ err: "Il manque l'email ou le mot de passe" });
  }

  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(400).send({ err: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, utilisateur.password);
    if (!isMatch) {
      return res.status(400).send({ err: "Mot de passe incorrect" });
    }

    req.session.userId = utilisateur._id;
    req.session.username = utilisateur.username;
    req.session.email = utilisateur.email;

    res.status(200).send(utilisateur);
  } catch (err) {
    res.status(500).send({ err: "Erreur du serveur" });
  }
});

app.get("/api/etatConnexion", (req, res) => {
  if (req.session.userId && req.session.username) {
    const donnees = {
      userId: req.session.userId,
      username: req.session.username,
      email: req.session.email,
    };

    res.status(200).send(donnees);
  } else {
    res.status(401).send({ message: "Non authentifié" });
  }
});

app.delete("/api/deconnexion", checkAuth, async (req, res) => {
  if (req.session.userId && req.session.username) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ err: "Erreur lors de la déconnexion" });
      }
      res.status(200).send({ message: "Déconnexion réussie" });
    });
  } else {
    res.status(400).send({ err: "Impossible de déconnecter l'utilisateur" });
  }
});

app.post("/api/reset_password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.error("Email manquant");
    return res.status(400).send({ err: "Email manquant" });
  }

  try {
    const findUser = await Utilisateur.findOne({ email });
    if (!findUser) {
      console.error("Aucun utilisateur n'a cet email");
      return res.status(400).send({ err: "Aucun utilisateur n'a cet email" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    findUser.resetPasswordToken = token;
    findUser.resetPasswordExpires = Date.now() + 36000000;
    await findUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mcourbeyrette1@gmail.com",
        pass: "gsih yoli nrbe neor",
      },
    });

    const resetUrl = `http://localhost:3001/newpassword/${token}`;
    const info = await transporter.sendMail({
      from: '"TaskManager 👻" <mcourbeyrette1@gmail.com>',
      to: email,
      subject: "Hello, pour réinitialiser ton mot de passe TaskManager ✔",
      text: `Appuie sur le lien suivant pour modifier ton mot de passe : ${resetUrl}`,
      html: `<p>Appuie sur le lien suivant pour modifier ton mot de passe : </p><a href='${resetUrl}'>Je réinitialise mon mot de passe</a>`,
    });

    console.log("Email envoyé:", info.response);
    res.status(200).send("Un message vous a été envoyé");
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email:", err);
    res.status(400).send({ err: "Quelque chose s'est mal passé" });
  }
});

app.get("/api/check_token/:token", async (req, res) => {
  try {
    console.log("Token reçu pour vérification:", req.params.token);

    const user = await Utilisateur.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token invalide ou expiré:", req.params.token);
      return res.status(400).send({ err: "Token invalide ou expiré" });
    }

    console.log("Token valide:", req.params.token);
    res.status(200).send({ msg: "Token valide" });
  } catch (err) {
    console.error("Erreur lors de la vérification du token:", err);
    res.status(400).send({ err: "Quelque chose s'est mal passé" });
  }
});

app.put("/api/reset_password/:token", async (req, res) => {
  const { confirmPassword, confirmPassword2 } = req.body;
  console.log("Données reçues pour la mise à jour du mot de passe:", req.body);

  if (!confirmPassword || !confirmPassword2) {
    console.log("Mauvaise réception des données");
    return res.status(400).send({ err: "Mauvaise réception des données" });
  }

  if (confirmPassword !== confirmPassword2) {
    console.log("Les mots de passe ne correspondent pas");
    return res
      .status(400)
      .send({ err: "Les mots de passe ne correspondent pas" });
  }

  try {
    console.log(
      "Token reçu pour la mise à jour du mot de passe:",
      req.params.token
    );

    const user = await Utilisateur.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token invalide ou expiré:", req.params.token);
      return res.status(400).send({ err: "Token invalide ou expiré" });
    }

    user.password = confirmPassword; // Assurez-vous de hacher le mot de passe avant de le sauvegarder
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(
      "Mot de passe mis à jour avec succès pour le token:",
      req.params.token
    );
    res.status(200).send("Mot de passe mis à jour avec succès");
  } catch (err) {
    console.error("Erreur lors de la mise à jour du mot de passe:", err);
    res.status(400).send({ err: "Quelque chose s'est mal passé" });
  }
});

app.post("/api/tachePerso", checkAuth, async (req, res) => {
  const currentUserEmail = req.session.email;

  if (!currentUserEmail) {
    return res.status(401).send({ err: "Utilisateur non authentifié" });
  }

  try {
    const creerParUser = await Utilisateur.findOne({ email: currentUserEmail });

    if (!creerParUser) {
      return res.status(404).send({
        err: "Impossible de trouver l'utilisateur dans la base de données",
      });
    }

    const { name, description, dateEnvoie, dateFin, importance, etat } =
      req.body;

    if (
      !name ||
      !description ||
      !dateEnvoie ||
      !dateFin ||
      !importance ||
      !etat
    ) {
      return res.status(400).send({ err: "Il manque des données" });
    }

    const nouvelleTache = new Tache({
      name,
      description,
      dateEnvoie,
      dateFin,
      importance,
      etat,
      creerParUser: creerParUser._id,
    });

    const data = await nouvelleTache.save();

    creerParUser.tachesPersonnellesCrees.push(nouvelleTache._id);
    await creerParUser.save();

    res.status(200).send(data);
  } catch (err) {
    console.error("Erreur lors de l'empaquetage ou de la sauvegarde:", err);
    return res.status(500).send({
      err: "Une erreur s'est produite lors de l'empaquetage ou de la sauvegarde.",
      details: err.message,
    });
  }
});

app.post("/api/tachePartagees", checkAuth, async (req, res) => {
  const currentUserEmail = req.session.email;

  if (!currentUserEmail) {
    return res.status(401).send({ err: "Utilisateur non authentifié" });
  }

  try {
    const creerParUser = await Utilisateur.findOne({ email: currentUserEmail });

    if (!creerParUser) {
      return res.status(404).send({
        err: "Impossible de trouver l'utilisateur dans la base de données",
      });
    }

    const { name, description, dateEnvoie, dateFin, importance, etat, amis } =
      req.body;

    if (
      !name ||
      !description ||
      !dateEnvoie ||
      !dateFin ||
      !importance ||
      !etat ||
      !amis
    ) {
      return res.status(400).send({ err: "Il manque des données" });
    }

    const findFriend = await Utilisateur.findOne({ email: amis });
    if (!findFriend) {
      return res.status(400).send({ err: "Trouve pas ton ami" });
    }

    const nouvelleTache = new Tache({
      name,
      description,
      dateEnvoie,
      dateFin,
      importance,
      etat,
      creerParUser: creerParUser._id,
      partageeAUser: findFriend._id,
    });

    const data = await nouvelleTache.save();

    creerParUser.tachesPartageesAuxAutres.push(nouvelleTache._id);
    await creerParUser.save();

    findFriend.tachesPartageesParLesAutres.push(nouvelleTache._id);
    await findFriend.save();
    console.log("Utilisateur mis à jour avec la nouvelle tâche");

    // Créer une notification
    const notification = new Notification({
      nom: "TACHE PARTAGEE AVEC VOUS",
      envoyeur: creerParUser.email,
      destinataire: findFriend.email,
      message: `${creerParUser.email} vous partagé une tache.`,
      date: new Date(),
    });
    await notification.save();

    res.status(200).send(data);
  } catch (err) {
    console.error("Erreur lors de l'empaquetage ou de la sauvegarde:", err);
    return res.status(500).send({
      err: "Une erreur s'est produite lors de l'empaquetage ou de la sauvegarde.",
      details: err.message,
    });
  }
});

app.get("/api/getTachesPersos", checkAuth, async (req, res) => {
  const currentUserEmail = req.session.email;

  if (!currentUserEmail) {
    return res.status(401).send({ err: "Erreur utilisateur non connecté" }); // 401 Unauthorized pour les erreurs d'authentification
  }

  try {
    const utilisateur = await Utilisateur.findOne({ email: currentUserEmail });

    if (!utilisateur) {
      return res.status(404).send({
        err: "Erreur pour trouver l'utilisateur dans la base de donnée",
      }); // 404 Not Found pour utilisateur non trouvé
    }

    const tachePersoIds = utilisateur.tachesPersonnellesCrees;

    if (!tachePersoIds || tachePersoIds.length === 0) {
      return res.status(404).send({ err: "Aucune tâche personnelle trouvée" });
    }

    const tachesPerso = await Tache.find({ _id: { $in: tachePersoIds } });

    if (!tachesPerso || tachesPerso.length === 0) {
      return res.status(404).send({
        err: "Erreur pour trouver les tâches personnelles dans la base de données",
      });
    }

    res.status(200).send(tachesPerso);
  } catch (error) {
    return res.status(500).send({ err: "Erreur serveur", details: error });
  }
});

app.get("/api/getTachesPartagees", checkAuth, async (req, res) => {
  const currentUserEmail = req.session.email;

  if (!currentUserEmail) {
    return res.status(401).send({ err: "Erreur utilisateur non connecté" }); // 401 Unauthorized pour les erreurs d'authentification
  }

  try {
    const utilisateur = await Utilisateur.findOne({ email: currentUserEmail });

    if (!utilisateur) {
      return res.status(404).send({
        err: "Erreur pour trouver l'utilisateur dans la base de donnée",
      }); // 404 Not Found pour utilisateur non trouvé
    }

    const tachePartageesIds = utilisateur.tachesPartageesParLesAutres;

    if (!tachePartageesIds || tachePartageesIds.length === 0) {
      return res.status(404).send({ err: "Aucune tâche personnelle trouvée" });
    }

    const tachesPartagees = await Tache.find({
      _id: { $in: tachePartageesIds },
    });

    if (!tachesPartagees || tachesPartagees.length === 0) {
      return res.status(404).send({
        err: "Erreur pour trouver les tâches personnelles dans la base de données",
      });
    }

    res.status(200).send(tachesPartagees);
  } catch (error) {
    return res.status(500).send({ err: "Erreur serveur", details: error });
  }
});

app.post("/api/addFriend", checkAuth, async (req, res) => {
  const currentUserEmail = req.session.email;
  if (!currentUserEmail) {
    return res.status(400).send({ err: "Impossible de trouver l'utilisateur" });
  }

  const utilisateur = await Utilisateur.findOne({ email: currentUserEmail });
  if (!utilisateur) {
    return res.status(400).send({ err: "Impossible de trouver l'utilisateur" });
  }

  const { email: friendEmail } = req.body;
  if (!friendEmail) {
    return res.status(400).send({ err: "Impossible de trouver votre ami" });
  }

  const utilisateurFriend = await Utilisateur.findOne({ email: friendEmail });
  if (!utilisateurFriend) {
    return res.status(400).send({ err: "Impossible de trouver l'utilisateur" });
  }

  // Vérifiez si l'utilisateur est déjà ami
  if (utilisateur.friends.includes(friendEmail)) {
    return res.status(400).send({ err: "Cet utilisateur est déjà votre ami" });
  }

  utilisateur.friends.push(friendEmail);
  await utilisateur.save();

  const notification = new Notification({
    nom: "AJOUT D'AMIS",
    envoyeur: utilisateur.email,
    destinataire: friendEmail,
    message: `${utilisateur.email} vous a ajouté en ami.`,
    date: new Date(),
  });
  await notification.save();

  res
    .status(200)
    .send({ message: "Ami ajouté avec succès et notification envoyée" });
});

app.get("/api/myfriends", checkAuth, async (req, res) => {
  const currentUserEmail = req.session.email;
  if (!currentUserEmail) {
    return res.status(400).send({ err: "Impossible de trouver l'utilisateur" });
  }

  const utilisateur = await Utilisateur.findOne({ email: currentUserEmail });
  if (!utilisateur) {
    return res.status(400).send({ err: "Impossible de trouver l'utilisateur" });
  }

  const mesAmis = utilisateur.friends;
  if (mesAmis.length > 0) {
    res.status(200).send(mesAmis);
  } else {
    res.status(400).send({ err: "Aucun amis trouvés" });
  }
});

app.get("/api/profils_utilisateurs", checkAuth, async (req, res) => {
  const currentUser = req.session.email;
  if (!currentUser) {
    return res.status(400).send({ err: "Utiisateur non connecté" });
  }

  try {
    const utilisateur = await Utilisateur.findOne({ email: currentUser });
    if (!utilisateur) {
      return res
        .status(400)
        .send({ err: "Utilisateur non trouvé dans la base de donnée." });
    }
    res.status(200).send(utilisateur);
  } catch (err) {
    res.status(500).send({ err: "Quelque chose s'est mal passé" });
  }
});

app.get("/api/notification", checkAuth, async (req, res) => {
  const currentUserEmail = req.session.email;
  if (!currentUserEmail) {
    return res.status(400).send({ err: "Impossible de trouver l'utilisateur" });
  }

  const notifications = await Notification.find({
    destinataire: currentUserEmail,
  });

  res.status(200).send(notifications);
});

app.get("/api/tachePerso/:tacheId", checkAuth, async (req, res) => {
  const tacheID = req.params.tacheId;

  if (!tacheID) {
    return res.status(400).send({ err: "Impossible de trouver la tâche" });
  }

  try {
    const tache = await Tache.findById(tacheID);

    if (!tache) {
      return res
        .status(404)
        .send({ err: "Impossible de trouver la tâche correspondante" });
    }

    res.status(200).send(tache);
  } catch (err) {
    return res.status(500).send({
      err: "Une erreur s'est produite lors de la recherche de la tâche ou de l'envoi des données",
    });
  }
});

app.delete("/api/delete/tachePerso/:tacheId", checkAuth, async (req, res) => {
  const currentUser = req.session.email;
  const tacheId = req.params.tacheId;
  if (!tacheId) {
    return res
      .status(400)
      .send({ err: "Impossible de trouver l'id de la tâche" });
  }

  try {
    const tache = await Tache.findByIdAndDelete(tacheId);
    if (!tache) {
      console.error(`Tâche avec id ${tacheId} non trouvée`); // Detailed logging
      return res.status(400).send({
        err: "Impossible de trouver la tâche dans la base de données",
      });
    }
    console.log(`Tâche avec id ${tacheId} supprimée avec succès`); // Detailed logging

    const notification = new Notification({
      nom: `LA TACHE "${tache.name}" A ETE SUPPRIME`,
      envoyeur: currentUser,
      destinataire: currentUser,
      message: `Vous avez supprimé une tache.`,
      date: new Date(),
    });
    await notification.save();

    return res.status(200).send({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error); // Add detailed logging
    return res
      .status(500)
      .send({ err: "Erreur lors de la suppression de la tâche" });
  }
});

app.post("/api/message/:tacheId", checkAuth, async (req, res) => {
  const tacheId = req.params.tacheId;
  const { message } = req.body;
  const currentUserEmail = req.session.email;

  if (!tacheId || !message || !currentUserEmail) {
    return res.status(400).send({
      err: "Impossible de poster car message manquant, id manquant ou utilisateur non connecté",
    });
  }

  try {
    const user = await Utilisateur.findOne({ email: currentUserEmail });
    if (!user) {
      return res.status(404).send({ err: "Utilisateur non trouvé" });
    }

    const task = await Tache.findById(tacheId);
    if (!task) {
      return res
        .status(404)
        .send({ err: "Impossible de trouver la tâche correspondante" });
    }

    const newMessage = new Message({
      utilisateur: user._id,
      message: message,
      tacheAffiliee: tacheId
    });

    await newMessage.save();
    task.messages.push(newMessage._id);
    await task.save();

    res.status(200).send({
      message: "Message envoyé avec succès",
      task: task,
    });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement du message :", err);
    res.status(500).send({
      err: "Erreur serveur : Impossible de construire le message ou de l'envoyer",
    });
  }
});

app.get("/api/getmessages/:tacheId", checkAuth, async (req, res) => {
  const tacheId = req.params.tacheId;
  if (!tacheId) {
    return res.status(400).send({
      err: "Erreur serveur : Impossible de trouver l'id de la tâche",
    });
  }

  try {
    const messages = await Message.find({ tacheAffiliee: tacheId }).populate('utilisateur', 'email');
    res.status(200).send(messages);
  } catch (err) {
    console.error("Erreur lors de la réception des messages :", err);
    res.status(500).send({
      err: "Erreur serveur : Impossible de trouver les messages.",
    });
  }
});

app.post('/api/ContacterSupport', checkAuth, async (req, res) => {
  const {email, message} = req.body;
  if (!email || !message) {
    res.status(400).send({err : "Données non recu"});
  }

  try {
    const findUser = await Utilisateur.findOne({ email });
    if (!findUser) {
      console.error("Aucun utilisateur n'a cet email");
      return res.status(400).send({ err: "Aucun utilisateur n'a cet email" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mcourbeyrette1@gmail.com",
        pass: "gsih yoli nrbe neor",
      },
    });

    const info = await transporter.sendMail({
      from: email,
      to: 'mcourbeyrette@gmail.com',
      subject: `${email} Souhaite Vous Contacter`,
      text: message,
    });

    console.log("Email envoyé:", info.response);
    res.status(200).send("Un message vous a été envoyé");
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email:", err);
    res.status(400).send({ err: "Quelque chose s'est mal passé" });
  } 
})


app.get("/api/test", (req, res) => {
  res.status(200).send({ message: "API is working" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
