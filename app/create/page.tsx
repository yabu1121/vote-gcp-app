"use client";

import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const choices = [
      formData.get("choice1") as string,
      formData.get("choice2") as string,
      formData.get("choice3") as string,
      formData.get("choice4") as string,
    ]
    console.log(title, choices);
    router.push("/timeline");
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