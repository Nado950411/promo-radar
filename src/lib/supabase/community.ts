import { createClient } from './client';

export type PostDB = {
  id: string;
  created_at: string;
  user_id: string;
  user_name: string;
  user_avatar_url: string | null;
  user_level: string;
  product_name: string;
  product_emoji: string;
  price: number;
  original_price: number;
  store_name: string;
  store_emoji: string;
  neighborhood: string;
  votes: number;
  comments: number;
  verified: boolean;
};

export type NewPost = Omit<PostDB, 'id' | 'created_at' | 'votes' | 'comments' | 'verified'>;

export async function fetchPosts(): Promise<PostDB[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) throw error;
  return data ?? [];
}

export async function fetchUserVotes(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('post_votes')
    .select('post_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []).map(v => v.post_id);
}

export async function toggleVote(postId: string, userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('toggle_vote', {
    p_post_id: postId,
    p_user_id: userId,
  });

  if (error) throw error;
  return data as boolean;
}

export async function createPost(post: NewPost): Promise<PostDB> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('community_posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data as PostDB;
}