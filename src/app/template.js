'use client';
import Transition from '@/components/common/Transition';

export default function Template({ children }) {
    return (
        <Transition>
            {children}
        </Transition>
    );
}
