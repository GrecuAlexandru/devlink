import { memo, useState, useRef } from "react";
import { useGetFeed, useCreatePost, useDeletePost, useLikePost, useUnlikePost, useAddComment, useDeleteComment } from "@/infrastructure/apis/api-management/feed";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquare, Trash2, Image as ImageIcon, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { AppRoute } from "@/routes";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

const PostCard = ({ post }: { post: any }) => {
  const currentUser = useOwnUser();
  const deletePost = useDeletePost();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();
  
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    if (post.isLikedByMe) {
      unlikePost.mutate(post.id);
    } else {
      likePost.mutate(post.id);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment.mutate({ postId: post.id, content: commentText }, {
      onSuccess: () => setCommentText("")
    });
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <Link to={post.authorId === currentUser?.id ? AppRoute.Profile : `${AppRoute.Profile}/${post.authorId}`} className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {post.author?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold hover:underline">{post.author?.name}</p>
            <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </Link>
        {post.authorId === currentUser?.id && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => deletePost.mutate(post.id)}
            disabled={deletePost.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
        
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className={`grid gap-2 ${post.imageUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {post.imageUrls.map((url: string, index: number) => (
              <img 
                key={index} 
                src={`${basePath}/api/File/${url}`} 
                alt="Post attachment" 
                className="rounded-md object-cover max-h-96 w-full"
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-muted/50 p-3 flex flex-col gap-3">
        <div className="flex w-full justify-between items-center text-sm text-muted-foreground px-2">
          <span>{post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}</span>
          <span>{post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}</span>
        </div>
        <div className="flex w-full gap-2 border-t pt-2">
          <Button 
            variant="ghost" 
            className={`flex-1 ${post.isLikedByMe ? "text-red-500 hover:text-red-600" : ""}`} 
            onClick={handleLike}
            disabled={likePost.isPending || unlikePost.isPending}
          >
            <Heart className={`mr-2 h-4 w-4 ${post.isLikedByMe ? "fill-current" : ""}`} /> 
            Like
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> 
            Comment
          </Button>
        </div>
      </CardFooter>

      {showComments && (
        <div className="p-4 border-t bg-muted/20 space-y-4">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <Input 
              value={commentText} 
              onChange={e => setCommentText(e.target.value)} 
              placeholder="Write a comment..." 
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!commentText.trim() || addComment.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-3 pt-2">
            {post.comments?.map((comment: any) => (
              <div key={comment.id} className="flex gap-3">
                <Link to={comment.authorId === currentUser?.id ? AppRoute.Profile : `${AppRoute.Profile}/${comment.authorId}`}>
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {comment.author?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 bg-muted p-3 rounded-lg overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <Link to={comment.authorId === currentUser?.id ? AppRoute.Profile : `${AppRoute.Profile}/${comment.authorId}`}>
                      <p className="font-semibold text-sm hover:underline">{comment.author?.name}</p>
                    </Link>
                    {comment.authorId === currentUser?.id && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteComment.mutate(comment.id)}
                        disabled={deleteComment.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export const FeedPage = memo(() => {
  const { data: feedData, isLoading: feedLoading } = useGetFeed();
  const createPost = useCreatePost();
  
  const [content, setContent] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const posts = feedData?.response ?? [];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && (!images || images.length === 0)) return;
    
    createPost.mutate({ content, images }, {
      onSuccess: () => {
        setContent("");
        setImages(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card className="mb-8">
        <CardContent className="p-4">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Textarea 
              placeholder="What do you want to talk about?" 
              value={content}
              onChange={e => setContent(e.target.value)}
              className="resize-none min-h-[100px]"
            />
            <div className="flex items-center justify-between">
              <div>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={e => setImages(e.target.files)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Photo {images && images.length > 0 && `(${images.length})`}
                </Button>
              </div>
              <Button type="submit" disabled={(!content.trim() && (!images || images.length === 0)) || createPost.isPending}>
                Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {feedLoading ? (
          <p className="text-center text-muted-foreground">Loading feed...</p>
        ) : posts.length > 0 ? (
          posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center bg-muted/30 rounded-lg p-8">
            <h3 className="font-semibold mb-2">No posts yet</h3>
            <p className="text-sm text-muted-foreground">Connect with more people to see their posts here!</p>
          </div>
        )}
      </div>
    </div>
  );
});
