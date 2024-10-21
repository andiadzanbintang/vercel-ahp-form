import  { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';


export default function Tutorial() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`tutorial tutorial-${isOpen}`}>
      <h3 onClick={toggleDropdown} className="dropdown-header">
        Petunjuk Penggunaan Form AHP {isOpen ? <AiOutlineUp className='dropdown-arrow' /> : <AiOutlineDown className='dropdown-arrow' />}
      </h3>
      <p className='dropdown-note'>Harap isi menggunakan laptop atau komputer untuk tampilan yang lebih baik.</p>

      {isOpen && (
        <div className="tutorial-content">
          <strong>Tujuan Pengisian</strong>
          <p>
          Pengisian form AHP ini bertujuan untuk memberikan nilai (tingkat kepentingan) pada indikator-indikator yang digunakan dalam menentukan infrastruktur prioritas. 
          Nilai tersebut diwujudkan dalam dua indeks utama dan beberapa indikator penyusun, yaitu:
          </p>
          <ul>
            <li><strong>Indeks Finansial Ekonomi (IFE)</strong></li>
            <li><strong>Indeks Sosial Lingkungan (ISL)</strong></li>
          </ul>
          <p>
            Setiap indeks memiliki beberapa indikator turunan. Untuk menentukan bobot dari setiap indikator, digunakan metode <strong>Analytical Hierarchy Process (AHP)</strong>. Penilaian ini dilakukan oleh tenaga ahli untuk mengetahui besar bobot masing-masing indikator.
          </p>

          <h3>Langkah-langkah Penggunaan AHP</h3>
          <ol>
            <li>
              <strong>Pergi ke Halaman Form</strong><br />
              Klik <a href="/form" style={{ textDecoration: 'none' }}><em>Form</em></a> di Navbar untuk masuk ke halaman pengisian.
            </li>
            <li><strong>Isi Data Diri</strong><br />Masukkan nama, posisi, dan instansi Anda.</li>
            <li><strong>Isi Penilaian Indikator</strong><br />Berikan penilaian perbandingan antar indikator. Lihat link <a href='/indikator' style={{fontStyle:'italic'}}>Indikator</a> untuk penjelasan lengkap indikatornya</li>
            <li>
              <strong>Penilaian Berdasarkan 3 Level:</strong>
              <ul>
                <li><em>Level 1:</em> Perbandingan antara IFE dan ISL.</li>
                <li>
                  <em>Level 2:</em>
                  <ul>
                    <li>Indikator Finansial vs Ekonomi (IFE)</li>
                    <li>Indikator Sosial vs Lingkungan (ISL)</li>
                  </ul>
                </li>
                <li>
                  <em>Level 3:</em> Perbandingan indikator turunan:
                  <ul>
                    <li>Finansial: FNPV, FIRR, FNBC</li>
                    <li>Ekonomi: ENPV, EIRR, ENBC, PDRB, Multiplier, Backward, Forward</li>
                    <li>Sosial: Serapan, Jumlah Penerima</li>
                    <li>Lingkungan: Penurunan Gas Rumah Kaca</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><strong>Submit Form</strong><br />Setelah semua penilaian selesai, klik tombol submit.</li>
            <li><strong>Lihat Hasil di Beranda</strong><br />Pergi ke beranda dan <em>Refresh</em> untuk melihat hasil penilaian.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
