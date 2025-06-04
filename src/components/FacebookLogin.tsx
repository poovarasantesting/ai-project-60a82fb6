import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook } from "lucide-react";
import { useEffect, useState } from "react";
import { initFacebookSDK, useFacebookStore } from "@/lib/facebook";
import { useToast } from "@/components/ui/use-toast";

export function FacebookLogin() {
  const { toast } = useToast();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const { isAuthenticated, login, logout, user } = useFacebookStore();
  
  useEffect(() => {
    const loadFacebookSDK = async () => {
      try {
        await initFacebookSDK();
        setIsSDKLoaded(true);
      } catch (error) {
        console.error("Failed to load Facebook SDK:", error);
        toast({
          title: "Error",
          description: "Failed to load Facebook SDK. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    loadFacebookSDK();
  }, [toast]);
  
  const handleLogin = async () => {
    if (!isSDKLoaded) {
      toast({
        title: "Loading",
        description: "Facebook SDK is still loading. Please wait a moment.",
      });
      return;
    }
    
    try {
      await login();
      toast({
        title: "Success",
        description: "Successfully logged in with Facebook!",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to login with Facebook",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Facebook className="h-5 w-5 text-blue-600" />
          Facebook Integration
        </CardTitle>
        <CardDescription>
          Connect with your Facebook account to view your posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {user?.picture && (
                <img 
                  src={user.picture.data.url} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full" 
                />
              )}
              <div>
                <p className="font-medium">Welcome, {user?.name}</p>
                <p className="text-sm text-muted-foreground">Connected to Facebook</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full"
            >
              Disconnect from Facebook
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!isSDKLoaded}
            onClick={handleLogin}
          >
            <Facebook className="mr-2 h-4 w-4" />
            Login with Facebook
          </Button>
        )}
      </CardContent>
    </Card>
  );
}