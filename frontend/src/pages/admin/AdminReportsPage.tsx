import React from 'react';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { FileSpreadsheet, Download, CheckCircle2, TrendingUp, Users } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { showToast } = useToast();

  const clubs = storageService.getClubs();
  const activities = storageService.getActivities();
  const registrations = storageService.getRegistrations();

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Reporte "${filename}" descargado exitosamente`, 'success');
  };

  const handleExportClubsReport = () => {
    const headers = ['Código', 'Nombre del Club', 'Categoría', 'Estado', 'Integrantes', 'Días de Reunión', 'Modalidad Ingreso'];
    const rows = clubs.map(c => [
      `"${c.code}"`,
      `"${c.name}"`,
      `"${c.category}"`,
      `"${c.status}"`,
      `"${c.memberCount}"`,
      `"${c.meetingDays.join(' - ')}"`,
      `"${c.admissionType}"`
    ]);

    const csv = [
      '"Reporte General de Clubes Estudiantiles - Universidad de Lima"',
      `"Generado: ${new Date().toLocaleString()}"`,
      '',
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    downloadCSV(csv, `Reporte_Clubes_Ulima_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportActivitiesReport = () => {
    const headers = ['Título Actividad', 'Club Organizador', 'Categoría', 'Fecha', 'Modalidad', 'Aforo Total', 'Inscritos', 'Porcentaje Ocupación'];
    const rows = activities.map(a => {
      const club = storageService.getClubById(a.clubId);
      const pct = Math.round((a.enrolledCount / (a.capacity || 1)) * 100);
      return [
        `"${a.title}"`,
        `"${club?.name || 'Club Ulima'}"`,
        `"${a.category}"`,
        `"${a.date}"`,
        `"${a.modality}"`,
        `"${a.capacity}"`,
        `"${a.enrolledCount}"`,
        `"${pct}%"`
      ];
    });

    const csv = [
      '"Reporte de Convocatoria y Actividades Extracurriculares Ulima"',
      `"Generado: ${new Date().toLocaleString()}"`,
      '',
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    downloadCSV(csv, `Reporte_Actividades_Ulima_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Reportes Institucionales de Vida Universitaria</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
          Descarga de balances semestrales e indicadores de gestión en formato CSV compatible con Excel
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '36px' }}>
        {/* Card 1: Reporte de Clubes */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ backgroundColor: 'var(--color-primary-soft)', padding: '10px', borderRadius: '8px', color: 'var(--color-primary)' }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Padrón Completo de Clubes</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{clubs.length} agrupaciones registradas</div>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
            Contiene la lista exhaustiva de agrupaciones con número de integrantes activos, régimen de admisión, categorías temáticas y estado administrativo de acreditación.
          </p>

          <button onClick={handleExportClubsReport} className="btn btn-primary" style={{ gap: '8px' }}>
            <Download size={16} />
            <span>Descargar Padrón de Clubes (CSV)</span>
          </button>
        </div>

        {/* Card 2: Reporte de Actividades */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ backgroundColor: 'var(--color-success-soft)', padding: '10px', borderRadius: '8px', color: 'var(--color-success)' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Convocatoria y Aforo de Actividades</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{activities.length} actividades en base de datos</div>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
            Informe detallado de participación por evento, tasas de ocupación de aforo, modalidades presencial/virtual y clubes con mayor nivel de convocatoria en campus.
          </p>

          <button onClick={handleExportActivitiesReport} className="btn btn-secondary" style={{ gap: '8px' }}>
            <Download size={16} />
            <span>Descargar Reporte de Actividades (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
