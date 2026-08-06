'use client';
import { useRef } from 'react';
import confetti from 'canvas-confetti';

export default function FinalCTA() {
  const ctaBtnRef = useRef(null);

  const handleCTA = () => {
    // Play backfire sound event
    window.dispatchEvent(new CustomEvent('final-backfire'));

    // Trigger glowing orange confetti explosion!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff5a00', '#ffa726', '#ffffff', '#222222'],
      disableForced3d: true
    });
  };

  return (
    <div className="final-cta-section story-section">
      {/* Background Hero */}
      <div 
        className="cta-bg"
        style={{ backgroundImage: "url('/images/A_premium_luxury_loading_scree_5.jpg')" }}
      ></div>

      {/* Volumetric ambient lighting */}
      <div className="light-glow"></div>

      <div className="ui-overlay cta-content">
        <h3 className="tech-text orange-glow-text">{"// ENTER_THE_EXPERIENCE"}</h3>
        <h1>MCLAREN P1 GTR</h1>
        <p>A hybrid powertrain generating 986 BHP. Track-exclusive performance refined for the ultimate driver.</p>
        
        <button 
          ref={ctaBtnRef}
          className="orange-glow-btn cta-btn"
          onClick={handleCTA}
        >
          EXPERIENCE PERFORMANCE
        </button>
      </div>

      {/* Footer copyright telemetry */}
      <div className="footer-bar tech-text">
        <span>© 2026 MCLAREN AUTOMOTIVE CORP</span>
        <span>GEOMETRY: 140K POLYGONS</span>
        <span>LATENCY: 8MS</span>
      </div>

      <div className="vignette-overlay" />

      <style jsx>{`
        .final-cta-section {
          width: 100vw;
          height: 100vh;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 10;
          overflow: hidden;
          text-align: center;
        }

        .cta-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          filter: brightness(0.25) contrast(1.1);
          animation: breathing 20s infinite alternate ease-in-out;
        }

        .light-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 90, 0, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 2;
        }

        .cta-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          max-width: 650px;
          z-index: 5;
          padding: 0 1rem;
        }

        .cta-content h3 {
          font-size: 0.95rem;
          letter-spacing: 0.25em;
        }

        .cta-content h1 {
          font-size: 4rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #fff;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        }

        .cta-content p {
          font-size: 0.85rem;
          color: #888;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .cta-btn {
          font-size: 0.95rem !important;
          padding: 14px 32px !important;
        }

        .footer-bar {
          position: absolute;
          bottom: 25px;
          left: 4%;
          right: 4%;
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: #444;
          z-index: 5;
        }

        @keyframes breathing {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.08); }
        }

        @media (max-width: 768px) {
          .cta-content h1 {
            font-size: 2.5rem;
          }
          .footer-bar {
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
