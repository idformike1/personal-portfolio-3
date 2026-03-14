'use client';
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';

export default function Magnetic({children}) {
    const magnetic = useRef(null);

    useEffect( () => {
        const mEl = magnetic.current;
        if (!mEl) return;

        let ctx = gsap.context(() => {
            const xTo = gsap.quickTo(mEl, "x", {duration: 1, ease: "elastic.out(1, 0.3)"})
            const yTo = gsap.quickTo(mEl, "y", {duration: 1, ease: "elastic.out(1, 0.3)"})

            const mouseMove = (e) => {
                const { clientX, clientY } = e;
                const {height, width, left, top} = mEl.getBoundingClientRect();
                const x = clientX - (left + width/2)
                const y = clientY - (top + height/2)
                xTo(x * 0.35);
                yTo(y * 0.35);
            }

            const mouseLeave = (e) => {
                xTo(0);
                yTo(0);
            }

            mEl.addEventListener("mousemove", mouseMove)
            mEl.addEventListener("mouseleave", mouseLeave)

            return () => {
                if (mEl) {
                    mEl.removeEventListener("mousemove", mouseMove)
                    mEl.removeEventListener("mouseleave", mouseLeave)
                }
            }
        });

        return () => ctx.revert();
    }, [])

    return (
        React.cloneElement(children, {ref: magnetic})
    )
}
