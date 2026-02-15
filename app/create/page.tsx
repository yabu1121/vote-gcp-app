"use client";

import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;

    // Collect non-empty choices
    const choices = [
      formData.get("choice1") as string,
      formData.get("choice2") as string,
      formData.get("choice3") as string,
      formData.get("choice4") as string,
    ].filter(c => c && c.trim() !== "");

    if (!title || choices.length < 2) {
      alert("Title and at least 2 choices are required.");
      return;
    }

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, choices }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create poll.");
    }
  };
  return (
    <div className='flex flex-col w-screen h-screen items-center justify-center'>
      <h1 className='text-2xl font-bold mb-4'>アンケートを作成してみんなの考えなどを聞きましょう！！</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-120'>
        <input name="title" type="text" placeholder="タイトル" className='border rounded-lg p-2' />
        <input name="choice1" type="text" placeholder="選択肢1" className='border rounded-lg p-2' />
        <input name="choice2" type="text" placeholder="選択肢2" className='border rounded-lg p-2' />
        <input name="choice3" type="text" placeholder="選択肢3" className='border rounded-lg p-2' />
        <input name="choice4" type="text" placeholder="選択肢4" className='border rounded-lg p-2' />
        <button type="submit" className='border rounded-lg p-2'>作成</button>
      </form>
    </div>
  )
}

export default page