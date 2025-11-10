// En: src/views/WorkerLogViewer/WorkerLogViewer.jsx
// --- ARCHIVO MODIFICADO ---

import React, { useMemo, useState } from 'react';
import EmptyState from '../../components/ui/EmptyState';
import ColorPaletteSelector from '../../components/ui/ColorPaletteSelector/ColorPaletteSelector';
import { LABORES_FINCA } from '../../data/constants';
import { ICONS } from '../../config/icons';
import './WorkerLogViewer.css';

const HOURS_IN_MS = 1000 * 60 * 60;

const WorkerLogViewer = ({
  workLogs = [],
  workers = [],
  fincas = [],
  cintasOptions = [],
  onNavigate,
  onCreateWorkRequest,
}) => {
  const [workerFilter, setWorkerFilter] = useState('all');
  const [fincaFilter, setFincaFilter] = useState('all');
  const [cintaFilter, setCintaFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [draft, setDraft] = useState({
    workerId: '',
    fincaId: '',
    lote: '',
    labor: LABORES_FINCA[0]?.value || '',
    cintas: [],
    date: '',
    startTime: '07:00',
    endTime: '16:00',
    description: '',
  });

  const cintaMap = useMemo(() => {
    const map = {};
    (cintasOptions || []).forEach(option => {
      map[option.value] = option;
    });
    return map;
  }, [cintasOptions]);

  const sortedLogs = useMemo(() => {
    return [...workLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [workLogs]);

  const filteredLogs = useMemo(() => {
    const now = new Date();
    const rangeInDays = dateRange === 'all' ? null : parseInt(dateRange, 10);
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return sortedLogs.filter(log => {
      if (workerFilter !== 'all' && log.workerId !== workerFilter) {
        return false;
      }

      if (fincaFilter !== 'all' && log.fincaId !== fincaFilter) {
        return false;
      }

      if (cintaFilter !== 'all') {
        const cintas = log.cintas || [];
        if (!cintas.includes(cintaFilter)) {
          return false;
        }
      }

      if (rangeInDays !== null) {
        const logDate = new Date(log.date);
        const diffInDays = Math.floor((now - logDate) / (1000 * 60 * 60 * 24));
        if (diffInDays > rangeInDays) {
          return false;
        }
      }

      if (fromDate) {
        const logDate = new Date(log.date);
        const minDate = new Date(fromDate);
        if (logDate < minDate) {
          return false;
        }
      }

      if (toDate) {
        const logDate = new Date(log.date);
        const maxDate = new Date(toDate);
        if (logDate > maxDate) {
          return false;
        }
      }

      if (!normalizedSearch) {
        return true;
      }

      const finca = fincas.find(f => f.id === log.fincaId);

      return [
        log.description,
        log.labor,
        log.lote,
        finca ? finca.name : '',
      ]
        .filter(Boolean)
        .some(value => value.toLowerCase().includes(normalizedSearch));
    });
  }, [sortedLogs, workerFilter, fincaFilter, cintaFilter, dateRange, searchTerm, fincas, fromDate, toDate]);

  const metrics = useMemo(() => {
    const uniqueWorkers = new Set();
    let totalHours = 0;

    filteredLogs.forEach(log => {
      if (log.workerId) {
        uniqueWorkers.add(log.workerId);
      }

      if (log.checkIn && log.checkOut) {
        const duration = new Date(log.checkOut) - new Date(log.checkIn);
        if (!Number.isNaN(duration) && duration > 0) {
          totalHours += duration / HOURS_IN_MS;
        }
      }
    });

    return {
      totalLogs: filteredLogs.length,
      activeWorkers: uniqueWorkers.size,
      totalHours,
    };
  }, [filteredLogs]);

  const workerOptions = useMemo(() => {
    return workers
      .filter(worker => workLogs.some(log => log.workerId === worker.id))
      .map(worker => ({ value: worker.id, label: worker.name }));
  }, [workers, workLogs]);

  const fincaOptions = useMemo(() => {
    return fincas
      .filter(finca => workLogs.some(log => log.fincaId === finca.id))
      .map(finca => ({ value: finca.id, label: finca.name }));
  }, [fincas, workLogs]);

  const resetFilters = () => {
    setWorkerFilter('all');
    setFincaFilter('all');
    setCintaFilter('all');
    setDateRange('all');
    setSearchTerm('');
    setFromDate('');
    setToDate('');
  };

  const getWorkerName = (workerId) => {
    const worker = workers.find(item => item.id === workerId);
    return worker ? worker.name : `ID: ${workerId}`;
  };

  const getFincaName = (fincaId) => {
    if (!fincaId) return 'Pendiente';
    const finca = fincas.find(item => item.id === fincaId);
    return finca ? finca.name : 'N/A';
  };

  const formatHours = (hours) => {
    if (!hours) return '0 h';
    return `${hours.toFixed(hours >= 10 ? 0 : 1)} h`;
  };

  const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTimeRange = (log) => {
    if (!log.checkIn || !log.checkOut) return '—';
    const from = new Date(log.checkIn).toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const to = new Date(log.checkOut).toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${from} - ${to}`;
  };

  const getCintaDisplay = (value) => {
    const cinta = cintaMap[value];
    if (!cinta) {
      return { label: value, color: '#CBD5F5' };
    }
    return cinta;
  };

  const toggleCintaFilter = (value) => {
    setCintaFilter(prev => (prev === value ? 'all' : value));
  };

  const resetDraft = () => {
    setDraft({
      workerId: '',
      fincaId: '',
      lote: '',
      labor: LABORES_FINCA[0]?.value || '',
      cintas: [],
      date: '',
      startTime: '07:00',
      endTime: '16:00',
      description: '',
    });
  };

  const handleDraftChange = (field, value) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleDraftCinta = (values) => {
    handleDraftChange('cintas', values);
  };

  const handleSubmitDraft = (event) => {
    event.preventDefault();
    if (!draft.workerId || !draft.fincaId || !draft.date || draft.cintas.length === 0) {
      return;
    }

    const worker = workers.find(item => item.id === draft.workerId);

    const newLog = {
      workerId: draft.workerId,
      name: worker ? worker.name : undefined,
      fincaId: draft.fincaId,
      lote: draft.lote || null,
      labor: draft.labor,
      cintas: draft.cintas,
      date: draft.date,
      checkIn: `${draft.date}T${draft.startTime || '07:00'}:00`,
      checkOut: `${draft.date}T${draft.endTime || '16:00'}:00`,
      description: draft.description,
    };

    if (onCreateWorkRequest) {
      onCreateWorkRequest(newLog);
    }

    resetDraft();
    setShowDraftForm(false);
  };

  return (
    <div className="worker-log-viewer">
      <header className="worker-log-viewer__header">
        <div>
          <p className="worker-log-viewer__eyebrow">Bitácora de campo</p>
          <h1 className="worker-log-viewer__title">Registro de labores completadas</h1>
          <p className="worker-log-viewer__subtitle">
            Supervisa las actividades finalizadas y publica nuevas labores para guiar a tu equipo.
          </p>
        </div>
        <div className="worker-log-viewer__actions">
          {onNavigate && (
            <button
              type="button"
              className="worker-log-viewer__link"
              onClick={() => onNavigate('manageWorkers')}
            >
              Gestionar trabajadores
            </button>
          )}
          <button
            type="button"
            className="worker-log-viewer__primary"
            onClick={() => setShowDraftForm(prev => !prev)}
          >
            {showDraftForm ? 'Cerrar creador de labor' : 'Publicar nueva labor'}
          </button>
        </div>
      </header>

      <section className="worker-log-viewer__summary">
        <article className="worker-log-viewer__summary-card">
          <h3>Registros vistos</h3>
          <p>{metrics.totalLogs}</p>
          <span>Según los filtros activos.</span>
        </article>
        <article className="worker-log-viewer__summary-card">
          <h3>Trabajadores</h3>
          <p>{metrics.activeWorkers}</p>
          <span>Con labores concluidas.</span>
        </article>
        <article className="worker-log-viewer__summary-card">
          <h3>Horas reportadas</h3>
          <p>{formatHours(metrics.totalHours)}</p>
          <span>Check-in y check-out confirmados.</span>
        </article>
      </section>

      {showDraftForm && (
        <section className="worker-log-viewer__draft">
          <h2>Crear labor para tu equipo</h2>
          <p>
            Las labores publicadas aparecerán como pendientes para el trabajador seleccionado en su perfil diario.
          </p>
          <form className="worker-log-viewer__draft-form" onSubmit={handleSubmitDraft}>
            <div className="worker-log-viewer__draft-grid">
              <label>
                <span>Trabajador</span>
                <select
                  value={draft.workerId}
                  onChange={(event) => handleDraftChange('workerId', event.target.value)}
                  required
                >
                  <option value="">Elige un colaborador…</option>
                  {workers.map(worker => (
                    <option key={worker.id} value={worker.id}>{worker.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Finca</span>
                <select
                  value={draft.fincaId}
                  onChange={(event) => handleDraftChange('fincaId', event.target.value)}
                  required
                >
                  <option value="">Selecciona la finca…</option>
                  {fincas.map(finca => (
                    <option key={finca.id} value={finca.id}>{finca.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Lote</span>
                <input
                  type="text"
                  value={draft.lote}
                  onChange={(event) => handleDraftChange('lote', event.target.value)}
                  placeholder="Ej. Lote 03"
                />
              </label>
              <label>
                <span>Labor</span>
                <select
                  value={draft.labor}
                  onChange={(event) => handleDraftChange('labor', event.target.value)}
                >
                  {LABORES_FINCA.map(labor => (
                    <option key={labor.value} value={labor.value}>{labor.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Fecha</span>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) => handleDraftChange('date', event.target.value)}
                  required
                />
              </label>
              <label>
                <span>Hora inicio</span>
                <input
                  type="time"
                  value={draft.startTime}
                  onChange={(event) => handleDraftChange('startTime', event.target.value)}
                />
              </label>
              <label>
                <span>Hora fin</span>
                <input
                  type="time"
                  value={draft.endTime}
                  onChange={(event) => handleDraftChange('endTime', event.target.value)}
                />
              </label>
            </div>

            <div className="worker-log-viewer__draft-cintas">
              <span>Colores de cinta a trabajar</span>
              <ColorPaletteSelector
                options={cintasOptions}
                selected={draft.cintas}
                onChange={handleToggleDraftCinta}
              />
            </div>

            <label className="worker-log-viewer__draft-description">
              <span>Notas para el trabajador</span>
              <textarea
                rows="3"
                value={draft.description}
                onChange={(event) => handleDraftChange('description', event.target.value)}
                placeholder="Detalla objetivos, requisitos o recordatorios importantes."
              />
            </label>

            <div className="worker-log-viewer__draft-actions">
              <button
                type="button"
                className="worker-log-viewer__ghost"
                onClick={() => {
                  resetDraft();
                  setShowDraftForm(false);
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="worker-log-viewer__primary"
                disabled={!draft.workerId || !draft.fincaId || !draft.date || draft.cintas.length === 0}
              >
                Publicar labor
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="worker-log-viewer__filters">
        <div className="worker-log-viewer__search">
          <label htmlFor="log-search">Buscar</label>
          <input
            id="log-search"
            type="search"
            placeholder="Descripción o lote"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="worker-log-viewer__selectors">
          <div className="worker-log-viewer__chip-group" role="group" aria-label="Filtrar por trabajador">
            <span className="worker-log-viewer__chip-group-label">Trabajador</span>
            <button
              type="button"
              className={`worker-log-viewer__chip ${workerFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setWorkerFilter('all')}
            >
              Todos
            </button>
            {workerOptions.map(option => (
              <button
                key={option.value}
                type="button"
                className={`worker-log-viewer__chip ${workerFilter === option.value ? 'is-active' : ''}`}
                onClick={() => setWorkerFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="worker-log-viewer__chip-group" role="group" aria-label="Filtrar por finca">
            <span className="worker-log-viewer__chip-group-label">Finca</span>
            <button
              type="button"
              className={`worker-log-viewer__chip ${fincaFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setFincaFilter('all')}
            >
              Todas
            </button>
            {fincaOptions.map(option => (
              <button
                key={option.value}
                type="button"
                className={`worker-log-viewer__chip ${fincaFilter === option.value ? 'is-active' : ''}`}
                onClick={() => setFincaFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="worker-log-viewer__range">
            <span>Rango rápido</span>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
              <option value="all">Todo</option>
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
            </select>
          </label>
        </div>

        <div className="worker-log-viewer__date-search">
          <label>
            <span>Desde</span>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </label>
          <label>
            <span>Hasta</span>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => setToDate(event.target.value)}
            />
          </label>
        </div>

        <div className="worker-log-viewer__cinta-filter">
          <span className="worker-log-viewer__cinta-filter-label">Filtrar por cinta trabajada</span>
          <div className="worker-log-viewer__cinta-options">
            <button
              type="button"
              className={`worker-log-viewer__cinta-option ${cintaFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setCintaFilter('all')}
            >
              Todas
            </button>
            {(cintasOptions || []).map(option => (
              <button
                type="button"
                key={option.value}
                className={`worker-log-viewer__cinta-option ${cintaFilter === option.value ? 'is-active' : ''}`}
                style={{ '--cinta-color': option.color }}
                onClick={() => toggleCintaFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="worker-log-viewer__ghost"
          onClick={resetFilters}
          disabled={
            workerFilter === 'all' &&
            fincaFilter === 'all' &&
            cintaFilter === 'all' &&
            dateRange === 'all' &&
            searchTerm === '' &&
            fromDate === '' &&
            toDate === ''
          }
        >
          Limpiar filtros
        </button>
      </section>

      {filteredLogs.length === 0 ? (
        <EmptyState
          iconPath={ICONS.report}
          title="Sin registros con estos filtros"
          message="Ajusta los filtros para revisar otra parte del historial."
        />
      ) : (
        <section className="worker-log-viewer__table-wrapper">
          <table className="worker-log-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Trabajador</th>
                <th>Finca</th>
                <th>Lote</th>
                <th>Labor</th>
                <th>Horas</th>
                <th>Cintas</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                const cintas = log.cintas || [];
                const workerName = getWorkerName(log.workerId);
                const fincaName = getFincaName(log.fincaId);
                const durationHours = log.checkIn && log.checkOut
                  ? Math.max((new Date(log.checkOut) - new Date(log.checkIn)) / HOURS_IN_MS, 0)
                  : 0;
                const primaryCinta = cintas[0];
                const primaryColor = primaryCinta ? getCintaDisplay(primaryCinta).color : 'rgba(31, 157, 102, 0.14)';

                return (
                  <tr key={log.id} style={{ '--worker-log-row-accent': primaryColor }}>
                    <td data-label="Fecha">{formatDate(log.date)}</td>
                    <td data-label="Horario">{formatTimeRange(log)}</td>
                    <td data-label="Trabajador">{workerName}</td>
                    <td data-label="Finca">{fincaName}</td>
                    <td data-label="Lote">{log.lote || '—'}</td>
                    <td data-label="Labor">{log.labor || 'Labor sin especificar'}</td>
                    <td data-label="Horas">{formatHours(durationHours)}</td>
                    <td data-label="Cintas" className="worker-log-table__cintas">
                      {cintas.length === 0 ? (
                        <span className="worker-log-table__cinta worker-log-table__cinta--empty">Sin cinta</span>
                      ) : (
                        cintas.map(value => {
                          const cinta = getCintaDisplay(value);
                          return (
                            <span
                              key={value}
                              className="worker-log-table__cinta"
                              style={{ '--cinta-color': cinta.color }}
                            >
                              {cinta.label}
                            </span>
                          );
                        })
                      )}
                    </td>
                    <td data-label="Notas" className="worker-log-table__notes">{log.description || 'Sin detalles registrados.'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default WorkerLogViewer;