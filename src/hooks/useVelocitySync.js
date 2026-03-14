'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { useLenis } from '@studio-freight/react-lenis';

/**
 * useVelocitySync Hook
 * Maps Lenis scroll velocity to GSAP timeline timeScale
 * 
 * @param {Object} timelineRef - Ref holding the GSAP timeline
 * @param {Number} baseScale - Starting timeScale (default: 1)
 * @param {Number} maxScale - Maximum timeScale (default: 10)
 */
export default function useVelocitySync(timelineRef, baseScale = 1, maxScale = 10) {
    useLenis(({ velocity }) => {
        if (timelineRef.current) {
            // Map absolute velocity (0 to ~100) to timeScale (1 to 10)
            // velocity * 0.1 is a common multiplier for hero marquees
            const targetScale = Math.min(baseScale + Math.abs(velocity * 0.1), maxScale);

            gsap.to(timelineRef.current, {
                timeScale: targetScale,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });
}
