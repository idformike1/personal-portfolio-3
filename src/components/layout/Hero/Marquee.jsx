'use client';
import styles from './Marquee.module.scss';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Marquee() {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  let xPercent = useRef(0);
  let direction = useRef(-1);

  useEffect( () => {
    gsap.registerPlugin(ScrollTrigger);
    let requestAnimationFrameId = null;

    let ctx = gsap.context(() => {
      gsap.to(slider.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          scrub: 0.25,
          start: 0,
          end: window.innerHeight,
          onUpdate: e => direction.current = e.direction * -1
        },
        x: "-500px",
      })
      
      const animateLoop = () => {
        if(xPercent.current < -100){
          xPercent.current = 0;
        }
        else if(xPercent.current > 0){
          xPercent.current = -100;
        }
        gsap.set(firstText.current, {xPercent: xPercent.current})
        gsap.set(secondText.current, {xPercent: xPercent.current})
        xPercent.current += 0.1 * direction.current;
        requestAnimationFrameId = requestAnimationFrame(animateLoop);
      }
      
      requestAnimationFrameId = requestAnimationFrame(animateLoop);
    });

    return () => {
      ctx.revert();
      if (requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
      }
    }
  }, [])

  return (
    <div className={styles.marqueeContainer}>
      <div ref={slider} className={styles.slider}>
        <p ref={firstText}>Freelance Designer -</p>
        <p ref={secondText}>Freelance Designer -</p>
      </div>
    </div>
  )
}
