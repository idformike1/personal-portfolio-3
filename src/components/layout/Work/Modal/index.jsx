'use client';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import styles from './style.module.scss';

const scaleAnimation = {
    initial: {scale: 0, x: "-50%", y: "-50%"},
    enter: {scale: 1, x: "-50%", y: "-50%", transition: {duration: 0.4, ease: [0.76, 0, 0.24, 1]}},
    closed: {scale: 0, x: "-50%", y: "-50%", transition: {duration: 0.4, ease: [0.32, 0, 0.67, 0]}}
}

export default function Modal({modal, projects}) {
  const { active, index } = modal;
  const modalContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);

  useEffect( () => {
    let ctx = gsap.context(() => {
      //Move Container
      let xMoveContainer = gsap.quickTo(modalContainer.current, "left", {duration: 0.6, ease: "power3"});
      let yMoveContainer = gsap.quickTo(modalContainer.current, "top", {duration: 0.6, ease: "power3"});
      //Move cursor
      let xMoveCursor = gsap.quickTo(cursor.current, "left", {duration: 0.4, ease: "power3"});
      let yMoveCursor = gsap.quickTo(cursor.current, "top", {duration: 0.4, ease: "power3"});
      //Move cursor label
      let xMoveCursorLabel = gsap.quickTo(cursorLabel.current, "left", {duration: 0.35, ease: "power3"});
      let yMoveCursorLabel = gsap.quickTo(cursorLabel.current, "top", {duration: 0.35, ease: "power3"});

      const moveItems = (x, y) => {
        xMoveContainer(x)
        yMoveContainer(y)
        xMoveCursor(x)
        yMoveCursor(y)
        xMoveCursorLabel(x)
        yMoveCursorLabel(y)
      }

      const mouseMoveHandler = (e) => {
        const { clientX, clientY } = e;
        moveItems(clientX, clientY)
      }

      window.addEventListener('mousemove', mouseMoveHandler)
      
      // Sliding track animation
      gsap.to(modalContainer.current.firstChild, {
        top: index * -100 + "%",
        duration: 0.5,
        ease: "power2.inOut"
      })

      // Cleanup on unmount/re-run
      return () => {
        window.removeEventListener('mousemove', mouseMoveHandler);
      }
    });

    return () => ctx.revert();
  }, [index])

  return (
    <>
        <motion.div ref={modalContainer} variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"} className={styles.modalContainer}>
            <div className={styles.modalSlider}>
            {
                projects.map( (project, index) => {
                const { src, color } = project
                return <div className={styles.modal} key={`modal_${index}`}>
                    <Image 
                    src={`/images/${src}`}
                    width={300}
                    height={0}
                    alt="image"
                    />
                </div>
                })
            }
            </div>
        </motion.div>
        <motion.div ref={cursor} className={styles.cursor} variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"}></motion.div>
        <motion.div ref={cursorLabel} className={styles.cursorLabel} variants={scaleAnimation} initial="initial" animate={active ? "enter" : "closed"}>View</motion.div>
    </>
  )
}
