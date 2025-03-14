"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPost } from "@/types";
import Loader from "@/components/Loader";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogCard({ blog }: { blog: BlogPost }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false); // Local state for navigation
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for delete confirmation dialog

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/blogs/${blog._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setIsDialogOpen(false); // Close dialog on success
    },
    onError: () => {
      setIsDialogOpen(false); // Close dialog on error (optional: add error handling)
    },
  });

  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };

  const handleDelete = () => {
    setIsDialogOpen(true); // Open the dialog instead of native confirm
  };

  const handleNavigate = async (path: string) => {
    setIsNavigating(true);
    await router.push(path); // Wait for navigation (client-side)
    setIsNavigating(false); // Note: This won’t run post-navigation, but kept for consistency
  };

  return (
    <>
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        {/* Card Content */}
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2 hover:text-blue-400 transition-colors duration-300 truncate">
            {blog.title}
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-4 line-clamp-3">
            {blog.content}
          </p>
          <p className="text-sm text-gray-400 italic mb-4">
            By{" "}
            <span className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300">
              {blog.author?.username ?? "Unknown Author"}
            </span>{" "}
            on{" "}
            <span className="font-semibold">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleNavigate(`/blogs/${blog._id}`)}
              className={`relative flex items-center px-4 py-2 rounded-full text-white font-medium transition-all duration-300 ${
                isNavigating
                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 hover:shadow-lg hover:scale-105"
              }`}
              disabled={isNavigating}
            >
              {isNavigating ? <Loader /> : "Read More"}
              {!isNavigating && (
                <span className="absolute inset-0 rounded-full border border-blue-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>

            {user?._id === blog.author?._id && (
              <>
                <button
                  onClick={() => handleNavigate(`/blogs/edit/${blog._id}`)}
                  className={`relative flex items-center px-4 py-2 rounded-full text-white font-medium transition-all duration-300 ${
                    isNavigating
                      ? "bg-gray-600 opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 hover:shadow-lg hover:scale-105"
                  }`}
                  disabled={isNavigating}
                >
                  {isNavigating ? <Loader /> : "Edit"}
                  {!isNavigating && (
                    <span className="absolute inset-0 rounded-full border border-green-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
                <button
                  onClick={handleDelete}
                  className={`relative flex items-center px-4 py-2 rounded-full text-white font-medium transition-all duration-300 ${
                    deleteMutation.isPending || isNavigating
                      ? "bg-gray-600 opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:scale-105"
                  }`}
                  disabled={deleteMutation.isPending || isNavigating}
                >
                  {deleteMutation.isPending ? <Loader /> : "Delete"}
                  {!deleteMutation.isPending && !isNavigating && (
                    <span className="absolute inset-0 rounded-full border border-red-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 animate-fadeInUp">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "<span className="font-semibold text-blue-400">{blog.title}</span>"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="relative px-4 py-2 rounded-full text-white font-medium bg-gray-700 hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className={`relative flex items-center px-4 py-2 rounded-full text-white font-medium transition-all duration-300 ${
                  deleteMutation.isPending
                    ? "bg-gray-600 opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:scale-105"
                }`}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? <Loader /> : "Delete"}
                {!deleteMutation.isPending && (
                  <span className="absolute inset-0 rounded-full border border-red-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}