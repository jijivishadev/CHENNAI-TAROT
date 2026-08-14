"use client";

import { useState, useEffect } from "react";
import BlogUploadForm, { BlogUploadFormValues } from "./BlogUploadForm";
import { BlogPostRecord, createBlogPost, deleteBlogPost, getBlogPosts, updateBlogPost } from "@/lib/firebaseServices";

export default function BlogBuilder() {
  const [posts, setPosts] = useState<BlogPostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: BlogUploadFormValues) => {
    setSubmitting(true);
    setError("");
    try {
      if (editingPost) {
        await updateBlogPost(editingPost.id, {
          title: values.title,
          shortDescription: values.shortDescription,
          imageUrl: values.imageUrl,
          imageFile: values.imageFile,
          keywords: values.keywords,
          richContent: values.richContent,
          author: values.author,
          readTime: values.readTime,
          onImageUploadProgress: (progress: number) => setUploadProgress(progress),
        });
      } else {
        await createBlogPost({
          title: values.title,
          shortDescription: values.shortDescription,
          imageUrl: values.imageUrl,
          imageFile: values.imageFile,
          keywords: values.keywords,
          richContent: values.richContent,
          author: values.author,
          readTime: values.readTime,
          onImageUploadProgress: (progress: number) => setUploadProgress(progress),
        });
      }
      setShowForm(false);
      setEditingPost(null);
      await fetchPosts();
    } catch (err) {
      console.error(err);
      setError("Save failed. Check console.");
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Advanced Blog Builder</h1>
      <button
        onClick={() => {
          setShowForm(!showForm);
          if (showForm) setEditingPost(null);
        }}
        className="bg-[#D4AF37] px-4 py-2 rounded"
      >
        {showForm ? "Cancel" : "+ Add New Blog Post"}
      </button>

      {showForm && (
        <div className="mt-6 border p-4 rounded">
          <BlogUploadForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isSubmitting={submitting}
            uploadProgress={uploadProgress}
            initialValues={editingPost || undefined}
            submitLabel={editingPost ? "Update Post" : "Create Post"}
          />
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded">
            <h3 className="font-bold">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.shortDescription}</p>
            <button
              onClick={() => {
                setEditingPost(post);
                setShowForm(true);
              }}
              className="text-blue-600 mr-2"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                if (confirm("Delete this post?")) {
                  await deleteBlogPost(post.id);
                  await fetchPosts();
                }
              }}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}