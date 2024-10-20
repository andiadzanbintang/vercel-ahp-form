import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function SetIteration() {
  const [iteration, setIteration] = useState(''); // Iterasi baru
  const [currentIteration, setCurrentIteration] = useState(''); // Iterasi saat ini
  const [loading, setLoading] = useState(false); // State loading

  // Mendapatkan iterasi terkini dari backend
  useEffect(() => {
    const getIteration = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/v1/admin/getIteration");

        if (response.status === 404) {
          setCurrentIteration("Gagal mendapatkan iterasi terkini");
        } else {
          const { iteration } = response.data; // Ambil iterasi dari respons
          setCurrentIteration(iteration); // Set iterasi saat ini
          setIteration(iteration.toString()); // Isi input dengan string iterasi
        }
      } catch (error) {
        console.error("Error fetching iteration:", error);
        setCurrentIteration("Gagal mendapatkan iterasi terkini");
      } finally {
        setLoading(false);
      }
    };
    getIteration();
  }, []); // UseEffect dijalankan sekali saat komponen pertama kali dirender

  // Handle submit perubahan iterasi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: Input harus angka positif
    if (!/^\d+$/.test(iteration)) {
      toast.error("Iterasi harus berupa angka positif!");
      return;
    }

    try {
      await axios.put("/api/v1/admin/editIteration", {
        iteration: parseInt(iteration, 10),
      });
      toast.success("Berhasil mengubah iterasi!");
      setCurrentIteration(parseInt(iteration, 10)); // Update iterasi saat ini
    } catch (error) {
      console.error("Error updating iteration:", error);
      toast.error("Gagal mengubah iterasi.");
    }
  };

  return (
    <div className="set-iteration-container">
      <h2>Pengaturan Iterasi</h2>

      {loading ? (
        <p>Memuat iterasi saat ini...</p>
      ) : (
        <p>
          Iterasi saat ini: <strong>{currentIteration}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit} className="set-iteration-form">
        <label htmlFor="iteration">Ganti Iterasi:</label>
        <input
          type="text"
          id="iteration"
          value={iteration}
          onChange={(e) => setIteration(e.target.value)}
          placeholder="Masukkan angka iterasi"
        />
        <button type="submit" disabled={loading || iteration === ""} className="set-iteration-btn">
          Simpan
        </button>
      </form>
    </div>
  );
}
