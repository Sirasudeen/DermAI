import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PageWrapper = ({ children }) => {
    const containerRef = useRef();

    useEffect(() => {
        const el = containerRef.current;

        const tl = gsap.timeline({
            defaults: {
                duration: 1,
                ease: 'power4.out',
            },
        });

        tl.fromTo(
            el,
            {
                opacity: 0,
                filter: 'blur(20px)',
                skewY: 7,
                scale: 0.95,
                y: 80,
            },
            {
                opacity: 1,
                filter: 'blur(0px)',
                skewY: 0,
                scale: 1,
                y: 0,
                duration: 1.2,
            }
        );

        tl.to(el, {
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.05)',
            duration: 0.4,
        }, "-=0.6");

        return () => {
            gsap.killTweensOf(el);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                overflow: 'hidden',
                willChange: 'transform, opacity, filter',
            }}
        >
            {children}
        </div>
    );
};

export default PageWrapper;
