const math = require('mathjs');
const AHPResult = require('../models/resultModel')
const Comparison = require('../models/Comparison'); // Pastikan path model Comparison sesuai dengan struktur project
const Config = require('../models/formConfig')
const mongoSaniteze = require('mongo-sanitize')

/**
 * Fungsi untuk menyimpan data pairwise comparison dari input user.
 * @param {Object} req - Request object dari express.
 * @param {Object} res - Response object dari express.
 * @returns {Object} Response dengan status 201 jika berhasil menyimpan.
 */
const submitPairwiseComparison = async (req, res) => {
  try {
    const { name, title, instansi, level_1, level_2, level_3, city } = mongoSaniteze(req.body);
    const cityToIteration = {
      Bitung: 0,
      Jakarta: 1,
      Palembang: 2,
      Balikpapan: 3,
      Semarang: 4
    };

    // Tetapkan nilai iteration berdasarkan input kota, atau default -1 jika tidak valid
    const iteration = cityToIteration[city] ?? 6;

    // Membuat objek level_1
    const newLevel1 = {
      comparison_type: "criteria",
      criteria: ["IFE", "ISL"], // Daftar kriteria untuk level 1
      pairwise_comparison: [{
        criteria_1: "IFE",
        criteria_2: "ISL",
        value: level_1.IFE_ISL
      }]
    };

    // Membuat objek level_2
    const newLevel2 = [{
      comparison_type: "criteria",
      criteria: ["Financial", "Economy", "Social", "Environment"], // Daftar kriteria untuk level 2
      pairwise_comparison: [
        {
          criteria_1: "Financial",
          criteria_2: "Economy",
          value: level_2.financial_economy
        },
        {
          criteria_1: "Social",
          criteria_2: "Environment",
          value: level_2.social_environment
        }
      ]
    }];

    // Membuat objek level_3 jika perlu, menyesuaikan dengan strukturnya
    // Membuat objek level_3 dengan perbandingan yang sesuai
    const newLevel3 = [{
      comparison_type: "criteria",
      criteria: [
        "FNPV", "FNBC", "FIRR", 
        "ENPV", "ENBC", "EIRR", 
        "PDRB", "Multiplier", 
        "Backward", "Forward", 
        "Serapan", "JumlahPenerima"
      ], // Daftar kriteria untuk level 3
      pairwise_comparison: [
        // Finansial
        {
          criteria_1: "FNPV",
          criteria_2: "FNBC",
          value: level_3.FNPV_FNBC
        },
        {
          criteria_1: "FIRR",
          criteria_2: "FNBC",
          value: level_3.FIRR_FNBC
        },
        {
          criteria_1: "FIRR",
          criteria_2: "FNPV",
          value: level_3.FIRR_FNPV
        },
        // Ekonomi
        {
          criteria_1: "ENPV",
          criteria_2: "ENBC",
          value: level_3.ENPV_ENBC
        },
        {
          criteria_1: "EIRR",
          criteria_2: "ENBC",
          value: level_3.EIRR_ENBC
        },
        {
          criteria_1: "EIRR",
          criteria_2: "ENPV",
          value: level_3.EIRR_ENPV
        },
        {
          criteria_1: "PDRB",
          criteria_2: "EIRR",
          value: level_3.PDRB_EIRR
        },
        {
          criteria_1: "PDRB",
          criteria_2: "ENPV",
          value: level_3.PDRB_ENPV
        },
        {
          criteria_1: "PDRB",
          criteria_2: "ENBC",
          value: level_3.PDRB_ENBC
        },
        {
          criteria_1: "Multiplier",
          criteria_2: "ENPV",
          value: level_3.Multiplier_ENPV
        },
        {
          criteria_1: "Multiplier",
          criteria_2: "ENBC",
          value: level_3.Multiplier_ENBC
        },
        {
          criteria_1: "Multiplier",
          criteria_2: "EIRR",
          value: level_3.Multiplier_EIRR
        },
        {
          criteria_1: "Multiplier",
          criteria_2: "PDRB",
          value: level_3.Multiplier_PDRB
        },
        {
          criteria_1: "Forward",
          criteria_2: "ENPV",
          value: level_3.Forward_ENPV
        },
        {
          criteria_1: "Forward",
          criteria_2: "ENBC",
          value: level_3.Forward_ENBC
        },
        {
          criteria_1: "Forward",
          criteria_2: "EIRR",
          value: level_3.Forward_EIRR
        },
        {
          criteria_1: "Forward",
          criteria_2: "PDRB",
          value: level_3.Forward_PDRB
        },
        {
          criteria_1: "Forward",
          criteria_2: "Multiplier",
          value: level_3.Forward_Multiplier
        },
        {
          criteria_1: "Backward",
          criteria_2: "ENPV",
          value: level_3.Backward_ENPV
        },
        {
          criteria_1: "Backward",
          criteria_2: "ENBC",
          value: level_3.Backward_ENBC
        },
        {
          criteria_1: "Backward",
          criteria_2: "EIRR",
          value: level_3.Backward_EIRR
        },
        {
          criteria_1: "Backward",
          criteria_2: "PDRB",
          value: level_3.Backward_PDRB
        },
        {
          criteria_1: "Backward",
          criteria_2: "Multiplier",
          value: level_3.Backward_Multiplier
        },
        {
          criteria_1: "Backward",
          criteria_2: "Forward",
          value: level_3.Backward_Forward
        },
        // Sosial
        {
          criteria_1: "Serapan",
          criteria_2: "JumlahPenerima",
          value: level_3.Serapan_JumlahPenerima
        }
      ]
    }];


    // Membuat objek baru Comparison berdasarkan input user
    const newComparison = new Comparison({
      name,
      title,
      instansi,
      iteration,
      level_1: newLevel1,
      level_2: newLevel2,
      level_3: newLevel3
    });

    // Simpan ke database
    await newComparison.save();

    res.status(201).json({ message: 'Pairwise comparison successfully submitted!' });
  } catch (error) {
    console.error('Something went wrong:', error);
    res.status(500).json({ message: 'An error occurred while submitting the pairwise comparison.' });
  }
};


