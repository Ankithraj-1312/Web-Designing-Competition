'use client';
import { useState, useEffect } from 'react';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // We will preload the first 60 frames of each sequence to make the transitions instant,
    // and load the rest progressively. For the loader, let's load all 240 frames of the garage sequence
    // so the intro is flawless.
    const totalFrames = 240; // Preload all 240 frames for 100% complete sequence playback
    let loadedCount = 0;
    const images = [];

    const incrementProgress = () => {
      loadedCount++;
      const percent = Math.min(100, Math.floor((loadedCount / totalFrames) * 100));
      setProgress(percent);
      if (loadedCount >= totalFrames) {
        setReady(true);
      }
    };

    // Preload loop
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/sequences/garage/ezgif-frame-${frameNum}.jpg`;
      img.onload = incrementProgress;
      img.onerror = incrementProgress; // Count as loaded even if error to avoid locking the loader
      images.push(img);
    }

    // Fallback if loading takes too long
    const timeout = setTimeout(() => {
      setReady(true);
      setProgress(100);
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  const handleStart = () => {
    setStarted(true);
    // Play startup audio (we'll communicate with a global audio channel or document event)
    const event = new CustomEvent('play-engine-startup');
    window.dispatchEvent(event);
    
    // Animate loader fade out
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className={`loader-overlay carbon-pattern ${started ? 'fade-out' : ''}`}>
      <div className="loader-container">
        {/* Glowing Orange Logo */}
        <div className="mclaren-logo-container">
          <svg className="mclaren-emblem" viewBox="0 0 100 30" width="180">
            <path 
              d="M 5,20 L 25,20 L 30,10 L 40,25 L 45,20 L 60,20 L 65,10 L 70,25 L 85,25 C 90,25 95,20 95,15 C 95,10 90,5 85,5 L 75,5 L 70,15 L 60,5 L 35,5 L 30,15 L 20,5 L 5,5 Z" 
              fill="none" 
              stroke="#ff5a00" 
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 85,15 L 92,15" stroke="#ff5a00" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="logo-text tech-text">P1 GTR</span>
        </div>

        {/* Fuel Gauge styled progress bar */}
        <div className="fuel-gauge-wrapper">
          <div className="gauge-header">
            <span className="tech-text label-e">E</span>
            <span className="gauge-title tech-text">SYSTEM CHECK</span>
            <span className="tech-text label-f">F</span>
          </div>
          
          <div className="gauge-bar-container">
            <div className="gauge-bar" style={{ width: `${progress}%` }}>
              <div className="gauge-glow"></div>
            </div>
            
            {/* Ticks */}
            <div className="gauge-ticks">
              {Array.from({ length: 11 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`tick ${progress >= i * 10 ? 'active' : ''}`}
                  style={{ left: `${i * 10}%` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="gauge-footer">
            <span className="tech-text status-text">
              {progress < 100 ? `INJECTING DATA: ${progress}%` : "SYSTEM READY"}
            </span>
            <span className="tech-text boost-text">BOOST: {Math.floor(progress * 1.2)} PSI</span>
          </div>
        </div>

        {/* Enter Button */}
        <div className="action-container">
          {ready && (
            <button className="start-btn orange-glow-btn" onClick={handleStart}>
              START ENGINE
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #050505;
          transition: transform 1.2s cubic-bezier(0.85, 0, 0.15, 1), opacity 1.2s ease;
        }

        .loader-overlay.fade-out {
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 90%;
          max-width: 450px;
          gap: 3rem;
        }

        .mclaren-logo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .mclaren-emblem {
          filter: drop-shadow(0 0 8px rgba(255, 90, 0, 0.6));
          animation: pulse 2.5s infinite alternate ease-in-out;
        }

        .logo-text {
          font-size: 0.9rem;
          color: #888;
          letter-spacing: 0.3em;
          margin-top: 0.5rem;
        }

        .fuel-gauge-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .gauge-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #555;
        }

        .gauge-title {
          color: #aaa;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
        }

        .label-e { color: #883333; }
        .label-f { color: #ff5a00; }

        .gauge-bar-container {
          position: relative;
          height: 10px;
          background: #111;
          border: 1px solid #222;
          border-radius: 2px;
          overflow: visible;
        }

        .gauge-bar {
          height: 100%;
          background: linear-gradient(90deg, #552200 0%, #ff5a00 100%);
          position: relative;
          transition: width 0.1s ease-out;
        }

        .gauge-glow {
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 100%;
          background: #fff;
          box-shadow: 0 0 10px 2px #ff5a00, 0 0 20px 4px #ff5a00;
        }

        .gauge-ticks {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 6px;
          pointer-events: none;
        }

        .tick {
          position: absolute;
          width: 1px;
          height: 4px;
          background: #222;
        }

        .tick.active {
          background: #ff5a00;
          box-shadow: 0 0 2px rgba(255, 90, 0, 0.5);
        }

        .gauge-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #555;
          margin-top: 4px;
        }

        .status-text {
          color: #888;
          letter-spacing: 0.05em;
        }

        .boost-text {
          color: #ff5a00;
          text-shadow: 0 0 4px rgba(255, 90, 0, 0.3);
        }

        .action-container {
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .start-btn {
          animation: glowPulse 1.5s infinite alternate ease-in-out;
          font-size: 0.9rem !important;
        }

        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1.02); }
        }

        @keyframes glowPulse {
          0% { box-shadow: 0 0 5px rgba(255, 90, 0, 0.2); }
          100% { box-shadow: 0 0 20px rgba(255, 90, 0, 0.6); }
        }
      `}</style>
    </div>
  );
}
