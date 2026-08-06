'use client';
import { useState } from 'react';
import SoundManager from '@/components/SoundManager';
import Loader from '@/components/Loader';
import NavBar from '@/components/NavBar';
import HeroHeadlights from '@/components/HeroHeadlights';
import GarageView from '@/components/GarageView';
import RolloutView from '@/components/RolloutView';
import AssemblyView from '@/components/AssemblyView';
import Configurator from '@/components/Configurator';
import CockpitView from '@/components/CockpitView';
import WindTunnel from '@/components/WindTunnel';
import StatsView from '@/components/StatsView';
import TrackLaunch from '@/components/TrackLaunch';
import GalleryView from '@/components/GalleryView';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded ? (
        <Loader onComplete={() => setIsLoaded(true)} />
      ) : (
        <main className="storytelling-container">
          <NavBar />
          <SoundManager />
          <HeroHeadlights />
          <GarageView />
          <RolloutView />
          <AssemblyView />
          <Configurator />
          <CockpitView />
          <WindTunnel />
          <StatsView />
          <TrackLaunch />
          <GalleryView />
          <FinalCTA />
        </main>
      )}
    </>
  );
}
