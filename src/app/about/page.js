'use client';

export default function AboutPage() {
    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: '#f5f5f5'
        }}>
            <h1 style={{
                fontSize: 'clamp(5rem, 15vw, 18rem)',
                fontWeight: 400,
                lineHeight: 1,
                margin: 0,
                color: '#1c1d20',
                zIndex: 2,
                position: 'relative'
            }}>
                About
            </h1>
            <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                fontWeight: 300,
                color: '#999d9e',
                marginTop: '2rem',
                zIndex: 2,
                position: 'relative'
            }}>
                Freelance Designer &amp; Developer · Based in the Netherlands
            </p>
        </main>
    );
}
