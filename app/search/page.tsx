
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Link from "next/link";

type Questionnaire = {
  id: string;
  title: string;
  choices: string[];
  totalResponses: number;
  stats: Record<string, number>;
  counts: Record<string, number>;
  owner_name?: string;
  owner_image?: string;
  created_at?: string;
  likes?: number;
};

type TrendWord = {
  word: string;
  count: number;
};

const STOP_WORDS = new Set([
  "の", "が", "は", "に", "を", "へ", "と", "より", "から", "で", "や",
  "し", "て", "ない", "ある", "いる", "こと", "もの", "ため", "よう",
  "さん", "くん", "ちゃん", "これ", "それ", "あれ", "どれ", "なん", "どう",
  "投票", "アンケート", "質問", "募集", "今日", "明日", "昨日", "好き", "嫌い",
  "について", "みんな", "その他", "おねがい", "選択", "結果", "一番", "いつ"
]);

export default function SearchPage() {
  const [polls, setPolls] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [trends, setTrends] = useState<TrendWord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/list");
        const data: Questionnaire[] = await res.json();

        if (Array.isArray(data)) {
          setPolls(data);
          analyzeTrends(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const analyzeTrends = (data: Questionnaire[]) => {
    if (typeof Intl === "undefined" || !(Intl as any).Segmenter) {
      return;
    }

    const segmenter = new (Intl as any).Segmenter("ja", { granularity: "word" });
    const wordCounts: Record<string, number> = {};

    data.forEach(poll => {
      const segments = segmenter.segment(poll.title);
      for (const seg of segments) {
        const word = seg.segment;
        if (word.length > 1 && !STOP_WORDS.has(word) && !/^\d+$/.test(word) && !/^[!-\/:-@[-`{-~]+$/.test(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      }
    });

    const sorted = Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setTrends(sorted);
  };

  const filteredPolls = polls.filter(poll => {
    if (!query) return false;
    const lowerQ = query.toLowerCase();
    return (
      poll.title.toLowerCase().includes(lowerQ) ||
      poll.choices.some(c => c.toLowerCase().includes(lowerQ))
    );
  });

  return (
    <div className="min-h-screen bg-base-primary text-text font-sans selection:bg-main/20">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-40">
        <div className="absolute top-[-10%] right-[20%] w-[30rem] h-[30rem] bg-conversation rounded-full blur-3xl animate-[pulse_15s_infinite]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[25rem] h-[25rem] bg-accent/10 rounded-full blur-3xl animate-[pulse_20s_infinite_reverse]"></div>
      </div>

      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Search Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-dark-gray mb-8 tracking-tight">
            <span className="inline-block relative">
              Explore Polls
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-main/20 rounded-full -z-10 transform -rotate-1"></span>
            </span>
          </h1>

          <div className="max-w-2xl mx-auto relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="キーワードを入力 (例: ランチ, 旅行...)"
              className="w-full px-8 py-5 text-xl font-bold rounded-full border-2 border-base-secondary bg-white text-dark-gray placeholder-middle-gray/60 focus:outline-none focus:border-main focus:ring-4 focus:ring-main/10 shadow-xl shadow-base-secondary/50 transition-all duration-300"
              autoFocus
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-main/50 animate-[pulse_3s_infinite]">
              {/* Magnifying Glass Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Trends */}
        {trends.length > 0 && (
          <div className="mb-16 max-w-4xl mx-auto text-center">
            <h2 className="text-xs font-bold text-middle-gray mb-6 tracking-widest uppercase flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-middle-gray/30"></span>
              Trending Now
              <span className="h-px w-8 bg-middle-gray/30"></span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {trends.map((trend, i) => (
                <button
                  key={trend.word}
                  onClick={() => setQuery(trend.word)}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0 border-b-4 active:border-b-0 ${i < 3
                    ? "bg-accent text-white border-yellow-500 shadow-lg shadow-accent/30 hover:shadow-accent/50"
                    : "bg-white text-dark-gray border-base-secondary hover:border-main/30 hover:text-main hover:bg-conversation"
                    }`}
                >
                  #{trend.word} <span className="text-[10px] opacity-70 ml-1 bg-black/10 px-1.5 rounded-full">{trend.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-base-secondary border-t-main rounded-full animate-spin"></div>
            <p className="text-middle-gray font-bold text-sm animate-pulse">Searching...</p>
          </div>
        ) : (
          <div className="transition-all duration-500">
            {query && (
              <div className="mb-8 text-center animate-[fade-in_0.5s_ease-out]">
                <span className="font-bold text-middle-gray bg-white px-4 py-2 rounded-full border border-base-secondary shadow-sm">
                  Result: <span className="text-main text-lg mx-1">{filteredPolls.length}</span> polls found
                </span>
              </div>
            )}

            {query ? (
              filteredPolls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                  {filteredPolls.map(poll => (
                    <div key={poll.id} className="h-full transform hover:-translate-y-2 transition-transform duration-500">
                      <Card
                        id={poll.id}
                        title={poll.title}
                        choices={poll.choices}
                        stats={poll.stats}
                        counts={poll.counts}
                        total={poll.totalResponses}
                        ownerName={poll.owner_name}
                        ownerImage={poll.owner_image}
                        createdAt={poll.created_at}
                        likes={poll.likes}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-base-secondary max-w-2xl mx-auto">
                  <p className="text-dark-gray font-bold text-lg mb-2">No polls found for "{query}"</p>
                  <p className="text-sm text-middle-gray">Try different keywords or check the trending topics!</p>
                </div>
              )
            ) : (
              <div className="text-center py-20 opacity-40">
                {/* Empty State Icon */}
                <div className="flex justify-center mb-4 text-middle-gray">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <p className="text-middle-gray font-bold">Search results will appear here</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
