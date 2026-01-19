import { env } from "@/app/lib/config/env";
import type { Message } from "./ChatFeed.types";
import MessageDate from "./MessageDate";

async function getMessages(): Promise<Message[]> {
  const messages = await fetch(`${env.BE_API_URL}/api/v1/messages`, {
    headers: { Authorization: `Bearer ${env.AUTH_TOKEN}` },
  }).then((res) => res.json());
  return messages;
}

export default async function ChatFeed() {
  const messages = await getMessages();

  return (
    <section
      role="feed"
      aria-label="Chat messages"
      className="flex flex-col items-left gap-6 scroll-smooth overflow-y-scroll bg-chat min-h-dvh py-10 px-10"
    >
      {(messages || [])?.map(({ message, author, createdAt, _id }: Message) => (
        <article
          key={_id}
          aria-label={`Message from ${author}`}
          className="flex flex-col items-left gap-0.5 bg-white p-3 border-2 border-gray-200 rounded-lg w-fit"
        >
          <small className="text-gray-400">{author}</small>
          <p className="text-lg leading-8 text-black">{message}</p>
          <MessageDate createdAt={createdAt} />
        </article>
      ))}
    </section>
  );
}
