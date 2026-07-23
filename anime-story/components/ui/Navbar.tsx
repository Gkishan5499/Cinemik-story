'use client';
import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const NAV_LINKS = [
  { href: '/story', label: 'STORY' },
  { href: '/characters', label: 'CHARACTERS' },
  { href: '/episodes', label: 'EPISODES' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const { user, logout, becomeCreator } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useGSAP(() => {
    if (!navRef.current) return;
    
    // Simple animation on first page load
    const preloaderRan = sessionStorage.getItem('preloader_shown');
    
    // Only animate on first load when preloader shows
    if (!preloaderRan) {
      gsap.from(navRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 2.8,
      });
    }
  }, { scope: navRef });

  if (isAdminRoute) return null;

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 flex justify-between items-center px-6 md:px-12 will-change-transform transition-all duration-500 ${scrolled
            ? 'py-3 bg-ink/98 backdrop-blur-3xl border-b border-crimson/20 shadow-lg'
            : 'py-5 bg-ink/85 backdrop-blur-2xl border-b border-crimson/15'
          }`}
        style={{ zIndex: 50, opacity: 1, visibility: 'visible' }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" data-cursor-hover>
          <div className="w-0.75 h-6 bg-crimson group-hover:h-8 transition-all duration-300" />
          <span className="font-display text-xl md:text-2xl tracking-[0.2em] text-ash group-hover:text-white transition-colors">
            Anime Story
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 font-mono text-xs tracking-widest text-ash/60">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`relative py-1 transition-colors duration-200 group ${isActive ? 'text-white' : 'hover:text-white'}`}
                data-cursor-hover
              >
                {label}
                <span className={`absolute bottom-0 left-0 h-px bg-crimson transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA + Auth + mobile menu */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="font-mono text-[10px] tracking-[0.2em] uppercase text-crimson/80 hover:text-crimson px-3 py-2 transition-colors"
                  data-cursor-hover
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/signup"
                  className="font-mono text-[10px] tracking-[0.2em] uppercase border border-crimson/50 hover:border-crimson text-crimson px-4 py-2 transition-all duration-300 hover:bg-crimson/10"
                  data-cursor-hover
                >
                  SIGN UP
                </Link>
              </>
            ) : (
              <>
                {user.role === 'creator' && (
                  <Link
                    href="/dashboard"
                    className="font-mono text-[10px] tracking-[0.2em] uppercase text-crimson/80 hover:text-crimson px-3 py-2 transition-colors"
                    data-cursor-hover
                  >
                    DASHBOARD
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="font-mono text-[10px] tracking-[0.2em] uppercase text-crimson/80 hover:text-crimson px-3 py-2 transition-colors"
                    data-cursor-hover
                  >
                    ADMIN
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="font-mono text-[10px] tracking-[0.2em] uppercase border border-crimson/50 hover:border-crimson text-crimson px-4 py-2 transition-all duration-300 hover:bg-crimson/10"
                    data-cursor-hover
                  >
                    {user.username}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-ink/98 border border-crimson/30 rounded shadow-lg z-50">
                      {user.role === 'reader' && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            router.push('/creator-setup');
                          }}
                          className="w-full text-left px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-crimson hover:bg-crimson/10 uppercase"
                        >
                          BECOME CREATOR
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          router.push('/');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-crimson hover:bg-crimson/10 uppercase"
                      >
                        LOGOUT
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-ash hover:text-crimson transition-colors relative"
            aria-label="Menu"
            onClick={() => setMenuOpen((o) => !o)}
            data-cursor-hover
            style={{ zIndex: 1001 }}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="square" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="square" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 bg-ink/98 backdrop-blur-2xl flex flex-col justify-center px-10 gap-8"
          style={{ zIndex: 999 }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-display text-4xl text-ash/80 hover:text-crimson transition-colors uppercase tracking-tight"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          
          {/* Mobile Auth Links */}
          <div className="border-t border-crimson/20 pt-8">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="block font-display text-2xl text-ash/80 hover:text-crimson transition-colors uppercase tracking-tight mb-4"
                  onClick={() => setMenuOpen(false)}
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/signup"
                  className="block font-display text-2xl text-crimson/80 hover:text-crimson transition-colors uppercase tracking-tight"
                  onClick={() => setMenuOpen(false)}
                >
                  SIGN UP
                </Link>
              </>
            ) : (
              <>
                {user.role === 'reader' && (
                  <button
                    onClick={async () => {
                      try {
                        await becomeCreator();
                        setMenuOpen(false);
                        router.push('/dashboard');
                      } catch {
                        setMenuOpen(false);
                      }
                    }}
                    className="block font-display text-2xl text-ash/80 hover:text-crimson transition-colors uppercase tracking-tight mb-4"
                  >
                    BECOME CREATOR
                  </button>
                )}
                {user.role === 'creator' && (
                  <Link
                    href="/dashboard"
                    className="block font-display text-2xl text-ash/80 hover:text-crimson transition-colors uppercase tracking-tight mb-4"
                    onClick={() => setMenuOpen(false)}
                  >
                    DASHBOARD
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block font-display text-2xl text-ash/80 hover:text-crimson transition-colors uppercase tracking-tight mb-4"
                    onClick={() => setMenuOpen(false)}
                  >
                    ADMIN PANEL
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                    setMenuOpen(false);
                  }}
                  className="block font-display text-2xl text-crimson/80 hover:text-crimson transition-colors uppercase tracking-tight"
                >
                  LOGOUT
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
