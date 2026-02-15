
"use client";

import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-base-secondary transition-all">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-1">
          <span className="text-3xl font-black text-main tracking-tighter cursor-pointer select-none">
            KiKo
          </span>
        </Link>
        {/* Navigation moved to BottomNav */}
      </div>
    </nav>
  );
}
