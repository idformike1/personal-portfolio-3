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
    const path = useRef(null);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Row 1: xPercent: -20
        gsap.to(row1.current, {
            xPercent: -20,
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Row 2: xPercent: 20
        gsap.to(row2.current, {
            xPercent: 20,
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // SVG Curve "Peel" Logic
        const width = window.innerWidth;
        gsap.to(path.current, {
            attr: { d: `M0 100 Q${width / 2} 100 ${width} 100 L${width} 100 L0 100 Z` },
            scrollTrigger: {
                trigger: container.current,
                start: "bottom bottom",
                end: "bottom top",
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
                            <Image fill={true} alt={project.src} src={`/images/${project.src}`} style={{ objectFit: 'contain' }} />
                        </div>
                    </div>
                ))}
            </div>
            
            <div ref={row2} className={styles.slider}>
                {slider2.map((project, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.imageContainer}>
                            <Image fill={true} alt={project.src} src={`/images/${project.src}`} style={{ objectFit: 'contain' }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.curveContainer}>
                <svg className={styles.svg} viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 2000} 100`}>
                    <path 
                        ref={path}
                        className={styles.path}
                        fill="white"
                        d={`M0 100 Q${typeof window !== 'undefined' ? window.innerWidth / 2 : 1000} 0 ${typeof window !== 'undefined' ? window.innerWidth : 2000} 100 L${typeof window !== 'undefined' ? window.innerWidth : 2000} 100 L0 100 Z`}
                    />
                </svg>
            </div>
        </section>
    );
}
