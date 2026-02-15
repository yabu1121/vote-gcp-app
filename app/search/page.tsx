
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
    // Check for Intl.Segmenter support
    if (typeof Intl === "undefined" || !(Intl as any).Segmenter) {
      console.warn("Intl.Segmenter not supported");
      return;
    }

    const segmenter = new (Intl as any).Segmenter("ja", { granularity: "word" });
    const wordCounts: Record<string, number> = {};

    data.forEach(poll => {
      // Analyze Title
      const segments = segmenter.segment(poll.title);
      for (const seg of segments) {
        const word = seg.segment;
        if (word.length > 1 && !STOP_WORDS.has(word) && !/^\d+$/.test(word) && !/^[!-\/:-@[-`{-~]+$/.test(word)) { // Filter short, stop words, numbers, symbols
          // Simple Kanji/Katakana/Hiragana check could be added but length>1 + stopwords usually works well
          // Filter Hiragana only words that might be meaningless? No, "うどん" is important.
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      }
    });

    const sorted = Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

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
    <div className="min-h-screen bg-yellow-50 text-gray-800 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-gray-800 mb-6 flex items-center justify-center gap-2">
            🔍 投票をさがす
          </h1>

          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="キーワードを入力 (例: ラーメン, ゲーム...)"
              className="w-full px-6 py-4 text-lg font-bold rounded-full border-4 border-yellow-400 focus:outline-none focus:border-red-400 shadow-lg placeholder-gray-300 transition-colors"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
              🔎
            </div>
          </div>
        </div>

        {/* Trends */}
        {trends.length > 0 && (
          <div className="mb-12 max-w-4xl mx-auto">
            <h2 className="text-center text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase">
              Trending Topics
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {trends.map((trend, i) => (
                <button
                  key={trend.word}
                  onClick={() => setQuery(trend.word)}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 border-b-4 active:border-b-0 active:translate-y-0.5 ${i < 3
                      ? "bg-red-500 text-white border-red-700 shadow-red-200"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 shadow-sm"
                    }`}
                >
                  #{trend.word} <span className="text-xs opacity-70 ml-1">{trend.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold animate-pulse">読み込み中...</div>
        ) : (
          <>
            {query && (
              <div className="mb-6 text-center">
                <span className="font-bold text-gray-500">
                  "{query}" の検索結果: {filteredPolls.length} 件
                </span>
              </div>
            )}

            {query ? (
              filteredPolls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPolls.map(poll => (
                    <div key={poll.id} className="h-full">
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
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold text-lg">
                    見つかりませんでした... 😢<br />
                    <span className="text-sm font-normal">別のキーワードで試してみてください</span>
                  </p>
                </div>
              )
            ) : (
              // Initial State (maybe Show Latest or Random? or nothing)
              <div className="text-center py-10 opacity-50">
                <p className="text-gray-400 font-bold">キーワードを入力するか、トレンドタグをクリック！</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
