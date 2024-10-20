const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');
const { body } = require('express-validator'); 


const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
];

const requireAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Pastikan menggunakan 'token' sesuai dengan yang digunakan di adminController

        // Cek apakah token ada 
        if (!token) {  
            return res.status(401).json({ error: 'Unauthorized! Token is missing.' });
        }

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET); 
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Unauthorized! Token invalid.' });
        }

        // Cek apakah peran admin sesuai
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden! Access is denied.' });
        } 

        // Cek apakah admin ada di database
        const admin = await AdminModel.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ error: 'Unauthorized! Admin not found.' });
        }
        // Simpan data admin ke request untuk digunakan di route selanjutnya
        req.admin = admin; // Mengganti 'req.user' menjadi 'req.admin' sesuai dengan konteks admin
        next();
    } catch (error) {
        console.error('Unauthorized:', error);
        return res.status(401).json({ error: 'Unauthorized! Token verification failed.' });
    }
}

module.exports = { requireAdmin, validateLogin }; 
