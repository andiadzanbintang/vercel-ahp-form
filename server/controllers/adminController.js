const AdminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const mongoSanitize = require("mongo-sanitize");
const { validationResult } = require('express-validator');
const formConfig = require("../models/formConfig");
require("dotenv").config();

const loginAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Sanitize input
      const { email, password } = mongoSanitize(req.body);
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." }); 
      }
  
      // Find admin by email
      const admin = await AdminModel.findOne({ email }).select("+password");
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }
  
      // Check if password matches
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { id: admin._id, role: admin.role, email: admin.email},
        process.env.ADMIN_JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      try {
        // Send token in cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'lax',  // Adding SameSite attribute for CSRF protection
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({status:200,  message: "Login successful." });
      } catch (error) {
        console.error("Something went wrong", error)
        return res.status(500).json({status:500, message:"Something went wrong"})
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({status:500, message: "Server error." });
    }
  };
  
  const logoutAdmin = async (req, res) => {
    try {
  
      // Clear cookie regardless of the presence of a token
      res.clearCookie("token", { path: "/" });
      if (req.session) {
        req.session.destroy();
      }
  
      return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      console.error("Something went wrong", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const checkAuth = async (req, res) => {  
    try {
      const admin = req.admin; // Dari middleware requireAdmin
      if (admin) {
        return res.status(200).json({ status: 200, message: 'Authenticated' });
      } else {
        return res.status(401).json({ status: 401, message: 'Unauthorized' });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
  };

  const getIteration = async (req, res) => {
    try {
      const admin = req.admin;
      if (!admin) {
        return res.status(401).json({ status: 401, message: "Unauthorized" });
      }
  
      const iterationData = await formConfig.findOne(); // Ambil dokumen pertama
      if (!iterationData) {
        return res.status(404).json({
          status: 404,
          message: "Iteration not found",
        });
      }
  
      return res.status(200).json({
        status: 200,
        message: "Success",
        iteration: iterationData.iteration, // Pastikan hanya kirim nilai iteration
      });
    } catch (error) {
      console.error("Something went wrong:", error);
      return res.status(500).json({
        status: 500,
        message: "Something went wrong",
      });
    }
  };

  // Endpoint untuk edit iterasi
const editIteration = async (req, res) => {
  try {
    const admin = req.admin; // Pastikan user adalah admin
    if (!admin) {
      return res.status(401).json({ status: 401, message: "Unauthorized" });
    }

    const { iteration } = req.body;

    // Validasi: iteration harus angka positif
    if (!Number.isInteger(iteration) || iteration < 0) {
      return res.status(400).json({
        status: 400,
        message: "Iteration must be a positive integer.",
      });
    }

    // Cari dan perbarui iterasi di database
    const updatedConfig = await formConfig.findOneAndUpdate(
      {}, // Update dokumen pertama
      { iteration },
      { new: true, upsert: true } // Buat dokumen baru jika tidak ada
    );

    return res.status(200).json({
      status: 200,
      message: "Iteration updated successfully.",
      iteration: updatedConfig.iteration,
    });
  } catch (error) {
    console.error("Error updating iteration:", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong.",
    });
  }
};
  
  

  module.exports = {
    loginAdmin, logoutAdmin, checkAuth,
    getIteration, editIteration
  }