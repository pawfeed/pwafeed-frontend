import React, { useState } from "react";
import Feed from "./Feed";
import Profile from "./Profile";

function App() {
  const [page, setPage] = useState("profile");

  return (
    <div>
      {/* TEMP NAVBAR */}
      <div className="flex justify-center gap-4 p-4 border-b">
        <button
          onClick={() => setPage("feed")}
          className="px-4 py-1 border rounded"
        >
          Feed
        </button>

        <button
          onClick={() => setPage("profile")}
          className="px-4 py-1 border rounded"
        >
          Profile
        </button>
      </div>

      {page === "feed" ? <Feed /> : <Profile />}
    </div>
  );
}

export default App;