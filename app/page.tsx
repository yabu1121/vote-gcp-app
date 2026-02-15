import Link from "next/link";
import Card from "@/components/Card";

const Page = () => {
  const dummyPolls = [
    {
      title: "好きなプログラミング言語は？",
      choices: ["JavaScript", "Python", "Go", "Rust"],
    },
    {
      title: "好きなエディタは？",
      choices: ["VS Code", "Vim", "IntelliJ", "Sublime Text"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="px-6 py-4 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-600">Poll App</h1>
        <nav className="flex gap-4">
          <Link
            href="/timeline"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Timeline
          </Link>
          <Link
            href="/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Create
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500 mb-8">
          最新のアンケートに回答しましょう。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {dummyPolls.map((poll, index) => (
            <Card key={index} title={poll.title} choices={poll.choices} />
          ))}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-400">
        &copy; 2026 Poll App by You
      </footer>
    </div>
  );
};

export default Page;