'use client';
import styles from './Marquee.module.scss';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLenis } from '@studio-freight/react-lenis';

export default function Marquee() {
  const container = useRef(null);
  const sliderWrapper = useRef(null);
  const marqueeTl = useRef(null);
  const xPercent = useRef(0);
  const direction = useRef(-1);

  // Velocity Integration (Lenis)
  useLenis(({ velocity }) => {
    if (marqueeTl.current) {
      // Tween timeScale based on absolute velocity
      // Base speed is 1, increases with velocity
      gsap.to(marqueeTl.current, {
        timeScale: 1 + Math.abs(velocity * 0.1),
        duration: 0.5,
        ease: "power2.out"
      });
      
      // Optional: Change direction based on scroll direction
      if (velocity !== 0) {
        direction.current = velocity > 0 ? 1 : -1;
      }
    }
  });

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Initial State: Hidden below
      gsap.set(container.current, { yPercent: 100 });

      // 2. Loop Logic: Twin-Track GSAP Timeline
      marqueeTl.current = gsap.timeline({
        repeat: -1,
        defaults: { ease: "none" }
      });

      // We animate the sliderWrapper xPercent to create the loop
      // Since it has two identical tracks, -100% to 0% creates seamless motion
      marqueeTl.current.to(sliderWrapper.current, {
        xPercent: -100,
        duration: 20, // Base "walking" speed
      });

      // 3. Reveal Sequence: Choreographed with Transition "Hold"
      // Note: In Stage 3, we add a slight delay to sync with the Transition context
      gsap.to(container.current, {
        yPercent: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const marqueeText = "Freelance Designer - Independent Designer & Developer -";

  return (
    <div ref={container} className={styles.marqueeContainer}>
      <div ref={sliderWrapper} className={styles.sliderWrapper}>
        <div className={styles.slider}>
          <p>{marqueeText}</p>
          <p>{marqueeText}</p>
          <p>{marqueeText}</p>
          <p>{marqueeText}</p>
        </div>
        <div className={styles.slider}>
          <p>{marqueeText}</p>
          <p>{marqueeText}</p>
          <p>{marqueeText}</p>
          <p>{marqueeText}</p>
        </div>
      </div>
    </div>
  );
}
