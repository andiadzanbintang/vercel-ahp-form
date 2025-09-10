require('dotenv').config()
const express = require('express');
const { calculateAHPWeights, submitPairwiseComparison, getALlWeights } = require('../controllers/FormController');

const router = express.Router();

// Rute untuk mengirimkan data perbandingan berpasangan (pairwise comparison).
router.post('/submit', submitPairwiseComparison);

// Rute untuk melakukan perhitungan AHP pada semua data yang ada.
router.get('/calculate', calculateAHPWeights); 

router.get('/getAllResult', getALlWeights)
 
module.exports = router; 
