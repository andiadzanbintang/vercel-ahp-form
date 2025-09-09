import { useEffect, useState } from "react";
import axios from "axios";

const IFE_INDICATORS = {
  IFE1: "Dampak terhadap pengembangan ekonomi lokal",
  IFE2: "Dampak terhadap keuntungan ekonomi jangka panjang",
  IFE3: "Dampak terhadap pemanfaatan sumber daya lokal",
  IFE4: "Kontribusi terhadap kehidupan lebih baik warga kota",
  IFE5: "Dampak multiplier & jejaring ekonomi/industri lain",
  IFE6: "Penerimaan langsung dari proyek",
  IFE7: "Pengaruh terhadap alokasi anggaran berjalan",
  IFE8: "Pengalokasian proyek di dalam APBD/APBN",
  IFE9: "Kebutuhan dukungan eksternal",
  IFE10: "Risiko finansial/ekonomi terhadap keberlanjutan proyek",
  IFE11: "Risiko politik terhadap keberlanjutan proyek",
  IFE12: "Strategi mitigasi risiko dalam penyelenggaraan proyek",
};

const ISL_INDICATORS = {
  ISL1: "Dampak terhadap kualitas lingkungan sekitar",
  ISL2: "Kontribusi dalam keberlanjutan jangka panjang",
  ISL3: "Kontribusi terhadap kesehatan masyarakat lokal",
  ISL4: "Kontribusi terhadap adaptasi perubahan iklim",
  ISL5: "Kontribusi terhadap mitigasi perubahan iklim",
  ISL6: "Kontribusi peningkatan kualitas ruang publik kota",
  ISL7: "Dampak/risiko terhadap keanekaragaman hayati",
  ISL8: "Inovasi/keterbaruan untuk perbaikan masa depan",
  ISL9: "Dampak ke masyarakat akibat alih fungsi lahan",
  ISL10: "Perbaikan lingkungan masyarakat berpenghasilan rendah",
};

export default function FinalResult() {
  const [weights, setWeights] = useState({});
  const [iteration, setIteration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinalWeights = async () => {
      try {
        const response = await axios.get("/api/v1/form/calculate");
        const { level3Weights = {}, iteration = 0 } = response.data;

        setWeights(level3Weights);
        setIteration(iteration);
        setLoading(false);
      } catch (err) {
        setError("Error fetching AHP final weights.", err);
        setLoading(false);
      }
    };

    fetchFinalWeights();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (Object.keys(weights).length === 0) return <p>Belum ada data perhitungan.</p>;

  return (
    <div>
      <p>Hasil Perhitungan Iterasi ke {iteration}</p>
      <h3>Bobot Akhir Indikator</h3>
      <ul>
        {Object.entries(weights).map(([key, value]) => (
          <li key={key}>
            {(IFE_INDICATORS[key] || ISL_INDICATORS[key] || key)}:{" "}
            {value.toFixed(4)}
          </li>
        ))}
      </ul>
    </div>
  );
}
