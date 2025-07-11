import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
const API_BASE = 'https://jsonplaceholder.typicode.com';
export const getPosts = () => fetch(`${API_BASE}/posts`).then(res => res.json());
export const getPost = (id: number) => fetch(`${API_BASE}/posts/${id}`).then(res => res.json());
export const getComments = (postId: number) => fetch(`${API_BASE}/posts/${postId}/comments`).then(res => res.json());

// hooks/useBlog.js
export const usePosts = () => useQuery({ queryKey: ['posts'], queryFn: getPosts });
export const usePost = (postId: number) => useQuery({
    queryKey: ['post', postId], 
    queryFn: () => getPost(postId),
    enabled: !!postId // მოთხოვნა შესრულდება მხოლოდ მაშინ, როცა postId არსებობს
});
export const useComments = (postId: number) => useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId
});

// components/BlogApp.js
function BlogApp() {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: post, isLoading: postLoading } = usePost(selectedPostId);
  const { data: comments, isLoading: commentsLoading } = useComments(selectedPostId);

  if (postsLoading) return <div>იტვირთება პოსტები...</div>;

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <h2>ბლოგის პოსტები</h2>
        {posts?.slice(0, 5).map(p => (
          <div key={p.id} onClick={() => setSelectedPostId(p.id)} style={{ padding: '10px', border: '1px solid #ccc', margin: '5px', cursor: 'pointer', backgroundColor: selectedPostId === p.id ? '#e3f2fd' : 'white' }}>
            <h4>{p.title}</h4>
          </div>
        ))}
      </div>
      
      <div style={{ flex: 2 }}>
        {selectedPostId ? (
          <div>
            {postLoading ? <div>იტვირთება პოსტი...</div> : post && <h2>{post.title}</h2>}
            <h3>კომენტარები</h3>
            {commentsLoading ? <div>იტვირთება კომენტარები...</div> : comments?.map(c => (
              <div key={c.id} style={{ borderTop: '1px solid #eee', padding: '10px', marginTop: '5px' }}>
                <strong>{c.email}</strong>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <h3>აირჩიეთ პოსტი დეტალების სანახავად</h3>
        )}
      </div>
    </div>
  );
}

export default BlogApp