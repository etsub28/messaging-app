import { useState, useEffect } from "react";
import { getAllUsers, sendFriendRequest } from "../api";

const API_URL = "http://localhost:3000";

function UsersList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState({});

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleAddFriend(userId, e) {
    e.stopPropagation();
    try {
      await sendFriendRequest(userId);
      setSentRequests((prev) => ({ ...prev, [userId]: true }));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="p-4 text-sm text-gray-500">Loading users...</p>;
  if (users.length === 0) return <p className="p-4 text-sm text-gray-500">No other users yet.</p>;

  return (
    <div className="divide-y divide-gray-100">
      {users.map((u) => (
        <div
          key={u.id}
          onClick={() => onSelectUser(u.id)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
        >
          {u.avatarUrl ? (
            <img
              src={`${API_URL}${u.avatarUrl}`}
              alt={u.username}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
              {u.username[0].toUpperCase()}
            </div>
          )}
          <p className="font-medium text-gray-800 text-sm flex-1">{u.username}</p>
          <button
            onClick={(e) => handleAddFriend(u.id, e)}
            disabled={sentRequests[u.id]}
            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
          >
            {sentRequests[u.id] ? "Sent" : "Add Friend"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default UsersList;
