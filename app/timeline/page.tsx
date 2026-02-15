'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import Card from "@/components/Card";

type Questionnaire = {
  id: string;
  title: string;
  choices: string[];
  totalResponses: number;
  stats: Record<string, number>;
  counts: Record<string, number>;
};

const Page = () => {
  const [polls, setPolls] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="px-6 py-4 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-600">Poll App</h1>
        <nav className="flex gap-4">
          <Link
            href="/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Create New Poll
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500 mb-8">
          最新のアンケート結果をご覧ください。
        </p>

        {loading ? (
          <div className="text-center text-gray-500">Loading polls...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {polls.length === 0 ? (
              <p className="col-span-full text-gray-400">No polls found.</p>
            ) : (
              polls.map((poll) => (
                <Card
                  key={poll.id}
                  id={poll.id}
                  title={poll.title}
                  choices={poll.choices}
                  stats={poll.stats}
                  counts={poll.counts}
                  total={poll.totalResponses}
                />
              ))
            )}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm text-gray-400">
        &copy; 2026 Poll App
      </footer>
    </div>
  );
};

export default Page;