import { useEffect, useState } from "react";
import axios from "axios";

// Nama-nama indikator berdasarkan level
const headers = {
  level1: ["IFE", "ISL"],
  level2: ["Financial", "Economy", "Social", "Environment"],
  level3: [
    "FNPV", "FNBC", "FIRR", "ENPV", "ENBC", "EIRR", 
    "PDRB", "Multiplier", "Backward", "Forward", 
    "Serapan", "Jumlah Penerima"
  ],
};

const PairwiseMat = () => {
  const [matrices, setMatrices] = useState({
    level1Matrices: [],
    level2Matrices: [],
    level3Matrices: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatrices = async () => {
      try {
        const response = await axios.get("/api/v1/form/calculate");
        const { level1Matrices, level2Matrices, level3Matrices } = response.data;

        setMatrices({
          level1Matrices: level1Matrices || [],
          level2Matrices: level2Matrices || [],
          level3Matrices: level3Matrices || [],
        });

        setLoading(false);
      } catch (err) {
        setError("Error fetching pairwise matrices.", err);
        setLoading(false);
      }
    };

    fetchMatrices();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Fungsi untuk menampilkan matriks dengan header
  const renderMatrixWithHeader = (matrix, header) => (
    <table>
      <thead>
        <tr>
          <th></th> {/* Cell kosong di pojok kiri atas */}
          {header.map((colName, index) => (
            <th key={index} style={{ padding: "8px", border: "1px solid #ddd" }}>
              {colName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>
              {header[rowIndex]}
            </th>
            {row.map((value, colIndex) => (
              <td key={colIndex} style={{ padding: "8px", border: "1px solid #ddd" }}>
                {value.toFixed(3)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      {/* Matriks Level 1 */}
      <div>
        <h3>Level 1 Matrix</h3>
        {matrices.level1Matrices.map((matrix, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            {renderMatrixWithHeader(matrix, headers.level1)}
          </div>
        ))}
      </div>

      {/* Matriks Level 2 */}
      <div>
        <h3>Level 2 Matrix</h3>
        {matrices.level2Matrices.map((matrix, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            {renderMatrixWithHeader(matrix, headers.level2)}
          </div>
        ))}
      </div>

      {/* Matriks Level 3 */}
      <div>
        <h3>Level 3 Matrix</h3>
        {matrices.level3Matrices.map((matrix, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            {renderMatrixWithHeader(matrix, headers.level3)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PairwiseMat;
