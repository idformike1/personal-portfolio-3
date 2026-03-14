'use client';
import styles from './page.module.css'
import Hero from '@/components/layout/Hero'
import Marquee from '@/components/layout/Marquee'
import Work from '@/components/layout/Work'
import SlidingGrid from '@/components/layout/SlidingGrid'

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <Marquee />
      <div style={{height: "100vh"}}></div>
      <Work />
      <SlidingGrid />
    </main>
  )
}
