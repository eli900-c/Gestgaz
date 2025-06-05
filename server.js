// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();


// Load environment variables
dotenv.config();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5035;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gaz_gestion';

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log("🟢 Connecté à MongoDB"))
.catch(err => console.error("🔴 Erreur de connexion MongoDB :", err));

// Route test
app.get('/', (req, res) => {
  res.send('🚀 Serveur opérationnel !');
});


// Routes
app.use('/auth', require('./routes/authRoute'));
app.use('/users', require('./routes/userRoute'));
app.use('/bouteilles', require('./routes/bouteilleRoute'));
app.use('/livraisons', require('./routes/livraisonRoute'));
app.use('/salaires', require('./routes/salaireRoute'));
app.use('/stocks', require('./routes/stockRoute'));
app.use('/camions', require('./routes/camionRoute'));
app.use('/chauffeurs', require('./routes/chauffeurRoute'));
app.use('/mouvements', require('./routes/MouvementstockRoute'));


// Start server
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

