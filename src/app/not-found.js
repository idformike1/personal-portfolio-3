import Link from 'next/link';

export default function NotFound() {
  return (
    <section style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: 'clamp(5rem, 15vw, 18rem)', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginTop: '-2rem', opacity: 0.6 }}>Page not found.</p>
      <Link href="/" style={{ marginTop: '2rem', padding: '1rem 2rem', border: '1px solid currentColor', borderRadius: '3rem' }}>
        Return Home
      </Link>
    </section>
  );
}
