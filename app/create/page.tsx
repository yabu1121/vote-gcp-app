
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function CreatePoll() {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  // デフォルトで2つの選択肢
  const [choices, setChoices] = useState<string[]>(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  const removeChoice = (index: number) => {
    if (choices.length <= 2) {
      alert("少なくとも2つの選択肢が必要です。");
      return;
    }
    const newChoices = choices.filter((_, i) => i !== index);
    setChoices(newChoices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 空白の選択肢を除去
    const cleanChoices = choices
      .map(c => c.trim())
      .filter(c => c !== "");

    if (!title.trim()) {
      alert("タイトルを入力してください。");
      return;
    }
    if (cleanChoices.length < 2) {
      alert("少なくとも2つの有効な選択肢を入力してください。");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          choices: cleanChoices
        }),
      });

      if (res.ok) {
        // ログイン状態ならダッシュボードへ、未ログインならタイムラインへ
        if (session) {
          router.push("/dashboard");
        } else {
          router.push("/timeline");
        }
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create poll.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <Navbar />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-200">
          <h1 className="text-3xl font-black text-gray-800 mb-6 text-center transform -rotate-1">
            <span className="bg-red-100 px-4 py-1 rounded-lg text-red-500">NEW</span> アンケートを作る
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 ml-1">タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: 次の旅行、どこ行きたい？"
                className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all font-bold placeholder-gray-300"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-gray-700 font-bold ml-1 flex justify-between">
                <span>選択肢</span>
                <span className="text-xs text-gray-400 font-normal self-end">最低2つ必要です</span>
              </label>

              {choices.map((choice, index) => (
                <div key={index} className="flex gap-2 group">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 font-bold">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={choice}
                      onChange={(e) => handleChoiceChange(index, e.target.value)}
                      placeholder={`選択肢 ${index + 1}`}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all font-medium"
                    />
                  </div>
                  {choices.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeChoice(index)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="削除"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addChoice}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span> 選択肢を追加する
            </button>

            <div className="pt-4 flex gap-4">
              <Link
                href="/"
                className="flex-1 py-4 text-center text-gray-500 font-bold hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-4 bg-red-500 text-white text-lg font-black rounded-2xl hover:bg-red-600 transition-all shadow-[0_4px_0_rgb(185,28,28)] hover:shadow-[0_2px_0_rgb(185,28,28)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] border-2 border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '作成中...' : 'アンケートを公開する！ 🚀'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}