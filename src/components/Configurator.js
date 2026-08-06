'use client';
import { useState } from 'react';

const paints = [
  { id: 'orange', name: 'Signature Orange', color: '#ff5a00', filter: 'none' },
  { id: 'grey', name: 'Stealth Carbon', color: '#3a3a3a', filter: 'grayscale(1) brightness(0.7) contrast(1.15)' },
  { id: 'red', name: 'Volcano Red', color: '#cc0000', filter: 'hue-rotate(-35deg) saturate(1.4)' },
  { id: 'green', name: 'Acid Green', color: '#76ff03', filter: 'hue-rotate(85deg) saturate(1.5) brightness(0.9)' }
];

const calipers = [
  { id: 'orange', name: 'McLaren Orange', color: '#ff5a00' },
  { id: 'yellow', name: 'Speed Yellow', color: '#ffd600' },
  { id: 'black', name: 'Alloy Black', color: '#000000' }
];

const wheels = [
  { id: 'spoke', name: '10-Spoke Lightweight Alloy' },
  { id: 'aero', name: 'Carbon Fiber Aerodisc' }
];

const lightingModes = [
  { id: 'studio', name: 'Studio Bright', ambient: 'rgba(255,255,255,0.05)' },
  { id: 'ambient', name: 'Ambient Hangar', ambient: 'rgba(255, 90, 0, 0.08)' },
  { id: 'night', name: 'Stealth Haze', ambient: 'rgba(0, 10, 40, 0.12)' }
];

