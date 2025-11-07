// src/utils/riskCalculator.js

/**
 * Calcula el riesgo fitosanitario basado en la compañía, motivo y cadena de valor.
 * @param {string} company 
 * @param {string} purpose 
 * @param {string} valueChain 
 * @returns {'Low' | 'Middle' | 'High'}
 */
export const calculateRisk = (company = '', purpose = '', valueChain = '') => {
  const comp = company.toLowerCase();
  const purp = purpose.toLowerCase();
  const chain = valueChain.toLowerCase();

  // Alto Riesgo
  if (comp.includes('pest') || purp.includes('maquinaria') || purp.includes('fumigación')) {
    return 'High';
  }

  // Riesgo Medio
  if (comp.includes('contratista') || chain.includes('agroinsumos') || chain.includes('servicios')) {
    return 'Middle';
  }
  
  // Riesgo Bajo (por defecto)
  return 'Low';
};