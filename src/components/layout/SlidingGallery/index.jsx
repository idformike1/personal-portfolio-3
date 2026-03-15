'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style.module.scss';
import Image from 'next/image';

const slider1 = [
    { src: "twice.png" },
    { src: "damai.png" },
    { src: "fabric.png" },
    { src: "twice.png" }
]

const slider2 = [
    { src: "damai.png" },
    { src: "fabric.png" },
    { src: "twice.png" },
    { src: "damai.png" }
]

export default function SlidingGallery() {
    const container = useRef(null);
    const row1 = useRef(null);
    const row2 = useRef(null);
    const pathRef = useRef(null);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Row 1: Kinetic slide (xPercent: -20)
        gsap.to(row1.current, {
            xPercent: -20,
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Row 2: Kinetic slide (xPercent: 20)
        gsap.to(row2.current, {
            xPercent: 20,
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Directive 2: The Liquid Morph Logic
        const width = window.innerWidth;
        const targetPath = `M0 0 L${width} 0 Q${width / 2} 0 0 0`;
        
        gsap.to(pathRef.current, {
            attr: { d: targetPath },
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "bottom bottom", // Start morphing when gallery hits bottom
                end: "bottom top",    // Finish morphing as it unrolls
                scrub: true
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className={styles.slidingGallery}>
            <div ref={row1} className={styles.slider}>
                {slider1.map((project, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.imageContainer}>
                            <Image 
                                fill={true} 
                                alt={project.src} 
                                src={`/images/${project.src}`} 
                                style={{ objectFit: 'contain' }} 
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            <div ref={row2} className={styles.slider}>
                {slider2.map((project, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.imageContainer}>
                            <Image 
                                fill={true} 
                                alt={project.src} 
                                src={`/images/${project.src}`} 
                                style={{ objectFit: 'contain' }} 
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Directive 2: Morphing SVG */}
            <div className={styles.curveContainer}>
                <svg className={styles.svg} viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 2000} 100`} preserveAspectRatio="none">
                    <path 
                        ref={pathRef}
                        className={styles.path}
                        fill="white"
                        // Initial State: Deep downward curve
                        d={`M0 0 L${typeof window !== 'undefined' ? window.innerWidth : 2000} 0 Q${typeof window !== 'undefined' ? window.innerWidth / 2 : 1000} 150 0 0`}
                    />
                </svg>
            </div>
        </section>
    );
}
