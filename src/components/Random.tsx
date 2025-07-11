import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
interface PostType {
    id: number,
    title: string,
    body: string
}

export const getPosts = async () => await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json());
export const getPost = async (postId: number) => await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.json());
export const getComments = async (postId: number) => await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`).then(res => res.json());
export const fetchPostsPaginated = async (page: number, limit: number = 15) => await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`).then(res => res.json());


const Random = () => {
    const [ page, setPages ] = useState(1)
    const [ postId, setPostId ] = useState(null);
    const [ searchTerm, setSearchTerm ] = useState('');

    const { data: post, isLoading: postLoading, isError: isPostError, error: postError } = useQuery({queryKey: ['post', postId], queryFn: () => getPost(postId)});
    const { data: comments, isLoading: commentsLoading, isError: isCommentsErrore, error: commentsError  } =  useQuery({queryKey: ['comments', postId], queryFn: () => getComments(postId)});
    const {data: posts, isLoading: postsLoading, isError: isPostsError, error: postsError} = useQuery({queryKey: ['posts', page], queryFn: () => fetchPostsPaginated(page)})


    const handleNext = () => setPages(prev => prev + 1);
    const handlePrev = () => setPages(prev => Math.max(prev - 1, 1))

    const filteredPosts = searchTerm ? posts.filter((post: PostType) => post.title.toLowerCase().includes(searchTerm.toLowerCase())) : posts;
        

    if(postsLoading) return <h1>Loading...</h1>
    if(isCommentsErrore) return <h1>comment errre</h1>
    if(isPostsError) return <h1>Error: {postsError.message}</h1>
    if(isPostError) return <h1>Error: {postError.message}</h1>

    return (
        <>
        <div className="blog">
            <div className="posts">
                <div className="header">
                    <h1>Posts List: {!postId ? 'selected post' : `postID: ${postId}`}</h1>
                </div>
                <div className="posts-container">
                    <form onSubmit={() => {}} className="search-bar">
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" />
                        <button>🔍</button>
                    </form>
                    {filteredPosts?.map((post: PostType) => (
                        <div className="post" key={post.id} onClick={() => setPostId(post.id)}>
                            <h2>{post.title}</h2>
                        </div>
                    ))}
                    <div className="buttons">
                        <button onClick={handlePrev} disabled={page===1}>prev</button>
                        <p>{page}</p>             
                        <button onClick={handleNext} disabled={page > (100/15)}>next</button>                      
                    </div>
                </div>
            </div>
            <div className="post-layout">
                {postId ? (
                        <div className="post-detail">
                            {postLoading ? 'Loading...' : <h1>{post.title}</h1>}
                            <div className="comments-container">
                                <h2>Comments:</h2>
                                {commentsLoading ? 'Loading comments...' : comments.map(comment => (
                                    <div key={comment.id} className='comment'>
                                        <strong>{comment.email}</strong>
                                        <p>{comment.body}</p>
                                    </div>  
                                ))}
                            </div>
                        </div>
                    ) : <h3>Select some Post to See Detailed</h3>
                }
            </div>       
        </div>
        </>
    )
}
export default Random