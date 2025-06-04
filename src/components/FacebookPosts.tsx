import { useEffect, useState } from "react";
import { FacebookPost, useFacebookStore } from "@/lib/facebook";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

export function FacebookPosts() {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, fetchPosts } = useFacebookStore();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadPosts = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        toast({
          title: "Error",
          description: "Failed to load your Facebook posts. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, [isAuthenticated, fetchPosts, toast]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="space-y-6 my-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Facebook Posts</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setIsLoading(true);
            fetchPosts()
              .then(posts => {
                setPosts(posts);
                toast({
                  title: "Refreshed",
                  description: "Your posts have been refreshed.",
                });
              })
              .catch(error => {
                toast({
                  title: "Error",
                  description: "Failed to refresh posts.",
                  variant: "destructive"
                });
              })
              .finally(() => setIsLoading(false));
          }}
          disabled={isLoading}
        >
          Refresh Posts
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-0">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent className="py-4">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <Facebook className="h-10 w-10 text-blue-600 opacity-50" />
              <p className="text-muted-foreground">No posts found on your Facebook account</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">
                  {post.message?.substring(0, 60) || "Facebook Post"}
                  {post.message && post.message.length > 60 ? "..." : ""}
                </CardTitle>
                <CardDescription>
                  {formatDistanceToNow(new Date(post.created_time), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              
              {post.full_picture && (
                <div className="px-6">
                  <img 
                    src={post.full_picture} 
                    alt="Post attachment" 
                    className="w-full rounded-md object-cover max-h-[300px]"
                  />
                </div>
              )}
              
              <CardContent className="py-4">
                {post.message ? (
                  <p>{post.message}</p>
                ) : (
                  <p className="text-muted-foreground italic">This post has no text content</p>
                )}
              </CardContent>
              
              {post.permalink_url && (
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    asChild
                  >
                    <a href={post.permalink_url} target="_blank" rel="noopener noreferrer">
                      View on Facebook
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}