require('dotenv').config()
const express = require('express');
const router = express.Router();

const { 
    loginAdmin, 
    logoutAdmin,  
    checkAuth,

    getIteration,
    editIteration
  } = require('../controllers/adminController'); 

const { requireAdmin, validateLogin } = require('../middleware/authMiddleware');
const { getAllComparisons } = require('../controllers/FormController');

router.post('/login', validateLogin, loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/checkAuth', requireAdmin, checkAuth); 

// Handle Form
router.get('/getIteration', requireAdmin, getIteration) 
router.put('/editIteration', requireAdmin, editIteration)
router.get('/getAllComparisons', requireAdmin, getAllComparisons)

module.exports = router; 