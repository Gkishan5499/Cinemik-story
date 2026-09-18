'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const NAV_LINKS = [
  { href: '/story', label: 'STORIES' },
  { href: '/episodes', label: 'EPISODES' },
  { href: '/characters', label: 'CHARACTERS' },
  { href: '/contact', label: 'CONTACT' },
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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (isAdminRoute) return null;

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 flex justify-between items-center px-6 md:px-12 will-change-transform transition-all duration-300 ${
          scrolled
            ? 'py-2.5 bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-[#2596be]/25 shadow-xl shadow-black/50'
            : 'py-3.5 md:py-4 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10'
        }`}
        style={{ zIndex: 100, opacity: 1, visibility: 'visible' }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" data-cursor-hover>
          <Image
            src="/logo.png"
            alt="CINEMIKS Logo"
            width={220}
            height={70}
            className="h-10 md:h-14 w-auto object-contain transition-all duration-300 group-hover:scale-105 filter drop-shadow-[0_0_10px_rgba(37,150,190,0.4)]"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-8 font-manrope text-xs font-semibold tracking-widest text-white/70">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`relative py-1 transition-colors duration-200 group ${
                  isActive ? 'text-[#2596be]' : 'hover:text-white'
                }`}
                data-cursor-hover
              >
                {label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#2596be] to-[#FFC857] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="font-manrope text-xs font-semibold tracking-wider text-white/80 hover:text-[#2596be] px-3 py-1.5 transition-colors uppercase"
                  data-cursor-hover
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/signup"
                  className="font-manrope text-xs font-bold tracking-wider text-white bg-gradient-to-r from-[#2596be] to-[#E63946] hover:from-[#FFC857] hover:to-[#2596be] px-4 py-1.5 rounded-sm transition-all duration-300 shadow-md shadow-[#2596be]/20 uppercase"
                  data-cursor-hover
                >
                  JOIN NOW
                </Link>
              </>
            ) : (
              <>
                {user.role === 'creator' && (
                  <Link
                    href="/dashboard"
                    className="font-manrope text-xs font-semibold tracking-wider text-[#FFC857] hover:text-[#2596be] px-3 py-2 transition-colors uppercase"
                    data-cursor-hover
                  >
                    CREATOR STUDIO
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="font-manrope text-xs font-semibold tracking-wider text-[#E63946] hover:text-[#2596be] px-3 py-2 transition-colors uppercase"
                    data-cursor-hover
                  >
                    ADMIN
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="font-manrope text-xs font-bold tracking-wider text-[#2596be] border border-[#2596be]/40 hover:border-[#2596be] bg-[#2596be]/10 px-4 py-2 rounded-sm transition-all duration-300 uppercase"
                    data-cursor-hover
                  >
                    {user.username}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#0A0A0A] border border-[#2596be]/30 rounded-sm shadow-xl z-50 py-2">
                      {user.role === 'reader' && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            router.push('/creator-setup');
                          }}
                          className="w-full text-left px-4 py-2.5 font-manrope text-xs font-semibold text-[#FFC857] hover:bg-[#2596be]/10 uppercase transition-colors"
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
                        className="w-full text-left px-4 py-2.5 font-manrope text-xs font-semibold text-[#E63946] hover:bg-[#E63946]/10 uppercase transition-colors"
                      >
                        LOGOUT
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white hover:text-[#2596be] transition-colors relative"
            aria-label="Menu"
            onClick={() => setMenuOpen((o) => !o)}
            data-cursor-hover
            style={{ zIndex: 1001 }}
          >
            {menuOpen ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-[#0A0A0A]/98 backdrop-blur-2xl flex flex-col justify-center px-8 gap-6"
          style={{ zIndex: 999 }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-bricolage text-3xl font-bold text-white/90 hover:text-[#2596be] transition-colors uppercase tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          <div className="border-t border-white/10 pt-6 mt-4 flex flex-col gap-4">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="font-manrope text-lg font-semibold text-white/80 hover:text-[#2596be] transition-colors uppercase"
                  onClick={() => setMenuOpen(false)}
                >
                  LOGIN
                </Link>
                <Link
                  href="/auth/signup"
                  className="font-manrope text-lg font-bold text-center text-white bg-gradient-to-r from-[#2596be] to-[#E63946] py-3 rounded-sm uppercase tracking-wider"
                  onClick={() => setMenuOpen(false)}
                >
                  JOIN CINEMIKS
                </Link>
              </>
            ) : (
              <>
                {user.role === 'reader' && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push('/creator-setup');
                    }}
                    className="font-manrope text-lg font-semibold text-left text-[#FFC857] hover:text-[#2596be] uppercase"
                  >
                    BECOME CREATOR
                  </button>
                )}
                {user.role === 'creator' && (
                  <Link
                    href="/dashboard"
                    className="font-manrope text-lg font-semibold text-white/80 hover:text-[#2596be] uppercase"
                    onClick={() => setMenuOpen(false)}
                  >
                    CREATOR DASHBOARD
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="font-manrope text-lg font-semibold text-white/80 hover:text-[#E63946] uppercase"
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
                  className="font-manrope text-lg font-semibold text-left text-[#E63946] uppercase"
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
