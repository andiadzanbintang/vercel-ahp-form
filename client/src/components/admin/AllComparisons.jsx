import { useEffect, useState } from "react";
import axios from "axios";

export default function AllComparisons() {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComparisons = async () => {
    try {
      const response = await axios.get("/api/v1/admin/getAllComparisons"); // Update route
      setComparisons(response.data.comparisons || []);
      setLoading(false);
    } catch (err) {
      setError("Error fetching comparisons.", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisons();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (comparisons.length === 0) return <p>Tidak ada data perbandingan.</p>;

  // Mengelompokkan perbandingan berdasarkan iterasi
  const groupedComparisons = comparisons.reduce((acc, comparison) => {
    (acc[comparison.iteration] = acc[comparison.iteration] || []).push(comparison);
    return acc;
  }, {});

  return (
    <div className="comparisons-container">
      <h2>Daftar Input Perbandingan</h2>
      {Object.keys(groupedComparisons).map((iteration) => (
        <div key={iteration} className="iteration-group">
          <h3>Iterasi ke-{iteration}</h3>
          <table className="comparisons-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Posisi</th>
                <th>Instansi</th>
              </tr>
            </thead>
            <tbody>
              {groupedComparisons[iteration].map((comparison) => (
                <tr key={comparison._id}>
                  <td>{comparison.name}</td>
                  <td>{comparison.title}</td>
                  <td>{comparison.instansi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
