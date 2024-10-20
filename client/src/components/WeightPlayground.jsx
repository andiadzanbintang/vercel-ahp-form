

// Data dummy untuk indikator dan bobot
const weightsData = [
  { name: 'Policy Alignment', value: 0.20 },
  { name: 'Environmental & Spatial Alignment', value: 0.25 },
  { name: 'Technical Alignment', value: 0.15 },
  { name: 'Economic Alignment', value: 0.35 },
  { name: 'Financial Alignment', value: 0.05 },
];

const WeightsDisplay = () => {
  return (
    <div className="weights-grid-container">
      {weightsData.map((indicator, index) => (
        <div className="weights-grid-item" key={index}>
          <h3 className="weights-indicator-name">{indicator.name}</h3>
          <p className="weights-indicator-value">{indicator.value.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default WeightsDisplay;
