"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CardProps = {
  id: string;
  title: string;
  choices: string[];
  stats?: Record<string, number>;
  counts?: Record<string, number>; // Raw counts for local calculation
  total?: number;
};

const Card = ({ id, title, choices, stats = {}, counts = {}, total = 0 }: CardProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Local state for immediate update
  const [currentTotal, setCurrentTotal] = useState(total);
  const [currentCounts, setCurrentCounts] = useState(counts);
  const [currentStats, setCurrentStats] = useState(stats);

  // Check data from props update (e.g. initial load or SWR revalidation)
  // Note: we only update if we haven't voted yet to avoid jitter, 
  // or if we want to sync latest results. For now simple init is enough.

  useEffect(() => {
    const votedIds = JSON.parse(localStorage.getItem('voted_polls') || '[]');
    if (votedIds.includes(id)) {
      setHasVoted(true);
    }
  }, [id]);

  const handleVote = async () => {
    if (!selectedChoice || isVoting) return;
    setIsVoting(true);

    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionnaire_id: id,
          answer: selectedChoice,
        }),
      });

      if (res.ok) {
        // Update local stats immediately
        const newTotal = currentTotal + 1;
        const newCounts = { ...currentCounts };
        newCounts[selectedChoice] = (newCounts[selectedChoice] || 0) + 1;

        const newStats: Record<string, number> = {};
        choices.forEach(c => {
          newStats[c] = Math.round(((newCounts[c] || 0) / newTotal) * 100);
        });

        setCurrentTotal(newTotal);
        setCurrentCounts(newCounts);
        setCurrentStats(newStats);
        setHasVoted(true);

        // Save to LocalStorage
        const votedIds = JSON.parse(localStorage.getItem('voted_polls') || '[]');
        if (!votedIds.includes(id)) {
          votedIds.push(id);
          localStorage.setItem('voted_polls', JSON.stringify(votedIds));
        }
      } else {
        alert('Failed to submit vote');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting vote');
    } finally {
      setIsVoting(false);
    }
  };

  // 投票済み（結果表示）モード
  if (hasVoted) {
    return (
      <div className="border rounded-xl p-6 w-full max-w-md shadow-sm bg-white hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold flex-1 mr-4">{title}</h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
            {currentTotal} votes
          </span>
        </div>

        <div className="space-y-3 mb-4">
          {choices.map((choice, index) => {
            const percentage = currentStats[choice] || 0;
            const isUserChoice = choice === selectedChoice;
            return (
              <div key={index} className="relative group">
                {/* Background Bar */}
                <div
                  className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-500 ${isUserChoice ? 'bg-blue-100' : 'bg-gray-100'}`}
                  style={{ width: `${percentage}%` }}
                ></div>

                {/* Content */}
                <div className={`relative flex justify-between items-center p-3 border rounded-lg z-10 ${isUserChoice ? 'border-blue-300' : 'border-gray-100'}`}>
                  <span className={`font-medium text-sm transition-colors flex items-center gap-2 ${isUserChoice ? 'text-blue-900' : 'text-gray-700'}`}>
                    {choice}
                    {isUserChoice && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">You</span>}
                  </span>
                  <span className={`text-sm font-bold ${isUserChoice ? 'text-blue-700' : 'text-gray-600'}`}>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-sm text-gray-500">Thank you for voting!</div>
      </div>
    );
  }

  // 未投票（投票フォーム）モード
  return (
    <div className="border rounded-xl p-6 w-full max-w-md shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold flex-1 mr-4">{title}</h2>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
          {currentTotal} votes
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {choices.map((choice, index) => (
          <div
            key={index}
            onClick={() => setSelectedChoice(choice)}
            className={`cursor-pointer relative flex items-center p-3 border rounded-lg transition-all ${selectedChoice === choice
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
          >
            <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${selectedChoice === choice ? 'border-blue-500' : 'border-gray-400'
              }`}>
              {selectedChoice === choice && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
            </div>
            <span className={`font-medium text-sm ${selectedChoice === choice ? 'text-blue-900' : 'text-gray-700'}`}>
              {choice}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleVote}
          disabled={!selectedChoice || isVoting}
          className={`flex-1 py-2.5 text-center text-sm font-bold text-white rounded-lg transition-colors shadow-sm ${!selectedChoice || isVoting
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isVoting ? 'Voting...' : 'Vote'}
        </button>
        {/*
        <Link 
          href={`/vote/${id}`}
          className="px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Details
        </Link>
        */}
      </div>
    </div>
  );
};

export default Card;