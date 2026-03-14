'use client';
import Transition from '@/components/common/Transition';

export default function Template({ children }) {
    return (
        <Transition>
            <div className="incoming-page">
                {children}
            </div>
        </Transition>
    );
}
