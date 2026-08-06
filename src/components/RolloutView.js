'use client';
import { useRef, useState } from 'react';
import SequencePlayer from './SequencePlayer';

export default function RolloutView() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleProgress = (progress) => {
    setScrollProgress(progress);
    const event = new CustomEvent('rollout-scroll', { detail: { progress } });
    window.dispatchEvent(event);
  };

  const getOverlayText = () => {
    if (scrollProgress < 0.25) return "01 // CAMERA SWEEP: FRONT APRON & VENTILATION INTAKES";
    if (scrollProgress < 0.5) return "02 // ROTOR FOCUS: 19\" WHEELS / SIX-PISTON AP RACING CALIPERS";
    if (scrollProgress < 0.75) return "03 // AERODYNAMIC FLOW: CARBON SIDE MIRRORS & ROOF SCOOP";
    return "04 // HYDRAULIC CHECK: DUAL-ELEMENT ACTIVE REAR WING DEPLOYED";
  };

  return (
    <div id="design" ref={containerRef} className="rollout-scroll-container">
      <div className="sticky-content">
        <SequencePlayer
          id="rollout"
          frameCount={240}
          sequencePath="/sequences/rolls_out/ezgif-frame-"
          triggerRef={containerRef}
          fallbackImage="/images/A_McLaren_P1_GTR_parked_beneat_1.jpg"
          overlayText={getOverlayText()}
          onProgressUpdate={handleProgress}
        >
          {/* Floating UI cards based on progress */}
          <div className={`floating-hud top-left-hud glass-panel ${scrollProgress > 0.05 && scrollProgress < 0.45 ? 'show' : ''}`}>
            <h4 className="tech-text orange-glow-text">CHASSIS_SPECS</h4>
            <p>Monocell carbon fiber safety cell.</p>
            <div className="value-bar"><div className="bar" style={{ width: '92%' }}></div></div>
          </div>

          <div className={`floating-hud bottom-left-hud glass-panel ${scrollProgress > 0.25 && scrollProgress < 0.65 ? 'show' : ''}`}>
            <h4 className="tech-text orange-glow-text">BRAKE_TELEM</h4>
            <p>Carbon ceramic disc: 390mm front, 380mm rear.</p>
            <p>Stopping dist. (100-0): 29 meters.</p>
          </div>

          <div className={`floating-hud top-right-hud glass-panel ${scrollProgress > 0.5 && scrollProgress < 0.9 ? 'show' : ''}`}>
            <h4 className="tech-text orange-glow-text">AERODYNAMICS</h4>
            <p>Drag reduction system (DRS) initialized.</p>
            <p>Downforce target: 600kg at 240km/h.</p>
          </div>

          {/* Cinematic Overlay vignetting for extra depth */}
          <div className="vignette-overlay" />
        </SequencePlayer>
      </div>

      <style jsx>{`
        .rollout-scroll-container {
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

        /* Floating HUD styling */
        .floating-hud {
          position: absolute;
          z-index: 10;
          padding: 1.25rem;
          width: 250px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .floating-hud.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .floating-hud h4 {
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.1em;
        }

        .floating-hud p {
          font-size: 0.7rem;
          color: #bbb;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }

        .value-bar {
          width: 100%;
          height: 3px;
          background: #222;
          margin-top: 0.5rem;
        }

        .value-bar .bar {
          height: 100%;
          background: var(--accent-orange);
        }

        .top-left-hud {
          top: 15%;
          left: 6%;
        }

        .bottom-left-hud {
          bottom: 15%;
          left: 6%;
        }

        .top-right-hud {
          top: 15%;
          right: 6%;
        }

        @media (max-width: 768px) {
          .floating-hud {
            width: 180px;
            padding: 0.75rem;
          }
          .top-left-hud { left: 4%; top: 4%; }
          .bottom-left-hud { left: 4%; bottom: 4%; }
          .top-right-hud { right: 4%; top: 4%; }
        }
      `}</style>
    </div>
  );
}
