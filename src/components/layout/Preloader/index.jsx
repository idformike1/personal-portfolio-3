'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './style.module.scss';

const words = ["Hello", "Bonjour", "Ciao", "Olà", "Schalom", "Hallo", "नमस्ते", "Hello"];

export default function Preloader({ finishLoading }) {
    const [index, setIndex] = useState(0);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const [hasSeenIntro, setHasSeenIntro] = useState(true);
    
    const container = useRef(null);
    const path = useRef(null);

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

    // Word roll logic
    useEffect(() => {
        if (!isMounted || hasSeenIntro) return;
        if (index === words.length - 1) return;
        const timer = setTimeout(() => {
            setIndex(index + 1);
        }, index === 0 ? 1000 : 150);
        return () => clearTimeout(timer);
    }, [index, isMounted, hasSeenIntro]);

    // Master GSAP Exit Timeline
    useGSAP(() => {
        if (!isMounted || hasSeenIntro || index !== words.length - 1) return;

        const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
        const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

        const tl = gsap.timeline({
            delay: 0.2,
            onComplete: () => {
                sessionStorage.setItem('seenIntro', 'true');
                document.body.style.overflow = 'auto';
                if (finishLoading) finishLoading();
            }
        });

        tl.set(container.current, { pointerEvents: "all" })
          .to(container.current, {
              yPercent: -100,
              duration: 0.8,
              ease: "power4.inOut"
          })
          .to(path.current, {
              attr: { d: targetPath },
              duration: 0.8,
              ease: "power4.inOut"
          }, "<")
          .set(container.current, { pointerEvents: "none" }); // Fail-safe frame

    }, { dependencies: [index, isMounted, hasSeenIntro, dimension], scope: container });

    if (!isMounted || hasSeenIntro) return null;

    const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;

    return (
        <div 
            ref={container} 
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
                        <path ref={path} d={initialPath}></path>
                    </svg>
                </>
            )}
        </div>
    );
}