/**
 * Fungsi untuk mendapatkan semua data pairwise comparison yang ada di database.
 * @param {Object} req - Request object dari express.
 * @param {Object} res - Response object dari express.
 * @returns {Array} Response berisi semua data pairwise comparison.
 */
const getAllComparisons = async (req, res) => {
  try {
    // Ambil semua data comparison yang ada di database
    const comparisons = await Comparison.find();
    if(!comparisons || comparisons.length === 0) {
      return res.status(404).json([])
    }
    res.status(200).json({
      status:200,
      message:"success",
      comparisons
    });
  } catch (error) {
    console.error("Something went wrong:", error)
    res.status(500).json({status:500, message: 'An error occurred while fetching comparisons.' });
  }
};


// Fungsi untuk membuat matriks pairwise comparison dari input user
const createPairwiseMatrix = (pairwiseComparisons, criteria) => {
  const size = criteria.length; 
  const matrix = math.identity(size)._data; // Inisialisasi matriks identitas
  const criteriaMap = criteria.reduce((acc, curr, idx) => { acc[curr] = idx; return acc; }, {});

  pairwiseComparisons.forEach(comparison => {
    const row = criteriaMap[comparison.criteria_1];
    const col = criteriaMap[comparison.criteria_2];
    matrix[row][col] = comparison.value; // Mengisi nilai pairwise pada matriks
    matrix[col][row] = 1 / comparison.value; // Mengisi kebalikan dari nilai pairwise
  });

  return matrix;
};

// Fungsi untuk menghitung rata-rata matriks dari beberapa matriks input
const calculateMeanMatrix = (matrices) => {
  const sumMatrix = matrices.reduce((acc, matrix) => math.add(acc, matrix), math.zeros(matrices[0].length, matrices[0].length));
  return math.divide(sumMatrix, matrices.length);
};

// Fungsi untuk memisahkan keterkaitan
// Fungsi untuk normalisasi matriks
const normalizeMatrix = (matrix) => {
  // Konversi matrix ke format array dua dimensi jika menggunakan math.js
  const matrixArray = math.matrix(matrix).toArray();
  // Menjumlahkan elemen per kolom
  const columnSums = math.sum(matrixArray, 0); // Hasil ini adalah array satu dimensi
  // Normalisasi elemen matriks
  return matrixArray.map(row => 
    row.map((value, colIdx) => value / columnSums[colIdx]) // Pastikan untuk memeriksa kolom
  );
};


// Fungsi untuk menghitung bobot kriteria berdasarkan matriks yang sudah dinormalisasi
const calculateWeights = (normalizedMatrix) => {
  const rowSums = math.sum(normalizedMatrix, 1); // Menjumlahkan elemen per baris
  return rowSums.map(sum => sum / normalizedMatrix.length); // Menghitung rata-rata setiap baris
};

