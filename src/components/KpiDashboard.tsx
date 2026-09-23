import React from 'react';

export const KpiDashboard: React.FC = () => {
  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px',
      width: '100%',
      marginBottom: '14px'
    }}>
      <div style={kpiCardStyle}>
        <div style={kpiIconStyle}>🎯</div>
        <div>
          <span style={kpiLabelStyle}>Moneyball Trefferquote</span>
          <h3 style={{ ...kpiValueStyle, color: '#48bb78' }}>86% 🔥</h3>
          <span style={kpiSubtextStyle}>Karrieresprung in Profiligen</span>
        </div>
      </div>

      <div style={kpiCardStyle}>
        <div style={kpiIconStyle}>💰</div>
        <div>
          <span style={kpiLabelStyle}>Marktwert-Explosion</span>
          <h3 style={{ ...kpiValueStyle, color: '#00ffcc' }}>+4.850.000 €</h3>
          <span style={kpiSubtextStyle}>Generierter Transferwert</span>
        </div>
      </div>

      <div style={kpiCardStyle}>
        <div style={kpiIconStyle}>💎</div>
        <div>
          <span style={kpiLabelStyle}>Identifizierte Gems</span>
          <h3 style={kpiValueStyle}>95 <span style={{ fontSize: '11px', color: '#a0aec0' }}>Perlen</span></h3>
          <span style={kpiSubtextStyle}>Spieler-Treffer aktiv</span>
        </div>
      </div>

      <div style={kpiCardStyle}>
        <div style={kpiIconStyle}>📍</div>
        <div>
          <span style={kpiLabelStyle}>Hotspot Scouting-Zone</span>
          <h3 style={{ ...kpiValueStyle, fontSize: '15px', color: '#00ffcc', paddingTop: '2px' }}>Regionalliga Bayern</h3>
          <span style={kpiSubtextStyle}>Höchste KI-Trefferdichte</span>
        </div>
      </div>
    </section>
  );
};

const kpiCardStyle: React.CSSProperties = {
  background: '#1a263e',
  border: '1px solid #2d3748',
  borderRadius: '10px',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const kpiIconStyle: React.CSSProperties = {
  background: '#111a2e',
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '18px',
  border: '1px solid rgba(0, 255, 204, 0.1)'
};

const kpiLabelStyle: React.CSSProperties = {
  color: '#a0aec0',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'block'
};

const kpiValueStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '1px 0',
  lineHeight: '1'
};

const kpiSubtextStyle: React.CSSProperties = {
  color: '#718096',
  fontSize: '10px',
  display: 'block'
};
