import React from 'react';

export default function CreateMatch() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Skapa match</h1>
      <form>
        <div>
          <label>Datum & tid</label>
          <input type="datetime-local" />
        </div>
        <div>
          <label>Plats</label>
          <input type="text" placeholder="Ange plats" />
        </div>
        <div>
          <label>Max deltagare</label>
          <input type="number" min="2" max="10" defaultValue={4} />
        </div>
        <button type="submit">Skapa</button>
      </form>
    </main>
  );
} 
