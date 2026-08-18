import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Briefcase,
  X,
  Upload,
  Save,
  Loader2,
} from "lucide-react";

const API_URL =
  "https://www.zwolfconsultancy.com/api/case-studies";

// const API_URL = 'http://localhost:5002/api/case-studies';

const emptyForm = {
  title: "",
  description: "",
};

// Safely parse response
const safeParseResponse = async (res) => {
  const rawText = await res.text();

  if (!rawText) {
    throw new Error(
      `Server returned an empty response (status ${res.status}).`
    );
  }

  try {
    return JSON.parse(rawText);
  } catch {
    console.error(
      "Non-JSON response received:",
      rawText.slice(0, 500)
    );

    throw new Error(
      `Server returned an unexpected response (status ${res.status}). Check backend logs.`
    );
  }
};

// Check Quill content
const isDescriptionEmpty = (html) => {
  if (!html) return true;

  const stripped = html
    .replace(/<[^>]*>/g, "")
    .trim();

  return stripped.length === 0;
};

// Quill toolbar
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
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "script",
  "indent",
  "blockquote",
  "code-block",
  "color",
  "background",
  "align",
  "link",
];

const CaseStudyForm = () => {
  const [formData, setFormData] = useState(emptyForm);

  // New files selected by user
  const [imageFiles, setImageFiles] = useState([]);

  // Local previews of new files
  const [imagePreviews, setImagePreviews] = useState([]);

  // Existing ImageKit images in edit mode
  const [existingImages, setExistingImages] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [descriptionError, setDescriptionError] =
    useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // Maximum 20 images
  const MAX_IMAGES = 20;

  // Maximum 5MB per image
  const MAX_SIZE_MB = 5;

  // ---------------------------------------------------------
  // Fetch existing case study in edit mode
  // ---------------------------------------------------------

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCaseStudy = async () => {
      setLoadingData(true);
      setFormError("");

      try {
        const res = await fetch(
          `${API_URL}/id/${id}`
        );

        const json = await safeParseResponse(res);

        if (!res.ok || !json.success) {
          throw new Error(
            json.message ||
              `Failed to fetch case study (status ${res.status})`
          );
        }

        const cs = json.data;

        setFormData({
          title: cs.title || "",
          description: cs.description || "",
        });

        // New multiple image structure
        setExistingImages(cs.images || []);
      } catch (err) {
        setFormError(
          err.message ||
            "Could not load case study details. Please try again."
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchCaseStudy();
  }, [id, isEditMode]);

  // ---------------------------------------------------------
  // Input change
  // ---------------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------
  // Quill change
  // ---------------------------------------------------------

  const handleDescriptionChange = (html) => {
    setFormData((prev) => ({
      ...prev,
      description: html,
    }));

    if (!isDescriptionEmpty(html)) {
      setDescriptionError("");
    }
  };

  // ---------------------------------------------------------
  // Multiple image selection
  // ---------------------------------------------------------

  const handleImageUpload = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    setError("");

    // Existing + new images
    const totalImages =
      existingImages.length + files.length;

    if (totalImages > MAX_IMAGES) {
      setError(
        `You can have maximum ${MAX_IMAGES} images in one case study.`
      );

      e.target.value = "";
      return;
    }

    // Validate every image
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(
          `${file.name} is not a valid image file.`
        );

        e.target.value = "";
        return;
      }

      if (
        file.size >
        MAX_SIZE_MB * 1024 * 1024
      ) {
        setError(
          `${file.name} must be smaller than ${MAX_SIZE_MB}MB.`
        );

        e.target.value = "";
        return;
      }
    }

    // Add new files instead of replacing previous selection
    setImageFiles((prev) => [
      ...prev,
      ...files,
    ]);

    // Generate previews
    const newPreviews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  // ---------------------------------------------------------
  // Remove newly selected image
  // ---------------------------------------------------------

  const removeNewImage = (index) => {
    setImageFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreviews((prev) => {
      const previewToRemove = prev[index];

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }

      return prev.filter(
        (_, i) => i !== index
      );
    });
  };

  // ---------------------------------------------------------
  // Remove existing ImageKit image from UI
  // ---------------------------------------------------------

  const removeExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ---------------------------------------------------------
  // Submit
  // ---------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setDescriptionError("");
    setError("");

    // Total images
    const totalImages =
      existingImages.length +
      imageFiles.length;

    // Create requires at least one image
    if (!isEditMode && totalImages === 0) {
      setError(
        "Please upload at least one image."
      );
      return;
    }

    // Description required
    if (
      isDescriptionEmpty(
        formData.description
      )
    ) {
      setDescriptionError(
        "Please write a description."
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();

      payload.append(
        "title",
        formData.title
      );

      payload.append(
        "description",
        formData.description
      );

      // -----------------------------------------------------
      // Upload newly selected images
      // -----------------------------------------------------

      imageFiles.forEach((file) => {
        payload.append(
          "images",
          file
        );
      });

      // -----------------------------------------------------
      // IMPORTANT:
      // Tell backend which existing images should remain
      // -----------------------------------------------------

      if (isEditMode) {
        payload.append(
          "existingImages",
          JSON.stringify(existingImages)
        );
      }

      const url = isEditMode
        ? `${API_URL}/${id}`
        : API_URL;

      const method = isEditMode
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const json =
        await safeParseResponse(res);

      if (!res.ok || !json.success) {
        throw new Error(
          json.message ||
            `Request failed with status ${res.status}`
        );
      }

      // Cleanup previews
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });

      navigate("/case-study");
    } catch (err) {
      setFormError(
        err.message ||
          "Failed to save case study."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------

  if (loadingData) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />

        <span className="ml-2 text-sm text-gray-500">
          Loading case study...
        </span>
      </div>
    );
  }

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">

        <Briefcase className="h-7 w-7 text-indigo-600" />

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode
              ? "Edit Case Study"
              : "Add New Case Study"}
          </h2>

          <p className="text-sm text-gray-500">
            {isEditMode
              ? "Update the case study details"
              : "Fill in the details to create a new case study"}
          </p>
        </div>

      </div>

      {/* Form Error */}
      {formError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
          {formError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 space-y-6"
      >

        {/* Title */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Custom E-Commerce Website for UrbanStyle"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

        </div>

        {/* Description */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={
              handleDescriptionChange
            }
            modules={quillModules}
            formats={quillFormats}
            className="bg-white"
            style={{
              minHeight: "200px",
            }}
          />

          {descriptionError && (
            <p className="text-xs text-red-500 mt-1">
              {descriptionError}
            </p>
          )}

        </div>

        {/* Images */}
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Case Study Images{" "}
            {!isEditMode && (
              <span className="text-red-500">
                *
              </span>
            )}
          </label>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-5">

              <p className="text-sm font-medium text-gray-600 mb-2">
                Existing Images
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {existingImages.map(
                  (image, index) => (
                    <div
                      key={
                        image.fileId ||
                        index
                      }
                      className="relative group"
                    >

                      <img
                        src={image.url}
                        alt={`Existing case study ${
                          index + 1
                        }`}
                        className="w-full h-40 object-cover rounded-md border border-gray-200"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(
                            index
                          )
                        }
                        className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full shadow hover:bg-white transition-colors"
                        aria-label="Remove existing image"
                      >
                        <X className="h-4 w-4" />
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {/* New Images */}
          {imagePreviews.length > 0 && (
            <div className="mb-5">

              <p className="text-sm font-medium text-gray-600 mb-2">
                New Images
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {imagePreviews.map(
                  (preview, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >

                      <img
                        src={preview}
                        alt={`New case study ${
                          index + 1
                        }`}
                        className="w-full h-40 object-cover rounded-md border border-gray-200"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(
                            index
                          )
                        }
                        className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full shadow hover:bg-white transition-colors"
                        aria-label="Remove new image"
                      >
                        <X className="h-4 w-4" />
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {/* Upload Box */}
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">

            {uploading ? (
              <span className="text-sm text-gray-500">
                Uploading...
              </span>
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400 mb-1" />

                <span className="text-sm text-gray-500">
                  Click to upload images
                </span>

                <span className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP up to 5MB each
                </span>

                <span className="text-xs text-gray-400">
                  Maximum 20 images
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

          </label>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-2">
            Total images:{" "}
            {existingImages.length +
              imageFiles.length}
            /{MAX_IMAGES}
          </p>

        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">

          <button
            type="button"
            onClick={() =>
              navigate("/case-study")
            }
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >

            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            <span>
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Update Case Study"
                : "Save Case Study"}
            </span>

          </button>

        </div>

      </form>
    </div>
  );
};

export default CaseStudyForm;