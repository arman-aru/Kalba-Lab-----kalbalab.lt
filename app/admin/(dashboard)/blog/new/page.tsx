import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/blog/PostForm";

export const metadata = { title: "New post · Blog" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-300 mb-1">
            <ArrowLeft size={12} /> Back to posts
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-100">New blog post</h1>
        </div>
      </div>

      <PostForm />
    </div>
  );
}
