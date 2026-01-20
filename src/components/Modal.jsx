import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'grid', placeItems: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 10, padding: 28, minWidth: 320, maxWidth: 420, boxShadow: '0 4px 32px rgba(0,0,0,0.18)', position: 'relative' }}>
        {children}
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }} aria-label="Stäng">×</button>
      </div>
    </div>
  );
}
