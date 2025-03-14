"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema } from "@/utils/validation";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, use } from "react";
import Loader from "@/components/Loader";

type BlogForm = {
  title: string;
  content: string;
};

type BlogPost = {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; username: string; email: string };
};

// Define an interface for the error object
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); // Unwrap params with React.use()
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: blog, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["blog", resolvedParams.id],
    queryFn: async () => {
      const { data } = await api.get(`/blogs/${resolvedParams.id}`);
      return data;
    },
    enabled: !!resolvedParams.id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    if (blog) {
      reset({ title: blog.title, content: blog.content });
    }
  }, [blog, reset]);

  const mutation = useMutation({
    mutationFn: (data: BlogForm) => api.put(`/blogs/${resolvedParams.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.push("/blogs");
    },
    onError: (error: unknown) => { // Use 'unknown' instead of 'any'
      const apiError = error as ApiError; // Type assertion to ApiError
      setError("root", {
        type: "manual",
        message: apiError.response?.data?.message || "Failed to update blog post",
      });
    },
  });

  const onSubmit = (data: BlogForm) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user._id !== blog?.author._id) {
      setError("root", {
        type: "manual",
        message: "You are not authorized to edit this post",
      });
      return;
    }
    mutation.mutate(data);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-depth-black">
        <Loader />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <p className="text-center text-lumen-white animate-depthFade bg-depth-black h-screen flex items-center justify-center font-mono text-xl">
        Blog post not found or an error occurred
      </p>
    );
  }

  return (
    <div
      data-edit-page // Added here to enable copy/paste
      className="fixed inset-0 bg-depth-black flex flex-col overflow-hidden pt-[80px] z-10"
    >
      {/* Infinite-Depth Lattice */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDrift">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,20,30,0.9)_50%,rgba(0,0,0,1)_50%)] bg-[length:30px_30px] animate-latticeDriftReverse" />
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-lumen-white/20 rounded-full animate-latticeNode"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Heading Section */}
      <div className="fixed top-[80px] left-0 w-full min-h-[60px] sm:min-h-[80px] bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] p-4 sm:p-6 shadow-[0_0_15px_rgba(0,200,255,0.5)] animate-depthEdge flex items-center justify-between z-60 shrink-0">
        <button
          onClick={handleBack}
          className="relative text-lumen-white font-mono px-4 py-2 hover:text-lumen-cyan transition-all duration-300 text-sm sm:text-base md:text-lg whitespace-nowrap"
        >
          Back
          <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-lumen-cyan transform scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-center" />
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono text-lumen-white tracking-wider animate-depthGlow text-center flex-1">
          Edit Blog Post
        </h1>
        <div className="w-12 sm:w-16" /> {/* Spacer */}
      </div>

      {/* Form */}
      <div className="flex-1 w-full p-4 sm:p-6 overflow-y-auto z-10 mt-[120px] sm:mt-[140px] flex items-start justify-center">
        <div className="relative w-full max-w-4xl transform transition-all duration-500 animate-paneRise">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,200,255,0.2),rgba(255,0,200,0.2))] opacity-50 rounded-xl animate-paneTrail" />
          <div className="relative z-10 bg-depth-black/80 p-6 rounded-xl shadow-[0_0_20px_rgba(0,200,255,0.5)] hover:shadow-[0_0_30px_rgba(0,200,255,0.7)] transition-all duration-300">
            {errors.root && (
              <p className="text-lumen-magenta mb-4 text-center font-medium animate-pulse text-sm sm:text-base">
                {errors.root.message}
              </p>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-lumen-white/70 mb-1"
                >
                  Title
                </label>
                <input
                  {...register("title")}
                  id="title"
                  placeholder="Enter blog title"
                  className={`w-full p-3 bg-depth-black text-lumen-white border border-lumen-cyan/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lumen-cyan transition-all duration-300 ${
                    errors.title
                      ? "border-lumen-magenta"
                      : "hover:border-lumen-cyan/50"
                  }`}
                  disabled={mutation.isPending}
                />
                {errors.title && (
                  <p className="text-lumen-magenta text-sm mt-1 animate-pulse">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-lumen-white/70 mb-1"
                >
                  Content
                </label>
                <textarea
                  {...register("content")}
                  id="content"
                  placeholder="Write your blog content here"
                  className={`w-full p-3 bg-depth-black text-lumen-white border border-lumen-cyan/20 rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-lumen-cyan transition-all duration-300 resize-y ${
                    errors.content
                      ? "border-lumen-magenta"
                      : "hover:border-lumen-cyan/50"
                  }`}
                  disabled={mutation.isPending}
                />
                {errors.content && (
                  <p className="text-lumen-magenta text-sm mt-1 animate-pulse">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className={`w-full relative flex justify-center items-center px-6 py-3 rounded-md text-lumen-white font-semibold transition-all duration-300 ${
                  mutation.isPending
                    ? "bg-gray-600/50 opacity-50 cursor-not-allowed"
                    : "bg-[linear-gradient(45deg,#00C8FF,#FF00C8)] hover:bg-[linear-gradient(45deg,#00E0FF,#FF33D6)] hover:shadow-[0_0_15px_rgba(0,200,255,0.7)] hover:scale-105"
                }`}
              >
                {mutation.isPending ? <Loader /> : "Update Post"}
              </button>
            </form>
          </div>
          <div className="absolute inset-0 border border-lumen-cyan/20 rounded-xl animate-paneEdge" />
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        /* Custom Depth Colors */
        :global(:root) {
          --depth-black: #0A0A0F; /* Deep, rich black */
          --lumen-white: #E0F0FF; /* Soft, luminous white */
          --lumen-cyan: #00C8FF; /* Vibrant cyan */
          --lumen-magenta: #FF00C8; /* Bright magenta */
        }
        .bg-depth-black {
          background-color: var(--depth-black);
        }
        .text-lumen-white {
          color: var(--lumen-white);
        }
        .text-lumen-cyan {
          color: var(--lumen-cyan);
        }
        .text-lumen-magenta {
          color: var(--lumen-magenta);
        }
        .border-lumen-cyan {
          border-color: var(--lumen-cyan);
        }
        .border-lumen-magenta {
          border-color: var(--lumen-magenta);
        }

        @keyframes latticeDrift {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 30px 30px;
          }
        }
        @keyframes latticeDriftReverse {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: -30px -30px;
          }
        }
        @keyframes latticeNode {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.5);
          }
        }
        @keyframes depthGlow {
          0%,
          100% {
            text-shadow: 0 0 5px rgba(0, 200, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 200, 255, 0.5),
              0 0 5px rgba(255, 0, 200, 0.5);
          }
        }
        @keyframes depthEdge {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 200, 255, 0.7),
              0 0 10px rgba(255, 0, 200, 0.7);
          }
        }
        @keyframes paneRise {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes paneTrail {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
        @keyframes paneEdge {
          0%,
          100% {
            border-color: rgba(0, 200, 255, 0.2);
          }
          50% {
            border-color: rgba(0, 200, 255, 0.4);
          }
        }
        @keyframes depthFade {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-latticeDrift {
          animation: latticeDrift 25s linear infinite;
        }
        .animate-latticeDriftReverse {
          animation: latticeDriftReverse 25s linear infinite;
        }
        .animate-latticeNode {
          animation: latticeNode 3s ease-in-out infinite;
        }
        .animate-depthGlow {
          animation: depthGlow 2s ease-in-out infinite;
        }
        .animate-depthEdge {
          animation: depthEdge 3s ease-in-out infinite;
        }
        .animate-paneRise {
          animation: paneRise 0.5s ease-out forwards;
        }
        .animate-paneTrail {
          animation: paneTrail 1.5s ease-in-out infinite;
        }
        .animate-paneEdge {
          animation: paneEdge 2s ease-in-out infinite;
        }
        .animate-depthFade {
          animation: depthFade 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}