'use client';
import styles from './page.module.css';
import Hero from '@/components/layout/Hero';
import Work from '@/components/layout/Work';
import SlidingGrid from '@/components/layout/SlidingGrid';

// NOTE: The standalone <Marquee /> has been removed.
// The Hero component owns its own marquee at the bottom edge — this is the correct
// Snellenberg architecture: one marquee, positioned at the bottom of the hero image,
// not repeated as a separate section below.

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <Work />
      <SlidingGrid />
    </main>
  );
}
