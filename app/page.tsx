import ChatFeed from "./components/ChatFeed";

export default async function Home() {
  return (
    <main className="flex min-h-screen w-full m-auto max-w-3xl flex-col bg-white">
      <ChatFeed />
    </main>
  );
}
