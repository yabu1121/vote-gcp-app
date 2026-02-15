
"use client";

import { useState, useEffect } from "react";

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
  likes?: number;
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
    <div className="flex justify-between items-start mb-6">
      <div className="flex-1 mr-4 overflow-hidden">
        {ownerName && (
          <div className="flex items-center gap-2 mb-2">
            {ownerImage ? (
              <img src={ownerImage} alt={ownerName} className="w-8 h-8 rounded-full border border-base-secondary object-cover flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-conversation text-main flex items-center justify-center text-xs font-bold flex-shrink-0">
                {ownerName[0]}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-dark-gray truncate">{ownerName}</span>
              {createdAt && <span className="text-[10px] text-middle-gray font-medium flex-shrink-0">{new Date(createdAt).toLocaleDateString()}</span>}
            </div>
          </div>
        )}
        <h2 className="text-xl font-black text-text leading-tight line-clamp-2">{title}</h2>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs font-bold text-main bg-conversation px-3 py-1 rounded-full whitespace-nowrap self-start mt-1 flex-shrink-0">
          {currentTotal} votes
        </span>
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="mt-auto pt-4 flex items-center justify-between border-t border-base-secondary/50">
      <div className="text-xs text-middle-gray font-bold flex-1">
        {hasVoted ? "あなたの投票ありがとうございました！" : "どれにする？"}
      </div>
      <button
        onClick={handleLike}
        disabled={isLiking}
        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95 ${hasLiked ? 'bg-pink-50 text-pink-500' : 'text-middle-gray hover:bg-base-primary hover:text-pink-400'
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={hasLiked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-5 h-5 transition-transform group-hover:scale-110 ${hasLiked ? 'text-pink-500 animate-[bounce_0.4s_ease-out]' : 'text-inherit'}`}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span className="text-sm font-bold min-w-[1rem] text-center">{likes}</span>
      </button>
    </div>
  );

  // 投票済み（結果表示）モード
  if (hasVoted) {
    return (
      <div className="relative border border-white/50 bg-white rounded-3xl p-6 w-full max-w-md shadow-xl shadow-base-secondary/50 hover:shadow-2xl hover:shadow-main/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-conversation/30 to-transparent rounded-bl-full -z-0 pointer-events-none opacity-50"></div>

        <div className="z-10 h-full flex flex-col">
          {renderHeader()}

          <div className="space-y-3 mb-4 flex-1 overflow-y-auto max-h-60 pr-2 scrollbar-thin scrollbar-thumb-base-secondary scrollbar-track-transparent">
            {choices.map((choice, index) => {
              const percentage = currentStats[choice] || 0;
              const isUserChoice = choice === selectedChoice;
              return (
                <div key={index} className="relative group mb-1">
                  <div className="flex justify-between items-end mb-1 px-1">
                    <span className={`font-bold text-sm truncate flex-1 pr-2 ${isUserChoice ? 'text-main' : 'text-dark-gray'}`}>
                      {choice} {isUserChoice && <span className="ml-1 text-[10px] bg-main text-white px-1.5 py-0.5 rounded-full align-middle">You</span>}
                    </span>
                    <span className={`text-sm font-black ${isUserChoice ? 'text-main' : 'text-middle-gray'}`}>{percentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-base-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${isUserChoice ? 'bg-main' : 'bg-middle-gray/30'}`} // changed from bg-accent to main for better harmony
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          {renderFooter()}
        </div>
      </div>
    );
  }

  // 未投票（投票フォーム）モード
  return (
    <div className="relative border border-white/50 bg-white rounded-3xl p-6 w-full max-w-md shadow-xl shadow-base-secondary/50 hover:shadow-2xl hover:shadow-main/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden">

      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full -z-0 pointer-events-none opacity-50"></div>

      <div className="z-10 h-full flex flex-col">
        {renderHeader()}

        <div className="space-y-3 mb-6 flex-1 overflow-y-auto max-h-60 pr-2 scrollbar-thin scrollbar-thumb-base-secondary scrollbar-track-transparent">
          {choices.map((choice, index) => (
            <div
              key={index}
              onClick={() => setSelectedChoice(choice)}
              className={`cursor-pointer relative flex items-center p-4 rounded-xl transition-all duration-200 group ${selectedChoice === choice
                  ? 'bg-conversation border-2 border-main shadow-inner'
                  : 'bg-base-primary border-2 border-transparent hover:bg-white hover:border-base-secondary hover:shadow-md'
                }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center transition-colors ${selectedChoice === choice ? 'border-main' : 'border-middle-gray group-hover:border-main/50'
                }`}>
                {selectedChoice === choice && <div className="w-2.5 h-2.5 rounded-full bg-main"></div>}
              </div>
              <span className={`font-bold text-sm ${selectedChoice === choice ? 'text-main' : 'text-dark-gray'}`}>
                {choice}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4 mt-auto">
          <button
            onClick={handleVote}
            disabled={!selectedChoice || isVoting}
            className={`flex-1 py-3.5 text-center text-sm font-black text-white rounded-full transition-all shadow-lg active:scale-95 ${!selectedChoice || isVoting
                ? 'bg-middle-gray/50 cursor-not-allowed shadow-none'
                : 'bg-main hover:bg-main/90 hover:shadow-main/40' // Accent also good, but Main is safer
              }`}
          >
            {isVoting ? 'Voting...' : '投票する！'}
          </button>
        </div>
        {renderFooter()}
      </div>
    </div>
  );
};

export default Card;