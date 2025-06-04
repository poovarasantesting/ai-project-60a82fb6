import { FacebookLogin } from "@/components/FacebookLogin";
import { FacebookPosts } from "@/components/FacebookPosts";
import { Toaster } from "@/components/ui/toaster";

export default function FacebookPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Facebook Integration</h1>
      
      <div className="mb-8">
        <FacebookLogin />
      </div>
      
      <FacebookPosts />
      
      <Toaster />
    </div>
  );
}