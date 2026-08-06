'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroHeadlights() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const headlightsRef = useRef(null);
  const carSilhouetteRef = useRef(null);
  const lensFlareRef = useRef(null);
  const textRef = useRef(null);

  const [ignited, setIgnited] = useState(false);

  useEffect(() => {
    // Canvas dust particles system
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.3 + 0.1;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y > canvas.height) {
          this.reset();
          this.y = 0;
        }
      }
      draw() {
        // Particles glow more when they cross the headlight beams
        // Headlight beams are roughly at y: 55% of screen, x: 25% and 75%
        const inBeamLeft = Math.abs(this.x - canvas.width * 0.35) < 150 && Math.abs(this.y - canvas.height * 0.58) < 300;
        const inBeamRight = Math.abs(this.x - canvas.width * 0.65) < 150 && Math.abs(this.y - canvas.height * 0.58) < 300;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = (inBeamLeft || inBeamRight) && ignited
          ? `rgba(255, 255, 255, ${this.opacity * 2})`
          : `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // GSAP ScrollTrigger Sequence
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom+=100% bottom',
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          // Ignite headlights at 15% scroll
          if (self.progress > 0.15 && !ignited) {
            setIgnited(true);
          } else if (self.progress <= 0.15 && ignited) {
            setIgnited(false);
          }
        }
      }
    });

    // Dark screen holds -> headlights ignite -> silhouette fades in -> zoom in -> transition
    timeline.to(headlightsRef.current, {
      opacity: 1,
      duration: 0.2,
      ease: 'power3.in',
    }, 0.2);

    timeline.to(lensFlareRef.current, {
      opacity: 1,
      scale: 1.5,
      duration: 0.3,
      ease: 'bounce.out',
    }, 0.2);

    timeline.to(carSilhouetteRef.current, {
      opacity: 0.35,
      duration: 0.5,
    }, 0.3);

    // Fade out text overlay
    timeline.to(textRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.3,
    }, 0.1);

    // Zoom into headlights
    timeline.to(containerRef.current, {
      scale: 1.2,
      duration: 1,
    }, 0.5);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      if (timeline.scrollTrigger) timeline.scrollTrigger.kill();
    };
  }, [ignited]);

  return (
    <div id="intro" ref={containerRef} className="headlights-section">
      {/* Background Silhouette */}
      <div 
        ref={carSilhouetteRef} 
        className="car-silhouette"
        style={{ backgroundImage: "url('/images/A_McLaren_P1_GTR_parked_inside_1.jpg')" }}
      ></div>

      {/* Floating Canvas for Dust Particles */}
      <canvas ref={canvasRef} className="dust-canvas"></canvas>

      {/* Volumetric Headlight Beams */}
      <div className={`light-beams ${ignited ? 'active' : ''}`}>
        <div className="beam left-beam"></div>
        <div className="beam right-beam"></div>
      </div>

      {/* Interactive Glowing Headlights & Lens Flares */}
      <div ref={headlightsRef} className={`headlight-glows ${ignited ? 'active' : ''}`}>
        <div className="led-light left-led">
          <div ref={lensFlareRef} className="lens-flare"></div>
        </div>
        <div className="led-light right-led">
          <div className="lens-flare"></div>
        </div>
      </div>

      {/* Atmospheric Fog Overlay */}
      <div className="fog-overlay"></div>

      {/* Cinematic Copy */}
      <div ref={textRef} className="intro-text-wrapper">
        <h2 className="tech-text orange-glow-text">HYBRID SYSTEM: ONLINE</h2>
        <h1>MCLAREN P1 GTR</h1>
        <p className="spec-line tech-text">3.8L TWIN-TURBO V8 HYBRID // 986 BHP // TRACK ONLY</p>
        <span className="scroll-indicator tech-text">SCROLL TO IGNITE VEHICLE STARTUP</span>
      </div>

      <style jsx>{`
        .headlights-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: #000;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        .car-silhouette {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0.75;
          filter: brightness(0.7) contrast(1.25);
          transition: opacity 1.5s ease;
          z-index: 1;
        }

        .dust-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }

        /* Volumetric Beams */
        .light-beams {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          z-index: 2;
          pointer-events: none;
          transition: opacity 0.5s ease-in;
        }

        .light-beams.active {
          opacity: 0.45;
        }

        .beam {
          position: absolute;
          top: 55%;
          width: 300px;
          height: 600px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 0%, rgba(255, 90, 0, 0.05) 50%, transparent 100%);
          filter: blur(25px);
          transform-origin: top center;
        }

        .left-beam {
          left: 23%;
          transform: rotate(-15deg);
        }

        .right-beam {
          right: 23%;
          transform: rotate(15deg);
        }

        /* Headlights & flares */
        .headlight-glows {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 4;
          opacity: 0;
          pointer-events: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 25vw;
        }

        .headlight-glows.active {
          opacity: 1;
        }

        .led-light {
          position: relative;
          top: 8%;
          width: 25px;
          height: 10px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 40px 15px #fff, 0 0 80px 30px #ff5a00;
        }

        .left-led {
          left: -40px;
        }

        .right-led {
          right: -40px;
        }

        .lens-flare {
          position: absolute;
          top: -5px;
          left: -100px;
          width: 225px;
          height: 20px;
          background: radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,90,0,0.3) 30%, transparent 80%);
          transform: scaleY(0.2);
          filter: blur(1px);
        }

        .fog-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, transparent 80%, rgba(0, 0, 0, 0.95) 100%);
          z-index: 5;
          pointer-events: none;
        }

        .intro-text-wrapper {
          position: absolute;
          z-index: 6;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .intro-text-wrapper h2 {
          font-size: 0.95rem;
          letter-spacing: 0.3em;
        }

        .intro-text-wrapper h1 {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        }

        .spec-line {
          font-size: 0.85rem !important;
          color: #aaa !important;
          letter-spacing: 0.15em !important;
          margin-top: 0.5rem;
        }

        .scroll-indicator {
          font-size: 0.7rem;
          color: #666;
          letter-spacing: 0.2em;
          margin-top: 1.5rem;
          animation: blink 1.5s infinite alternate ease-in-out;
        }

        @keyframes blink {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .intro-text-wrapper h1 {
            font-size: 2.2rem;
          }
          .headlight-glows {
            padding: 0 15vw;
          }
          .left-led { left: 0px; }
          .right-led { right: 0px; }
          .left-beam { left: 10%; }
          .right-beam { right: 10%; }
        }
      `}</style>
    </div>
  );
}
