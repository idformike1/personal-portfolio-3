'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style.module.scss';

gsap.registerPlugin(ScrollTrigger);

const ScrollTransition = ({ 
    frameCount = 60, // Default to 60 frames if not specified
    basePath = '/animations/transition/',
    fileNamePrefix = 'frame_',
    fileExtension = 'webp' // Highly recommended for performance
}) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [images, setImages] = useState([]);
    
    // Technical refs for "Snellenberg" Physics
    const state = useRef({
        targetProgress: 0,
        currentProgress: 0,
        currentFrame: 0,
        lastFrame: -1
    });

    // 1. Preload Images
    useEffect(() => {
        const loadedImages = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Assuming 1-based indexing with padding (e.g., frame_0001.webp)
            const paddedIndex = i.toString().padStart(4, '0');
            img.src = `${basePath}${fileNamePrefix}${paddedIndex}.${fileExtension}`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    console.log('All frames loaded');
                    // Initial render of first frame
                    renderFrame(0);
                }
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, [frameCount, basePath, fileNamePrefix, fileExtension]);

    // 2. Initialize Canvas & Scroll Mapping
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        contextRef.current = context;

        // Resize logic to ensure "Cover" behavior
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(state.current.currentFrame);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // ScrollTrigger Mapping
        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                state.current.targetProgress = self.progress;
            }
        });

        // Loop for Lerp (The Snellenberg "Heavy/Fluid" Signature)
        let animationId;
        const loop = () => {
            // Lerp physics: 0.1 factor as requested
            state.current.currentProgress += (state.current.targetProgress - state.current.currentProgress) * 0.1;
            
            // Map progress to frame index
            const frameIndex = Math.min(
                frameCount - 1, 
                Math.floor(state.current.currentProgress * frameCount)
            );

            if (frameIndex !== state.current.lastFrame) {
                renderFrame(frameIndex);
                state.current.lastFrame = frameIndex;
                state.current.currentFrame = frameIndex;
            }

            animationId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener('resize', handleResize);
            st.kill();
            cancelAnimationFrame(animationId);
        };
    }, [images, frameCount]);

    const renderFrame = (index) => {
        if (!contextRef.current || !images[index]) return;

        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        const img = images[index];

        // Draw Image - Aspect Ratio Cover logic
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let dWidth, dHeight, dx, dy;

        if (imgRatio > canvasRatio) {
            dHeight = canvas.height;
            dWidth = dHeight * imgRatio;
            dx = (canvas.width - dWidth) / 2;
            dy = 0;
        } else {
            dWidth = canvas.width;
            dHeight = dWidth / imgRatio;
            dx = 0;
            dy = (canvas.height - dHeight) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, dx, dy, dWidth, dHeight);
    };

    return (
        <div ref={containerRef} className={styles.scrollContainer}>
            <div className={styles.stickyWrapper}>
                <canvas ref={canvasRef} className={styles.animationCanvas} />
                <div className={styles.overlay}>
                    <slot /> {/* Allow for text overlays */}
                </div>
            </div>
        </div>
    );
};

export default ScrollTransition;
