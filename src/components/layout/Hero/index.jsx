'use client';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style.module.scss';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <Image 
                    src="/images/hero_portrait.png"
                    fill={true}
                    alt="Hero Portrait"
                    priority={true}
                    quality={100}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.copy}>
                    <p>Independent</p>
                    <p>Designer & Developer</p>
                </div>
            </div>
        </section>
    );
}
