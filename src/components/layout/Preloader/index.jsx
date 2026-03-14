'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './style.module.scss';

const words = ["Hello", "Bonjour", "Ciao", "Olà", "Schalom", "Hallo", "नमस्ते", "Hello"];

export default function Preloader({ finishLoading }) {
    const [index, setIndex] = useState(0);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const [hasSeenIntro, setHasSeenIntro] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        const seen = sessionStorage.getItem('seenIntro');
        if (seen) {
            setHasSeenIntro(true);
            if (finishLoading) finishLoading();
        } else {
            setHasSeenIntro(false);
            document.body.style.overflow = 'hidden';
            setDimension({ width: window.innerWidth, height: window.innerHeight });
        }
    }, []);

    useEffect(() => {
        if (!isMounted || hasSeenIntro) return;
        if (index === words.length - 1) return;
        const timer = setTimeout(() => {
            setIndex(index + 1);
        }, index === 0 ? 1000 : 150);
        return () => clearTimeout(timer);
    }, [index, isMounted, hasSeenIntro]);

    const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
    const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

    const curve = {
        initial: {
            d: initialPath,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
        },
        exit: {
            d: targetPath,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
        }
    };

    if (!isMounted || hasSeenIntro) return null;

    return (
        <motion.div
            variants={{
                initial: { top: 0 },
                exit: { 
                    top: "-100vh",
                    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
                }
            }}
            initial="initial"
            exit="exit"
            onAnimationComplete={() => {
                sessionStorage.setItem('seenIntro', 'true');
                document.body.style.overflow = 'auto';
                if (finishLoading) finishLoading();
            }}
            className={styles.introduction}
            style={{ zIndex: 999 }}
        >
            {dimension.width > 0 && (
                <>
                    <motion.p
                        variants={{
                            initial: { opacity: 0 },
                            enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } }
                        }}
                        initial="initial"
                        animate="enter"
                    >
                        <span></span>
                        {words[index]}
                    </motion.p>
                    <svg>
                        <motion.path
                            variants={curve}
                            initial="initial"
                            exit="exit"
                        ></motion.path>
                    </svg>
                </>
            )}
        </motion.div>
    );
}
