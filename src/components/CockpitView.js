'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CockpitView() {
  const containerRef = useRef(null);
  const cockpitImgRef = useRef(null);

  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(1000);
  const [gear, setGear] = useState(1);
  const [boost, setBoost] = useState(0);
  const [steerAngle, setSteerAngle] = useState(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom+=150% bottom',
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;

        // Speed animation: 0 to 400 km/h
        const currentSpeed = Math.floor(p * 400);
        setSpeed(currentSpeed);

        // Gear & RPM calculations with drops on gear shift
        let currentGear = 1;
        let currentRpm = 1000;
        let currentBoost = 0;

        if (p < 0.2) {
          // Gear 1
          currentGear = 1;
          const ratio = p / 0.2;
          currentRpm = Math.floor(1000 + ratio * 7500); // 1000 - 8500
          currentBoost = Math.floor(ratio * 22);
        } else if (p < 0.4) {
          // Gear 2
          currentGear = 2;
          const ratio = (p - 0.2) / 0.2;
          currentRpm = Math.floor(5500 + ratio * 3000); // 5500 - 8500
          currentBoost = Math.floor(20 + ratio * 5);
        } else if (p < 0.6) {
          // Gear 3
          currentGear = 3;
          const ratio = (p - 0.4) / 0.2;
          currentRpm = Math.floor(6000 + ratio * 2500); // 6000 - 8500
          currentBoost = Math.floor(24 + ratio * 4);
        } else if (p < 0.8) {
          // Gear 4
          currentGear = 4;
          const ratio = (p - 0.6) / 0.2;
          currentRpm = Math.floor(6200 + ratio * 2300); // 6200 - 8500
          currentBoost = 28;
        } else {
          // Gear 5
          currentGear = 5;
          const ratio = (p - 0.8) / 0.2;
          currentRpm = Math.floor(6500 + ratio * 2000); // 6500 - 8500
          currentBoost = Math.floor(28 - ratio * 3);
        }

        setGear(currentGear);
        setRpm(currentRpm);
        setBoost(currentBoost);

        // Steering wheel vibration and slight rotation on speed
        const jitter = Math.sin(p * 200) * (currentSpeed / 100);
        setSteerAngle(jitter);

        // Dispatch engine rev event to update sound pitch in SoundManager
        const event = new CustomEvent('engine-rev', { 
          detail: { rpm: currentRpm, gear: currentGear, speed: currentSpeed } 
        });
        window.dispatchEvent(event);
      }
    });

    // Subtitle dashboard zoom-in animation
    gsap.fromTo(cockpitImgRef.current, 
      { scale: 1 },
      {
        scale: 1.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      }
    );

    return () => {
      st.kill();
    };
  }, []);

  // Compute shift lights
  const renderShiftLights = () => {
    // 10 lights, green, yellow, red
    return Array.from({ length: 10 }).map((_, i) => {
      const active = rpm >= 1000 + i * 750;
      let colorClass = 'green';
      if (i >= 5) colorClass = 'yellow';
      if (i >= 8) colorClass = 'red';
      const flash = rpm > 8000 && i >= 8;

      return (
        <div 
          key={i} 
          className={`led ${active ? 'active' : ''} ${colorClass} ${flash ? 'flash' : ''}`}
        ></div>
      );
    });
  };

  return (
    <div id="cockpit" ref={containerRef} className="cockpit-scroll-container">
      <div className="sticky-content">
        
        {/* Cockpit Background Render */}
        <div 
          ref={cockpitImgRef} 
          className="cockpit-bg"
          style={{ 
            backgroundImage: "url('/images/Luxury_McLaren_P1_GTR_cockpit__2.jpg')",
            transform: `rotate(${steerAngle * 0.1}deg) translate(${steerAngle * 0.2}px, ${Math.abs(steerAngle) * 0.1}px)`
          }}
        ></div>

        {/* Steering Wheel overlay layer (vibration/rotation) */}
        <div className="vignette-overlay" />

        {/* Dashboard digital telemetry overlay */}
        <div className="dashboard-hud glass-panel">
          
          {/* Shift Light Array */}
          <div className="shift-lights">
            {renderShiftLights()}
          </div>

          <div className="hud-main">
            {/* Speed readout */}
            <div className="speed-group">
              <span className="speed-val tech-text">{speed}</span>
              <span className="unit tech-text">KM/H</span>
            </div>

            {/* Middle telemetry */}
            <div className="stats-group">
              <div className="stat-item">
                <span className="label">RPM</span>
                <span className="val tech-text orange-glow-text">{rpm}</span>
              </div>
              <div className="stat-item">
                <span className="label">GEAR</span>
                <span className="val tech-text">{gear}</span>
              </div>
              <div className="stat-item">
                <span className="label">BOOST</span>
                <span className="val tech-text">{boost} PSI</span>
              </div>
            </div>
          </div>

          {/* Bottom bars */}
          <div className="hud-meters">
            <div className="meter-bar">
              <span className="lbl tech-text">THR</span>
              <div className="track"><div className="fill" style={{ width: `${Math.min(100, (rpm / 8500) * 100)}%` }}></div></div>
            </div>
            <div className="meter-bar">
              <span className="lbl tech-text">BRK</span>
              <div className="track"><div className="fill brake" style={{ width: `${speed > 350 ? 80 : speed > 200 ? 30 : 0}%` }}></div></div>
            </div>
          </div>
        </div>

        {/* HUD Instructions */}
        <div className="cockpit-label tech-text">
          <span className="orange-glow-text">{"//"}</span> COCKPIT FLIGHT DATA LINK
        </div>
      </div>

      <style jsx>{`
        .cockpit-scroll-container {
          position: relative;
          width: 100vw;
          height: 250vh; /* Scroll length */
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

        .cockpit-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: transform 0.05s linear;
        }

        /* HUD style console */
        .dashboard-hud {
          position: relative;
          z-index: 10;
          width: 90%;
          max-width: 480px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 10vh; /* Position slightly lower like a dashboard */
          border-color: rgba(255, 90, 0, 0.15) !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.85), inset 0 0 20px rgba(255, 90, 0, 0.05) !important;
        }

        /* Shift Lights */
        .shift-lights {
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 8px;
          gap: 4px;
        }

        .led {
          flex: 1;
          height: 100%;
          background: #151515;
          border-radius: 2px;
          transition: background 0.1s ease;
        }

        .led.active.green { background: #00ff00; box-shadow: 0 0 8px #00ff00; }
        .led.active.yellow { background: #ffff00; box-shadow: 0 0 8px #ffff00; }
        .led.active.red { background: #ff0000; box-shadow: 0 0 8px #ff0000; }

        .led.flash {
          animation: redFlash 0.15s infinite alternate;
        }

        @keyframes redFlash {
          0% { background: #ff0000; box-shadow: 0 0 10px #ff0000; }
          100% { background: #151515; box-shadow: none; }
        }

        .hud-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .speed-group {
          display: flex;
          flex-direction: column;
        }

        .speed-val {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          color: #fff;
        }

        .unit {
          font-size: 0.65rem;
          color: #666;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }

        .stats-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          min-width: 120px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .stat-item .label {
          color: #555;
        }

        .stat-item .val {
          font-weight: bold;
        }

        /* Meter Bars */
        .hud-meters {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .meter-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .meter-bar .lbl {
          font-size: 0.6rem;
          color: #555;
          width: 25px;
        }

        .meter-bar .track {
          flex: 1;
          height: 4px;
          background: #111;
          border-radius: 2px;
          overflow: hidden;
        }

        .meter-bar .fill {
          height: 100%;
          background: var(--accent-orange);
          box-shadow: 0 0 6px var(--accent-orange);
        }

        .meter-bar .fill.brake {
          background: #ff2222;
          box-shadow: 0 0 6px #ff2222;
        }

        .cockpit-label {
          position: absolute;
          bottom: 4%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          color: #555;
          letter-spacing: 0.15em;
          z-index: 5;
        }

        @media (max-width: 480px) {
          .speed-val {
            font-size: 2.5rem;
          }
          .dashboard-hud {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
