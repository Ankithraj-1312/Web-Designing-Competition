'use client';
import { useState, useEffect } from 'react';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left: Logo & Wordmark */}
        <div className="brand">
          <svg className="mclaren-wordmark" viewBox="0 0 100 30" width="120">
            <path 
              d="M 5,20 L 25,20 L 30,10 L 40,25 L 45,20 L 60,20 L 65,10 L 70,25 L 85,25 C 90,25 95,20 95,15 C 95,10 90,5 85,5 L 75,5 L 70,15 L 60,5 L 35,5 L 30,15 L 20,5 L 5,5 Z" 
              fill="none" 
              stroke="#ff5a00" 
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="brand-badge tech-text">P1 GTR</span>
        </div>

        {/* Center: Navigation links */}
        <ul className="nav-links tech-text">
          <li><a href="#intro" className="link-hover">INTRO</a></li>
          <li><a href="#garage" className="link-hover">GARAGE</a></li>
          <li><a href="#design" className="link-hover">DESIGN</a></li>
          <li><a href="#engineering" className="link-hover">ENGINEERING</a></li>
          <li><a href="#configurator" className="link-hover">CONFIG</a></li>
          <li><a href="#cockpit" className="link-hover">COCKPIT</a></li>
          <li><a href="#aerodynamics" className="link-hover">AERO</a></li>
          <li><a href="#performance" className="link-hover">SPECS</a></li>
          <li><a href="#gallery" className="link-hover">GALLERY</a></li>
        </ul>

        {/* Right: Telemetry Status */}
        <div className="telemetry-status tech-text">
          <span className="dot pulse"></span>
          <span className="status-label">LINK ACTIVE</span>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 999;
          padding: 1.5rem 4%;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          background: linear-gradient(to bottom, rgba(5,5,5,0.8) 0%, transparent 100%);
          border-bottom: 1px solid transparent;
        }

        .navbar.scrolled {
          padding: 0.85rem 4%;
          background: rgba(8, 8, 8, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mclaren-wordmark {
          filter: drop-shadow(0 0 4px var(--accent-orange-glow));
        }

        .brand-badge {
          font-size: 0.65rem;
          color: #888;
          border: 1px solid #333;
          padding: 2px 6px;
          border-radius: 2px;
          background: rgba(0,0,0,0.5);
          letter-spacing: 0.15em;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .nav-links a {
          text-decoration: none;
          color: #aaa;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          transition: all 0.3s ease;
          position: relative;
          padding: 4px 0;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background-color: var(--accent-orange);
          transition: width 0.3s ease;
          box-shadow: 0 0 8px var(--accent-orange);
        }

        .nav-links a:hover {
          color: #fff;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .telemetry-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.65rem;
          color: #888;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: 20px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #00ff66;
          box-shadow: 0 0 8px #00ff66;
        }

        .pulse {
          animation: statusPulse 2s infinite alternate ease-in-out;
        }

        @keyframes statusPulse {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        @media (max-width: 900px) {
          .nav-links {
            display: none; /* Hide link list on small devices, show logo and status */
          }
          .navbar {
            padding: 1rem 4%;
          }
        }
      `}</style>
    </nav>
  );
}
