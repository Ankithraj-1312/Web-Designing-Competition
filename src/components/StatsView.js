'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const statsList = [
  { id: 'hp', number: 986, unit: 'BHP', label: 'COMBINED OUTPUT', desc: 'V8 twin-turbo coupled with high performance electric motor.' },
  { id: 'accel', number: 2.4, unit: 'SEC', label: '0-100 KM/H', desc: 'Formula-class launch control traction management.' },
  { id: 'topspeed', number: 400, unit: 'KM/H', label: 'TOP SPEED', desc: 'Aerodynamically optimized and electronically limited.' },
  { id: 'weight', number: 1350, unit: 'KG', label: 'DRY WEIGHT', desc: 'Carbon fiber monocell chassis and Kevlar bodywork.' },
  { id: 'torque', number: 1010, unit: 'NM', label: 'MAX TORQUE', desc: 'Instant electric torque filling V8 turbo spool-up lag.' }
];

export default function StatsView() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Animate stats cards on entry
    const cards = gsap.utils.toArray('.stat-card');
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Number count-up animation
    cards.forEach((card) => {
      const numEl = card.querySelector('.stat-num');
      if (!numEl) return;
      const targetVal = parseFloat(numEl.getAttribute('data-target'));

      gsap.fromTo(numEl,
        { textContent: 0 },
        {
          textContent: targetVal,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: targetVal % 1 === 0 ? 1 : 0.1 }, // snap to decimal if float
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

  }, []);

  return (
    <div id="performance" ref={containerRef} className="stats-section story-section">
      <div className="section-header">
        <h3 className="tech-text orange-glow-text">{"// HYBRID_PERFORMANCE"}</h3>
        <h2>SPECIFICATION TELEMETRY</h2>
      </div>

      <div className="stats-grid">
        {statsList.map((s) => (
          <div key={s.id} className="stat-card glass-panel">
            <div className="card-top">
              <span className="card-lbl tech-text">{s.label}</span>
              <span className="card-dot"></span>
            </div>
            
            <div className="number-display">
              <span className="stat-num tech-text" data-target={s.number}>0</span>
              <span className="stat-unit tech-text">{s.unit}</span>
            </div>

            <div className="card-bottom">
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .stats-section {
          width: 100vw;
          min-height: 100vh;
          background: #090909;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          padding: 6rem 2rem;
          z-index: 10;
          position: relative;
        }

        .section-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .section-header h3 {
          font-size: 0.85rem;
          letter-spacing: 0.2em;
        }

        .section-header h2 {
          font-size: 2.25rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          width: 100%;
          max-width: 1200px;
        }

        /* Card designs */
        .stat-card {
          padding: 2.25rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-height: 220px;
          justify-content: space-between;
          border-radius: 12px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-lbl {
          font-size: 0.7rem;
          color: #666;
          letter-spacing: 0.1em;
        }

        .card-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-orange);
          box-shadow: 0 0 6px var(--accent-orange);
        }

        .number-display {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .stat-num {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          color: #fff;
        }

        .stat-unit {
          font-size: 1rem;
          font-weight: 900;
          color: var(--accent-orange);
        }

        .card-bottom p {
          font-size: 0.75rem;
          color: #888;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 1.75rem;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
