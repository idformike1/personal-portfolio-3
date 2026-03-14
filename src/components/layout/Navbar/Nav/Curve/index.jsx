import React from 'react'
import { motion } from 'framer-motion';
import styles from './style.module.scss';

export default function Curve() {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  const initialPath = `M100 0 L100 ${height} Q-100 ${height/2} 100 0`
  const targetPath = `M100 0 L100 ${height} Q100 ${height/2} 100 0`

  const curve = {
    initial: {
        d: initialPath
    },
    enter: {
        d: targetPath,
        transition: {duration: 1, ease: [0.76, 0, 0.24, 1]}
    },
    exit: {
        d: initialPath,
        transition: {duration: 0.8, ease: [0.76, 0, 0.24, 1]}
    }
  }

  if (height === 0) return null;

  return (
    <svg className={styles.svgCurve}>
        <motion.path variants={curve} initial="initial" animate="enter" exit="exit"></motion.path>
    </svg>
  )
}
