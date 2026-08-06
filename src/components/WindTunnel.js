'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WindTunnel() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [windSpeed, setWindSpeed] = useState(240); // km/h
  const [drsActive, setDrsActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class for airflow streamlines
    class FlowParticle {
      constructor(customY = null) {
        this.reset(customY);
        // Start randomly along the width for the initial batch
        this.x = Math.random() * canvas.width;
      }

      reset(customY = null) {
        this.x = 0;
        // Distribute Y across canvas height
        this.y = customY !== null ? customY : Math.random() * canvas.height;
        this.baseY = this.y;
        this.speed = (windSpeed / 40) + Math.random() * 2;
        this.size = Math.random() * 1.5 + 0.5;
        // Orange glow color palette
        this.color = Math.random() > 0.3 ? '#ff5a00' : '#ffa726';
        this.alpha = Math.random() * 0.5 + 0.25;
      }

      update() {
        this.x += this.speed;

        // Bending aerodynamics math around the car silhouette
        // Silhouette bounding coordinates inside the canvas:
        // Assume car is centered, wheels at bottom. Hood starts around x: 30%, roof scoop around x: 55%, wing at x: 80%
        const carLeft = canvas.width * 0.28;
        const carRight = canvas.width * 0.82;
        const carCenterY = canvas.height * 0.55;

        if (this.x > carLeft && this.x < carRight) {
          const ratio = (this.x - carLeft) / (carRight - carLeft);
          
          // Streamline deflections
          if (this.baseY > carCenterY - 120 && this.baseY < carCenterY + 40) {
            // Airflow hitting the front hood and climbing
            if (ratio < 0.35) {
              // Hood climb
              this.y = this.baseY - Math.sin(ratio * Math.PI) * 75;
            } else if (ratio < 0.65) {
              // Roof scoop climb & dip
              const localRatio = (ratio - 0.35) / 0.3;
              this.y = this.baseY - 75 - Math.sin(localRatio * Math.PI) * 35;
            } else {
              // Sliding down the rear glass towards spoiler
              const localRatio = (ratio - 0.65) / 0.35;
              const def = drsActive ? 15 : 45; // DRS deflection (flatter deflection if active)
              this.y = this.baseY - 75 + localRatio * (75 - def);
            }
          }
        } else if (this.x >= carRight) {
          // Turbulence behind the spoiler
          const ratio = (this.x - carRight) / (canvas.width - carRight);
          const dev = drsActive ? 12 : 35; // less turbulence if DRS is open (drag is reduced)
          this.y += Math.sin(this.x * 0.1) * (dev * ratio) * 0.15;
          this.alpha = Math.max(0, this.alpha - 0.01);
        }

        // Reset if goes off canvas
        if (this.x > canvas.width) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        // Streamline rendering
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    // Initialize streamlines
    for (let i = 0; i < 180; i++) {
      particles.push(new FlowParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Scroll trigger for active wing tilt
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      st.kill();
    };
  }, [windSpeed, drsActive]);

  return (
    <div id="aerodynamics" ref={containerRef} className="wind-tunnel-section">
      <div className="sticky-content">
        
        {/* Background Car Profile */}
        <div 
          className="tunnel-bg"
          style={{ backgroundImage: "url('/images/A_McLaren_P1_GTR_inside_a_futu_1.jpg')" }}
        ></div>

        {/* Airflow Particles Canvas */}
        <canvas ref={canvasRef} className="tunnel-canvas" />

        {/* Config / Control panel overlay */}
        <div className="tunnel-panel glass-panel">
          <h3 className="tech-text orange-glow-text">{"// AERO_DYNAMICS"}</h3>
          <p className="status-indicator">
            <span className="dot pulse"></span>
            WIND TUNNEL CALIBRATION
          </p>

          <div className="slider-group">
            <div className="slider-header">
              <span className="tech-text">VELOCITY</span>
              <span className="val tech-text">{windSpeed} KM/H</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="350" 
              value={windSpeed}
              onChange={(e) => setWindSpeed(Number(e.target.value))}
              className="accent-range"
            />
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span className="tech-text">DRS WING STATUS</span>
              <span className="val tech-text orange-glow-text">
                {drsActive ? "OPEN (MIN DRAG)" : "CLOSED (MAX DOWNFORCE)"}
              </span>
            </div>
            <button 
              className={`orange-glow-btn drs-btn tech-text ${drsActive ? 'drs-on' : ''}`}
              onClick={() => setDrsActive(!drsActive)}
            >
              TOGGLE DRS SYSTEM
            </button>
          </div>

          <div className="telemetry-bar tech-text">
            <span>DRAG: {drsActive ? "0.32 Cd" : "0.45 Cd"}</span>
            <span>DOWNFORCE: {drsActive ? "210 KG" : "600 KG"}</span>
          </div>
        </div>

        {/* HUD Instructions */}
        <div className="tunnel-caption tech-text">
          <span className="orange-glow-text">{"//"}</span> MTR: AIRFLOW STREAMLINES OVER MATTE BODYWORK
        </div>

        <div className="vignette-overlay" />
      </div>

      <style jsx>{`
        .wind-tunnel-section {
          position: relative;
          width: 100vw;
          height: 200vh; /* Scroll length */
          background: #000;
        }

        .sticky-content {
          position: sticky;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .tunnel-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          filter: grayscale(0.85) brightness(0.2) contrast(1.2);
        }

        .tunnel-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }

        /* Controls Panel */
        .tunnel-panel {
          position: absolute;
          z-index: 10;
          top: 10%;
          left: 4%;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-width: 280px;
          pointer-events: auto;
        }

        .tunnel-panel h3 {
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.5rem;
        }

        .status-indicator {
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #888;
          margin-top: -0.5rem;
        }

        .status-indicator .dot {
          width: 6px;
          height: 6px;
          background: #00e5ff;
          border-radius: 50%;
          box-shadow: 0 0 8px #00e5ff;
        }

        .status-indicator .dot.pulse {
          animation: cyanPulse 1.2s infinite alternate ease-in-out;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: #aaa;
        }

        .accent-range {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: #222;
          outline: none;
          border-radius: 2px;
        }

        .accent-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: var(--accent-orange);
          box-shadow: 0 0 6px var(--accent-orange);
          border-radius: 50%;
          cursor: pointer;
        }

        .drs-btn {
          width: 100%;
          padding: 8px 12px !important;
          font-size: 0.65rem !important;
          border-color: #333;
        }

        .drs-btn.drs-on {
          border-color: #00e5ff;
          color: #00e5ff;
          box-shadow: 0 0 12px rgba(0, 229, 255, 0.2);
        }

        .telemetry-bar {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          border-top: 1px solid var(--glass-border);
          padding-top: 0.5rem;
          color: #666;
        }

        .tunnel-caption {
          position: absolute;
          bottom: 4%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          color: #555;
          letter-spacing: 0.15em;
          z-index: 5;
        }

        @keyframes cyanPulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .tunnel-panel {
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            min-width: unset;
            top: 2%;
          }
          .tunnel-caption {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
