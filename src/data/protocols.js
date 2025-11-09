// En: src/data/protocols.js
// --- ARCHIVO MODIFICADO ---

/**
 * Plantillas de Planes de Contención
 * Cada enfermedad mapea a un plan.
 * Cada plan tiene "pasos" (steps) basados en el tiempo.
 * Cada paso tiene "tareas" (tarjetas) con una estructura de bitácora.
 */

const taskTemplate = (id, text) => ({
  id,
  text,
  status: 'pending', // 'pending' | 'in_progress' | 'completed'
  completedAt: null, // '2025-11-07T10:30:00Z'
  log: [], // Array de { user: 'Nombre', date: '...', comment: '...' }
  evidencePhoto: null // 'data:image/png;base64,...'
});


export const CONTAINMENT_PLAN_TEMPLATES = {
  
  // --- PLAN 1: MOKO (Ralstonia solanacearum) ---
  'Moko': {
    diseaseName: 'Moko',
    description: 'Protocolo de contención y erradicación para Moko. Requiere acción inmediata y estricta bioseguridad.',
    // "phases" AHORA ES "steps"
    steps: [
      {
        id: 'step-1',
        title: 'Semana 1-2: Shock y Contención',
        tasks: [
          taskTemplate('moko-1.1', 'Cuarentena: Delimitar y señalizar "Zona Roja" (foco) y "Zona Amarilla" (buffer 5-10m).'),
          taskTemplate('moko-1.2', 'Instalar pediluvios (cal, amonio) en un único punto de acceso a la Zona Roja.'),
          taskTemplate('moko-1.3', 'Erradicación (Paso 1): Aplicar herbicida sistémico (Glifosato 20%) a plantas enfermas y 5m a la redonda.'),
          taskTemplate('moko-1.4', 'Control de Vectores: Eliminar flor masculina (bellota) en Zona Amarilla para evitar transmisión por insectos.'),
        ]
      },
      {
        id: 'step-2',
        title: 'Semana 2-4: Erradicación y Limpieza',
        tasks: [
          taskTemplate('moko-2.1', 'Erradicación (Paso 2): Una vez secas, trocear plantas in situ. Aplicar cal a los residuos.'),
          taskTemplate('moko-2.2', 'Bioseguridad: Desinfección estricta de herramientas entre CADA planta en la zona de trabajo.'),
          taskTemplate('moko-2.3', 'Monitoreo: Inspección visual semanal de la Zona Amarilla buscando nuevos síntomas.'),
        ]
      },
      {
        id: 'step-3',
        title: 'Mes 2-6: Vigilancia y Barbecho',
        tasks: [
          taskTemplate('moko-3.1', 'Monitoreo: Continuar inspecciones semanales en Zona Amarilla.'),
          taskTemplate('moko-3.2', 'Control de Malezas: Eliminar hospedantes alternos (heliconias, etc.).'),
          taskTemplate('moko-3.3', 'Barbecho: PROHIBIDO resembrar banano en Zona Roja por 6-12 meses.'),
        ]
      }
    ]
  },

  // --- PLAN 2: FOC R4T (Fusarium) ---
  'Foc R4T': {
    diseaseName: 'Foc R4T',
    description: 'Protocolo de ALERTA MÁXIMA. Requiere notificación a autoridad y cuarentena absoluta.',
    steps: [
      {
        id: 'step-1',
        title: 'Semana 1: Alerta y Cuarentena Total',
        tasks: [
          taskTemplate('foc-1.1', 'Notificación: Reporte INMEDIATO a la autoridad fitosanitaria (Agrocalidad).'),
          taskTemplate('foc-1.2', 'Cuarentena Absoluta: Restringir TODO movimiento de personal, maquinaria y material del lote afectado.'),
          taskTemplate('foc-1.3', 'Bioseguridad Nivel 5: Instalar arcos de desinfección para vehículos y pediluvios en TODOS los accesos.'),
          taskTemplate('foc-1.4', 'Erradicación: Destrucción in situ de plantas sintomáticas y buffer (según protocolo de autoridad).'),
        ]
      },
      {
        id: 'step-2',
        title: 'Mes 2+: Contención y Monitoreo',
        tasks: [
          taskTemplate('foc-2.1', 'Monitoreo: Prospecciones semanales en TODA la finca para detectar nuevos focos.'),
          taskTemplate('foc-2.2', 'Bioseguridad: Mantenimiento estricto de la cuarentena del lote.'),
          taskTemplate('foc-2.3', 'Clausura: El lote afectado queda clausurado para musáceas indefinidamente.'),
        ]
      }
    ]
  },

  // --- PLAN 3: Erwinia (Pudrición Blanda) ---
  'Erwinia': {
    diseaseName: 'Erwinia',
    description: 'Protocolo de manejo cultural, cirugía y control de vectores.',
    steps: [
      {
        id: 'step-1',
        title: 'Semana 1-2: Manejo Cultural y Cirugía',
        tasks: [
          taskTemplate('erw-1.1', 'Drenaje: Revisar y mejorar el drenaje del lote. Evitar encharcamientos.'),
          taskTemplate('erw-1.2', '"Cirugía": Eliminar tejido afectado en plantas con síntomas iniciales y desinfectar herida.'),
          taskTemplate('erw-1.3', 'Erradicación: Eliminar y destruir in situ las plantas muy afectadas.'),
          taskTemplate('erw-1.4', 'Desinfección de Herramientas: Desinfectar herramientas (Vanodine, Kilol) planta a planta.'),
        ]
      },
      {
        id: 'step-2',
        title: 'Semana 2-4: Vectores y Nutrición',
        tasks: [
          taskTemplate('erw-2.1', 'Control de Vectores: Monitorear y controlar Picudo Negro (Cosmopolites sordidus). Instalar trampas.'),
          taskTemplate('erw-2.2', 'Nutrición: Ajustar fertilización, asegurando niveles óptimos de Potasio y Calcio.'),
          taskTemplate('erw-2.3', 'Monitoreo: Revisión semanal de focos y efectividad de cirugía.'),
        ]
      }
    ]
  },
  
  // --- PLAN 4: Virosis (Ej. CMV) ---
  'Virosis': {
    diseaseName: 'Virosis (CMV)',
    description: 'Protocolo enfocado en erradicación de plantas sintomáticas y control de áfidos (vectores).',
    steps: [
      {
        id: 'step-1',
        title: 'Semana 1-2: Erradicación y Control',
        tasks: [
          taskTemplate('vir-1.1', 'Erradicación: Eliminación INMEDIATA de todas las plantas que muestren síntomas de mosaico.'),
          taskTemplate('vir-1.2', 'Control de Áfidos: Aplicar insecticidas (ej. Malatión) o control biológico para bajar la población de pulgones.'),
        ]
      },
      {
        id: 'step-2',
        title: 'Semana 2-8: Manejo de Hospedantes',
        tasks: [
          taskTemplate('vir-2.1', 'Control de Malezas: Mantener el lote y bordes libres de malezas hospedantes (CMV es polífago).'),
          taskTemplate('vir-2.2', 'Monitoreo: Inspección semanal de nuevas plantas con síntomas (para erradicar) y de poblaciones de áfidos.'),
          taskTemplate('vir-2.3', 'Largo Plazo: Usar únicamente material de siembra (colinos) certificado y libre de virus.'),
        ]
      }
    ]
  }
};