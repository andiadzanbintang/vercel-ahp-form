require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { calculateAHPWeights, submitPairwiseComparison, getALlWeights } = require('../controllers/FormController');

const router = express.Router();

router.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL
})) 

// Rute untuk mengirimkan data perbandingan berpasangan (pairwise comparison).
router.post('/submit', submitPairwiseComparison);

// Rute untuk melakukan perhitungan AHP pada semua data yang ada.
router.get('/calculate', calculateAHPWeights); 

router.get('/getAllResult', getALlWeights)
 
module.exports = router; 
