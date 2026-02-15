"use client";

import { useEffect, useState, useRef } from 'react';
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
  likes?: number;
};

const Page = () => {
  const [polls, setPolls] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(false); // Initial false to allow useEffect to trigger? Or true? 
  // Better to control loading inside fetch.
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortType, setSortType] = useState<'latest' | 'popular'>('latest');
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPolls = async (pageNum: number, type: 'latest' | 'popular') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/list?page=${pageNum}&limit=6&sort=${type}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        if (data.length < 6) setHasMore(false);
        setPolls(prev => pageNum === 1 ? data : [...prev, ...data]);
      }
    } catch (error) {
      console.error('Failed to fetch polls:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset when sort type changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPolls([]);
    fetchPolls(1, sortType);
  }, [sortType]);

  // Load more when page changes (but not on initial mount if sortType effect handles it?)
  // Actually, combining them is tricky.
  // Best way: 
  // 1. SortType change -> setPage(1), setPolls([]).
  // 2. useEffect on [page, sortType] -> fetch. 
  //    But SortType change triggers this effect too? 
  //    If sortType changes, we want fetchPolls(1, newType).
  //    If scrolling (setPage(p+1)), we want fetchPolls(p+1, currentType).

  // Let's rely on `useEffect(() => { fetchPolls(page, sortType) }, [page, sortType])`.
  // But we need to clear polls if sortType changed.
  // We can track prevSortType?

  // Simplified approach:
  // Use one effect for page change.
  // Use another for sort change which resets everything.

  // Let's use the layout: 
  // useEffect [sortType] -> setPage(1); setPolls([]);
  // useEffect [page] -> fetchPolls(page, sortType). 
  // Problem: When sortType changes, setPage(1) might not trigger [page] effect if page was already 1.
  // So we need to explicitly fetch when sortType changes.

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    // If page > 1, it's a "load more" action triggered by observer
    if (page > 1) {
      fetchPolls(page, sortType);
    }
  }, [page]);


  return (
    <div className="min-h-screen font-sans bg-base-primary text-text">
      {/* Background Blobs (Optional for subtle effect) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-conversation rounded-full blur-3xl animate-[pulse_10s_infinite]"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-[pulse_12s_infinite]"></div>
      </div>

      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl pb-32">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-dark-gray mb-6 tracking-tight relative inline-block">
            みんなの投票
            <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-accent/50 rounded-full -z-10 transform -rotate-1"></span>
          </h1>

          {/* Sort Tabs */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex bg-white p-1.5 rounded-full shadow-lg shadow-base-secondary border border-base-secondary/50">
              <button
                onClick={() => setSortType('latest')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${sortType === 'latest'
                  ? 'bg-main text-white shadow-md shadow-main/30'
                  : 'text-middle-gray hover:text-dark-gray hover:bg-base-primary'
                  }`}
              >
                新着順
              </button>
              <button
                onClick={() => setSortType('popular')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${sortType === 'popular'
                  ? 'bg-accent text-white shadow-md shadow-accent/30'
                  : 'text-middle-gray hover:text-dark-gray hover:bg-base-primary'
                  }`}
              >
                人気順
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {polls.length > 0 && polls.map((poll) => (
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

        {loading && (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-10 h-10 border-4 border-base-secondary border-t-main rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && hasMore && (
          <div ref={observerTarget} className="h-10 w-full"></div>
        )}

        {!loading && polls.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-base-secondary">
            <p className="text-xl font-bold text-middle-gray mb-2">まだアンケートがありません</p>
            <p className="text-sm text-middle-gray opacity-70">最初のアンケートを作成してみましょう！</p>
          </div>
        )}
      </main>


      {/* Footer */}
      <footer className="py-8 text-center border-t border-base-secondary/50 text-xs font-bold text-middle-gray bg-white/50 backdrop-blur-sm">
        &copy; 2026 KiKo
      </footer>
    </div>
  );
};

export default Page;