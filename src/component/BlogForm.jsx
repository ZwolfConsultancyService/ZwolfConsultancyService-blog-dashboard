import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogQuery,
  useUploadImageMutation,
} from "../store/api/blogApi";
import { Upload, X, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const [uploadedImages, setUploadedImages] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: blogData, isLoading: isBlogLoading } = useGetBlogQuery(id, {
    skip: !isEditing,
  });

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [uploadImage] = useUploadImageMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      author: "",
      tags: [],
    },
  });

  const watchedTags = watch("tags");

  // Load blog data for editing
  useEffect(() => {
    if (isEditing && blogData?.data) {
      const blog = blogData.data;
      setValue("title", blog.title);
      setValue("content", blog.content);
      setValue("author", blog.author);
      setValue("tags", blog.tags || []);
      setUploadedImages(blog.images || []);
    }
  }, [blogData, setValue, isEditing]);

  // Handle file input trigger
  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not a valid image.`);
        }

        const formData = new FormData();
        formData.append("image", file);

        // console.log('Uploading file:', file.name, file.type, file.size);

        const response = await uploadImage(formData).unwrap();
        return response.data;
      });

      const uploadedImageData = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...uploadedImageData]);
      toast.success(
        `${uploadedImageData.length} image(s) uploaded successfully`
      );
    } catch (error) {
      const errorMessage = error.data?.message || error.message || "Failed to upload images";
      toast.error(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      const currentTags = watchedTags || [];

      if (!currentTags.includes(newTag)) {
        setValue("tags", [...currentTags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = watchedTags || [];
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data) => {
    try {
      const blogData = {
        ...data,
        images: uploadedImages,
      };

      if (isEditing) {
        await updateBlog({ id, ...blogData }).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await createBlog(blogData).unwrap();
        toast.success("Blog created successfully");
      }

      navigate("/");
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update blog" : "Failed to create blog"
      );
      console.error("Submit error:", error);
    }
  };

  // Simplified quill modules to reduce warnings
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'script', 'indent', 'blockquote',
    'code-block', 'color', 'background', 'align', 'link'
  ];

  if (isEditing && isBlogLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Posts</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          {/* Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              {...register("title", {
                required: "Title is required",
                maxLength: {
                  value: 200,
                  message: "Title cannot exceed 200 characters",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter blog title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Author */}
          <div className="mb-6">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Author *
            </label>
            <input
              type="text"
              id="author"
              {...register("author", {
                required: "Author is required",
                maxLength: {
                  value: 100,
                  message: "Author name cannot exceed 100 characters",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter author name..."
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">
                {errors.author.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Type a tag and press Enter..."
            />
            {watchedTags && watchedTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {watchedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload - Improved */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleImageUploadClick}
                    disabled={isUploading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Images"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <Controller
              name="content"
              control={control}
              rules={{
                required: "Content is required",
                minLength: {
                  value: 10,
                  message: "Content must be at least 10 characters long",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <ReactQuill
                  theme="snow"
                  value={value}
                  onChange={onChange}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                  style={{ minHeight: "300px" }}
                />
              )}
            />

            {errors.content && (
              <p className="mt-1 text-sm text-red-600">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isCreating || isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{isEditing ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditing ? "Update Post" : "Create Post"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;