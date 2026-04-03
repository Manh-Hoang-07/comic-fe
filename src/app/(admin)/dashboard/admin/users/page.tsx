"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/UI/DataDisplay/DataTable";
import { Button } from "@/components/UI/Navigation/Button";
import FormField from "@/components/UI/Forms/FormField";
import Modal from "@/components/UI/Feedback/Modal";
import { useToastContext } from "@/contexts/ToastContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  // Mock data - in real app, this would be fetched from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          createdAt: "2023-01-15",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          createdAt: "2023-01-10",
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "user",
          createdAt: "2023-01-05",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateUser = () => {
    // In real app, this would call API

    // Reset form
    setFormData({
      name: "",
      email: "",
      role: "user",
      password: "",
    });

    // Close modal
    setIsCreateModalOpen(false);

    // Show success message (in real app, this would be a toast)
    showSuccess("User created successfully!");
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    // In real app, this would call API

    // Close modal
    setIsEditModalOpen(false);
    setSelectedUser(null);

    // Reset form
    setFormData({
      name: "",
      email: "",
      role: "user",
      password: "",
    });

    // Show success message (in real app, this would be a toast)
    showSuccess("User updated successfully!");
  };

  const handleDeleteUser = (userId: string) => {
    // In real app, this would call API

    // Show confirmation dialog
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));

      // Show success message (in real app, this would be a toast)
      showSuccess("User deleted successfully!");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users Management</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Users</h2>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Add User
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-2 text-gray-600">Loading users...</p>
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
                  Showing {users.length} results
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
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

      {/* Create User Modal */}
      <Modal
        show={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create User"
        size="md"
      >
        <div className="space-y-4">
          <FormField
            id="name"
            name="name"
            type="text"
            label="Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />

          <FormField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            required
          />

          <FormField
            id="role"
            name="role"
            type="select"
            label="Role"
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value })}
            options={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
            ]}
            required
          />

          <FormField
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
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
          <Button onClick={handleCreateUser}>
            Create User
          </Button>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        show={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="md"
      >
        <div className="space-y-4">
          <FormField
            id="name"
            name="name"
            type="text"
            label="Name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />

          <FormField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            required
          />

          <FormField
            id="role"
            name="role"
            type="select"
            label="Role"
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value })}
            options={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
            ]}
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
          <Button onClick={handleEditUser}>
            Update User
          </Button>
        </div>
      </Modal>
    </div>
  );
}

