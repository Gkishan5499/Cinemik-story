'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop
    if (window.matchMedia("(max-width: 768px)").matches) return;

    // Set initial position out of view
    gsap.set([cursor.current, follower.current], { x: -100, y: -100, opacity: 0 });

    const onMove = (e: MouseEvent) => {
      // reveal if hidden
      if (cursor.current && gsap.getProperty(cursor.current, "opacity") === 0) {
        gsap.to([cursor.current, follower.current], { opacity: 1, duration: 0.3 });
      }

      gsap.to(cursor.current, { x: e.clientX, y: e.clientY, duration: 0 });
      gsap.to(follower.current, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    };

    const onHover = () => gsap.to(follower.current, { scale: 2.5, borderColor: 'var(--crimson)', duration: 0.3 });
    const onLeave = () => gsap.to(follower.current, { scale: 1, borderColor: 'var(--ash)', duration: 0.3 });

    document.addEventListener('mousemove', onMove);

    // Initial query
    const interactables = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onHover);
      el.addEventListener('mouseleave', onLeave);
    });

    // Observer for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              const newInteractables = node.querySelectorAll('a, button, [data-cursor-hover]');
              newInteractables.forEach(el => {
                el.addEventListener('mouseenter', onHover);
                el.addEventListener('mouseleave', onLeave);
              });
              
              if (node.matches('a, button, [data-cursor-hover]')) {
                node.addEventListener('mouseenter', onHover);
                node.addEventListener('mouseleave', onLeave);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onHover);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <div className="hidden md:block">
      <div ref={cursor} className="cursor-dot" />
      <div ref={follower} className="cursor-ring" />
    </div>
  );
}
