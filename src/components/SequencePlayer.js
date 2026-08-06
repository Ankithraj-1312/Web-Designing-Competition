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
  onProgressUpdate,
  fallbackImage,
  children,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [startedLoading, setStartedLoading] = useState(true);

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
          setImages([...loadedImages]);
        };
        img.onerror = () => {
          loadedCount++;
        };
      }
    };

    preloadImages();
  }, [frameCount, sequencePath, extension]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderState = { frame: 0 };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.offsetWidth;
      const displayHeight = canvas.offsetHeight;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      drawFrame(renderState.frame);
    };

    const drawFrame = (index) => {
      // Fallback to nearest loaded frame to eliminate black flash
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

      const displayWidth = canvas.offsetWidth;
      const displayHeight = canvas.offsetHeight;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // CONTAIN draw math (no cropping of vehicle)
      const imgWidth = img.width;
      const imgHeight = img.height;
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = displayWidth / displayHeight;

      let drawWidth = displayWidth;
      let drawHeight = displayHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio < canvasRatio) {
        drawHeight = displayHeight;
        drawWidth = displayHeight * imgRatio;
        offsetX = (displayWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = displayWidth;
        drawHeight = displayWidth / imgRatio;
        offsetX = 0;
        offsetY = (displayHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const st = ScrollTrigger.create({
      trigger: triggerRef.current || containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(self.progress * frameCount)
        );

        renderState.frame = frameIndex;
        setCurrentFrameIndex(frameIndex);
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

  const activeAmbientBg = images[currentFrameIndex]?.src || fallbackImage;

  return (
    <div ref={containerRef} className="sequence-player-wrapper">
      {/* Ambient Blur Layer matching current frame */}
      {activeAmbientBg && (
        <div 
          className="ambient-blur-layer" 
          style={{ backgroundImage: `url('${activeAmbientBg}')` }}
        />
      )}

      {images.filter(Boolean).length === 0 ? (
        <div className="sequence-loading glass-panel">
          <div className="spinner"></div>
          <span className="tech-text">
            {startedLoading ? `CALIBRATING SCANNER: ${loadedPercent}%` : 'PREPARING SECTOR...'}
          </span>
        </div>
      ) : null}

      <div className="cinematic-frame">
        {fallbackImage && images.filter(Boolean).length === 0 && (
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

        .ambient-blur-layer {
          position: absolute;
          top: -15%;
          left: -15%;
          width: 130%;
          height: 130%;
          background-size: cover;
          background-position: center;
          filter: blur(50px) brightness(0.5) contrast(1.15);
          transform: scale(1.15);
          opacity: 0.8;
          z-index: 1;
          pointer-events: none;
          transition: background-image 0.2s ease;
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
          height: 86vh;
          max-height: 880px;
          aspect-ratio: 9 / 16;
          max-width: 92vw;
          border: 1px solid rgba(255, 90, 0, 0.35);
          border-radius: 12px;
          background: #050505;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 90, 0, 0.15);
          overflow: hidden;
          z-index: 2;
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
          width: 14px;
          height: 14px;
          border: 2px solid var(--accent-orange);
          opacity: 0.8;
          z-index: 3;
        }

        .tl { top: 16px; left: 16px; border-right: none; border-bottom: none; }
        .tr { top: 16px; right: 16px; border-left: none; border-bottom: none; }
        .bl { bottom: 16px; left: 16px; border-right: none; border-top: none; }
        .br { bottom: 16px; right: 16px; border-left: none; border-top: none; }

        .overlay-caption {
          position: absolute;
          bottom: 30px;
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
