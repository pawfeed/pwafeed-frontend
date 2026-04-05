import React, { useEffect, useState } from "react";
import {
  getProfile,
  createPost,
  likePost,
  getLikes,
  unlikePost,
  getComments,
  addComment
} from "./api";

function App() {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");

  const [likes, setLikes] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    getProfile(16).then(data => setProfile(data));
  }, []);

  useEffect(() => {
    if (!profile) return;
    profile.posts.forEach(post => {
      getLikes(post.id).then(count => {
        setLikes(prev => ({ ...prev, [post.id]: count }));
      });
    });
  }, [profile]);

  const handleLike = async (postId) => {
    try {
      if (likedPosts[postId]) {
        await unlikePost(postId, 16);

        setLikes(prev => ({
          ...prev,
          [postId]: Math.max((prev[postId] ?? 0) - 1, 0),
        }));

        setLikedPosts(prev => ({ ...prev, [postId]: false }));
      } else {
        await likePost(postId, 16);

        setLikes(prev => ({
          ...prev,
          [postId]: (prev[postId] ?? 0) + 1,
        }));

        setLikedPosts(prev => ({ ...prev, [postId]: true }));
      }
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  if (!profile) return <h1 className="text-center mt-10">Loading...</h1>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-4 rounded-xl shadow">

      {/* PROFILE */}
      <div className="flex items-center gap-5">
        <img
          src="https://i.pravatar.cc/150"
          alt=""
          className="w-24 h-24 rounded-full object-cover"
        />

        <div>
          <h2 className="text-xl font-semibold">{profile.user.name}</h2>
          <p className="text-gray-500">{profile.user.bio}</p>

          <div className="flex gap-4 mt-2 text-sm">
            <span><b>{profile.posts.length}</b> posts</span>
            <span><b>{profile.followersCount}</b> followers</span>
            <span><b>{profile.followingCount}</b> following</span>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 mt-4">
        <button className="bg-blue-500 text-white px-5 py-2 rounded-lg">
          Follow
        </button>

        <button className="border px-5 py-2 rounded-lg">
          Message
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Post
        </button>
      </div>

      <div className="border-t mt-6"></div>

      {/* POSTS GRID */}
      <div className="grid grid-cols-3 gap-1 mt-4">
        {profile.posts.length === 0 ? (
          <p className="col-span-3 text-center text-gray-400">
            No posts yet
          </p>
        ) : (
          profile.posts.map(post => (
            <div key={post.id} className="relative">

              <img
                src={post.imageUrl}
                alt=""
                onClick={async () => {
                  setSelectedPost(post);
                  const data = await getComments(post.id);
                  setComments(Array.isArray(data) ? data : []);
                }}
                className="w-full object-cover aspect-square cursor-pointer"
                onDoubleClick={() => console.log("DOUBLE CLICK")}
              />

              <div className="absolute bottom-1 left-1 flex items-center gap-1">
                <button
                  onClick={() => handleLike(post.id)}
                  className="text-lg"
                  style={{ color: likedPosts[post.id] ? "red" : "white" }}
                >
                  ❤️
                </button>

                <span className="text-white text-xs font-semibold drop-shadow">
                  {likes[post.id] ?? 0}
                </span>
              </div>

            </div>
          ))
        )}
      </div>

      {/* UPLOAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white w-[500px] p-4 rounded-xl">

            <h2 className="text-lg font-semibold mb-3">Create new post</h2>

            <input
              type="file"
              accept="image/*"
              className="border p-2 w-full"
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
                setPreview(URL.createObjectURL(file));
              }}
            />

            {preview && (
              <img
                src={preview}
                alt=""
                className="mt-3 w-full h-60 object-cover rounded"
              />
            )}

            <input
              type="text"
              placeholder="Write caption..."
              className="border p-2 w-full mt-2"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!selectedFile) {
                    alert("Select image first");
                    return;
                  }

                  try {
                    const newPost = await createPost(selectedFile, caption, 16);

                    setProfile({
                      ...profile,
                      posts: [newPost, ...profile.posts],
                    });

                    setShowModal(false);
                    setSelectedFile(null);
                    setPreview(null);
                    setCaption("");
                  } catch (err) {
                    console.error(err);
                    alert("Upload failed");
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Share
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POST VIEW MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">

          <div className="bg-white w-[700px] rounded-xl overflow-hidden flex">

            {/* IMAGE */}
            <div className="w-1/2 bg-black">
              <img
                src={selectedPost.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* DETAILS */}
            <div className="w-1/2 p-4 flex flex-col">

              <h3 className="font-semibold mb-2">
                {profile.user.name}
              </h3>

              <p className="text-sm text-gray-700 mb-4">
                {selectedPost.caption}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(selectedPost.id)}
                  className="text-xl"
                  style={{
                    color: likedPosts[selectedPost.id] ? "red" : "black",
                  }}
                >
                  ❤️
                </button>

                <span>{likes[selectedPost.id] ?? 0} likes</span>
              </div>

              {/* COMMENTS */}
              <div className="mt-4 max-h-40 overflow-y-auto">
                {Array.isArray(comments) &&
                  comments.map((c) => (
                    <p key={c.id} className="text-sm border-b py-1">
                      {c.text}
                    </p>
                  ))}
              </div>

              {/* ADD COMMENT */}
              <div className="flex mt-3 gap-2">
                <input
                  type="text"
                  placeholder="Add comment..."
                  className="border p-2 flex-1"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <button
                  onClick={async () => {
                    if (!newComment.trim()) return;

                    await addComment(selectedPost.id, 16, newComment);

                    const updated = await getComments(selectedPost.id);
                    setComments(Array.isArray(updated) ? updated : []);

                    setNewComment("");
                  }}
                  className="bg-blue-500 text-white px-3"
                >
                  Post
                </button>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="mt-auto border p-2 rounded"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;