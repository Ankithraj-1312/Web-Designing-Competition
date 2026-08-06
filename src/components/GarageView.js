'use client';
import { useRef, useState } from 'react';
import SequencePlayer from './SequencePlayer';

export default function GarageView() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleProgress = (progress) => {
    setScrollProgress(progress);
    // Custom audio control: increase garage audio volume or pitch slightly
    const event = new CustomEvent('garage-scroll', { detail: { progress } });
    window.dispatchEvent(event);
  };

  const getSubtext = () => {
    if (scrollProgress < 0.3) return "SYSTEM IGNITION AND STABILITY MONITOR";
    if (scrollProgress < 0.65) return "VOLUMETRIC LIGHT CONE COUPLING";
    return "GARAGE HANGAR DOOR DEPLOYMENT ACTIVE";
  };

  return (
    <div id="garage" ref={containerRef} className="garage-scroll-container">
      <div className="sticky-content">
        <SequencePlayer
          id="garage"
          frameCount={240}
          sequencePath="/sequences/garage/ezgif-frame-"
          triggerRef={containerRef}
          fallbackImage="/images/A_McLaren_P1_GTR_parked_inside_1.jpg"
          overlayText={getSubtext()}
          onProgressUpdate={handleProgress}
        >
          {/* Side Panel HUD */}
          <div className="hud-panel left-hud glass-panel">
            <h3 className="tech-text orange-glow-text">SYS_TELEMETRY</h3>
            <div className="telemetry-item">
              <span className="label">GEAR:</span>
              <span className="value tech-text">NEUTRAL</span>
            </div>
            <div className="telemetry-item">
              <span className="label">RPM:</span>
              <span className="value tech-text orange-glow-text">
                {scrollProgress > 0.1 ? Math.floor(950 + scrollProgress * 300) : "0"}
              </span>
            </div>
            <div className="telemetry-item">
              <span className="label">OIL TEMP:</span>
              <span className="value tech-text">82°C</span>
            </div>
            <div className="telemetry-item">
              <span className="label">CO2 DENSITY:</span>
              <span className="value tech-text">
                {Math.max(12, Math.floor(45 - scrollProgress * 30))}%
              </span>
            </div>
          </div>

          <div className="hud-panel right-hud glass-panel">
            <h3 className="tech-text">ENVIRONMENTAL</h3>
            <div className="telemetry-item">
              <span className="label">LOCATION:</span>
              <span className="value tech-text">HANGAR_09</span>
            </div>
            <div className="telemetry-item">
              <span className="label">LIGHTING:</span>
              <span className="value tech-text">
                {scrollProgress < 0.5 ? "Glowing Orange" : "Volumetric Sun"}
              </span>
            </div>
            <div className="telemetry-item">
              <span className="label">DOOR STATUS:</span>
              <span className="value tech-text">
                {scrollProgress < 0.7 ? "CLOSED" : `${Math.floor((scrollProgress - 0.7) * 333)}% OPEN`}
              </span>
            </div>
          </div>

          {/* Scrolling indicator on screen */}
          <div className="scroller-hud">
            <div className="bar" style={{ height: `${scrollProgress * 100}%` }}></div>
          </div>
        </SequencePlayer>
      </div>

      <style jsx>{`
        .garage-scroll-container {
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

        /* HUD positioning */
        .hud-panel {
          position: absolute;
          z-index: 10;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 200px;
          pointer-events: auto;
        }

        .left-hud {
          left: 4%;
          top: 10%;
        }

        .right-hud {
          right: 4%;
          top: 10%;
        }

        .hud-panel h3 {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.5rem;
          margin-bottom: 0.25rem;
          color: #888;
        }

        .telemetry-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
        }

        .telemetry-item .label {
          color: #666;
        }

        .telemetry-item .value {
          color: #eee;
        }

        .scroller-hud {
          position: absolute;
          right: 2%;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 100px;
          background: #111;
          z-index: 10;
        }

        .scroller-hud .bar {
          width: 100%;
          background: var(--accent-orange);
          box-shadow: 0 0 8px var(--accent-orange);
          transition: height 0.1s ease;
        }

        @media (max-width: 900px) {
          .hud-panel {
            min-width: 150px;
            padding: 0.75rem;
          }
          .left-hud {
            left: 2%;
            top: 2%;
          }
          .right-hud {
            right: 2%;
            top: 2%;
          }
        }
      `}</style>
    </div>
  );
}