// Fungsi utama untuk menghitung bobot AHP dari input user
// const calculateAHPWeights = async (req, res) => {
//   try {

//     const config = await Config.find();
//     const iteration = config.length > 0 ? config[0].iteration : 0; // Menghindari error jika tidak ada config 

//     const comparisonData = await Comparison.find({iteration:iteration});

//     if (!comparisonData || comparisonData.length === 0) {
//       return res.json([]);
//     }

//     // Gabungkan semua matriks pairwise comparison dari masing-masing level.
//     const level1Matrices = comparisonData.map(form => createPairwiseMatrix(form.level_1.pairwise_comparison, form.level_1.criteria));
//     const level2Matrices = comparisonData.map(form => createPairwiseMatrix(form.level_2[0].pairwise_comparison, form.level_2[0].criteria));
//     const level3Matrices = comparisonData.map(form => createPairwiseMatrix(form.level_3[0].pairwise_comparison, form.level_3[0].criteria));


//     // Hitung mean matrix dari setiap level untuk seluruh input yang ada. 
//     const meanMatrixLevel1 = calculateMeanMatrix(level1Matrices);
//     const meanMatrixLevel2 = calculateMeanMatrix(level2Matrices);
//     const meanMatrixLevel3 = calculateMeanMatrix(level3Matrices);

//     // Normalisasi matriks dan hitung bobot untuk setiap level.
//     const normalizedMatrixLevel1 = normalizeMatrix(meanMatrixLevel1);
//     const normalizedMatrixLevel2 = normalizeMatrix(meanMatrixLevel2);
//     const normalizedMatrixLevel3 = normalizeMatrix(meanMatrixLevel3);

//     const weightsLevel1 = calculateWeights(normalizedMatrixLevel1);
//     const weightsLevel2 = calculateWeights(normalizedMatrixLevel2);
//     const weightsLevel3 = calculateWeights(normalizedMatrixLevel3);

//     await AHPResult.findOneAndUpdate(
//       { iteration }, // Cari dokumen dengan iterasi yang sama
//       {
//         iteration,
//         level1Weights: {
//           IFE: weightsLevel1[0],
//           ISL: weightsLevel1[1],
//         },
//         level2Weights: {
//           Financial: weightsLevel2[0] * 2,
//           Economy: weightsLevel2[1 * 2],
//           Social: weightsLevel2[2] * 2,
//           Environment: weightsLevel2[3] * 2,
//         },
//         level3Weights: {
//           FNPV: weightsLevel3[0],
//           FNBC: weightsLevel3[1],
//           FIRR: weightsLevel3[2],
//           ENPV: weightsLevel3[3],
//           ENBC: weightsLevel3[4],
//           EIRR: weightsLevel3[5],
//           PDRB: weightsLevel3[6],
//           Multiplier: weightsLevel3[7],
//           Backward: weightsLevel3[8],
//           Forward: weightsLevel3[9],
//           Serapan: weightsLevel3[10],
//           JumlahPenerima: weightsLevel3[11],
//         },
//       },
//       { new: true, upsert: true } // Buat dokumen baru jika tidak ditemukan
//     );

//     // Return hasil perhitungan bobot kriteria pada setiap level.
//     res.status(200).json({
//       meanMatrixLevel1:meanMatrixLevel1,
//       meanMatrixLevel2:meanMatrixLevel2,
//       meanMatrixLevel3:meanMatrixLevel3,
//       normalizedMatrixLevel1:normalizedMatrixLevel1,
//       normalizedMatrixLevel2:normalizedMatrixLevel2,
//       normalizedMatrixLevel3:normalizedMatrixLevel3,
//       level1Matrices: level1Matrices,
//       level2Matrices:level2Matrices,
//       level3Matrices:level3Matrices,
//       level1Weights: weightsLevel1,
//       level2Weights: weightsLevel2,
//       level3Weights: weightsLevel3,
//       iteration:iteration
//     });
//   } catch (error) {
//     console.error("Something went wrong:", error)
//     res.status(500).send("An error occurred while calculating AHP weights.");
//   }
// };

