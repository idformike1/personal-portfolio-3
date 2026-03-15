'use client';
import styles from './style.module.scss';
import { useState } from 'react';
import Project from './Project';
import Modal from './Modal';
import Rounded from '@/components/common/RoundedButton';

const projects = [
  {
    title: 'TWICE',
    src: 'twice.png',
    color: '#000000'
  },
  {
    title: 'The Damai',
    src: 'damai.png',
    color: '#8C8C8C'
  },
  {
    title: 'FABRIC™',
    src: 'fabric.png',
    color: '#EFE8D3'
  },
  {
    title: 'Atypikal',
    src: 'twice.png',
    color: '#706D63'
  }
];

export default function Work() {
  const [modal, setModal] = useState({ active: false, index: 0 });

  return (
    <main className={styles.main}>
      <div className={styles.body}>
        {projects.map((project, index) => (
          <Project
            index={index}
            title={project.title}
            manageModal={(active, index) => setModal({ active, index })}
            key={index}
          />
        ))}
      </div>
      {/* "More work" button — matches original */}
      <div className={styles.moreWork}>
        <Rounded>
          <p>More work <sup>{projects.length}</sup></p>
        </Rounded>
      </div>
      <Modal modal={modal} projects={projects} />
    </main>
  );
}
