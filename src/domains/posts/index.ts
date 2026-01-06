// Public API for posts domain

export type { TPost } from './api/posts';
export { fetchPostById, fetchPosts, getPostById, getPosts } from './api/posts';
export { default as PostCard } from './components/PostCard';
