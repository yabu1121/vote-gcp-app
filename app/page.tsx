
"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-base-primary text-text font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-conversation rounded-full blur-3xl opacity-60 animate-[pulse_8s_infinite]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-accent/20 rounded-full blur-3xl opacity-50 animate-[pulse_10s_infinite_reverse]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center z-10 relative">
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white border border-main/20 text-main text-sm font-bold mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            新機能: トレンド & いいね機能がつきました！
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-text tracking-tighter mb-8 leading-[1.1] drop-shadow-sm">
            その迷い、 <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-main to-purple-500">
              みんなに聞いてみない？
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-middle-gray font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
            今日のランチから人生の選択まで。<br />
            タップひとつで、みんなの意見が集まります。
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
            {session ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-main text-white rounded-full font-bold text-lg shadow-xl shadow-main/30 hover:shadow-main/50 hover:-translate-y-1 transition-all active:scale-95 w-full sm:w-auto min-w-[200px]"
              >
                マイページへ
              </Link>
            ) : (
              <button
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="px-8 py-4 bg-main text-white rounded-full font-bold text-lg shadow-xl shadow-main/30 hover:shadow-main/50 hover:-translate-y-1 transition-all active:scale-95 w-full sm:w-auto min-w-[200px]"
              >
                あとで登録する
              </button>
            )}
            <Link
              href="/timeline"
              className="px-8 py-4 bg-white text-dark-gray border-2 border-base-secondary rounded-full font-bold text-lg hover:bg-base-primary hover:border-main/20 hover:text-main transition-all w-full sm:w-auto min-w-[200px]"
            >
              みんなの投票を見る
            </Link>
          </div>

          <div className="relative max-w-4xl mx-auto mt-8 transform hover:scale-[1.02] transition-transform duration-700">
            <div className="absolute inset-0 bg-gradient-to-t from-base-primary via-transparent to-transparent z-10"></div>
            <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-main/20 border-4 border-white ring-4 ring-base-secondary/50 overflow-hidden">
              <div className="bg-base-primary rounded-[2rem] p-8 md:p-12 overflow-hidden relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-md">P</div>
                      <div>
                        <div className="h-2 w-24 bg-dark-gray/10 rounded-full mb-1"></div>
                        <div className="h-2 w-16 bg-dark-gray/10 rounded-full"></div>
                      </div>
                    </div>
                    <div className="h-8 w-3/4 bg-dark-gray rounded-lg opacity-80 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-12 w-full bg-white rounded-xl shadow-sm border border-base-secondary/50 flex items-center px-4">
                        <div className="w-4 h-4 rounded-full border-2 border-main/30 mr-3"></div>
                        <div className="h-2 w-32 bg-dark-gray/10 rounded-full"></div>
                      </div>
                      <div className="h-12 w-full bg-conversation border-2 border-main rounded-xl shadow-sm flex items-center px-4 relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-[70%] bg-main/10"></div>
                        <div className="w-4 h-4 rounded-full border-4 border-main mr-3 relative z-10"></div>
                        <div className="h-2 w-40 bg-main rounded-full relative z-10"></div>
                        <span className="ml-auto font-bold text-main z-10">70%</span>
                      </div>
                      <div className="h-12 w-full bg-white rounded-xl shadow-sm border border-base-secondary/50 flex items-center px-4">
                        <div className="w-4 h-4 rounded-full border-2 border-main/30 mr-3"></div>
                        <div className="h-2 w-24 bg-dark-gray/10 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-base-secondary rotate-3 hover:rotate-0 transition-transform duration-500">
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-black text-dark-gray">Analysis</span>
                        <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded-full">Live</span>
                      </div>
                      <div className="flex items-end justify-between gap-2 h-32 px-4 pb-4 border-b border-base-secondary mb-4">
                        <div className="w-full bg-main/20 rounded-t-lg h-[40%] relative group"><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">40</div></div>
                        <div className="w-full bg-main rounded-t-lg h-[80%] relative group shadow-lg shadow-main/30"><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">80</div></div>
                        <div className="w-full bg-accent rounded-t-lg h-[60%] relative group"><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">60</div></div>
                        <div className="w-full bg-main/20 rounded-t-lg h-[30%] relative group"><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">30</div></div>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-middle-gray">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-dark-gray mb-6">迷いを確信に変える機能</h2>
            <p className="text-middle-gray font-bold max-w-2xl mx-auto">
              シンプルだけど、頼りになる。あなたの「知りたい」をサポートします。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-base-primary rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-main shadow-md mb-6">
                {/* Search Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-dark-gray mb-3">トレンド探索</h3>
              <p className="text-middle-gray font-medium leading-relaxed">
                今、みんなが気にしていることは？話題のアンケートがすぐに見つかります。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-base-primary rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-main shadow-md mb-6">
                {/* Lightning Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-dark-gray mb-3">リアルタイム集計</h3>
              <p className="text-middle-gray font-medium leading-relaxed">
                投票した瞬間、グラフが動く。みんなの声がリアルタイムで形になります。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-base-primary rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-main shadow-md mb-6">
                {/* Heart Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-dark-gray mb-3">いいね機能</h3>
              <p className="text-middle-gray font-medium leading-relaxed">
                「面白い！」と思ったらハートをタップ。人気のアンケートはランキングで注目の的に。
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-base-primary rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-main shadow-md mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-dark-gray mb-3">ダッシュボード</h3>
              <p className="text-middle-gray font-medium leading-relaxed">
                あなたの質問への反応を一目でチェック。参加人数の推移もグラフでわかります。
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-base-primary rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-main shadow-md mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-dark-gray mb-3">スマホでもPCでも</h3>
              <p className="text-middle-gray font-medium leading-relaxed">
                いつでもどこでも、サクサク投票できます。
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-main to-purple-500 rounded-[2rem] p-8 text-white shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center items-center text-center">
              <Link href="/timeline" className="px-6 py-2 bg-white text-main rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors">
                体験してみる
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-base-primary text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-conversation rounded-full blur-3xl opacity-40"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-dark-gray mb-6 tracking-tight">
            さあ、聞いてみよう。
          </h2>
          <p className="text-xl font-bold text-middle-gray mb-10 max-w-2xl mx-auto">
            あなたの毎日を、もっとスムーズに。<br />
            まずはみんなの投票を見てみませんか？
          </p>
          <Link
            href="/create"
            className="inline-block px-10 py-5 bg-main text-white rounded-full font-bold text-xl shadow-xl shadow-main/30 hover:shadow-main/50 hover:-translate-y-1 transition-all active:scale-95"
          >
            アンケートを作る
          </Link>
        </div>
      </section>

      <footer className="py-12 bg-white text-center border-t border-base-secondary">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-80">
          <span className="text-2xl font-black text-main tracking-tighter">KiKo</span>
        </div>
        <p className="text-xs font-bold text-middle-gray">
          © {new Date().getFullYear()} KiKo. All rights reserved.
        </p>
      </footer>
    </div>
  );
}