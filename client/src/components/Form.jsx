import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Tooltip from "@mui/material/Tooltip";
import CustomSlider from "./CustomSlider";

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
      toast.error(
        "Jabatan harus memiliki panjang antara 2 hingga 100 karakter."
      );
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
      toast.error(
        "Instansi harus memiliki panjang antara 2 hingga 100 karakter."
      );
      return false;
    }

    return true;
  };

  const calculateConsistency = (matrix) => {
    const n = matrix.length;
    const sumColumns = Array(n).fill(0);

    // Hitung jumlah setiap kolom
    matrix.forEach((row) =>
      row.forEach((value, j) => (sumColumns[j] += value))
    );

    // Normalisasi matriks
    const normalizedMatrix = matrix.map((row) =>
      row.map((value, j) => value / sumColumns[j])
    );

    // Hitung eigenvector (rata-rata dari setiap baris)
    const eigenVector = normalizedMatrix.map(
      (row) => row.reduce((acc, val) => acc + val, 0) / n
    );

    // Hitung λ_max
    const lambdaMax =
      matrix
        .map((row, i) =>
          row.reduce((acc, val, j) => acc + val * eigenVector[j], 0)
        )
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
  };

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
      toast.error(
        `Inconsistent pairwise comparison (CR = ${CR.toFixed(
          2
        )}). Please revise.`
      );
      return;
    }

    // Fungsi untuk membangun matriks pairwise dari sebuah array indikator
    const buildMatrix = (indicators) =>
      indicators.map((i, rowIdx) =>
        indicators.map((j, colIdx) =>
          rowIdx === colIdx
            ? 1
            : adjustedLevel3[`${i}_${j}`] || 1 / adjustedLevel3[`${j}_${i}`]
        )
      );

    // Buat dan validasi matriks untuk setiap kelompok level 3
    const groups = {
      financial: ["FNPV", "FIRR", "FNBC"],
      economy: [
        "ENPV",
        "EIRR",
        "ENBC",
        "PDRB",
        "Multiplier",
        "Backward",
        "Forward",
      ],
      social: ["Serapan", "JumlahPenerima"],
    };

    for (const [groupName, indicators] of Object.entries(groups)) {
      const matrix = buildMatrix(indicators);
      const CR = calculateConsistency(matrix);
      if (CR >= 0.1) {
        toast.error(
          `Inconsistent ${groupName} comparison (CR = ${CR.toFixed(
            2
          )}). Please revise.`
        );
        return;
      }
    }

    const data = {
      name: name,
      title: jabatan,
      instansi: instansi,
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
        />
      </div>
      <div className="data-diri">
        <label>Instansi</label>
        <input
          required
          type="text"
          value={instansi}
          onChange={(e) => setInstansi(e.target.value)} // Menangani perubahan input
        />
      </div>

      {/* LEVEL 1 */}
      <h3 className="comparison-title">Perbandingan Level 1</h3>
      <p className="show-value">Nilai : {showValue(level1.IFE_ISL)}</p>
      <div className="comparison">
        <label>
          IFE
          <Tooltip title="Indeks Finansial Ekonomi">
            <span className="tooltip-icon">i</span>{" "}
            {/* Anda bisa menggunakan simbol atau ikon untuk menunjukkan tooltip */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel1({ ...level1, IFE_ISL: newValue }); // Mengupdate nilai IFE_ISL sesuai perubahan slider
            }}
          />
        </div>

        {/* Label dengan tooltip untuk ISL */}
        <label>
          ISL
          <Tooltip title="Indeks Sosial Lingkungan">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ISL */}
          </Tooltip>
        </label>
      </div>

      {/* LEVEL 2 */}
      <h3 className="comparison-title">perbandingan Level 2</h3>
      <p className="show-value">
        Nilai : {showValue(level2.financial_economy)}
      </p>
      <div className="comparison">
        <label>
          Finansial
          <Tooltip title="Mengukur aspek keuangan proyek seperti keuntungan dan investasi">
            <span className="tooltip-icon">i</span>{" "}
            {/* Anda bisa menggunakan simbol atau ikon untuk menunjukkan tooltip */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel2({ ...level2, financial_economy: newValue });
            }}
          />
        </div>
        <label>
          Ekonomi
          <Tooltip title="Mengukur dampak ekonomi seperti PDB dan nilai tambah">
            <span className="tooltip-icon">i</span>{" "}
            {/* Anda bisa menggunakan simbol atau ikon untuk menunjukkan tooltip */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">
        Nilai : {showValue(level2.social_environment)}
      </p>
      <div className="comparison">
        <label>
          Sosial
          <Tooltip title="Menganalisis dampak sosial, seperti tenaga kerja yang terserap">
            <span className="tooltip-icon">i</span>{" "}
            {/* Anda bisa menggunakan simbol atau ikon untuk menunjukkan tooltip */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel2({ ...level2, social_environment: newValue });
            }}
          />
        </div>
        <label>
          Lingkungan
          <Tooltip title="Mengukur dampak lingkungan seperti penurunan emisi karbon">
            <span className="tooltip-icon">i</span>{" "}
            {/* Anda bisa menggunakan simbol atau ikon untuk menunjukkan tooltip */}
          </Tooltip>
        </label>
      </div>

      {/* LEVEL 3 */}
      <h3 className="comparison-title">perbandingan Level 3</h3>
      <p className="show-value">Nilai : {showValue(level3.FNPV_FNBC)}</p>
      {/* Finansial */}
      <div className="comparison">
        <label>
          FNPV
          <Tooltip title="Financial Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis finansial dan sudah dinyatakan dalam nilai saat ini (present value).">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk FNPV */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, FNPV_FNBC: newValue });
            }}
          />
        </div>
        <label>
          FNBC
          <Tooltip title="Financial Net Benefit Cost Ratio adalah perbandingan antara FNPV yang bernilai positif dengan FNPV yang bernilai negatif. FNBC menggambarkan berapa kali lipat benefit yang dapat diperoleh dari biaya yang dikeluarkan.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk FNBC */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.FIRR_FNBC)}</p>
      <div className="comparison">
        <label>
          FIRR
          <Tooltip title="Financial Internal Rate of Return adalah tingkat keuntungan suatu proyek atau discount rate yang membuat FNPV sama dengan nol.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk FIRR */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, FIRR_FNBC: newValue });
            }}
          />
        </div>
        <label>
          FNBC
          <Tooltip title="Financial Net Benefit Cost Ratio adalah perbandingan antara FNPV yang bernilai positif dengan FNPV yang bernilai negatif. FNBC menggambarkan berapa kali lipat benefit yang dapat diperoleh dari biaya yang dikeluarkan.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk FNBC */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.FIRR_FNPV)}</p>
      <div className="comparison">
        <label>
          FIRR
          <Tooltip title="Financial Internal Rate of Return adalah tingkat keuntungan suatu proyek atau discount rate yang membuat FNPV sama dengan nol.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk FIRR */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, FIRR_FNPV: newValue });
            }}
          />
        </div>
        <label>
          FNPV
          <Tooltip title="Financial Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis finansial dan sudah dinyatakan dalam nilai saat ini (present value).">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk FNPV */}
          </Tooltip>
        </label>
      </div> 

      {/* Ekonomi */}
      <p className="show-value">Nilai : {showValue(level3.ENPV_ENBC)}</p>
      <div className="comparison">
        <label>
          ENPV
          <Tooltip title="Economic Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis ekonomi dan dinyatakan dalam nilai saat ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENPV */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, ENPV_ENBC: newValue });
            }}
          />
        </div>
        <label>
          ENBC
          <Tooltip title="Economic Net Benefit Cost Ratio adalah perbandingan antara ENPV yang positif dengan ENPV yang negatif. ENBC menunjukkan berapa kali lipat benefit yang diperoleh dari biaya yang dikeluarkan.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENBC */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.EIRR_ENBC)}</p>
      <div className="comparison">
        <label>
          EIRR
          <Tooltip title="Economic Internal Rate of Return adalah tingkat pengembalian ekonomi atau discount rate yang membuat ENPV sama dengan nol.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk EIRR */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, EIRR_ENBC: newValue });
            }}
          />
        </div>
        <label>
          ENBC
          <Tooltip title="Economic Net Benefit Cost Ratio adalah perbandingan antara ENPV yang positif dengan ENPV yang negatif. ENBC menunjukkan berapa kali lipat benefit yang diperoleh dari biaya yang dikeluarkan.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENBC */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.EIRR_ENPV)}</p>
      <div className="comparison">
        <label>
          EIRR
          <Tooltip title="Economic Internal Rate of Return adalah tingkat pengembalian ekonomi atau discount rate yang membuat ENPV sama dengan nol.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk EIRR */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, EIRR_ENPV: newValue });
            }}
          />
        </div>
        <label>
          ENPV
          <Tooltip title="Economic Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis ekonomi dan dinyatakan dalam nilai saat ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENPV */}
          </Tooltip>
        </label>
      </div>

      {/* EKONOMI PDRB ICOR */}
      <p className="show-value">Nilai : {showValue(level3.PDRB_EIRR)}</p>
      <div className="comparison">
        <label>
          PDRB ICOR
          <Tooltip title="Nilai tambahan PDRB sub-sektor atau lapangan usaha sesuai dengan proyek yang dikerjakan yang diproyeksikan dari nilai ICOR (Incremental Capital Output Ratio).">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk PDRB */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, PDRB_EIRR: newValue });
            }}
          />
        </div>
        <label>
          EIRR
          <Tooltip title="Economic Internal Rate of Return adalah tingkat pengembalian ekonomi atau discount rate yang membuat ENPV sama dengan nol.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk EIRR */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.PDRB_ENPV)}</p>
      <div className="comparison">
        <label>
          PDRB ICOR
          <Tooltip title="Nilai tambahan PDRB sub-sektor atau lapangan usaha sesuai dengan proyek yang dikerjakan yang diproyeksikan dari nilai ICOR (Incremental Capital Output Ratio).">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk PDRB */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, PDRB_ENPV: newValue });
            }}
          />
        </div>
        <label>
          ENPV
          <Tooltip title="Economic Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis ekonomi dan dinyatakan dalam nilai saat ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENPV */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.PDRB_ENBC)}</p>
      <div className="comparison">
        <label>
          PDRB ICOR
          <Tooltip title="Nilai tambahan PDRB sub-sektor atau lapangan usaha sesuai dengan proyek yang dikerjakan yang diproyeksikan dari nilai ICOR (Incremental Capital Output Ratio).">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk PDRB */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, PDRB_ENBC: newValue });
            }}
          />
        </div>
        <label>
          ENBC
          <Tooltip title="Economic Net Benefit Cost Ratio adalah perbandingan antara ENPV yang positif dengan ENPV yang negatif. ENBC menunjukkan berapa kali lipat benefit yang diperoleh dari biaya yang dikeluarkan.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENBC */}
          </Tooltip>
        </label>
      </div>

      {/* EKONOMI Multiplier Output */}
      <p className="show-value">Nilai : {showValue(level3.Multiplier_ENPV)}</p>
      <div className="comparison">
        <label>
          Multiplier Output
          <Tooltip title="Output multiplier atau angka pengganda output menunjukkan berapa besar tambahan output pada suatu sub sektor atau lapangan usaha jika ada tambahan final demand (konsumsi, investasi, dan pengeluaran pemerintah) sebesar Rp 1 pada sub sektor atau lapangan usaha tersebut.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Multiplier Output */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Multiplier_ENPV: newValue });
            }}
          />
        </div>
        <label>
          ENPV
          <Tooltip title="Economic Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis ekonomi dan dinyatakan dalam nilai saat ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENPV */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Multiplier_ENBC)}</p>
      <div className="comparison">
        <label>
          Multiplier Output
          <Tooltip title="Output multiplier atau angka pengganda output menunjukkan berapa besar tambahan output pada suatu sub sektor atau lapangan usaha jika ada tambahan final demand (konsumsi, investasi, dan pengeluaran pemerintah) sebesar Rp 1 pada sub sektor atau lapangan usaha tersebut.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Multiplier Output */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Multiplier_ENBC: newValue });
            }}
          />
        </div>
        <label>
          ENBC
          <Tooltip title="Economic Net Benefit Cost Ratio adalah perbandingan antara ENPV yang positif dengan ENPV yang negatif. ENBC menunjukkan berapa kali lipat benefit yang diperoleh dari biaya yang dikeluarkan.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENBC */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Multiplier_EIRR)}</p>
      <div className="comparison">
        <label>
          Multiplier Output
          <Tooltip title="Output multiplier atau angka pengganda output menunjukkan berapa besar tambahan output pada suatu sub sektor atau lapangan usaha jika ada tambahan final demand (konsumsi, investasi, dan pengeluaran pemerintah) sebesar Rp 1 pada sub sektor atau lapangan usaha tersebut.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Multiplier Output */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Multiplier_EIRR: newValue });
            }}
          />
        </div>
        <label>
          EIRR
          <Tooltip title="Economic Internal Rate of Return adalah tingkat pengembalian ekonomi atau discount rate yang membuat ENPV sama dengan nol.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk EIRR */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Multiplier_PDRB)}</p>
      <div className="comparison">
        <label>
          Multiplier Output
          <Tooltip title="Output multiplier atau angka pengganda output menunjukkan berapa besar tambahan output pada suatu sub sektor atau lapangan usaha jika ada tambahan final demand (konsumsi, investasi, dan pengeluaran pemerintah) sebesar Rp 1 pada sub sektor atau lapangan usaha tersebut.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Multiplier Output */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Multiplier_PDRB: newValue });
            }}
          />
        </div>
        <label>
          PDRB ICOR
          <Tooltip title="Nilai tambahan PDRB sub-sektor atau lapangan usaha sesuai dengan proyek yang dikerjakan yang diproyeksikan dari nilai ICOR (Incremental Capital Output Ratio).">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk PDRB */}
          </Tooltip>
        </label>
      </div>

      {/* EKONOMI Forward Linkage */}
      <p className="show-value">Nilai : {showValue(level3.Forward_ENPV)}</p>
      <div className="comparison">
        <label>
          Forward Linkage
          <Tooltip title="Forward Linkage atau keterkaitan ke hilir menunjukkan indeks derajat kepekaan yang mengukur seberapa besar suatu sub sektor atau lapangan usaha memiliki kemampuan mendorong pertumbuhan sektor lainnya yang mempergunakan input dari sub sektor atau lapangan usaha ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Forward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Forward_ENPV: newValue });
            }}
          />
        </div>
        <label>
          ENPV
          <Tooltip title="Economic Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis ekonomi dan dinyatakan dalam nilai saat ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENPV */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Forward_ENBC)}</p>
      <div className="comparison">
        <label>
          Forward Linkage
          <Tooltip title="Forward Linkage atau keterkaitan ke hilir menunjukkan indeks derajat kepekaan yang mengukur seberapa besar suatu sub sektor atau lapangan usaha memiliki kemampuan mendorong pertumbuhan sektor lainnya yang mempergunakan input dari sub sektor atau lapangan usaha ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Forward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Forward_ENBC: newValue });
            }}
          />
        </div>
        <label>
          ENBC
          <Tooltip title="Economic Net Benefit Cost Ratio adalah perbandingan antara ENPV yang positif dengan ENPV yang negatif. ENBC menunjukkan berapa kali lipat benefit yang diperoleh dari biaya yang dikeluarkan.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENBC */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Forward_EIRR)}</p>
      <div className="comparison">
        <label>
          Forward Linkage
          <Tooltip title="Forward Linkage atau keterkaitan ke hilir menunjukkan indeks derajat kepekaan yang mengukur seberapa besar suatu sub sektor atau lapangan usaha memiliki kemampuan mendorong pertumbuhan sektor lainnya yang mempergunakan input dari sub sektor atau lapangan usaha ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Forward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Forward_EIRR: newValue });
            }}
          />
        </div>
        <label>
          EIRR
          <Tooltip title="Economic Internal Rate of Return adalah tingkat pengembalian ekonomi atau discount rate yang membuat ENPV sama dengan nol.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk EIRR */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Forward_PDRB)}</p>
      <div className="comparison">
        <label>
          Forward Linkage
          <Tooltip title="Forward Linkage atau keterkaitan ke hilir menunjukkan indeks derajat kepekaan yang mengukur seberapa besar suatu sub sektor atau lapangan usaha memiliki kemampuan mendorong pertumbuhan sektor lainnya yang mempergunakan input dari sub sektor atau lapangan usaha ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Forward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Forward_PDRB: newValue });
            }}
          />
        </div>
        <label>
          PDRB ICOR
          <Tooltip title="Nilai tambahan PDRB sub-sektor atau lapangan usaha sesuai dengan proyek yang dikerjakan yang diproyeksikan dari nilai ICOR (Incremental Capital Output Ratio).">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk PDRB */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Forward_Multiplier)}</p>
      <div className="comparison">
        <label>
          Forward Linkage
          <Tooltip title="Forward Linkage atau keterkaitan ke hilir menunjukkan indeks derajat kepekaan yang mengukur seberapa besar suatu sub sektor atau lapangan usaha memiliki kemampuan mendorong pertumbuhan sektor lainnya yang mempergunakan input dari sub sektor atau lapangan usaha ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Forward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Forward_Multiplier: newValue });
            }}
          />
        </div>
        <label>
          Multiplier Output
          <Tooltip title="Output multiplier atau angka pengganda output menunjukkan berapa besar tambahan output pada suatu sub sektor atau lapangan usaha jika ada tambahan final demand (konsumsi, investasi, dan pengeluaran pemerintah) sebesar Rp 1 pada sub sektor atau lapangan usaha tersebut.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Multiplier Output */}
          </Tooltip>
        </label>
      </div>

      {/* EKONOMI Backward Linkage */}
      <p className="show-value">Nilai : {showValue(level3.Backward_ENPV)}</p>
      <div className="comparison">
        <label>
          Backward Linkage
          <Tooltip title="Backward Linkage atau keterkaitan ke hulu menunjukkan indeks daya penyebaran yang mengukur seberapa besar suatu sub sektor atau lapangan usaha mempunyai kemampuan menarik pertumbuhan sektor-sektor yang menyediakan input atau bahan baku produksinya.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Backward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Backward_ENPV: newValue });
            }}
          />
        </div>
        <label>
          ENPV
          <Tooltip title="Economic Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis ekonomi dan dinyatakan dalam nilai saat ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENPV */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_ENBC)}</p>
      <div className="comparison">
        <label>
          Backward Linkage
          <Tooltip title="Backward Linkage atau keterkaitan ke hulu menunjukkan indeks daya penyebaran yang mengukur seberapa besar suatu sub sektor atau lapangan usaha mempunyai kemampuan menarik pertumbuhan sektor-sektor yang menyediakan input atau bahan baku produksinya.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Backward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Backward_ENBC: newValue });
            }}
          />
        </div>
        <label>
          ENBC
          <Tooltip title="Economic Net Benefit Cost Ratio adalah perbandingan antara ENPV yang positif dengan ENPV yang negatif. ENBC menunjukkan berapa kali lipat benefit yang diperoleh dari biaya yang dikeluarkan.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk ENBC */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_EIRR)}</p>
      <div className="comparison">
        <label>
          Backward Linkage
          <Tooltip title="Backward Linkage atau keterkaitan ke hulu menunjukkan indeks daya penyebaran yang mengukur seberapa besar suatu sub sektor atau lapangan usaha mempunyai kemampuan menarik pertumbuhan sektor-sektor yang menyediakan input atau bahan baku produksinya.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Backward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Backward_EIRR: newValue });
            }}
          />
        </div>
        <label>
          EIRR
          <Tooltip title="Economic Internal Rate of Return adalah tingkat pengembalian ekonomi atau discount rate yang membuat ENPV sama dengan nol.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk EIRR */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_PDRB)}</p>
      <div className="comparison">
        <label>
          Backward Linkage
          <Tooltip title="Backward Linkage atau keterkaitan ke hulu menunjukkan indeks daya penyebaran yang mengukur seberapa besar suatu sub sektor atau lapangan usaha mempunyai kemampuan menarik pertumbuhan sektor-sektor yang menyediakan input atau bahan baku produksinya.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Backward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Backward_PDRB: newValue });
            }}
          />
        </div>
        <label>
          PDRB ICOR
          <Tooltip title="Nilai tambahan PDRB sub-sektor atau lapangan usaha sesuai dengan proyek yang dikerjakan yang diproyeksikan dari nilai ICOR (Incremental Capital Output Ratio).">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk PDRB */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_Multiplier)}</p>
      <div className="comparison">
        <label>
          Backward Linkage
          <Tooltip title="Backward Linkage atau keterkaitan ke hulu menunjukkan indeks daya penyebaran yang mengukur seberapa besar suatu sub sektor atau lapangan usaha mempunyai kemampuan menarik pertumbuhan sektor-sektor yang menyediakan input atau bahan baku produksinya.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Backward Linkage */}
          </Tooltip>
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Backward_Multiplier: newValue });
            }}
          />
        </div>
        <label>
          Multiplier Output
          <Tooltip title="Output multiplier atau angka pengganda output menunjukkan berapa besar tambahan output pada suatu sub sektor atau lapangan usaha jika ada tambahan final demand (konsumsi, investasi, dan pengeluaran pemerintah) sebesar Rp 1 pada sub sektor atau lapangan usaha tersebut.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Multiplier Output */}
          </Tooltip>
        </label>
      </div>

      <p className="show-value">Nilai : {showValue(level3.Backward_Forward)}</p>
      <div className="comparison">
        <label>
          Backward Linkage
          <Tooltip title="Backward Linkage atau keterkaitan ke hulu menunjukkan indeks daya penyebaran yang mengukur seberapa besar suatu sub sektor atau lapangan usaha mempunyai kemampuan menarik pertumbuhan sektor-sektor yang menyediakan input atau bahan baku produksinya.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Backward Linkage */}
          </Tooltip>
        </label>

        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Backward_Forward: newValue });
            }}
          />
        </div>
        <label>
          Forward Linkage
          <Tooltip title="Forward Linkage atau keterkaitan ke hilir menunjukkan indeks derajat kepekaan yang mengukur seberapa besar suatu sub sektor atau lapangan usaha memiliki kemampuan mendorong pertumbuhan sektor lainnya yang mempergunakan input dari sub sektor atau lapangan usaha ini.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Forward Linkage */}
          </Tooltip>
        </label>
      </div>

      {/* Sosial */}
      <p className="show-value">Nilai : {showValue(level3.Serapan_JumlahPenerima)}</p>
      <div className="comparison">
        <label className="social-indicator">
          Serapan Tenaga<br/>Kerja
          <Tooltip title="Multiplier atau angka pengganda tenaga kerja menunjukkan berapa tambahan tenaga kerja yang diperlukan di suatu sub sektor atau lapangan usaha Jika ada tambahan final demand (konsumsi rumah tangga, pengeluaran pemerintah, atau investasi) sebesar Rp 1 di sub sektor atau lapangan usaha tersebut.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Serapan Tenaga Kerja */}
          </Tooltip> 
        </label>
        <div className="range-container">
          <CustomSlider
            onChange={(newValue) => {
              setLevel3({ ...level3, Serapan_JumlahPenerima: newValue });
            }}
          />
        </div>
        <label className="social-indicator">
          Jumlah Penerima<br/>Manfaat
          <Tooltip title="Jumlah penerima manfaat langsung yang mendapatkan keuntungan dari proyek.">
            <span className="tooltip-icon">i</span>{" "}
            {/* Ikon tooltip untuk Jumlah Penerima Manfaat */}
          </Tooltip>
        </label>
      </div>
      <button type="submit" className="form-btn">
        Submit
      </button>
    </form>
  );
};

export default Form;
