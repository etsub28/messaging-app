import "./App.css";
import { useState, useEffect } from "react";
import { getMe } from "./api";
import Login from "./components/Login";
import Profile from "./components/Profile";
import UsersList from "./components/UsersList";
import Inbox from "./components/Inbox";
import ChatThread from "./components/ChatThread";
import Signup from "./components/Signup";
import Friends from "./components/Friends";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chattingWithId, setChattingWithId] = useState(null);
  const [tab, setTab] = useState("inbox");
  const [authView, setAuthView] = useState("login"); // "login" or "signup"

  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Messaging App
        </h1>
        {authView === "login" ? (
          <Login onLogin={(u) => setUser(u)} />
        ) : (
          <Signup onSignup={(u) => setUser(u)} />
        )}
        <p className="text-center text-sm text-gray-500 mt-4">
          {authView === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setAuthView("signup")}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setAuthView("login")}
                className="text-blue-600 font-medium hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold text-lg">Messaging App</h1>
        </div>

        {chattingWithId ? (
          <ChatThread
            userId={chattingWithId}
            currentUserId={user.id}
            onBack={() => setChattingWithId(null)}
          />
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <Profile
              user={user}
              onLogout={() => setUser(null)}
              onUpdate={(updated) => setUser(updated)}
            />

<div className="flex border-b border-gray-200">
  <button
    onClick={() => setTab("inbox")}
    className={`flex-1 py-2 text-sm font-medium ${
      tab === "inbox"
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500"
    }`}
  >
    Inbox
  </button>
  <button
    onClick={() => setTab("friends")}
    className={`flex-1 py-2 text-sm font-medium ${
      tab === "friends"
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500"
    }`}
  >
    Friends
  </button>
  <button
    onClick={() => setTab("users")}
    className={`flex-1 py-2 text-sm font-medium ${
      tab === "users"
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500"
    }`}
  >
    Browse Users
  </button>
</div>

<div className="flex-1 overflow-y-auto">
  {tab === "inbox" && (
    <Inbox onSelectConversation={(id) => setChattingWithId(id)} />
  )}
  {tab === "friends" && (
    <Friends onSelectFriend={(id) => setChattingWithId(id)} />
  )}
  {tab === "users" && (
    <UsersList onSelectUser={(id) => setChattingWithId(id)} />
  )}
</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


