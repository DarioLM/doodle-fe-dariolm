import { env } from "@/app/lib/config/env";
import type { Message } from "./ChatFeed.types";
import MessageDate from "./MessageDate";
import ChatFeedWrapper from "./ChatFeedWrapper";

async function getMessages(): Promise<Message[]> {
  try {
    const response = await fetch(`${env.BE_API_URL}/api/v1/messages`, {
      headers: { Authorization: `Bearer ${env.AUTH_TOKEN}` },
      next: { tags: ["messages"] },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export default async function ChatFeed({
  actualUsername,
}: {
  actualUsername?: string | null;
}) {
  const messages = await getMessages();

  if (messages.length === 0) {
    return (
      <ChatFeedWrapper>
        <div className="flex flex-1 items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-500 text-center">
              <span className="text-4xl block mb-2">😴</span>
              Oops, no messages found... maybe the server is taking a nap!
            </p>
          </div>
        </div>
      </ChatFeedWrapper>
    );
  }

  return (
    <ChatFeedWrapper>
      <div className="flex flex-1 flex-col w-fit md:w-[640px] px-6">
        {messages.map(({ message, author, createdAt, _id }: Message) => {
          const messageFromActualUser = author === actualUsername;
          return (
            <article
              key={_id}
              aria-label={`Message from ${author}`}
              className={`flex flex-col my-2 py-2 border-2 border-gray-200 rounded-lg w-fit max-w-[420px] ${messageFromActualUser ? "self-end bg-chat-bubble-sender" : "self-start bg-chat-bubble"}`}
            >
              {!messageFromActualUser && (
                <small className="text-gray-400 px-4">{author}</small>
              )}
              <p className="px-4">{message}</p>
              <MessageDate
                createdAt={createdAt}
                alignment={messageFromActualUser ? "right" : "left"}
              />
            </article>
          );
        })}
      </div>
    </ChatFeedWrapper>
  );
}
