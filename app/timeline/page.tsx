
"use client";

import { useEffect, useState } from 'react';
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";

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
  likes?: number; // Add likes
};

const Page = () => {
  const [polls, setPolls] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState<'latest' | 'popular'>('latest');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch('/api/list');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPolls(data);
        }
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const sortedPolls = [...polls].sort((a, b) => {
    if (sortType === 'popular') {
      return (b.totalResponses || 0) - (a.totalResponses || 0);
    }
    // Default: Latest (Newest first)
    // Assume created_at is ISO string
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-800 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-800 mb-4">みんなが作ったアンケート一覧</h1>

          {/* Sort Tabs */}
          <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setSortType('latest')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortType === 'latest'
                  ? 'bg-yellow-400 text-yellow-900 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              📅 新着順
            </button>
            <button
              onClick={() => setSortType('popular')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sortType === 'popular'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              🔥 人気順
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 font-bold">読み込み中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPolls.length === 0 ? (
              <p className="col-span-full text-gray-400 font-bold">まだアンケートがありません。</p>
            ) : (
              sortedPolls.map((poll) => (
                <Card
                  key={poll.id}
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
              ))
            )}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-gray-400 font-bold">
        &copy; 2026 Poll App
      </footer>
    </div>
  );
};

export default Page;