const BASE_URL = "http://localhost:8081";

export const checkFollow = async (userId, followerId) => {
  const res = await fetch(
    `http://localhost:8081/users/${userId}/is-following?followerId=${followerId}`
  );
  return res.json();
};

export const follow = async (userId, followerId) => {
  await fetch(
    `http://localhost:8081/users/${userId}/follow?followerId=${followerId}`,
    { method: "POST" }
  );
};

export const unfollow = async (userId, followerId) => {
  await fetch(
    `http://localhost:8081/users/${userId}/unfollow?followerId=${followerId}`,
    { method: "DELETE" }
  );
};

export const createPost = async (file, caption, userId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("caption", caption);
  formData.append("userId", userId);

  const res = await fetch("http://localhost:8081/posts", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
  const text = await res.text();
  console.error("Backend error:", text);
  throw new Error("Upload failed");
}

return await res.json();

  return res.json();
};



export const getProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/profile`);
  return res.json();
};


export const likePost =async(postId , userId ) => {
  const res = await fetch(
    `http://localhost:8081/posts/${postId}/like?userId=${userId}`,
    {
      method: "POST"
    }
  );
  return await res.text();
};


export const getLikes = async (postId) => {
    const res = await fetch(`http://localhost:8081/posts/${postId}/likes`);
    const count = await res.json();
    return count; 
};

export const unlikePost = async (postId, userId) => {
  const res = await fetch (
    `http://localhost:8081/posts/${postId}/like?userId=${userId}`,
    {
      method:"DELETE",
    }
  );
  return await res.text();
}

export const getFeed = async (userId) =>{
  const res = await fetch(`http://localhost:8081/posts/feed?userId=${userId}`);
  return res.json()
}

export const getComments = async(postId) => {
  const res = await fetch(
    `http://localhost:8081/comments/${postId}`);
    return res.json();
};

export const addComment = async (postId, userId, text) => {
  const res = await fetch("http://localhost:8081/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId,
      userId,
      text,
    }),
  
  });





  return res.json();
};
