import { useState } from "react";
import { logout, updateProfile, uploadAvatar } from "../api";

const API_URL = "http://localhost:3000";

function Profile({ user, onLogout, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleLogout() {
    await logout();
    onLogout();
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    try {
      const updated = await updateProfile({ username, bio });
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      setError("Could not update profile (username may be taken)");
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const updated = await uploadAvatar(file);
      onUpdate(updated);
    } catch (err) {
      setError("Avatar upload failed");
    } finally {
      setUploading(false);
    }
  }

  const avatarSrc = user.avatarUrl ? `${API_URL}${user.avatarUrl}` : null;

  if (editing) {
    return (
      <form onSubmit={handleSave} className="p-4 space-y-3 border-b border-gray-200">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        {avatarSrc ? (
          <img src={avatarSrc} alt="avatar" className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
            {user.username[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{user.username}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-2">{user.bio || "No bio yet"}</p>

      <div className="mt-2">
        <label className="text-xs text-gray-500">Change avatar:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={uploading}
          className="block text-xs mt-1"
        />
        {uploading && <p className="text-xs text-gray-400">Uploading...</p>}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setEditing(true)}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Profile;



