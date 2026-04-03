"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/UI/DataDisplay/DataTable";
import { Button } from "@/components/UI/Navigation/Button";
import FormField from "@/components/UI/Forms/FormField";
import Modal from "@/components/UI/Feedback/Modal";
import { useToastContext } from "@/contexts/ToastContext";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    status: "draft" as "draft" | "published" | "archived",
    content: "",
  });

  // Mock data - in real app, this would be fetched from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts([
        {
          id: "1",
          title: "Getting Started with Next.js",
          slug: "getting-started-with-nextjs",
          status: "published",
          createdAt: "2023-01-15",
          updatedAt: "2023-01-15",
        },
        {
          id: "2",
          title: "Understanding React Hooks",
          slug: "understanding-react-hooks",
          status: "published",
          createdAt: "2023-01-10",
          updatedAt: "2023-01-12",
        },
        {
          id: "3",
          title: "TypeScript Best Practices",
          slug: "typescript-best-practices",
          status: "draft",
          createdAt: "2023-01-05",
          updatedAt: "2023-01-05",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreatePost = () => {
    // In real app, this would call API

    // Reset form
    setFormData({
      title: "",
      slug: "",
      status: "draft",
      content: "",
    });

    // Close modal
    setIsCreateModalOpen(false);

    // Show success message
    showSuccess("Post created successfully!");
  };

  const handleEditPost = () => {
    if (!selectedPost) return;

    // In real app, this would call API

    // Close modal
    setIsEditModalOpen(false);
    setSelectedPost(null);

    // Reset form
    setFormData({
      title: "",
      slug: "",
      status: "draft",
      content: "",
    });

    // Show success message
    showSuccess("Post updated successfully!");
  };

  const handleDeletePost = (postId: string) => {
    // In real app, this would call API

    // Show confirmation dialog
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(post => post.id !== postId));

      // Show success message
      showSuccess("Post deleted successfully!");
    }
  };

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      status: post.status,
      content: "",
    });
    setIsEditModalOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: any) => {
    const title = value;
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Posts Management</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Posts</h2>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Add Post
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-2 text-gray-600">Loading posts...</p>
          </div>
        ) : (
          <DataTable
            actions={
              <Button variant="ghost" size="sm">
                Export
              </Button>
            }
            pagination={
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Showing {posts.length} results
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            }
          >
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="px-4 py-3">{post.title}</td>
                  <td className="px-4 py-3">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${post.status === "published"
                      ? "bg-green-100 text-green-800"
                      : post.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                      }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{post.createdAt}</td>
                  <td className="px-4 py-3">{post.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(post)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </div>

      {/* Create Post Modal */}
      <Modal
        show={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Post"
        size="lg"
      >
        <div className="space-y-4">
          <FormField
            id="title"
            name="title"
            type="text"
            label="Title"
            value={formData.title}
            onChange={handleTitleChange}
            required
          />

          <FormField
            id="slug"
            name="slug"
            type="text"
            label="Slug"
            value={formData.slug}
            onChange={(value) => setFormData({ ...formData, slug: value })}
            required
          />

          <FormField
            id="status"
            name="status"
            type="select"
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as "draft" | "published" | "archived" })}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
            required
          />

          <FormField
            id="content"
            name="content"
            type="textarea"
            label="Content"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            rows={10}
            required
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="secondary"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreatePost}>
            Create Post
          </Button>
        </div>
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Post"
        size="lg"
      >
        <div className="space-y-4">
          <FormField
            id="title"
            name="title"
            type="text"
            label="Title"
            value={formData.title}
            onChange={handleTitleChange}
            required
          />

          <FormField
            id="slug"
            name="slug"
            type="text"
            label="Slug"
            value={formData.slug}
            onChange={(value) => setFormData({ ...formData, slug: value })}
            required
          />

          <FormField
            id="status"
            name="status"
            type="select"
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as "draft" | "published" | "archived" })}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ]}
            required
          />

          <FormField
            id="content"
            name="content"
            type="textarea"
            label="Content"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            rows={10}
            required
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="secondary"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleEditPost}>
            Update Post
          </Button>
        </div>
      </Modal>
    </div>
  );
}

