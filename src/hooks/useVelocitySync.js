'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useLenis } from '@studio-freight/react-lenis';

/**
 * useVelocitySync Hook
 * Maps Lenis scroll velocity to a GSAP timeline's timeScale.
 * On fast scroll: timeScale surges.
 * After scroll stops: it decays back to baseScale with a power3.out ease.
 * This creates the "heavy" physical feel of the original site.
 */
export default function useVelocitySync(timelineRef, baseScale = 1, maxScale = 8) {
    const decayTween = useRef(null);

    useLenis(({ velocity }) => {
        if (!timelineRef.current) return;

        const absVelocity = Math.abs(velocity);

        if (absVelocity > 0.1) {
            // Kill any decay in progress — a new surge is happening
            if (decayTween.current) decayTween.current.kill();

            const surge = Math.min(baseScale + absVelocity * 0.1, maxScale);

            gsap.to(timelineRef.current, {
                timeScale: surge,
                duration: 0.3,
                ease: 'power2.out',
            });

            // Schedule decay back to baseScale
            decayTween.current = gsap.to(timelineRef.current, {
                timeScale: baseScale,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.3,
            });
        }
    });
}
