'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SequencePlayer({
  id,
  frameCount = 240,
  sequencePath,
  extension = '.jpg',
  triggerRef,
  overlayText,
  onProgressUpdate, // callback for custom animations (like gauge, speed, sound etc)
  children,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [startedLoading, setStartedLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(3, '0');
        img.src = `${sequencePath}${frameNum}${extension}`;
        img.onload = () => {
          loadedCount++;
          setLoadedPercent(Math.floor((loadedCount / frameCount) * 100));
          if (loadedCount === frameCount) {
            setImages(loadedImages);
          }
        };
        img.onerror = () => {
          loadedCount++;
          setErrorOccurred(true);
          if (loadedCount === frameCount) {
            setImages(loadedImages);
          }
        };
        loadedImages.push(img);
      }
    };

    // ScrollTrigger to trigger background preloading when user is near
    const preloadTrigger = ScrollTrigger.create({
      trigger: triggerRef.current || containerRef.current,
      start: 'top bottom+=150%', // Start loading when section is 1.5 screens below viewport
      once: true,
      onEnter: () => {
        setStartedLoading(true);
        preloadImages();
      }
    });

    return () => {
      preloadTrigger.kill();
    };
  }, [frameCount, sequencePath, extension, triggerRef]);

  useEffect(() => {
    if (images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderState = { frame: 0 };

    const resizeCanvas = () => {
      // Fit the 1080x1920 portrait canvas into the parent container
      // If we are on desktop, we can display it inside a centered box (cinematic view)
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawFrame(renderState.frame);
    };

    const drawFrame = (index) => {
      const img = images[index];
      if (!img) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render with cover logic to fill the canvas
      const imgWidth = img.width;
      const imgHeight = img.height;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        // Image is wider than canvas
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      } else {
        // Image is taller than canvas
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Draw first frame
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Adaptive performance tracking variables
    let lastDrawTime = typeof window !== 'undefined' ? performance.now() : 0;
    let lowPerformanceMode = false;
    let slowDrawCount = 0;

    // Scroll trigger mapping frame index
    const st = ScrollTrigger.create({
      trigger: triggerRef.current || containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const now = performance.now();
        const delta = now - lastDrawTime;
        lastDrawTime = now;

        // If time delta between scrolls is long (under 25 FPS), trigger low perf mode
        if (delta > 40) {
          slowDrawCount++;
          if (slowDrawCount > 6) {
            lowPerformanceMode = true;
          }
        } else {
          slowDrawCount = Math.max(0, slowDrawCount - 1);
        }

        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(self.progress * frameCount)
        );

        // Under low-perf mode, skip rendering odd frames when scrolling rapidly
        if (lowPerformanceMode && frameIndex % 2 !== 0 && frameIndex !== frameCount - 1) {
          return;
        }

        renderState.frame = frameIndex;
        drawFrame(frameIndex);
        
        if (onProgressUpdate) {
          onProgressUpdate(self.progress, frameIndex);
        }
      }
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      st.kill();
    };
  }, [images, frameCount, triggerRef, onProgressUpdate]);

  return (
    <div ref={containerRef} className="sequence-player-wrapper">
      {images.length === 0 ? (
        <div className="sequence-loading glass-panel">
          <div className="spinner"></div>
          <span className="tech-text">
            {startedLoading ? `CALIBRATING SCANNER: ${loadedPercent}%` : 'PREPARING SECTOR...'}
          </span>
        </div>
      ) : null}

      <div className="cinematic-frame">
        <canvas ref={canvasRef} className="player-canvas" />
        <div className="telemetry-corner tl"></div>
        <div className="telemetry-corner tr"></div>
        <div className="telemetry-corner bl"></div>
        <div className="telemetry-corner br"></div>
      </div>

      {overlayText && images.length > 0 && (
        <div className="overlay-caption tech-text">
          {overlayText}
        </div>
      )}

      {children}

      <style jsx>{`
        .sequence-player-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          overflow: hidden;
          z-index: 2;
        }

        .sequence-loading {
          position: absolute;
          z-index: 5;
          padding: 1.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          width: 25px;
          height: 25px;
          border: 2px solid rgba(255, 90, 0, 0.1);
          border-top-color: var(--accent-orange);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .cinematic-frame {
          position: relative;
          width: 100%;
          height: 100%;
          border: none;
          background: #000;
          overflow: hidden;
        }

        .player-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Telemetry frame details */
        .telemetry-corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid var(--accent-orange);
          opacity: 0.65;
        }

        .tl { top: 40px; left: 4%; border-right: none; border-bottom: none; }
        .tr { top: 40px; right: 4%; border-left: none; border-bottom: none; }
        .bl { bottom: 40px; left: 4%; border-right: none; border-top: none; }
        .br { bottom: 40px; right: 4%; border-left: none; border-top: none; }

        .overlay-caption {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          color: var(--accent-orange);
          letter-spacing: 0.15em;
          text-shadow: 0 0 8px rgba(255, 90, 0, 0.5);
          background: rgba(0,0,0,0.85);
          padding: 8px 20px;
          border-radius: 4px;
          border: 1px solid var(--glass-border);
          z-index: 3;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
