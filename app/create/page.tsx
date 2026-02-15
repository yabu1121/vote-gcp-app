
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreatePoll() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [choices, setChoices] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length > 2) {
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
    }
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title.trim() || choices.some((c) => !c.trim())) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, choices }),
      });

      if (res.ok) {
        router.push("/timeline");
      } else {
        setError("Failed to create poll.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="min-h-screen bg-base-primary flex items-center justify-center font-bold text-middle-gray">Wait a sec...</div>;

  return (
    <div className="min-h-screen bg-base-primary text-text font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-base-secondary border border-white">
          <h1 className="text-3xl font-black text-dark-gray mb-8 text-center flex items-center justify-center gap-3">
            <span className="bg-main text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-main/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            Create New Poll
          </h1>

          {error && (
            <div className="bg-red-50 text-red-500 font-bold p-4 rounded-xl mb-6 text-center border-l-4 border-red-400 animate-[shake_0.5s_ease-in-out]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group">
              <label className="block text-sm font-bold text-middle-gray mb-2 ml-1 uppercase tracking-wide group-focus-within:text-main transition-colors">
                Question
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question?"
                className="w-full px-6 py-4 rounded-xl border-2 border-base-secondary bg-base-primary/30 text-dark-gray font-bold text-xl placeholder-middle-gray/50 focus:outline-none focus:border-main focus:bg-white focus:ring-4 focus:ring-main/10 transition-all duration-300 shadow-inner focus:shadow-lg"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-middle-gray mb-2 ml-1 uppercase tracking-wide">
                Choices
              </label>
              <div className="space-y-3">
                {choices.map((choice, index) => (
                  <div key={index} className="flex gap-3 animate-[slide-in-bottom_0.3s_ease-out]">
                    <div className="flex-1 relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-base-secondary text-middle-gray flex items-center justify-center font-bold text-xs group-focus-within:bg-main group-focus-within:text-white transition-colors">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) => handleChoiceChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-base-secondary bg-white text-dark-gray font-medium focus:outline-none focus:border-main focus:ring-4 focus:ring-main/10 transition-all shadow-sm focus:shadow-md"
                      />
                    </div>
                    {choices.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChoice(index)}
                        className="p-3 text-middle-gray hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 border-2 border-transparent hover:border-red-200"
                        title="Remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddChoice}
                className="w-full py-3 mt-4 text-main bg-conversation border-2 border-main/20 hover:border-main hover:bg-main hover:text-white rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-white group-hover:text-main group-hover:border-transparent transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                Add Choice
              </button>
            </div>

            <div className="pt-6 border-t border-base-secondary">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-gradient-to-r from-main to-purple-500 text-white rounded-full font-black text-xl shadow-xl shadow-main/40 hover:shadow-2xl hover:shadow-main/60 hover:-translate-y-1 transition-all active:scale-95 active:translate-y-0 duration-300 relative overflow-hidden ${loading ? "opacity-70 cursor-wait" : ""}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Creating...
                  </span>
                ) : (
                  "Create Poll"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}