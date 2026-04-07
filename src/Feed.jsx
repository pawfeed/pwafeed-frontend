import React, { useEffect, useState } from "react";
import { getFeed } from "./api";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getFeed(16).then(data => {
      setPosts(data);
    });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-md mx-auto">

        <h1 className="text-xl font-semibold p-4">Feed</h1>

        {posts.map(post => (
          <div key={post.id} className="mb-6">

            <img
              src={post.imageUrl}
              alt=""
              className="w-full"
            />

            <p className="px-3 mt-2">{post.caption}</p>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Feed;