import React from 'react'
import { motion, usePresence } from 'framer-motion';
import styles from './style.module.scss';
import gsap from 'gsap';

export default function Curve() {
  const [height, setHeight] = React.useState(0);
  const path = React.useRef(null);
  const [isPresent, safeToRemove] = usePresence();

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  React.useEffect(() => {
    if (height > 0) {
      const initialPath = `M100 0 L100 ${height} Q-100 ${height/2} 100 0`
      const targetPath = `M100 0 L100 ${height} Q100 ${height/2} 100 0`

      let ctx = gsap.context(() => {
        if (isPresent) {
          gsap.set(path.current, { attr: { d: initialPath } });
          gsap.to(path.current, {
            attr: { d: targetPath },
            duration: 1,
            ease: "elastic.out(1, 0.3)"
          });
        } else {
          gsap.to(path.current, {
            attr: { d: initialPath },
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: safeToRemove
          });
        }
      });

      return () => ctx.revert();
    }
  }, [height, isPresent]);

  if (height === 0) return null;

  return (
    <svg className={styles.svgCurve}>
        <path ref={path}></path>
    </svg>
  )
}
