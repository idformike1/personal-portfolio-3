'use client';
import styles from './page.module.css'
import Hero from '@/components/layout/Hero'
import Marquee from '@/components/layout/Marquee'
import Work from '@/components/layout/Work'
import SlidingGrid from '@/components/layout/SlidingGrid'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <Marquee />
      <div style={{height: "100vh"}}></div>
      <Work />
      <SlidingGrid />
      <Footer />
    </main>
  )
}
