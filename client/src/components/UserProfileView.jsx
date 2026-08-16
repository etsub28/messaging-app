import { useState, useEffect } from "react";
import { getUserById } from "../api";

const API_URL = "https://messaging-app-production-8ef3.up.railway.app";

function UserProfileView({ userId, onBack }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getUserById(userId).then(setProfile).catch(() => setProfile(null));
  }, [userId]);

  if (!profile) return <p>Loading profile...</p>;

  const avatarSrc = profile.avatarUrl ? `${API_URL}${profile.avatarUrl}` : null;

  return (
    <div>
      <button onClick={onBack}>← Back to Users</button>
      {avatarSrc && (
        <img
          src={avatarSrc}
          alt="avatar"
          style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
        />
      )}
      <h2>{profile.username}</h2>
      <p>Bio: {profile.bio || "No bio yet"}</p>
    </div>
  );
}

export default UserProfileView;