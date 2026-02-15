
"use client";

import { useSession, signOut } from "next-auth/react";
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
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // No strict file size check here, we try to compress first.
      // But reject extremely large files to prevent browser hang
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large (Max 5MB).");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize logic: Max dimension 150px
          const MAX_SIZE = 150;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          let base64Image = canvas.toDataURL('image/jpeg', 0.8);

          // If still too large (over 50k chars ~ 37KB), compress more
          if (base64Image.length > 50000) {
            base64Image = canvas.toDataURL('image/jpeg', 0.5);
          }

          if (base64Image.length > 50000) {
            alert("Unable to compress image enough. Please use a simpler image.");
            return;
          }

          // Upload
          uploadCompressedImage(base64Image);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadCompressedImage = async (base64Image: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setEditImage(data.imageUrl);
      } else {
        console.error("Upload failed", data.error);
        alert("Image upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-base-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-base-primary pb-32 font-sans text-text selection:bg-main/20">
      <Navbar />

      <div className="relative bg-main h-48 md:h-64 overflow-hidden">
        {/* Cover Image Placeholder or Gradient */}
        <div className="absolute inset-0 bg-base-primary/10"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-10 right-10 w-60 h-60 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      <main className="container mx-auto px-4 max-w-5xl -mt-16 md:-mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Card */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="relative group/avatar">
              <label htmlFor="avatar-upload" className={`cursor-pointer block relative ${!isEditing ? 'pointer-events-none' : ''}`}>
                {isEditing ? (
                  editImage ? (
                    <img src={editImage} alt="Profile" className="w-28 h-28 rounded-full border-4 border-white ring-4 ring-base-secondary object-cover shadow-lg" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-conversation text-main flex items-center justify-center text-5xl font-black border-4 border-white ring-4 ring-base-secondary shadow-lg">
                      {editName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )
                ) : (
                  profile?.image ? (
                    <img src={profile.image} alt="Profile" className="w-28 h-28 rounded-full border-4 border-white ring-4 ring-base-secondary object-cover shadow-lg" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-conversation text-main flex items-center justify-center text-5xl font-black border-4 border-white ring-4 ring-base-secondary shadow-lg">
                      {profile?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                  </div>
                )}
              </label>
              {isEditing && (
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={saving} />
              )}

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="absolute bottom-0 -left-4 p-2.5 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-md hover:scale-110 active:scale-95"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              </button>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-0 -right-4 p-2.5 bg-dark-gray text-white rounded-full hover:bg-main transition-colors shadow-md hover:scale-110 active:scale-95 z-10"
                title={isEditing ? "Close Edit" : "Edit Profile"}
              >
                {isEditing ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              {isEditing ? (
                <div className="space-y-4 max-w-lg animate-[fade-in_0.3s_ease-out]">
                  <div>
                    <label className="block text-xs font-bold text-middle-gray mb-1 uppercase tracking-wide">Display Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border-2 border-base-secondary rounded-xl p-3 font-bold text-dark-gray focus:border-main focus:outline-none focus:ring-4 focus:ring-main/10 transition-all"
                    />
                  </div>
                  <div className="flex gap-3 justify-center md:justify-start pt-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-2 bg-main text-white rounded-full font-bold hover:bg-main/90 hover:shadow-lg disabled:opacity-50 transition-all active:scale-95"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-base-secondary text-middle-gray rounded-full font-bold hover:bg-base-primary hover:text-dark-gray transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <h2 className="text-4xl font-black text-dark-gray mb-2 tracking-tight">{profile?.name || "Guest User"}</h2>
                  <p className="text-middle-gray font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    {profile?.email}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
                <span className="px-4 py-1.5 bg-base-primary rounded-full text-xs font-bold text-middle-gray border border-base-secondary">
                  Creator
                </span>
                <span className="px-4 py-1.5 bg-base-primary rounded-full text-xs font-bold text-middle-gray border border-base-secondary">
                  {polls.length} Polls Created
                </span>
              </div>
            </div>

            <div className="hidden md:block">
              <Link href="/create" className="group px-8 py-4 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/50 hover:-translate-y-1 transition-all active:scale-95 border-b-4 border-yellow-500 active:border-b-0 active:translate-y-0.5 block text-center min-w-[200px]">
                <span className="text-lg block mb-1">Make a Poll +</span>
                Create New Poll
              </Link>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-sm border border-base-secondary/50">
          <h3 className="text-xl font-black text-dark-gray mb-8 flex items-center gap-2">
            Analytics Overview
          </h3>
          <DashboardChart />
        </div>

        <div className="mb-8 flex items-center gap-4">
          <h3 className="text-2xl font-black text-dark-gray">My Polls</h3>
          <div className="h-0.5 flex-1 bg-base-secondary rounded-full"></div>
        </div>

        {
          polls.length === 0 ? (
            <div className="text-center py-20 bg-white/50 border-4 border-dashed border-base-secondary rounded-3xl">
              <p className="text-xl font-bold text-middle-gray mb-6">No polls created yet</p>
              <Link
                href="/create"
                className="px-8 py-3 bg-main text-white text-lg font-bold rounded-full hover:bg-main/90 transition-all shadow-lg hover:shadow-main/30"
              >
                Create your first poll
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
              {polls.map((poll) => (
                <div key={poll.id} className="h-full transform hover:-translate-y-2 transition-transform duration-500">
                  <Card
                    id={poll.id}
                    title={poll.title}
                    choices={poll.choices}
                    stats={poll.stats}
                    counts={poll.counts}
                    total={poll.totalResponses}
                    ownerName={profile?.name || poll.owner_name}
                    ownerImage={profile?.image || poll.owner_image}
                    createdAt={poll.created_at}
                    likes={poll.likes}
                  />
                </div>
              ))}
            </div>
          )
        }
      </main >
    </div >
  );
}
