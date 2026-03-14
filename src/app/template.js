'use client';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Transition from '@/components/common/Transition';

export default function Template({ children }) {
    const pathname = usePathname();
    const contentRef = useRef(null);

    useGSAP(() => {
        if (!contentRef.current) return;

        // Parallax Reveal: Content slides up as the transition overlay exits
        // Using a delay to match the Transition component's "Hold" phase
        gsap.fromTo(contentRef.current, 
            { y: 100 }, 
            { 
                y: 0, 
                duration: 0.8, 
                ease: "power4.inOut",
                delay: 1.2 // Delay = Entry (0.8) + Hold Text Reveal (0.4) roughly
            }
        );
    }, [pathname]);

    return (
        <Transition>
            <div ref={contentRef}>
                {children}
            </div>
        </Transition>
    );
}
