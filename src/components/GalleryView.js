'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  { id: 1, src: '/images/A_McLaren_P1_GTR_parked_beneat_1.jpg', title: 'NIGHT RACING GRID', desc: 'Ambient wet reflections on racing tarmac.' },
  { id: 2, src: '/images/A_McLaren_P1_GTR_inside_a_futu_1.jpg', title: 'HYPER-FLOW TUNNEL', desc: 'Volumetric mist stream aerodynamics calibration.' },
  { id: 3, src: '/images/A_McLaren_P1_GTR_parked_inside_1.jpg', title: 'THE CARBON LAIR', desc: 'Parked inside the carbon fiber chassis laboratory.' },
  { id: 4, src: '/images/A_futuristic_McLaren-inspired__3.jpg', title: 'MONOCELL SILHOUETTE', desc: 'Backlit signature curves and orange accent styling.' }
];

export default function GalleryView() {
  const containerRef = useRef(null);

  // Parallax zoom effect on scroll
  useEffect(() => {
    const items = gsap.utils.toArray('.gallery-item');
    
    items.forEach((item) => {
      const img = item.querySelector('.gallery-img');
      
      gsap.fromTo(img, 
        { scale: 1.25, yPercent: -15 },
        {
          scale: 1,
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });
  }, []);

  // Mouse tilt 3D hover effect
  const handleMouseMove = (e, itemRef) => {
    const card = itemRef;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = -(y - centerY) / 10; // invert tilt
    const rotateY = (x - centerX) / 10;
    
    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 800,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      boxShadow: '0 20px 40px rgba(255, 90, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.7)'
    });
  };

  const handleMouseLeave = (itemRef) => {
    gsap.to(itemRef, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
    });
  };

  return (
    <div ref={containerRef} className="gallery-section story-section">
      <div className="section-header">
        <h3 className="tech-text orange-glow-text">{"//bespoke_renders"}</h3>
        <h2>CINEMATIC EXHIBITION</h2>
      </div>

      <div className="gallery-grid">
        {galleryImages.map((item) => {
          let cardRef = null;
          return (
            <div 
              key={item.id} 
              ref={(el) => { cardRef = el; }}
              className="gallery-item glass-panel"
              onMouseMove={(e) => handleMouseMove(e, cardRef)}
              onMouseLeave={() => handleMouseLeave(cardRef)}
            >
              <div className="img-wrapper">
                <div 
                  className="gallery-img"
                  style={{ backgroundImage: `url('${item.src}')` }}
                ></div>
              </div>
              
              <div className="gallery-overlay">
                <h4 className="tech-text">{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .gallery-section {
          width: 100vw;
          min-height: 100vh;
          background: #050505;
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

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
          width: 100%;
          max-width: 1200px;
        }

        /* Gallery Cards styling */
        .gallery-item {
          position: relative;
          height: 380px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.3s ease;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          border-color: var(--glass-border);
        }

        .img-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transform-origin: center;
        }

        .gallery-overlay {
          position: relative;
          z-index: 2;
          padding: 2rem 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
          width: 100%;
        }

        .gallery-overlay h4 {
          font-size: 0.9rem;
          color: #fff;
          margin-bottom: 0.35rem;
          letter-spacing: 0.05em;
        }

        .gallery-overlay p {
          font-size: 0.7rem;
          color: #888;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .gallery-item {
            height: 280px;
          }
          .section-header h2 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}
