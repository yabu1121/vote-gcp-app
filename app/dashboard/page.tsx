
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import DashboardChart from "@/components/DashboardChart";

type Questionnaire = {
  id: string;
  title: string;
  choices: string[];
  totalResponses: number;
  stats: Record<string, number>;
  counts: Record<string, number>;
  created_at?: string;
  owner_email?: string;
  owner_name?: string;
  owner_image?: string;
  likes?: number;
};

type UserProfile = {
  email: string;
  name: string;
  image: string;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [polls, setPolls] = useState<Questionnaire[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchData = async () => {
      try {
        // Fetch Profile
        const profileRes = await fetch("/api/user/me");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
          setEditName(profileData.name || "");
          setEditImage(profileData.image || "");
        }

        // Fetch Polls
        const listRes = await fetch("/api/list");
        const listData = await listRes.json();
        if (Array.isArray(listData)) {
          // Filter by owner_email
          const myPolls = listData.filter((p: Questionnaire) => p.owner_email === session.user?.email);
          setPolls(myPolls);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      alert("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, image: editImage }),
      });

      if (res.ok) {
        setProfile({ ...profile!, name: editName, image: editImage });
        setIsEditing(false);
        alert("Profile updated!");
        // Refresh polls to update name
        // Alternatively, reload page
        window.location.reload();
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen bg-yellow-50 flex items-center justify-center text-gray-500 font-bold">Loading dashboard...</div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-yellow-50 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <Navbar />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm border-2 border-yellow-100 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            {profile?.image ? (
              <img src={profile.image} alt="Profile" className="w-24 h-24 rounded-full border-4 border-yellow-200 object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center text-4xl text-yellow-500 font-bold border-4 border-yellow-200">
                {profile?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition shadow-md"
              title="Edit Profile"
            >
              ✏️
            </button>
          </div>

          <div className="flex-1 text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">表示名</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-1">アイコン画像URL (任意)</label>
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    placeholder="https://example.com/icon.png"
                    className="w-full border-2 border-gray-200 rounded-lg p-2 text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">※ 画像のURLを入力してください</p>
                </div>
                <div className="flex gap-2 justify-center md:justify-start">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50"
                  >
                    {saving ? "保存中..." : "保存する"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-300"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">{profile?.name}</h2>
                <p className="text-gray-500 font-bold mb-1">{profile?.email}</p>
                <div className="mt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-blue-500 font-bold hover:underline"
                  >
                    プロフィールを編集する
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <Link href="/create" className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg hover:bg-red-600 hover:scale-105 transition-all border-b-4 border-red-700 active:border-b-0 active:translate-y-1 block text-center">
              投票を作る！ <br /><span className="text-sm font-normal">Create Poll</span>
            </Link>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm border-2 border-yellow-100">
          <h3 className="text-xl font-black text-gray-700 mb-6 flex items-center gap-2">
            📊 アナリティクス
          </h3>
          <DashboardChart />
        </div>

        <div className="mb-6 border-b-2 border-gray-100 pb-2">
          <h3 className="text-xl font-black text-gray-700">あなたの投稿一覧</h3>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-gray-200">
            <p className="text-xl font-bold text-gray-400 mb-6">まだアンケートを作っていません</p>
            <Link
              href="/create"
              className="px-8 py-4 bg-yellow-400 text-yellow-900 text-lg font-black rounded-2xl hover:bg-yellow-300 transition-all shadow-[0_4px_0_rgb(202,138,4)] border-2 border-yellow-500"
            >
              最初のアンケートを作る！
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {polls.map((poll) => (
              <div key={poll.id} className="transform hover:-translate-y-1 transition-transform duration-300 h-full">
                <Card
                  id={poll.id}
                  title={poll.title}
                  choices={poll.choices}
                  stats={poll.stats}
                  counts={poll.counts}
                  total={poll.totalResponses}
                  // プロフィールの最新情報を使用
                  ownerName={profile?.name || poll.owner_name}
                  ownerImage={profile?.image || poll.owner_image}
                  createdAt={poll.created_at}
                  likes={poll.likes}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
