'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './globals.scss'
import SmoothScroll from '@/components/common/SmoothScroll'
import Preloader from '@/components/layout/Preloader'

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.cursor = 'default'
          window.scrollTo(0, 0);
        }, 2000)
    })()
  }, [])

  return (
    <html lang="en">
      <body>
        <AnimatePresence mode='wait'>
          {isLoading && <Preloader />}
        </AnimatePresence>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
