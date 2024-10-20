const mongoose = require('mongoose');

const ahpResultSchema = new mongoose.Schema({
  iteration: {
    type: Number,
    required: true,
    unique: true, // Agar tidak ada duplikasi iterasi yang sama
  },
  level1Weights: {
    IFE: Number,
    ISL: Number,
  },
  level2Weights: {
    Financial: Number, 
    Economy: Number,
    Social: Number,
    Environment: Number,
  },
  level3Weights: {
    FNPV: Number,
    FNBC: Number,
    FIRR: Number,
    ENPV: Number,
    ENBC: Number,
    EIRR: Number,
    PDRB: Number,
    Multiplier: Number,
    Backward: Number,
    Forward: Number,
    Serapan: Number,
    JumlahPenerima: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware untuk update waktu terakhir diubah (updatedAt)
ahpResultSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('AHPResult', ahpResultSchema);
