import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Slider } from "@mui/material";
import CustomSlider from "./customSlider";

// Random Index (RI) untuk ukuran matriks
const RI_VALUES = { 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32 };

const Form = () => {
  const [name, setName] = useState("");
  const [instansi, setInstansi] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [level1, setLevel1] = useState({ IFE_ISL: 1 }); // Default value for level 1 comparison
  const [level2, setLevel2] = useState({
    financial_economy: 1,
    social_environment: 1,
  });
  const [level3, setLevel3] = useState({
    // Finansial
    FNPV_FNBC: 1,
    FIRR_FNBC: 1,
    FIRR_FNPV: 1,

    // Ekonomi
    ENPV_ENBC: 1,
    EIRR_ENBC: 1,
    EIRR_ENPV: 1,
    PDRB_EIRR: 1,
    PDRB_ENPV: 1,
    PDRB_ENBC: 1,
    Multiplier_ENPV: 1,
    Multiplier_ENBC: 1,
    Multiplier_EIRR: 1,
    Multiplier_PDRB: 1,
    Forward_ENPV: 1,
    Forward_ENBC: 1,
    Forward_EIRR: 1,
    Forward_PDRB: 1,
    Forward_Multiplier: 1,
    Backward_ENPV: 1,
    Backward_ENBC: 1,
    Backward_EIRR: 1,
    Backward_PDRB: 1,
    Backward_Multiplier: 1,
    Backward_Forward: 1,

    // Sosial
    Serapan_JumlahPenerima: 1,

    // Lingkungan (tidak ada pairwise, hanya satu indikator)
  });

  // Slider marks
  const marks = [
    { value: -9, label: '-9' },
    { value: -8, label: '-8' },
    { value: -7, label: '-7' },
    { value: -6, label: '-6' },
    { value: -5, label: '-5' },
    { value: -4, label: '-4' },
    { value: -3, label: '-3' },
    { value: -2, label: '-2' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
  ];

  const validateInput = () => {
    // Validasi nama
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name) {
      toast.error("Nama tidak boleh kosong.");
      return false; 
    }
    if (!nameRegex.test(name)) {
      toast.error("Nama hanya boleh mengandung huruf dan spasi.");
      return false;
    }
    if (name.length < 2 || name.length > 50) {
      toast.error("Nama harus memiliki panjang antara 2 hingga 50 karakter.");
      return false;
    }

    // Validasi jabatan
    const jabatanRegex = /^[A-Za-z0-9\s]+$/;
    if (!jabatan) {
      toast.error("Jabatan tidak boleh kosong.");
      return false;
    }
    if (!jabatanRegex.test(jabatan)) {
      toast.error("Jabatan hanya boleh mengandung huruf, angka, dan spasi.");
      return false;
    }
    if (jabatan.length < 2 || jabatan.length > 100) {
      toast.error("Jabatan harus memiliki panjang antara 2 hingga 100 karakter.");
      return false;
    }

    const instansiRegex = /^[A-Za-z0-9\s]+$/;
    if (!instansi) {
      toast.error("Instansi tidak boleh kosong.");
      return false;
    }
    if (!instansiRegex.test(instansi)) {
      toast.error("Instansi hanya boleh mengandung huruf, angka, dan spasi.");
      return false;
    }
    if (instansi.length < 2 || instansi.length > 100) {
      toast.error("Instansi harus memiliki panjang antara 2 hingga 100 karakter.");
      return false;
    }

    return true;
  };

  const calculateConsistency = (matrix) => {
    const n = matrix.length;
    const sumColumns = Array(n).fill(0);

    // Hitung jumlah setiap kolom
    matrix.forEach((row) => row.forEach((value, j) => (sumColumns[j] += value)));

    // Normalisasi matriks
    const normalizedMatrix = matrix.map((row) =>
      row.map((value, j) => value / sumColumns[j])
    );

    // Hitung eigenvector (rata-rata dari setiap baris)
    const eigenVector = normalizedMatrix.map(
      (row) => row.reduce((acc, val) => acc + val, 0) / n
    );

    // Hitung λ_max
    const lambdaMax = matrix
      .map((row, i) => row.reduce((acc, val, j) => acc + val * eigenVector[j], 0))
      .reduce((acc, val) => acc + val, 0) / n;

    // Hitung CI dan CR
    const CI = (lambdaMax - n) / (n - 1);
    const CR = CI / (RI_VALUES[n] || 0.58); // Gunakan RI berdasarkan ukuran matriks

    return CR;
  };

  const adjustValue = (value) => {
    if (value === 0 || value === -1) {
      return 1; // Anggap 0 dan -1 sebagai 1
    } else if (value < 0) {
      return Math.abs(value); // Ubah nilai negatif jadi positif
    } else if (value > 1) {
      return 1 / value; // Invers untuk nilai > 1
    } else {
      return value; // Kembalikan nilai aslinya
    }
  };

  const showValue = (value) => {
    if (value === 0 || value === -1) {
      return 1; // Anggap 0 dan -1 sebagai 1
    } else if (value < 0) {
      return Math.abs(value); // Ubah nilai negatif jadi positif
    } else {
      return value; // Kembalikan nilai aslinya
    }
  }
  



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
        return;
    }

    const adjustedLevel1 = { IFE_ISL: adjustValue(level1.IFE_ISL) };
    const adjustedLevel2 = {
        financial_economy: adjustValue(level2.financial_economy),
        social_environment: adjustValue(level2.social_environment),
      };

    const adjustedLevel3 = Object.keys(level3).reduce((acc, key) => {
        acc[key] = adjustValue(level3[key]);
        return acc;
    }, {});

    // Buat matriks level 2 untuk pengecekan konsistensi
    const level2Matrix = [
      [1, adjustedLevel2.financial_economy],
      [1 / adjustedLevel2.financial_economy, 1],
    ];

    // Validasi konsistensi level 2
    const CR = calculateConsistency(level2Matrix);
    if (CR >= 0.1) {
      toast.error(`Inconsistent pairwise comparison (CR = ${CR.toFixed(2)}). Please revise.`);
      return;
    }

      // Fungsi untuk membangun matriks pairwise dari sebuah array indikator
  const buildMatrix = (indicators) =>
    indicators.map((i, rowIdx) =>
      indicators.map((j, colIdx) =>
        rowIdx === colIdx ? 1 : adjustedLevel3[`${i}_${j}`] || 1 / adjustedLevel3[`${j}_${i}`]
      )
    );

  // Buat dan validasi matriks untuk setiap kelompok level 3
  const groups = {
    financial: ["FNPV", "FIRR", "FNBC"],
    economy: ["ENPV", "EIRR", "ENBC", "PDRB", "Multiplier", "Backward", "Forward"],
    social: ["Serapan", "JumlahPenerima"],
  };

  for (const [groupName, indicators] of Object.entries(groups)) {
    const matrix = buildMatrix(indicators);
    const CR = calculateConsistency(matrix);
    if (CR >= 0.1) {
      toast.error(`Inconsistent ${groupName} comparison (CR = ${CR.toFixed(2)}). Please revise.`);
      return;
    }
  }
  

    const data = {
      name: name,
      title: jabatan,
      instansi:instansi,
      level_1: adjustedLevel1,
      level_2: adjustedLevel2,
      level_3: adjustedLevel3, // All level 3 comparisons
    };

    try {
      await axios.post("/api/v1/form/submit", data);
      toast.success("Data successfully submitted!");
      window.location.reload();
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error("Failed to submit data.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="data-diri">
        <label>Nama</label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)} // Menangani perubahan input
        />
      </div>
      <div className="data-diri">
        <label>Posisi</label>
        <input
          required
          type="text"
          value={jabatan}
          onChange={(e) => setJabatan(e.target.value)} // Menangani perubahan input
          placeholder="Contoh : Tenaga ahli kelautan"
        />
      </div>
      <div className="data-diri">
        <label>Instansi</label>
        <input
          required
          type="text"
          value={instansi}
          onChange={(e) => setInstansi(e.target.value)} // Menangani perubahan input
          placeholder="Contoh : PT Cilaki 45"
        />
      </div>

      {/* LEVEL 1 */}
      <h3 className="comparison-title">perbandingan Level 1</h3>
      <p className="show-value">Nilai : {showValue(level1.IFE_ISL)}</p>
      <div className="comparison">
        <label>IFE</label>
          <Slider
          value={level1.IFE_ISL}
          min={-9}
          max={9}
          step={1}
          marks={marks}
          valueLabelDisplay="auto"
          onChange={(e, newValue) => setLevel1({ IFE_ISL: newValue })}
        />
        <label>ISL</label>
      </div>

      {/* LEVEL 2 */}
      <h3 className="comparison-title">perbandingan Level 2</h3>
      <p className="show-value">Nilai : {showValue(level2.financial_economy)}</p>
      <div className="comparison">
        <label>Financial</label>
          <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel2({ ...level2, financial_economy: newValue });
            }}
          />
        </div>
        <label>Economy</label>
      </div>

      <p className="show-value">Nilai : {showValue(level2.social_environment)}</p>
      <div className="comparison">
        <label>Social</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level2.social_environment} // Gunakan nilai asli dari social_environment
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel2({ ...level2, social_environment: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>Environment</label>
      </div>

      {/* LEVEL 3 */}
      <h3 className="comparison-title">perbandingan Level 3</h3>
      <p className="show-value">Nilai : {showValue(level3.FNPV_FNBC)}</p>
      {/* Finansial */}
      <div className="comparison">
        <label>Policy Alignment</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.FNPV_FNBC} // Gunakan nilai asli dari FNPV_FNBC
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, FNPV_FNBC: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>Environmental and Spatial Alignment</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.FIRR_FNBC)}</p>
      <div className="comparison">
        <label>Policy Alignment</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.FIRR_FNBC} // Gunakan nilai asli dari FIRR_FNBC
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, FIRR_FNBC: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>Technical Alignment</label>
      </div>

      
      <p className="show-value">Nilai : {showValue(level3.FIRR_FNPV)}</p>
      <div className="comparison">
        <label>Policy Alignment</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.FIRR_FNPV} // Gunakan nilai asli dari FIRR_FNPV
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, FIRR_FNPV: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>Economic Alignment</label>
      </div>

      {/* Ekonomi */}
      <p className="show-value">Nilai : {showValue(level3.ENPV_ENBC)}</p>
      <div className="comparison">
        <label>ENPV</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.ENPV_ENBC} // Gunakan nilai asli dari ENPV_ENBC
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, ENPV_ENBC: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENBC</label>
      </div>


      <p className="show-value">Nilai : {showValue(level3.EIRR_ENBC)}</p>
      <div className="comparison">
        <label>EIRR</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.EIRR_ENBC} // Gunakan nilai asli dari EIRR_ENBC
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, EIRR_ENBC: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENBC</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.EIRR_ENPV)}</p>
      <div className="comparison">
        <label>EIRR</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.EIRR_ENPV} // Gunakan nilai asli dari EIRR_ENPV
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, EIRR_ENPV: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENPV</label>
      </div>

      {/* EKONOMI PDRB ICOR */}
      <p className="show-value">Nilai : {showValue(level3.PDRB_EIRR)}</p>
      <div className="comparison">
        <label>PDRB ICOR</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.PDRB_EIRR} // Gunakan nilai asli dari PDRB_EIRR
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, PDRB_EIRR: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>EIRR</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.PDRB_ENPV)}</p>
      <div className="comparison">
        <label>PDRB ICOR</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.PDRB_ENPV} // Gunakan nilai asli dari PDRB_ENPV
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, PDRB_ENPV: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENPV</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.PDRB_ENBC)}</p>
      <div className="comparison">
        <label>PDRB ICOR</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.PDRB_ENBC} // Gunakan nilai asli dari PDRB_ENBC
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, PDRB_ENBC: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENBC</label>
      </div>


      {/* EKONOMI Multiplier Output */}
      <p className="show-value">Nilai : {showValue(level3.Multiplier_ENPV)}</p>
      <div className="comparison">
        <label>Multiplier Output</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Multiplier_ENPV} // Gunakan nilai asli dari Multiplier_ENPV
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Multiplier_ENPV: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENPV</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Multiplier_ENBC)}</p>
      <div className="comparison">
        <label>Multiplier Output</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Multiplier_ENBC} // Gunakan nilai asli dari Multiplier_ENBC
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Multiplier_ENBC: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENBC</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Multiplier_EIRR)}</p>
      <div className="comparison">
        <label>Multiplier Output</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Multiplier_EIRR} // Gunakan nilai asli dari Multiplier_EIRR
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Multiplier_EIRR: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>EIRR</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Multiplier_PDRB)}</p>
      <div className="comparison">
        <label>Multiplier Output</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Multiplier_PDRB} // Gunakan nilai asli dari Multiplier_PDRB
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Multiplier_PDRB: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>PDRB ICOR</label>
      </div>

      {/* EKONOMI Forward Linkage */}
      <p className="show-value">Nilai : {showValue(level3.Forward_ENPV)}</p>
      <div className="comparison">
        <label>Forward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Forward_ENPV} // Gunakan nilai asli dari Forward_ENPV
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Forward_ENPV: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENPV</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Forward_ENBC)}</p>
      <div className="comparison">
        <label>Forward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Forward_ENBC} // Gunakan nilai asli dari Forward_ENBC
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Forward_ENBC: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENBC</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Forward_EIRR)}</p>
      <div className="comparison">
        <label>Forward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Forward_EIRR} // Gunakan nilai asli dari Forward_EIRR
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Forward_EIRR: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>EIRR</label>
      </div>

      
      <p className="show-value">Nilai : {showValue(level3.Forward_PDRB)}</p>
      <div className="comparison">
        <label>Forward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Forward_PDRB} // Gunakan nilai asli dari Forward_PDRB
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Forward_PDRB: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>PDRB ICOR</label>
      </div>


      <p className="show-value">Nilai : {showValue(level3.Forward_Multiplier)}</p>
      <div className="comparison">
        <label>Forward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Forward_Multiplier} // Gunakan nilai asli dari Forward_Multiplier
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Forward_Multiplier: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>Multiplier Output</label>
      </div>

      {/* EKONOMI Backward Linkage */}
      <p className="show-value">Nilai : {showValue(level3.Backward_ENPV)}</p>
      <div className="comparison">
        <label>Backward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Backward_ENPV} // Gunakan nilai asli dari Backward_ENPV
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Backward_ENPV: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENPV</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_ENBC)}</p>
      <div className="comparison">
        <label>Backward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Backward_ENBC} // Gunakan nilai asli dari Backward_ENBC
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Backward_ENBC: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>ENBC</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_EIRR)}</p>
      <div className="comparison">
        <label>Backward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Backward_EIRR} // Gunakan nilai asli dari Backward_EIRR
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Backward_EIRR: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>EIRR</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_PDRB)}</p>
      <div className="comparison">
        <label>Backward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Backward_PDRB} // Gunakan nilai asli dari Backward_PDRB
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Backward_PDRB: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>PDRB ICOR</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_Multiplier)}</p>
      <div className="comparison">
        <label>Backward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Backward_Multiplier} // Gunakan nilai asli dari Backward_Multiplier
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Backward_Multiplier: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>Multiplier Output</label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_Forward)}</p>
      <div className="comparison">
        <label>Backward Linkage</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Backward_Forward} // Gunakan nilai asli dari Backward_Forward
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Backward_Forward: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>Forward Linkage</label>
      </div>

      {/* Sosial */}
      <p className="show-value">Nilai : {showValue(level3.Serapan_JumlahPenerima)}</p>
      <div className="comparison">
        <label>Serapan Tenaga Kerja</label>
        <div className="range-container">
          <input
            required
            type="range"
            min="-9"
            max="9"
            value={level3.Serapan_JumlahPenerima} // Gunakan nilai asli dari Serapan_JumlahPenerima
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setLevel3({ ...level3, Serapan_JumlahPenerima: newValue }); // Simpan nilai asli
            }}
          />
          <div className="range-labels">
            {[-9, -8, -7, -6, -5, -4, -3, -2,-1,0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (num) => (
                <span key={num} className="range-label">
                  {num < 1 ? Math.abs(num) : num}
                </span>
              )
            )}
          </div>
        </div>
        <label>Jumlah Penerima Manfaat</label>
      </div>
      <button type="submit" className="form-btn">Submit</button>
    </form>
  );
};

export default Form;
