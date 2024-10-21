const indikatorData = {
  level1: [
    { title: "IFE", description: "Indeks Finansial Ekonomi (IFE) adalah ukuran yang mengukur sejauh mana dampak keuangan dan ekonomi yang ditimbulkan oleh adanya proyek pembangunan infrastruktur." },
    { title: "ISL", description: "Indeks Sosial Lingkungan (ISL) adalah ukuran yang mengukur sejauh mana proyek infrastruktur dapat meningkatkan kualitas hidup dan sejauh mana pengorbanan yang diakibatkan pembangunan proyek tersebut dapat membahayakan aspek lingkungan." },
  ],
  level2: [
    { title: "Financial", description: "Analisis finansial adalah analisis kelayakan investasi suatu proyek dari aspek keuangan yang diukur dengan indikator manfaat-biaya (benefit-cost) dengan satuan nilai uang (moneter value) dan dianalisis dengan konsep analisis finansial dengan target financially sustainable untuk memaksimumkan keuntungan bagi pemilik proyek (private return) berdasarkan perhitungan harga pasar (market price)." },
    { title: "Economy", description: "Analisis ekonomi adalah analisis kelayakan investasi suatu proyek dari aspek keuangan yang diukur dengan indikator manfaat-biaya (benefit-cost) dengan satuan nilai uang (moneter value) dan dianalisis dengan konsep analisis ekonomi dengan target economically viable untuk memaksimumkan keuntungan ekonomi (economic profit atau sosial return) dalam rangka memaksimumkan kesejahteraan masyarakat secara luas berdasarkan perhitungan harga ekonomi (economic cost) yang diukur dengan konsep shadow price, real price, dan opportunity cost (benefit foregone)." },
    { title: "Social", description: "Analisis aspek sosial adalah mengukur dampak sosial yang dapat secara langsung maupun tidak langsung ditimbulkan oleh adanya investasi suatu proyek infrastruktur dan dirasakan oleh masyarakat di sekitar lokasi proyek maupun masyarakat pada lingkungan yang lebih luas. " },
    { title: "Environment", description: "Analisis aspek lingkungan adalah mengukur dampak lingkungan dan perubahan kondisi keanekaragaman hayati yang ditimbulkan oleh adanya investasi suatu proyek, baik dampak atau eksternalitas positif maupun dampak atau eksternalitas negatif." },
  ],
  level3: [
    {
      title: "FNPV",
      description: "Financial Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis finansial dan sudah dinyatakan dalam nilai saat ini (present value).",
      data_used_description: [
        "Nilai pendapatan proyek yang sudah dihitung dengan analisis finansial dan dinyatakan dalam nilai saat ini (present value benefit).",
        "Nilai biaya total proyek yang dihitung dengan analisis finansial dan dinyatakan dalam nilai saat ini."
      ],
      unit: ["Rp", "Rp"],
      kriteria: ["Nilai positif atau lebih besar dari nol (>0)"]
    },
    {
      title: "FNBC",
      description: "Financial Net Benefit Cost Ratio adalah perbandingan antara FNPV yang bernilai positif dengan FNPV yang bernilai negatif. FNBC menggambarkan berapa kali lipat benefit yang dapat diperoleh dari biaya yang dikeluarkan.",
      data_used_description: ["Nilai FNPV yang positif dan FNPV yang negatif"],
      unit: ["Angka rasio"],
      kriteria: ["Lebih besar dari satu (>1)"]
    },
    {
      title: "FIRR",
      description: "Financial Internal Rate of Return adalah tingkat keuntungan suatu proyek atau discount rate yang membuat FNPV sama dengan nol.",
      data_used_description: ["Nilai FNPV"],
      unit: ["%"],
      kriteria: ["Lebih besar dari discount rate yang digunakan"]
    },
    {
      title: "ENPV",
      description: "Economic Net Present Value adalah keuntungan netto (pendapatan bruto dikurangi biaya total) suatu proyek yang dihitung dengan analisis ekonomi dan dinyatakan dalam nilai saat ini.",
      data_used_description: [
        "Nilai pendapatan proyek yang dihitung dengan analisis ekonomi dan dinyatakan dalam nilai saat ini (present value benefit).",
        "Nilai biaya total proyek yang dihitung dengan analisis ekonomi dan dinyatakan dalam nilai saat ini."
      ],
      unit: ["Rp", "Rp"],
      kriteria: ["Nilai positif atau lebih besar dari nol (>0)"]
    },
    {
      title: "ENBC",
      description: "Economic Net Benefit Cost Ratio adalah perbandingan antara ENPV yang positif dengan ENPV yang negatif. ENBC menunjukkan berapa kali lipat benefit yang diperoleh dari biaya yang dikeluarkan.",
      data_used_description: ["Nilai ENPV yang positif dan ENPV yang negatif"],
      unit: ["Angka rasio"],
      kriteria: ["Lebih besar dari satu (>1)"]
    },
    {
      title: "EIRR",
      description: "Economic Internal Rate of Return adalah tingkat pengembalian ekonomi atau discount rate yang membuat ENPV sama dengan nol.",
      data_used_description: ["Nilai ENPV"],
      unit: ["%"],
      kriteria: ["Lebih besar dari sosial discount rate yang digunakan"]
    },
    {
      title: "PDRB",
      description: "Nilai tambahan PDRB sub-sektor atau lapangan usaha sesuai dengan proyek yang dikerjakan yang diproyeksikan dari nilai ICOR (Incremental Capital Output Ratio). ICOR adalah rasio antara tambahan investasi dengan tambahan output atau PDRB.",
      data_used_description: [
        "Nilai ICOR lapangan usaha atau sub-sektor proyek.",
        "Nilai investasi proyek."
      ],
      unit: ["Angka rasio", "Rp"],
      kriteria: [
        "Semakin rendah angka ICOR, semakin efisien.",
        "Semakin besar nilai tambahan PDRB, semakin baik."
      ]
    },
    {
      title: "Multiplier Output",
      description: "Output multiplier atau angka pengganda output menunjukkan berapa besar tambahan output pada suatu sub sektor atau lapangan usaha jika ada tambahan final demand (konsumsi, investasi, dan pengeluaran pemerintah) sebesar Rp 1 pada sub sektor atau lapangan usaha tersebut.",
      data_used_description: [
        "Nilai koefisien multiplier output dari tabel input-output.",
        "Nilai investasi proyek."
      ],
      unit: ["Angka koefisien", "Rp"],
      kriteria: ["Semakin besar tambahan output, semakin baik"]
    },
    {
      title: "Backward Linkage",
      description: "Backward Linkage atau keterkaitan ke hulu menunjukkan indeks daya penyebaran yang mengukur seberapa besar suatu sub sektor atau lapangan usaha mempunyai kemampuan menarik pertumbuhan sektor-sektor yang menyediakan input atau bahan baku produksinya.",
      data_used_description: ["Nilai koefisien backward linkage dari tabel input-output."],
      unit: ["Angka koefisien"],
      kriteria: [
        "Lebih besar dari satu (>1) menunjukkan daya penyebaran di atas rata-rata sektor ekonomi."
      ]
    },
    {
      title: "Forward Linkage",
      description: "Forward Linkage atau keterkaitan ke hilir menunjukkan indeks derajat kepekaan yang mengukur seberapa besar suatu sub sektor atau lapangan usaha memiliki kemampuan mendorong pertumbuhan sektor lainnya yang mempergunakan input dari sub sektor atau lapangan usaha ini.",
      data_used_description: ["Nilai koefisien forward linkage dari tabel input-output."],
      unit: ["Angka koefisien"],
      kriteria: [
        "Lebih besar dari satu (>1) menunjukkan derajat kepekaan di atas rata-rata sektor ekonomi."
      ]
    },
    {
      title: "Serapan Tenaga Kerja",
      description: "Multiplier atau angka pengganda tenaga kerja menunjukkan berapa tambahan tenaga kerja yang diperlukan di suatu sub sektor atau lapangan usaha Jika ada tambahan final demand (konsumsi rumah tangga, pengeluaran pemerintah, atau investasi) sebesar Rp 1 di sub sektor atau lapangan usaha tersebut.",
      data_used_description: [
        "Nilai koefisien multiplier tenaga kerja.",
        "Nilai investasi proyek."
      ],
      unit: ["Angka koefisien", "Rp"],
      kriteria: ["Semakin banyak tenaga kerja terserap, semakin baik"]
    },
    {
      title: "Jumlah Penerima Manfaat",
      description: "Jumlah penerima manfaat langsung yang mendapatkan keuntungan dari proyek.",
      data_used_description: ["Jumlah penerima manfaat proyek."],
      unit: ["Orang"],
      kriteria: ["Semakin banyak penerima manfaat, semakin baik"]
    }
  ],
};

// Komponen untuk menampilkan masing-masing indikator

export default function IndikatorPage() {
  return (
    <div className="indikator-container">
        <div className="lvl-1-group indikator-group">
        {indikatorData.level1.map((indikator, index) => (
            <div className="indikator-item" key={index}>
                <h2 className="indikator-title">{indikator.title}</h2>
                <div className="description">{indikator.description}</div>
            </div>
        ))}
        </div>

        <div className="lvl-2-group indikator-group">
        {indikatorData.level2.map((indikator, index) => (
            <div className="indikator-item" key={index}>
            <h2 className="indikator-title">{indikator.title === "Financial" ? 'Finansial' : (indikator.title === "Economy" ? 'Ekonomi' : (indikator.title === "Social" ? "Sosial" : "Lingkungan"))}</h2>
            <div className="description">{indikator.description}</div>
            </div>
        ))}
        </div>

        <div className="lvl-3-group indikator-group">
        {indikatorData.level3.map((indikator, index) => (
            <div className="indikator-item" key={index}>
            <h2 className="indikator-title">{indikator.title}</h2>
            <div className="description">{indikator.description}</div>
            </div>
        ))}
        </div>
  </div>
  );
}
