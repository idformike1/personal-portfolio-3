'use client';
import InfiniteMarquee from '@/components/common/InfiniteMarquee';
import Work from '@/components/layout/Work';

export default function WorkPage() {
    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#f5f5f5'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 'clamp(8rem, 15vh, 15rem)',
                paddingBottom: '4rem'
            }}>
                <h1 style={{
                    fontSize: 'clamp(4rem, 12vw, 14rem)',
                    fontWeight: 400,
                    lineHeight: 1,
                    margin: 0,
                    color: '#1c1d20'
                }}>
                    Work
                </h1>
            </div>
            <Work />
        </main>
    );
}
