'use client';
import { useRef, useState, useEffect } from 'react';
import SequencePlayer from './SequencePlayer';

const hotspots = [
  { id: 'engine', x: 50, y: 65, title: 'HYBRID V8 ENGINE', desc: '3.8L Twin-Turbo V8 paired with an electric motor, generating a combined 986 horsepower.' },
  { id: 'battery', x: 45, y: 50, title: 'LITHIUM BATTERY PACK', desc: 'Lightweight IPU battery pack that stores regenerative energy under deceleration.' },
  { id: 'chassis', x: 50, y: 40, title: 'MONOCELL CHASSIS', desc: 'Ultra-rigid carbon fiber tub weighing a mere 90kg, providing exceptional safety.' },
  { id: 'suspension', x: 30, y: 70, title: 'PUSHROD SUSPENSION', desc: 'F1-inspired pushrod-actuated suspension with active ride-height adjustability.' },
  { id: 'brakes', x: 26, y: 55, title: 'CARBON ROTORS', desc: 'Formula-grade carbon ceramic rotors providing maximum stopping power without fade.' }
];

export default function AssemblyView() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [xrayMode, setXrayMode] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play lock-in sound at specific frame transitions
  const lastPlayedFrame = useRef(-1);
  const handleProgress = (progress, frameIndex) => {
    setScrollProgress(progress);

    // Play metallic click sound when components lock in (every ~40 frames)
    const lockFrames = [40, 80, 120, 160, 200, 239];
    const matchingFrame = lockFrames.find(f => Math.abs(f - frameIndex) <= 1);
    
    if (matchingFrame !== undefined && lastPlayedFrame.current !== matchingFrame) {
      lastPlayedFrame.current = matchingFrame;
      if (soundEnabled) {
        playMetallicSound();
      }
    }
  };

  const playMetallicSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  const getSubtext = () => {
    if (xrayMode) return "X-RAY SYSTEM DIAGNOSTIC ACTIVE";
    if (scrollProgress < 0.1) return "DISSOLVING TO EXPLODED CHASSIS VIEW";
    if (scrollProgress < 0.5) return "ASSEMBLING INTERNAL SUSPENSION & DRIVE GEAR";
    if (scrollProgress < 0.9) return "LOCKING BODYWORK PANELS";
    return "ASSEMBLY SEQUENCE COMPLETED";
  };

  return (
    <div id="engineering" ref={containerRef} className="assembly-scroll-container">
      <div className="sticky-content">
        
        {/* Toggle X-Ray Overlay or Normal Sequence */}
        {!xrayMode ? (
          <SequencePlayer
            id="assembly"
            frameCount={240}
            sequencePath="/sequences/assembly/ezgif-frame-"
            triggerRef={containerRef}
            fallbackImage="/images/A_perfectly_exploded_McLaren_P_1.jpg"
            overlayText={getSubtext()}
            onProgressUpdate={handleProgress}
          />
        ) : (
          <div className="xray-container">
            <div 
              className="xray-image"
              style={{ backgroundImage: "url('/images/A_transparent_McLaren_P1_GTR_s_2.jpg')" }}
            ></div>
            
            {/* Pulsing Hotspots overlay */}
            <div className="hotspots-overlay">
              {hotspots.map((spot) => (
                <div 
                  key={spot.id} 
                  className="hotspot-dot"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  onMouseEnter={() => setHoveredHotspot(spot)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  <div className="pulse-circle"></div>
                  <div className="inner-dot"></div>
                </div>
              ))}
            </div>

            {/* Spec Card HUD */}
            {hoveredHotspot && (
              <div className="spec-card glass-panel fade-in">
                <h4 className="tech-text orange-glow-text">{hoveredHotspot.title}</h4>
                <p>{hoveredHotspot.desc}</p>
              </div>
            )}

            <div className="xray-legend tech-text">
              <span className="orange-glow-text">{"//"}</span> SELECT HOTSPOT TO DISPLAY TELEMETRY
            </div>
          </div>
        )}

        {/* Global Controls Overlay */}
        <div className="assembly-controls glass-panel">
          <h3 className="tech-text">ENGINEERING DEPT</h3>
          <p className="status-indicator">
            <span className="dot pulse"></span>
            {xrayMode ? "X-RAY TELEMETRY MODE" : `ASSEMBLING CHASSIS: ${Math.floor(scrollProgress * 100)}%`}
          </p>
          <button 
            className={`control-btn tech-text ${xrayMode ? 'active' : ''}`}
            onClick={() => setXrayMode(!xrayMode)}
          >
            {xrayMode ? "ACTIVATE OPTICAL MODE" : "ACTIVATE X-RAY MODE"}
          </button>
        </div>

        {/* Cinematic Vignette */}
        <div className="vignette-overlay" />
      </div>

      <style jsx>{`
        .assembly-scroll-container {
          position: relative;
          width: 100vw;
          height: 300vh; /* Scroll length */
          background: #050505;
        }

        .sticky-content {
          position: sticky;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        /* X-Ray Layout */
        .xray-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
          background: #000;
        }

        .xray-image {
          width: 100%;
          height: 100%;
          border: none;
          background-size: cover;
          background-position: center;
          filter: contrast(1.1) brightness(0.9);
          position: relative;
        }

        /* Hotspots */
        .hotspots-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 4;
        }

        .hotspot-dot {
          position: absolute;
          width: 20px;
          height: 20px;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 5;
        }

        .inner-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          top: 7px;
          left: 7px;
          box-shadow: 0 0 8px #ff5a00;
        }

        .pulse-circle {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 1.5px solid var(--accent-orange);
          border-radius: 50%;
          animation: spotPulse 1.8s infinite ease-out;
        }

        .spec-card {
          position: absolute;
          z-index: 10;
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 380px;
          padding: 1.25rem;
          text-align: center;
        }

        .spec-card h4 {
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.1em;
        }

        .spec-card p {
          font-size: 0.75rem;
          color: #ccc;
          line-height: 1.4;
        }

        .xray-legend {
          position: absolute;
          bottom: 4%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: #555;
          z-index: 5;
        }

        /* Engineering controller */
        .assembly-controls {
          position: absolute;
          bottom: 6%;
          left: 4%;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 240px;
          z-index: 10;
          pointer-events: auto;
        }

        .assembly-controls h3 {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: #888;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.5rem;
        }

        .status-indicator {
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ccc;
        }

        .status-indicator .dot {
          width: 6px;
          height: 6px;
          background: #44ff44;
          border-radius: 50%;
          box-shadow: 0 0 8px #44ff44;
        }

        .status-indicator .dot.pulse {
          animation: statusPulse 1.2s infinite alternate ease-in-out;
        }

        .control-btn {
          background: transparent;
          border: 1px solid var(--glass-border);
          color: #eee;
          padding: 8px 16px;
          font-size: 0.7rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-btn:hover, .control-btn.active {
          border-color: var(--accent-orange);
          color: var(--accent-orange);
          box-shadow: 0 0 10px var(--accent-orange-glow);
        }

        @keyframes spotPulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        @keyframes statusPulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .assembly-controls {
            left: 50%;
            transform: translateX(-50%);
            bottom: 4%;
            width: 90%;
            min-width: unset;
          }
          .xray-legend {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
