'use client';
import styles from './style.module.scss';
import { useState } from 'react';
import Project from './Project';
import Modal from './Modal';

const projects = [
  {
    title: "TWICE",
    src: "twice.png",
    color: "#000000"
  },
  {
    title: "The Damai",
    src: "damai.png",
    color: "#8C8C8C"
  },
  {
    title: "FABRIC™",
    src: "fabric.png",
    color: "#EFE8D3"
  },
  {
    title: "Atypikal",
    src: "twice.png", // Reusing for demo
    color: "#706D63"
  }
]

export default function Work() {

  const [modal, setModal] = useState({active: false, index: 0})

  return (
  <main className={styles.main}>
    <div className={styles.body}>
      {
        projects.map( (project, index) => {
          return <Project index={index} title={project.title} manageModal={setModal} key={index}/>
        })
      }
    </div>
    <Modal modal={modal} projects={projects}/>
  </main>
  )
}