export default function Configurator() {
  const [activePaint, setActivePaint] = useState(paints[0]);
  const [activeCaliper, setActiveCaliper] = useState(calipers[0]);
  const [activeWheel, setActiveWheel] = useState(wheels[0]);
  const [activeLighting, setActiveLighting] = useState(lightingModes[0]);

  return (
    <div className="configurator-section story-section">
      <div className="config-grid">
        {/* Left Side: Dynamic Canvas/Image Showcase */}
        <div className="showcase-container">
          <div 
            className="configurator-viewport"
            style={{ 
              backgroundColor: activeLighting.id === 'studio' ? '#070707' : activeLighting.id === 'ambient' ? '#090502' : '#030408',
              boxShadow: `inset 0 0 100px ${activeLighting.ambient}`
            }}
          >
            {/* The base car image with color filters */}
            <div 
              className="car-render"
              style={{ 
                backgroundImage: "url('/images/Ultra_realistic_futuristic_McL_2.jpg')",
                filter: activePaint.filter
              }}
            ></div>

            {/* Custom Overlay caliper glow indicator */}
            <div className="hud-caliper-tag tech-text">
              CALIPER: <span style={{ color: activeCaliper.color }}>{activeCaliper.name.toUpperCase()}</span>
            </div>

            {/* Telemetry HUD display */}
            <div className="telemetry-bar tech-text">
              <span>PAINT: {activePaint.name.toUpperCase()}</span>
              <span>WHEEL: {activeWheel.name.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Options Dashboard Panel */}
        <div className="controls-panel glass-panel">
          <h2 className="tech-text orange-glow-text">{"// SPEC_CONFIGURATOR"}</h2>
          <p className="config-intro">Bespoke personalization engine for the track client.</p>

          {/* 1. Paint Finishes */}
          <div className="option-group">
            <h4 className="tech-text">PAINT FINISH</h4>
            <div className="paint-grid">
              {paints.map((p) => (
                <button 
                  key={p.id}
                  className={`paint-swatch ${activePaint.id === p.id ? 'active' : ''}`}
                  style={{ backgroundColor: p.color }}
                  onClick={() => setActivePaint(p)}
                  title={p.name}
                >
                  <span className="swatch-indicator"></span>
                </button>
              ))}
            </div>
            <span className="active-label tech-text">{activePaint.name}</span>
          </div>

          {/* 2. Wheel Options */}
          <div className="option-group">
            <h4 className="tech-text">WHEEL DESIGN</h4>
            <div className="select-buttons">
              {wheels.map((w) => (
                <button
                  key={w.id}
                  className={`select-btn tech-text ${activeWheel.id === w.id ? 'active' : ''}`}
                  onClick={() => setActiveWheel(w)}
                >
                  {w.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Caliper Colors */}
          <div className="option-group">
            <h4 className="tech-text">CALIPER COLOR</h4>
            <div className="caliper-row">
              {calipers.map((c) => (
                <button
                  key={c.id}
                  className={`caliper-swatch ${activeCaliper.id === c.id ? 'active' : ''}`}
                  style={{ borderColor: c.color }}
                  onClick={() => setActiveCaliper(c)}
                >
                  <span className="caliper-dot" style={{ backgroundColor: c.color }}></span>
                  <span className="tech-text">{c.name.split(' ')[1] || c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Lighting Environment */}
          <div className="option-group">
            <h4 className="tech-text">LIGHTING MODES</h4>
            <div className="select-buttons">
              {lightingModes.map((l) => (
                <button
                  key={l.id}
                  className={`select-btn tech-text ${activeLighting.id === l.id ? 'active' : ''}`}
                  onClick={() => setActiveLighting(l)}
                >
                  {l.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .configurator-section {
          width: 100vw;
          min-height: 100vh;
          background: #050505;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4rem 2rem;
          z-index: 10;
          position: relative;
        }

        .config-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 2.5rem;
          width: 100%;
          max-width: 1200px;
        }

        /* Showcase Viewport */
        .showcase-container {
          display: flex;
          flex-direction: column;
        }

        .configurator-viewport {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          overflow: hidden;
          transition: background-color 0.8s ease, box-shadow 0.8s ease;
        }

        .car-render {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: filter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hud-caliper-tag {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 0.7rem;
          background: rgba(0,0,0,0.8);
          border: 1px solid var(--glass-border);
          padding: 6px 12px;
          border-radius: 4px;
          color: #888;
        }

        .telemetry-bar {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          background: rgba(0,0,0,0.8);
          border: 1px solid var(--glass-border);
          padding: 8px 16px;
          border-radius: 4px;
          color: #aaa;
        }

        /* Controls Panel Dashboard */
        .controls-panel {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          justify-content: center;
        }

        .controls-panel h2 {
          font-size: 1.1rem;
          letter-spacing: 0.1em;
        }

        .config-intro {
          font-size: 0.75rem;
          color: #666;
          margin-top: -1rem;
          margin-bottom: 0.5rem;
        }

        .option-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .option-group h4 {
          font-size: 0.7rem;
          color: #888;
          letter-spacing: 0.15em;
        }

        /* Paint buttons */
        .paint-grid {
          display: flex;
          gap: 0.75rem;
        }

        .paint-swatch {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .paint-swatch.active {
          border-color: #fff;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
        }

        .swatch-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .paint-swatch.active .swatch-indicator {
          opacity: 1;
        }

        .active-label {
          font-size: 0.7rem;
          color: #ff5a00;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        /* Select Button options */
        .select-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .select-btn {
          flex: 1;
          background: transparent;
          border: 1px solid var(--glass-border);
          color: #aaa;
          padding: 8px 12px;
          font-size: 0.65rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .select-btn:hover, .select-btn.active {
          border-color: var(--accent-orange);
          color: #fff;
          background: rgba(255, 90, 0, 0.05);
        }

        /* Calipers */
        .caliper-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .caliper-swatch {
          background: transparent;
          border: 1px solid var(--glass-border);
          color: #aaa;
          padding: 6px 12px;
          font-size: 0.65rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .caliper-swatch.active {
          border-color: #fff;
          color: #fff;
        }

        .caliper-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        @media (max-width: 1024px) {
          .config-grid {
            grid-template-columns: 1fr;
          }
          .configurator-viewport {
            height: 380px;
          }
        }
      `}</style>
    </div>
  );
}
