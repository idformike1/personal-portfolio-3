'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style.module.scss';
import RoundedButton from '@/components/common/RoundedButton';

export default function Description() {
    const container = useRef(null);
    const textRef = useRef(null);
    
    const lines = [
        "Helping brands to stand out in the digital",
        "era. Together we will set the new status quo.",
        "No nonsense, always on the cutting edge."
    ];

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (textRef.current) {
            const lineInner = textRef.current.querySelectorAll(`.${styles.lineInner}`);
            
            gsap.from(lineInner, {
                yPercent: 100,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top bottom-=100",
                    toggleActions: "play none none reverse",
                }
            });
        }
    }, { scope: container });

    return (
        <section ref={container} className={styles.description}>
            <div className={styles.wrapper}>
                <div ref={textRef} className={styles.mainText}>
                    {lines.map((line, i) => (
                        <div key={i} className={styles.lineMask}>
                            <span className={styles.lineInner}>{line}</span>
                        </div>
                    ))}
                </div>
                
                <div className={styles.sideContent}>
                    <p className={styles.secondaryText}>
                        The combination of my passion for design, code & interaction positions me in a unique place in the web design world.
                    </p>
                    <div className={styles.buttonContainer}>
                        <RoundedButton className={styles.button}>
                            <p>About me</p>
                        </RoundedButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
