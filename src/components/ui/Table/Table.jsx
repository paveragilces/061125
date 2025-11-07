// src/components/ui/Table/Table.jsx
import React from 'react';
import './Table.css'; // Creamos un CSS para la tabla

const Table = ({ headers, data, renderRow, emptyMessage = "No hay datos para mostrar." }) => {
  if (!data || data.length === 0) {
    return <p className="emptyTableMessage">{emptyMessage}</p>;
  }

  return (
    <div className="tableContainer">
      <table className="customTable">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className={header.className || ''}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {renderRow(item, rowIndex)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;