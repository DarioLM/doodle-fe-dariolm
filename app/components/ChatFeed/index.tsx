import { env } from "@/app/lib/config/env";
import type { Message } from "./ChatFeed.types";
import MessageDate from "./MessageDate";

async function getMessages(): Promise<Message[]> {
  const messages = await fetch(`${env.BE_API_URL}/api/v1/messages`, {
    headers: { Authorization: `Bearer ${env.AUTH_TOKEN}` },
  }).then((res) => res.json());
  return messages;
}

export default async function ChatFeed({
  actualUsername,
}: {
  actualUsername?: string | null;
}) {
  const messages = await getMessages();

  return (
    <section
      role="feed"
      aria-label="Chat messages"
      className="flex flex-1 flex-col items-center bg-chat bg-contain scroll-smooth overflow-y-scroll"
    >
      <div className="flex flex-1 flex-col w-[640px] px-6">
        {(messages || [])?.map(
          ({ message, author, createdAt, _id }: Message) => {
            const messageFromActualUser = author === actualUsername;
            return (
              <article
                key={_id}
                aria-label={`Message from ${author}`}
                className={`flex flex-col p-3 my-2 border-2 border-gray-200 rounded-lg w-fit max-w-[420px] ${messageFromActualUser ? "self-end bg-chat-bubble-sender" : "self-left bg-chat-bubble"}`}
              >
                {!messageFromActualUser && (
                  <small className="text-gray-400">{author}</small>
                )}
                <p>{message}</p>
                <MessageDate createdAt={createdAt} />
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}
