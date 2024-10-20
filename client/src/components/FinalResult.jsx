import { useEffect, useState } from "react";
import axios from "axios";

const FinalResult = () => {
  const [weights, setWeights] = useState({
    level1Weights: [], 
    level2Weights: [],
    level3Weights: [],
  });

  const [iteration, setIteration] = useState(0)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinalWeights = async () => {
      try {
        // Ganti endpoint ini sesuai dengan path API Anda
        const response = await axios.get("/api/v1/form/calculate");

        const { level1Weights, level2Weights, level3Weights, iteration} = response.data;

        setWeights({
          level1Weights: level1Weights || [],
          level2Weights: level2Weights || [],
          level3Weights: level3Weights || [],
        });

        setIteration(iteration)

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

  // Cek apakah semua array level weights kosong
  if (
    weights.level1Weights.length === 0 &&
    weights.level2Weights.length === 0 &&
    weights.level3Weights.length === 0
  ) {
    return <p>Belum ada data perhitungan.</p>;
  }

  // Daftar nama indikator untuk setiap level
  const level1Indicators = ["IFE", "ISL"];
  const level2Indicators = ["Financial", "Economy", "Social", "Environment"];
  const level3Indicators = [
    "FNPV",
    "FNBC",
    "FIRR",
    "ENPV",
    "ENBC",
    "EIRR",
    "PDRB",
    "Multiplier",
    "Backward",
    "Forward",
    "Serapan",
    "JumlahPenerima",
  ];

  return (
    <div>
      {/* Display Level 1 Weights */}
      <p>Hasil Perhitungan Iterasi ke {iteration} </p>
      <div>
        <h3>Level 1 Weights</h3>
        <ul>
          {weights.level1Weights.map((weight, index) => (
            <li key={index}>
              {level1Indicators[index]}: {weight}
            </li>
          ))}
        </ul>
      </div>

      {/* Display Level 2 Weights */}
      <div>
        <h3>Level 2 Weights</h3>
        <ul>
          {weights.level2Weights.map((weight, index) => (
            <li key={index}>
              {level2Indicators[index]}: {weight}
            </li>
          ))}
        </ul>
      </div>

      {/* Display Level 3 Weights */}
      <div>
        <h3>Level 3 Weights</h3>
        <ul>
          {weights.level3Weights.map((weight, index) => (
            <li key={index}>
              {level3Indicators[index]}: {weight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FinalResult;
