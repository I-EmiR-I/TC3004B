'use client';

import { useAuth } from '@/lib/auth';
import { LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Acerca', href: '/about' },
    ...(isAuthenticated
      ? [
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Perfil', href: '/profile' },
        ]
      : []),
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Menu className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">MyApp</span>
            </Link>
            <div className="ml-10 hidden space-x-8 md:flex">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium ${
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                className="flex items-center"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="default">Iniciar Sesión</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}