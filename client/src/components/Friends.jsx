import { useState, useEffect } from "react";
import {
  getFriendsList,
  getPendingRequests,
  respondToFriendRequest,
} from "../api";

const API_URL = "http://localhost:3000";
const POLL_INTERVAL = 5000; // 5 seconds

function Friends({ onSelectFriend }) {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function loadData() {
    Promise.all([getFriendsList(), getPendingRequests()])
      .then(([friendsData, pendingData]) => {
        setFriends(friendsData);
        setPending(pendingData);
      })
      .catch(() => setError("Failed to load friends"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  async function handleRespond(requestId, action) {
    try {
      await respondToFriendRequest(requestId, action);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="p-4 text-sm text-gray-500">Loading friends...</p>;

  return (
    <div>
      {error && <p className="text-red-500 text-xs px-4 pt-2">{error}</p>}

      {pending.length > 0 && (
        <div className="border-b border-gray-200">
          <h4 className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase">
            Friend Requests
          </h4>
          {pending.map((req) => (
            <div key={req.id} className="flex items-center gap-3 px-4 py-2">
              {req.requester.avatarUrl ? (
                <img
                  src={`${API_URL}${req.requester.avatarUrl}`}
                  alt={req.requester.username}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">
                  {req.requester.username[0].toUpperCase()}
                </div>
              )}
              <span className="flex-1 text-sm font-medium text-gray-800">
                {req.requester.username}
              </span>
              <button
                onClick={() => handleRespond(req.id, "accept")}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded-md"
              >
                Accept
              </button>
              <button
                onClick={() => handleRespond(req.id, "reject")}
                className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      )}

      <h4 className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase">
        Friends
      </h4>
      {friends.length === 0 && (
        <p className="px-4 pb-3 text-sm text-gray-500">No friends yet. Add some from Browse Users!</p>
      )}
      {friends.map((f) => (
        <div
          key={f.id}
          onClick={() => onSelectFriend(f.id)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
        >
          <div className="relative">
            {f.avatarUrl ? (
              <img
                src={`${API_URL}${f.avatarUrl}`}
                alt={f.username}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                {f.username[0].toUpperCase()}
              </div>
            )}
            {f.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{f.username}</p>
            <p className="text-xs text-gray-400">{f.online ? "Online" : "Offline"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Friends;