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
  fallbackImage, // High-res background image fallback to eliminate black space
  children,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [startedLoading, setStartedLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    const loadedImages = new Array(frameCount).fill(null);
    let loadedCount = 0;

    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(3, '0');
        img.src = `${sequencePath}${frameNum}${extension}`;
        img.onload = () => {
          loadedCount++;
          loadedImages[i - 1] = img;
          setLoadedPercent(Math.floor((loadedCount / frameCount) * 100));
          // Expose loaded frames immediately to state
          setImages([...loadedImages]);
        };
        img.onerror = () => {
          loadedCount++;
          setErrorOccurred(true);
        };
      }
    };

    // Preload immediately on mount so frames are ready instantly
    preloadImages();
  }, [frameCount, sequencePath, extension]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderState = { frame: 0 };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawFrame(renderState.frame);
    };

    const drawFrame = (index) => {
      // Get exact frame or nearest available loaded frame
      let img = images[index];
      if (!img) {
        for (let i = index - 1; i >= 0; i--) {
          if (images[i]) { img = images[i]; break; }
        }
      }
      if (!img) {
        for (let i = index + 1; i < frameCount; i++) {
          if (images[i]) { img = images[i]; break; }
        }
      }
      if (!img) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render with cover logic to fill the full screen edge-to-edge
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

    // Draw initial frame
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Scroll trigger mapping frame index with instant response (no frame skipping)
    const st = ScrollTrigger.create({
      trigger: triggerRef.current || containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true, // Direct 1:1 instant scroll response for all 240 frames
      onUpdate: (self) => {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(self.progress * frameCount)
        );

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
        {fallbackImage && (
          <div 
            className="fallback-bg" 
            style={{ backgroundImage: `url('${fallbackImage}')` }}
          />
        )}
        <canvas ref={canvasRef} className="player-canvas" />
        <div className="telemetry-corner tl"></div>
        <div className="telemetry-corner tr"></div>
        <div className="telemetry-corner bl"></div>
        <div className="telemetry-corner br"></div>
      </div>

      {overlayText && (
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
          background: #050505;
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
          background: #050505;
          overflow: hidden;
        }

        .fallback-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          filter: brightness(0.85) contrast(1.1);
          z-index: 0;
        }

        .player-canvas {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Telemetry frame details */
        .telemetry-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          border: 2px solid var(--accent-orange);
          opacity: 0.8;
          z-index: 3;
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
          padding: 8px 24px;
          border-radius: 4px;
          border: 1px solid var(--glass-border);
          z-index: 4;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .cinematic-frame {
            height: 100%;
            width: 100%;
            aspect-ratio: unset;
            border-radius: 0;
            border: none;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
