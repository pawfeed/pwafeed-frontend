const BASE_URL = "http://localhost:8081";

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


