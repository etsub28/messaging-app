import { useState, useEffect, useRef } from "react";
import { getConversation, sendMessage } from "../api";

const API_URL = "https://messaging-app-production-8ef3.up.railway.app";

function ChatThread({ userId, currentUserId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    getConversation(userId)
      .then((data) => {
        setMessages(data.messages);
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);
      })
      .catch(() => setError("Failed to load conversation"))
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleLoadMore() {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const data = await getConversation(userId, nextCursor);
      setMessages((prev) => [...data.messages, ...prev]);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError("Failed to load more messages");
    } finally {
      setLoadingMore(false);
    }
  }

  async function refreshLatest() {
    try {
      const data = await getConversation(userId);
      setMessages(data.messages);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError("Failed to refresh conversation");
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;

    setSending(true);
    setError("");
    try {
      await sendMessage(userId, newMessage.trim() || null, imageFile);
      setNewMessage("");
      clearImage();
      refreshLatest();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <button onClick={onBack} className="text-blue-600 text-sm font-medium">
          ← Back
        </button>
      </div>

      {error && <p className="text-red-500 text-xs px-4 pt-2">{error}</p>}

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
        {loading && <p className="text-sm text-gray-500">Loading conversation...</p>}

        {!loading && hasMore && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="text-xs text-blue-600 hover:underline disabled:text-gray-400"
            >
              {loadingMore ? "Loading..." : "Load older messages"}
            </button>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <p className="text-sm text-gray-500">No messages yet. Say hi!</p>
        )}

        {messages.map((msg) => {
          const mine = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl overflow-hidden max-w-[70%] ${
                  mine ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.imageUrl && (
                  <img
                    src={`${API_URL}${msg.imageUrl}`}
                    alt="sent"
                    className="max-w-full max-h-64 object-cover"
                  />
                )}
                {msg.content && (
                  <p className="px-3 py-2 text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {imagePreview && (
        <div className="px-3 pt-2 flex items-center gap-2">
          <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
          <button
            type="button"
            onClick={clearImage}
            className="text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-200">
        <label className="cursor-pointer text-xl px-1" title="Attach image">
          📷
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            ref={fileInputRef}
            className="hidden"
          />
        </label>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300"
        >
          {sending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default ChatThread;



