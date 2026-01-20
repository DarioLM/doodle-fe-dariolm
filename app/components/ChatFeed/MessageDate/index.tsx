"use client";

/* Date in format 10 Mar 2018 10:25, need to be client side to allow user browser formating */
export default function MessageDate({
  createdAt,
  alignment,
}: {
  createdAt: string;
  alignment?: "left" | "right";
}) {
  // We format the date on the user browser locale
  const userLocale =
    typeof window !== "undefined" ? navigator.language : "en-US";

  return (
    <small
      className={`text-gray-400 px-4 self-end ${alignment === "right" ? "self-end" : "self-start"}`}
    >
      {new Date(createdAt).toLocaleString(userLocale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}
    </small>
  );
}
