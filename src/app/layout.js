'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './globals.scss'
import SmoothScroll from '@/components/common/SmoothScroll'
import Preloader from '@/components/layout/Preloader'

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic cursor and scroll reset on mount
    document.body.style.cursor = 'default';
    window.scrollTo(0, 0);
  }, []);

  return (
    <html lang="en">
      <body>
        <AnimatePresence mode='wait'>
          {isLoading && <Preloader finishLoading={() => setIsLoading(false)} />}
        </AnimatePresence>
        <SmoothScroll>
          {!isLoading && children}
        </SmoothScroll>
      </body>
    </html>
  )
}