const calculateAHPWeights = async (req, res) => {
  try {
    for (let iteration = 0; iteration <= 5; iteration++){
      const comparisonData = await Comparison.find({ iteration });

    if (!comparisonData || comparisonData.length === 0) {
      return res.json([]);
    }

    // Gabungkan matriks untuk setiap level
    const level1Matrices = comparisonData.map((form) =>
      createPairwiseMatrix(form.level_1.pairwise_comparison, form.level_1.criteria)
    );
    const level2Matrices = comparisonData.map((form) =>
      createPairwiseMatrix(form.level_2[0].pairwise_comparison, form.level_2[0].criteria)
    );
    const level3Matrices = comparisonData.map((form) =>
      createPairwiseMatrix(form.level_3[0].pairwise_comparison, form.level_3[0].criteria)
    );

    // Perhitungan LEVEL 1
    const meanMatrixLevel1 = calculateMeanMatrix(level1Matrices);
    const normalizedMatrixLevel1 = normalizeMatrix(meanMatrixLevel1);
    const weightsLevel1 = calculateWeights(normalizedMatrixLevel1);

    // Perhitungan LEVEL 2 (dengan koreksi pengali)
    const meanMatrixLevel2 = calculateMeanMatrix(level2Matrices);
    const normalizedMatrixLevel2 = normalizeMatrix(meanMatrixLevel2);
    const rawWeightsLevel2 = calculateWeights(normalizedMatrixLevel2);

    const weightsLevel2 = {
      Financial: rawWeightsLevel2[0] * 2,
      Economy: rawWeightsLevel2[1] * 2,
      Social: rawWeightsLevel2[2] * 2,
      Environment: rawWeightsLevel2[3] * 2,
    };

    // Perhitungan LEVEL 3 (dengan pembagian kelompok dan faktor pengali)
    const financialIndicators = ["FNPV", "FIRR", "FNBC"];
    const economicIndicators = ["ENPV", "EIRR", "ENBC", "PDRB", "Multiplier", "Backward", "Forward"];
    const socialIndicators = ["Serapan", "JumlahPenerima"];

    let sumFinancial = 0;
    let sumEconomic = 0;
    let sumSocial = 0;

    // Hitung total bobot mentah dari setiap kelompok
    const rawWeightsLevel3 = calculateWeights(normalizeMatrix(calculateMeanMatrix(level3Matrices)));

    // Hitung total bobot untuk setiap kelompok
    financialIndicators.forEach((indicator, index) => {
      sumFinancial += rawWeightsLevel3[index] || 0;
    });

    economicIndicators.forEach((indicator, index) => {
      sumEconomic += rawWeightsLevel3[financialIndicators.length + index] || 0;
    });

    socialIndicators.forEach((indicator, index) => {
      sumSocial += rawWeightsLevel3[financialIndicators.length + economicIndicators.length + index] || 0;
    });

    // Terapkan faktor pengali agar setiap kelompok memiliki total 1
    const weightsLevel3 = {};

    // Kelompok Finansial
    financialIndicators.forEach((indicator, index) => {
      weightsLevel3[indicator] = (rawWeightsLevel3[index] / sumFinancial) || 0;
    });

    // Kelompok Ekonomi
    economicIndicators.forEach((indicator, index) => {
      weightsLevel3[indicator] = (rawWeightsLevel3[financialIndicators.length + index] / sumEconomic) || 0;
    });

    // Kelompok Sosial
    socialIndicators.forEach((indicator, index) => {
      weightsLevel3[indicator] = (rawWeightsLevel3[financialIndicators.length + economicIndicators.length + index] / sumSocial) || 0;
    });

    // Simpan hasil perhitungan ke database
    await AHPResult.findOneAndUpdate(
      { iteration },
      {
        iteration,
        level1Weights: {
          IFE: weightsLevel1[0],
          ISL: weightsLevel1[1],
        },
        level2Weights: weightsLevel2,
        level3Weights: weightsLevel3,
      },
      { new: true, upsert: true }
    );

    }

    // Kirim hasil perhitungan sebagai respons
    res.status(200).json({
      status:200,
      message:"Success"
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    res.status(500).send("An error occurred while calculating AHP weights.");
  }
};




const getALlWeights = async(req, res) => {
  try {
    const result = await AHPResult.find()
    if(!result || result.length === 0) {
      return res.status(404).json([])
    }

    res.status(200).json({
      status:200,
      message:"Success",
      result
    })
  } catch (error) {
    console.error('Something went wrong', error)
    return res.status(500).json({
      status:500,
      message:"Something went wrong while getting final data"
    })
  }
}


module.exports = { 
    calculateAHPWeights,
    submitPairwiseComparison,
    getAllComparisons,
    getALlWeights
};