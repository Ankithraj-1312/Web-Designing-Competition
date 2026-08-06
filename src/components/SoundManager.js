'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function SoundManager() {
  const [muted, setMuted] = useState(true); // Default muted to respect browser policy
  const audioCtxRef = useRef(null);
  
  // Audio Nodes
  const engineSourceRef = useRef(null);
  const engineBufferRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Loaded HTML5 Audios for auxiliary triggers
  const startupAudioRef = useRef(null);
  const backfireAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  // Initialize auxiliary audios
  useEffect(() => {
    startupAudioRef.current = new Audio('/audio/garage.mp3');
    startupAudioRef.current.volume = 0.5;

    backfireAudioRef.current = new Audio('/audio/launch.mp3');
    backfireAudioRef.current.volume = 0.4;

    clickAudioRef.current = new Audio('/audio/assembly.mp3');
    clickAudioRef.current.volume = 0.15;

    // Load continuous loop audio via Web Audio API for smooth pitching
    const initWebAudio = async () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
        
        // Fetch the rolls_out sound (smooth engine running sound)
        const response = await fetch('/audio/rolls_out.mp3');
        const arrayBuffer = await response.arrayBuffer();
        
        // Decode audio data
        audioCtxRef.current.decodeAudioData(arrayBuffer, (buffer) => {
          engineBufferRef.current = buffer;
        });

        // Gain (volume) control
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.value = 0; // Start at 0 volume
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      } catch (e) {
        console.error("Web Audio initialization failed", e);
      }
    };

    initWebAudio();

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Handle Play/Stop continuous engine sound
  const startEngineLoop = useCallback(() => {
    if (!audioCtxRef.current || !engineBufferRef.current || engineSourceRef.current) return;
    
    // Create source node
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = engineBufferRef.current;
    source.loop = true;
    source.playbackRate.value = 0.6; // Start low pitch (idle)
    
    // Connect to gain
    source.connect(gainNodeRef.current);
    source.start(0);
    engineSourceRef.current = source;

    // Fade in volume
    if (gainNodeRef.current && !muted) {
      gainNodeRef.current.gain.setTargetAtTime(0.3, audioCtxRef.current.currentTime, 1.5);
    }
  }, [muted]);

  const stopEngineLoop = () => {
    if (engineSourceRef.current) {
      try {
        engineSourceRef.current.stop();
      } catch (e) {}
      engineSourceRef.current = null;
    }
  };

  // Event Listeners for Page events
  useEffect(() => {
    // 1. Play startup sound
    const handleStartup = () => {
      setMuted(false); // Unmute on start click
      if (startupAudioRef.current) {
        startupAudioRef.current.muted = false;
        startupAudioRef.current.play().catch(() => {});
      }
      
      // Start the looping running sound slightly after startup rev finishes
      setTimeout(() => {
        startEngineLoop();
      }, 2000);
    };

    // 2. Dynamic RPM pitch shifting
    const handleEngineRev = (e) => {
      const { rpm } = e.detail;
      if (!engineSourceRef.current || !audioCtxRef.current) return;

      // Map RPM 1000-8500 to playback rate 0.45 - 2.2
      const rate = 0.45 + (rpm - 1000) / 7500 * 1.75;
      engineSourceRef.current.playbackRate.setTargetAtTime(rate, audioCtxRef.current.currentTime, 0.05);

      // Volume changes based on throttle load (RPM)
      if (gainNodeRef.current && !muted) {
        const vol = 0.25 + (rpm - 1000) / 7500 * 0.25; // max 0.5
        gainNodeRef.current.gain.setTargetAtTime(vol, audioCtxRef.current.currentTime, 0.05);
      }
    };

    // 3. Final backfire sound trigger
    const handleBackfire = () => {
      if (backfireAudioRef.current && !muted) {
        backfireAudioRef.current.currentTime = 0;
        backfireAudioRef.current.play().catch(() => {});
      }
    };

    // 4. Click sound triggers (assembly)
    const handleAssemblyClick = () => {
      if (clickAudioRef.current && !muted) {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('play-engine-startup', handleStartup);
    window.addEventListener('engine-rev', handleEngineRev);
    window.addEventListener('final-backfire', handleBackfire);
    window.addEventListener('assembly-click', handleAssemblyClick);

    return () => {
      window.removeEventListener('play-engine-startup', handleStartup);
      window.removeEventListener('engine-rev', handleEngineRev);
      window.removeEventListener('final-backfire', handleBackfire);
      window.removeEventListener('assembly-click', handleAssemblyClick);
    };
  }, [muted, startEngineLoop]);

  // Synchronize Mute status
  useEffect(() => {
    if (startupAudioRef.current) startupAudioRef.current.muted = muted;
    if (backfireAudioRef.current) backfireAudioRef.current.muted = muted;
    if (clickAudioRef.current) clickAudioRef.current.muted = muted;

    if (gainNodeRef.current && audioCtxRef.current) {
      const targetVol = muted ? 0 : 0.3;
      gainNodeRef.current.gain.setTargetAtTime(targetVol, audioCtxRef.current.currentTime, 0.3);
    }
  }, [muted]);

  const toggleMute = () => {
    // Resume context if suspended (browser security)
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setMuted(!muted);
  };

  return (
    <button 
      className={`sound-toggle-btn glass-panel ${muted ? 'muted' : ''}`}
      onClick={toggleMute}
      title={muted ? "Unmute Engine Audio" : "Mute Engine Audio"}
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}

      <style jsx>{`
        .sound-toggle-btn {
          position: fixed;
          top: 30px;
          right: 30px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaa;
          cursor: pointer;
          z-index: 9999;
          transition: all 0.3s ease;
          border: 1px solid var(--glass-border);
          pointer-events: auto;
        }

        .sound-toggle-btn:hover {
          color: var(--accent-orange);
          border-color: var(--accent-orange);
          box-shadow: 0 0 15px var(--accent-orange-glow);
          transform: scale(1.05);
        }

        .sound-toggle-btn.muted {
          color: #ff3333;
          border-color: rgba(255, 51, 51, 0.3);
        }

        .sound-toggle-btn.muted:hover {
          box-shadow: 0 0 15px rgba(255, 51, 51, 0.2);
        }

        @media (max-width: 768px) {
          .sound-toggle-btn {
            top: 20px;
            right: 20px;
            width: 38px;
            height: 38px;
          }
        }
      `}</style>
    </button>
  );
}
