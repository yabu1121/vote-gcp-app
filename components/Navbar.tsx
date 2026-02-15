
"use client";

import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
      <Link href="/" className="text-3xl font-black text-red-500 tracking-tighter transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer drop-shadow-sm select-none">
        POLL APP!
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* PC向けメニュー */}
        <Link href="/timeline" className="hidden sm:block font-bold text-gray-600 hover:text-red-500 transition-colors px-3 py-2">
          みんなの投票
        </Link>
        <Link href="/search" className="hidden sm:block font-bold text-gray-600 hover:text-red-500 transition-colors px-3 py-2">
          さがす
        </Link>

        {session ? (
          <>
            <Link href="/dashboard" className="hidden sm:block font-bold text-gray-600 hover:text-red-500 transition-colors px-3 py-2">
              マイページ
            </Link>

            <div className="flex items-center gap-3 ml-2">
              {session.user?.image && (
                <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border-2 border-yellow-400" />
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs font-bold text-gray-400 hover:text-red-500 underline"
              >
                Logout
              </button>
            </div>

            <Link href="/create" className="ml-2 px-5 py-2.5 bg-red-500 text-white rounded-full font-bold shadow-lg hover:bg-red-600 hover:scale-105 transition-all active:scale-95 border-b-4 border-red-700 active:border-b-0 active:translate-y-1 text-sm">
              作成
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="px-4 py-2 bg-white text-gray-800 font-bold rounded-full hover:bg-gray-100 transition shadow-sm border-2 border-gray-200 text-sm"
            >
              Login
            </button>
            <Link href="/create" className="ml-2 px-5 py-2.5 bg-red-500 text-white rounded-full font-bold shadow-lg hover:bg-red-600 hover:scale-105 transition-all active:scale-95 border-b-4 border-red-700 active:border-b-0 active:translate-y-1 text-sm">
              作成
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
