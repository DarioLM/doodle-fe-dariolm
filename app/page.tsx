import ChatFeed from "./components/ChatFeed";
import { SendMessage } from "./components/SendMessage";
import { UserSelector } from "./components/UserSelector";
import { getUsernameFromCookie } from "./lib/cookies/username";

export default async function Home() {
  const currentUsername = await getUsernameFromCookie();

  return (
    <main className="relative border-x border-gray-300 flex h-screen w-full m-auto max-w-[1536px] flex-col bg-white">
      <UserSelector currentUsername={currentUsername} />
      <ChatFeed actualUsername={currentUsername} />
      <SendMessage currentUsername={currentUsername} />
    </main>
  );
}
