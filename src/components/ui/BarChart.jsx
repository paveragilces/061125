import React from 'react';
import './BarChart.css';

/**
 * Gráfico de Barras Simple
 */
const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1); // Evitar división por cero
  const colors = ['#d9534f', '#f0ad4e', '#5bc0de', '#005a3a', '#5cb85c'];

  return (
    <div className="barChartContainer">
      {data.map((item, index) => (
        <div key={item.label} className="barRow">
          <div className="barLabel">{item.label}</div>
          <div className="barWrapper">
            <div
              className="bar"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: colors[index % colors.length],
              }}
            >
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;