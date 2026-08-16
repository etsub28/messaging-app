import { useState, useEffect } from "react";
import { getConversationsList } from "../api";

const API_URL = "https://messaging-app-production-8ef3.up.railway.app";

function Inbox({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversationsList()
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4 text-sm text-gray-500">Loading conversations...</p>;
  if (conversations.length === 0)
    return <p className="p-4 text-sm text-gray-500">No conversations yet. Message someone from Browse Users!</p>;

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((c) => (
        <div
          key={c.user.id}
          onClick={() => onSelectConversation(c.user.id)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
        >
          {c.user.avatarUrl ? (
            <img
              src={`${API_URL}${c.user.avatarUrl}`}
              alt={c.user.username}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
              {c.user.username[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 text-sm">{c.user.username}</p>
            <p className="text-xs text-gray-500 truncate">{c.lastMessage.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Inbox;
