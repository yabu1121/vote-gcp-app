
"use client";

import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-yellow-50 font-sans text-gray-800 selection:bg-red-200">
      {/* Navbar - Playful & Bold */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="text-3xl font-black text-red-500 tracking-tighter transform -rotate-2 hover:rotate-0 transition-transform cursor-default drop-shadow-sm select-none">
          POLL APP!
        </div>
        <div className="flex items-center gap-4">
          <Link href="/timeline" className="hidden sm:block font-bold text-gray-600 hover:text-red-500 transition-colors border-b-2 border-transparent hover:border-red-500">
            みんなの投票を見る
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-bold text-sm text-gray-700">
                {session.user?.name}
              </span>
              {session.user?.image && (
                <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border-2 border-yellow-400" />
              )}
              <button
                onClick={() => signOut()}
                className="text-xs font-bold text-gray-500 hover:text-red-500 underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="px-4 py-2 bg-white text-gray-800 font-bold rounded-full hover:bg-gray-100 transition shadow-sm border-2 border-gray-200 text-sm"
            >
              Login
            </button>
          )}

          <Link href="/create" className="px-6 py-3 bg-red-500 text-white rounded-full font-bold shadow-lg hover:bg-red-600 hover:scale-105 transition-all active:scale-95 border-b-4 border-red-700 active:border-b-0 active:translate-y-1">
            投票を作る！
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-6 text-center max-w-4xl mx-auto relative">
        {/* Decorative Circles */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-300 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute top-40 right-10 w-16 h-16 bg-red-300 rounded-full opacity-50 animate-pulse"></div>

        <div className="inline-block px-6 py-2 mb-6 rounded-full bg-white border-4 border-yellow-300 text-yellow-600 font-black text-sm tracking-wide shadow-sm transform hover:scale-105 transition -rotate-1">
          🔑 ログイン不要！5秒でスタート！
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight tracking-tighter drop-shadow-sm">
          みんなの声を<br />
          <span className="text-red-500 relative inline-block transform rotate-1">
            きこう！！
            <svg className="absolute w-full h-4 -bottom-2 left-0 text-yellow-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto font-bold leading-relaxed">
          面倒な登録は一切なし。<br className="hidden md:block" />
          今すぐアンケートを作って、友達や同僚にシェアしよう。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4">
          <Link
            href="/create"
            className="w-full sm:w-auto px-10 py-5 bg-red-500 text-white text-xl font-black rounded-2xl hover:bg-red-600 transition-all shadow-[0_6px_0_rgb(185,28,28)] hover:shadow-[0_3px_0_rgb(185,28,28)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] border-2 border-red-600 group flex items-center justify-center gap-2"
          >
            今すぐ投票を作る！
            <span className="group-hover:translate-x-1 transition-transform">🚀</span>
          </Link>
          <Link
            href="/timeline"
            className="w-full sm:w-auto px-10 py-5 bg-yellow-400 text-yellow-900 text-xl font-black rounded-2xl hover:bg-yellow-300 transition-all shadow-[0_6px_0_rgb(202,138,4)] hover:shadow-[0_3px_0_rgb(202,138,4)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] border-2 border-yellow-500"
          >
            一覧を見る 👀
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white px-6 border-t-8 border-dashed border-red-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4 transform -rotate-1">
              <span className="bg-yellow-200 px-4 py-1 inline-block rounded-lg shadow-sm border-2 border-yellow-400 text-yellow-800">POLL APP</span> のすごいところ
            </h2>
            <p className="text-gray-500 font-bold mt-4">とにかくシンプル！</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-yellow-50 p-8 rounded-3xl border-4 border-yellow-200 hover:border-red-400 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-md transform rotate-3 border-2 border-yellow-100">
                ⚡
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-3">爆速作成</h3>
              <p className="text-gray-600 font-bold leading-relaxed">
                ログイン不要！<br />
                思いついたら5秒で作成。<br />
                すぐにURLを友達にシェア。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-red-50 p-8 rounded-3xl border-4 border-red-200 hover:border-yellow-400 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-md transform -rotate-3 border-2 border-red-100">
                🎈
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-3">誰でもかんたん</h3>
              <p className="text-gray-600 font-bold leading-relaxed">
                難しい設定はゼロ。<br />
                タイトルと選択肢を入れるだけ。<br />
                直感的に使えます。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-blue-50 p-8 rounded-3xl border-4 border-blue-200 hover:border-red-400 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-md transform rotate-2 border-2 border-blue-100">
                📈
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-3">リアルタイム集計</h3>
              <p className="text-gray-600 font-bold leading-relaxed">
                投票結果はすぐにグラフ化。<br />
                みんなの意見がひと目で<br />
                わかります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center mt-12 border-t-8 border-yellow-400">
        <div className="text-3xl font-black text-yellow-400 mb-4 tracking-widest hover:text-red-400 transition-colors cursor-default">POLL APP!</div>
        <p className="text-gray-300 font-medium mb-8 text-sm">
          Login-free Simple Polling Service 🚀
        </p>
        <p className="text-gray-600 text-xs font-bold">
          © 2026 Poll App.
        </p>
      </footer>
    </div>
  );
}