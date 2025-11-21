'use client';

import React from 'react';
import Link from 'next/link';
import { Home, User, BarChart2, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
      { icon: Home, label: 'Home', href: '/' },
      { icon: User, label: 'Profile', href: '/profile/me' }, // Placeholder 'me' or logic to get last searched
      { icon: BarChart2, label: 'Stats', href: '/stats' },
];

export default function Sidebar() {
      const pathname = usePathname();

      return (
            <aside className="w-64 bg-black h-screen flex flex-col p-6 fixed left-0 top-0 border-r border-white/5">
                  <div className="mb-10 flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                              <span className="font-bold text-black">P</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Poro Wrapped</h1>
                  </div>

                  <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                              const isActive = pathname === item.href;
                              return (
                                    <Link
                                          key={item.href}
                                          href={item.href}
                                          className={cn(
                                                "flex items-center gap-4 px-4 py-3 rounded-lg transition-colors font-medium",
                                                isActive
                                                      ? "bg-white/10 text-white"
                                                      : "text-muted hover:text-white hover:bg-white/5"
                                          )}
                                    >
                                          <item.icon size={22} />
                                          <span>{item.label}</span>
                                    </Link>
                              );
                        })}
                  </nav>

                  <div className="mt-auto pt-6 border-t border-white/5">
                        <Link
                              href="/settings"
                              className="flex items-center gap-4 px-4 py-3 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors font-medium"
                        >
                              <Settings size={22} />
                              <span>Settings</span>
                        </Link>
                  </div>
            </aside>
      );
}
