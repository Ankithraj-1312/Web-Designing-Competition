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
    <div id="configure" className="final-cta-section story-section">
      {/* Background Hero */}
      <div 
        className="cta-bg"
        style={{ backgroundImage: "url('/images/A_premium_luxury_loading_scree_5.jpg')" }}
      ></div>

      {/* Volumetric ambient lighting */}
      <div className="light-glow"></div>

      <div className="ui-overlay cta-content">
        <h3 className="tech-text orange-glow-text">{"// ESTABLISH_SPECIFICATION"}</h3>
        <h1>MCLAREN P1 GTR</h1>
        <p className="cta-description">
          A hybrid powertrain generating 986 BHP. Track-exclusive performance refined for the ultimate driver.
        </p>

        {/* Spec telemetry grid */}
        <div className="cta-specs-grid tech-text">
          <div className="cta-spec-item">
            <span className="spec-val orange-glow-text">986 BHP</span>
            <span className="spec-lbl">TOTAL POWER</span>
          </div>
          <div className="cta-spec-item">
            <span className="spec-val">2.8 S</span>
            <span className="spec-lbl">0 - 100 KM/H</span>
          </div>
          <div className="cta-spec-item">
            <span className="spec-val">350+</span>
            <span className="spec-lbl">TOP SPEED KM/H</span>
          </div>
          <div className="cta-spec-item">
            <span className="spec-val">1,440 KG</span>
            <span className="spec-lbl">LIGHTWEIGHT DRY</span>
          </div>
        </div>
        
        <div className="cta-button-row">
          <button 
            ref={ctaBtnRef}
            className="orange-glow-btn cta-btn"
            onClick={handleCTA}
          >
            EXPERIENCE PERFORMANCE
          </button>
          
          <a href="#intro" className="outline-btn tech-text">
            RETURN TO INTRO
          </a>
        </div>
      </div>

      {/* Footer copyright telemetry */}
      <div className="footer-bar tech-text">
        <span>© 2026 MCLAREN AUTOMOTIVE CORP</span>
        <span>SYSTEM VERSION: V1.1.2-STABLE</span>
        <span>TELEMETRY: LINK ENCRYPTED</span>
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

        .cta-description {
          font-size: 0.85rem;
          color: #888;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        .cta-specs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
          margin: 1rem 0 2rem 0;
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem 0;
        }

        .cta-spec-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .spec-val {
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .spec-lbl {
          font-size: 0.55rem;
          color: #666;
          letter-spacing: 0.15em;
        }

        .cta-button-row {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .cta-btn {
          font-size: 0.8rem !important;
          padding: 14px 30px !important;
        }

        .outline-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #aaa;
          padding: 14px 30px;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .outline-btn:hover {
          color: #fff;
          border-color: #fff;
          background: rgba(255, 255, 255, 0.03);
          transform: translateY(-2px);
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
          .cta-specs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin: 1.5rem 0;
            width: 100%;
          }
          .cta-button-row {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }
          .cta-btn, .outline-btn {
            width: 100%;
            text-align: center;
          }
          .footer-bar {
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
            bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
}
