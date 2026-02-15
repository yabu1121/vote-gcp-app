
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
  ownerName?: string;
  ownerImage?: string;
  createdAt?: string;
  likes?: number; // Add likes
};

const Card = ({ id, title, choices, stats = {}, counts = {}, total = 0, ownerName, ownerImage, createdAt, likes: initialLikes = 0 }: CardProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Like state
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Local state for immediate update
  const [currentTotal, setCurrentTotal] = useState(total);
  const [currentCounts, setCurrentCounts] = useState(counts);
  const [currentStats, setCurrentStats] = useState(stats);

  useEffect(() => {
    // Check Vote
    const votedIds = JSON.parse(localStorage.getItem('voted_polls') || '[]');
    if (votedIds.includes(id)) {
      setHasVoted(true);
    }

    // Check Like
    const likedIds = JSON.parse(localStorage.getItem('liked_polls') || '[]');
    if (likedIds.includes(id)) {
      setHasLiked(true);
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

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const newHasLiked = !hasLiked;
    const newLikes = newHasLiked ? likes + 1 : Math.max(0, likes - 1);

    // Optimistic UI Update
    setHasLiked(newHasLiked);
    setLikes(newLikes);

    try {
      await fetch('/api/like', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaire_id: id, increment: newHasLiked })
      });

      // Update LocalStorage
      const likedIds = JSON.parse(localStorage.getItem('liked_polls') || '[]');
      if (newHasLiked) {
        if (!likedIds.includes(id)) likedIds.push(id);
      } else {
        const index = likedIds.indexOf(id);
        if (index > -1) likedIds.splice(index, 1);
      }
      localStorage.setItem('liked_polls', JSON.stringify(likedIds));

    } catch (error) {
      console.error("Like failed", error);
      // Revert on error
      setHasLiked(!newHasLiked);
      setLikes(newHasLiked ? newLikes - 1 : newLikes + 1);
    } finally {
      setIsLiking(false);
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1 mr-4 overflow-hidden">
        {ownerName && (
          <div className="flex items-center gap-2 mb-2">
            {ownerImage ? (
              <img src={ownerImage} alt={ownerName} className="w-6 h-6 rounded-full border border-gray-100 object-cover flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold flex-shrink-0">
                {ownerName[0]}
              </div>
            )}
            <span className="text-xs text-gray-500 font-bold truncate">{ownerName}</span>
            {createdAt && <span className="text-xs text-gray-300 flex-shrink-0">• {new Date(createdAt).toLocaleDateString()}</span>}
          </div>
        )}
        <h2 className="text-xl font-bold leading-tight line-clamp-2">{title}</h2>
      </div>
      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap self-start mt-1 flex-shrink-0">
        {currentTotal} votes
      </span>
    </div>
  );

  const renderFooter = () => (
    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
      <div className="text-xs text-gray-400 font-bold flex-1">
        {hasVoted ? "Thank you for voting!" : "Vote now!"}
      </div>
      <button
        onClick={handleLike}
        disabled={isLiking}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95 ${hasLiked ? 'bg-pink-100 text-pink-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={hasLiked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-4 h-4 ${hasLiked ? 'text-pink-500' : 'text-gray-400'}`}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span className="text-sm font-bold">{likes}</span>
      </button>
    </div>
  );

  // 投票済み（結果表示）モード
  if (hasVoted) {
    return (
      <div className="border rounded-xl p-6 w-full max-w-md shadow-sm bg-white hover:shadow-md transition-shadow h-full flex flex-col">
        {renderHeader()}

        <div className="space-y-3 mb-4 flex-1 overflow-y-auto max-h-60 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {choices.map((choice, index) => {
            const percentage = currentStats[choice] || 0;
            const isUserChoice = choice === selectedChoice;
            return (
              <div key={index} className="relative group">
                <div
                  className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-500 ${isUserChoice ? 'bg-blue-100' : 'bg-gray-100'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
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
        {renderFooter()}
      </div>
    );
  }

  // 未投票（投票フォーム）モード
  return (
    <div className="border rounded-xl p-6 w-full max-w-md shadow-sm bg-white hover:shadow-md transition-shadow h-full flex flex-col">
      {renderHeader()}

      <div className="space-y-3 mb-6 flex-1 overflow-y-auto max-h-60 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
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

      <div className="flex gap-2 mb-4">
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
      </div>
      {renderFooter()}
    </div>
  );
};

export default Card;