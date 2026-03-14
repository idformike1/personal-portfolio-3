'use client';
import Transition from '@/components/common/Transition';

export default function Template({ children }) {
    return (
        <Transition>
            <div className="motion-wrapper">
                {children}
            </div>
        </Transition>
    );
}
