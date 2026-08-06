'use client';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import SequencePlayer from './SequencePlayer';

gsap.registerPlugin(ScrollToPlugin);

export default function TrackLaunch() {
  const containerRef = useRef(null);
  const smokeCanvasRef = useRef(null);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [launchState, setLaunchState] = useState('idle'); // idle -> holding -> revving -> launched
  const [countdown, setCountdown] = useState(3);
  
  const handleProgress = (progress) => {
    setScrollProgress(progress);
    
    // Play launch exhaust/screech sounds at specific progress
    const event = new CustomEvent('launch-scroll', { detail: { progress } });
    window.dispatchEvent(event);
  };

  // Canvas Smoke Particle System
  useEffect(() => {
    const canvas = smokeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SmokeParticle {
      constructor() {
        this.reset();
      }
      reset() {
        // Emit from bottom rear wheel area
        this.x = canvas.width * 0.4 + (Math.random() * 80 - 40);
        this.y = canvas.height * 0.75 + (Math.random() * 40 - 20);
        this.size = Math.random() * 15 + 10;
        this.speedX = Math.random() * 2 - 1.5;
        this.speedY = -(Math.random() * 2 + 1);
        this.alpha = Math.random() * 0.4 + 0.1;
        this.grow = Math.random() * 0.4 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size += this.grow;
        this.alpha = Math.max(0, this.alpha - 0.004);
        if (this.alpha <= 0 || this.y < 0) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 220, 220, ${this.alpha})`;
        ctx.shadowBlur = this.size * 0.2;
        ctx.shadowColor = 'rgba(255, 90, 0, 0.1)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    // Populate smoke particles
    for (let i = 0; i < 40; i++) {
      particles.push(new SmokeParticle());
    }

    const animateSmoke = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Smoke is thickest during launch acceleration (progress 0.1 to 0.5)
      if (scrollProgress > 0.05 && scrollProgress < 0.6) {
        particles.forEach(p => {
          p.update();
          p.draw();
        });
      }
      animationId = requestAnimationFrame(animateSmoke);
    };
    animateSmoke();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [scrollProgress]);

  // Autoscroll launch sequence trigger
  const triggerLaunch = () => {
    setLaunchState('holding');
    setCountdown(3);

    // Play rev sound event
    window.dispatchEvent(new CustomEvent('launch-control-rev'));

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setLaunchState('launched');
        
        // Autoscroll using GSAP
        window.dispatchEvent(new CustomEvent('launch-control-release'));
        
        gsap.to(window, {
          scrollTo: {
            y: containerRef.current.offsetTop + containerRef.current.offsetHeight - window.innerHeight,
            autoKill: false
          },
          duration: 3.5,
          ease: 'power3.inOut',
          onComplete: () => {
            setLaunchState('idle');
          }
        });
      }
    }, 1000);
  };

  const getSubtext = () => {
    if (launchState === 'holding') return "LAUNCH CONTROL: HOLD BRAKE / FULL ACCELERATION";
    if (launchState === 'launched') return "LAUNCH CONTROL: THREADING CIRCUITS / MAX TORQUE DEPLOYED";
    if (scrollProgress < 0.15) return "READY STAGED ON CIRCUIT FORMULA GRID";
    if (scrollProgress < 0.5) return "0-100 ACCELERATION BURST / TYRE SCRIP LIMITS";
    return "CHASE PROFILE TRACK TELEMETRY ENGAGED";
  };

  return (
    <div ref={containerRef} className="track-launch-container">
      <div className="sticky-content">
        
        <SequencePlayer
          id="launch"
          frameCount={240}
          sequencePath="/sequences/launch/ezgif-frame-"
          triggerRef={containerRef}
          overlayText={getSubtext()}
          onProgressUpdate={handleProgress}
        >
          {/* Smoke Particle Overlay */}
          <canvas ref={smokeCanvasRef} className="smoke-canvas" />

          {/* Launch Control Panel */}
          <div className="launch-controls glass-panel">
            <h3 className="tech-text orange-glow-text">{"// LAUNCH_CONTROL"}</h3>
            {launchState === 'idle' ? (
              <button className="launch-btn orange-glow-btn" onClick={triggerLaunch}>
                ENGAGE LAUNCH CONTROL
              </button>
            ) : (
              <div className="launch-countdown tech-text">
                {launchState === 'holding' ? (
                  <>
                    <span className="blink-text">HOLD BRAKE</span>
                    <span className="count orange-glow-text">{countdown}</span>
                  </>
                ) : (
                  <span className="orange-glow-text launched-text animate-pulse">LAUNCH ACTIVE</span>
                )}
              </div>
            )}
          </div>

          {/* Slip Telemetry HUD */}
          <div className="telemetry-bar-right hud-panel glass-panel">
            <h4 className="tech-text">SLIP_TELEMETRY</h4>
            <div className="stat-row">
              <span>LATERAL G:</span>
              <span className="tech-text value">
                {scrollProgress > 0.05 && scrollProgress < 0.6 
                  ? (1.0 + Math.sin(scrollProgress * Math.PI) * 1.8).toFixed(2) 
                  : "0.00"} G
              </span>
            </div>
            <div className="stat-row">
              <span>WHEEL SPIN:</span>
              <span className="tech-text value orange-glow-text">
                {scrollProgress > 0.05 && scrollProgress < 0.35 ? "14% SLIP" : "0% SLIP"}
              </span>
            </div>
            <div className="stat-row">
              <span>FLAMES:</span>
              <span className="tech-text value">
                {scrollProgress > 0.1 && scrollProgress < 0.25 ? "ACTIVE EXHAUST" : "STANDBY"}
              </span>
            </div>
          </div>
        </SequencePlayer>
      </div>

      <style jsx>{`
        .track-launch-container {
          position: relative;
          width: 100vw;
          height: 350vh; /* Scroll length */
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

        .smoke-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }

        /* Launch Control overlay UI */
        .launch-controls {
          position: absolute;
          z-index: 10;
          bottom: 10%;
          left: 4%;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 260px;
          pointer-events: auto;
        }

        .launch-controls h3 {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.5rem;
        }

        .launch-btn {
          width: 100%;
          padding: 10px 16px !important;
          font-size: 0.7rem !important;
        }

        .launch-countdown {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .launch-countdown .count {
          font-size: 2rem;
          font-weight: bold;
          margin-top: 5px;
        }

        .blink-text {
          animation: blink 0.5s infinite alternate;
          color: #ff3333;
        }

        .launched-text {
          font-size: 1.1rem;
          font-weight: bold;
          letter-spacing: 0.1em;
          text-shadow: 0 0 10px var(--accent-orange-glow);
        }

        /* Telemetry overlay panel */
        .telemetry-bar-right {
          position: absolute;
          z-index: 10;
          top: 10%;
          right: 4%;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 220px;
        }

        .telemetry-bar-right h4 {
          font-size: 0.75rem;
          color: #888;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.5rem;
          letter-spacing: 0.1em;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
        }

        .stat-row span:first-child {
          color: #666;
        }

        .stat-row .value {
          color: #eee;
        }

        @keyframes blink {
          to { opacity: 0.3; }
        }

        @media (max-width: 768px) {
          .launch-controls {
            left: 50%;
            transform: translateX(-50%);
            bottom: 4%;
            width: 90%;
          }
          .telemetry-bar-right {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
