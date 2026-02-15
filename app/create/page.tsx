const page = () => {
  return (
    <div className='flex flex-col w-screen h-screen items-center justify-center'> 
      <h1 className='text-2xl font-bold mb-4'>アンケートを作成してみんなの考えなどを聞きましょう！！</h1>
      <form className='flex flex-col gap-4 w-120'>
        <input type="text" placeholder="タイトル" className='border rounded-lg p-2' />
        <input type="text" placeholder="選択肢1" className='border rounded-lg p-2' />
        <input type="text" placeholder="選択肢2" className='border rounded-lg p-2' />
        <input type="text" placeholder="選択肢3" className='border rounded-lg p-2' />
        <input type="text" placeholder="選択肢4" className='border rounded-lg p-2' />
        <button type="submit" className='border rounded-lg p-2'>作成</button>
      </form>
    </div>
  )
}

export default page