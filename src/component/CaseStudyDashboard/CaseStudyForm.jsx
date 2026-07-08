import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, X, Upload, Save } from 'lucide-react';

const emptyForm = {
  title: '',
  description: '',
  image: '',
};

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

// Convert uploaded file to base64 string
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const CaseStudyForm = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const stored = JSON.parse(localStorage.getItem('caseStudies') || '[]');
      const existing = stored.find((cs) => String(cs.id) === String(id));
      if (existing) {
        setFormData({ ...emptyForm, ...existing });
      }
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle single image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB}MB.`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, image: base64 }));
    } catch (err) {
      setError('Failed to read image. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = JSON.parse(localStorage.getItem('caseStudies') || '[]');

    try {
      if (isEditMode) {
        const updated = stored.map((cs) =>
          String(cs.id) === String(id)
            ? { ...formData, id, slug: slugify(formData.title) }
            : cs
        );
        localStorage.setItem('caseStudies', JSON.stringify(updated));
      } else {
        const newEntry = {
          ...formData,
          id: Date.now().toString(),
          slug: slugify(formData.title),
        };
        localStorage.setItem('caseStudies', JSON.stringify([...stored, newEntry]));
      }

      navigate('/case-study');
    } catch (err) {
      alert('Storage limit exceeded. Try using a smaller image.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <Briefcase className="h-7 w-7 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Case Study' : 'Add New Case Study'}
          </h2>
          <p className="text-sm text-gray-500">
            {isEditMode ? 'Update the case study details' : 'Fill in the details to create a new case study'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
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
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Write the full case study description here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image <span className="text-red-500">*</span>
          </label>

          {formData.image ? (
            <div className="relative group w-full sm:w-64">
              <img
                src={formData.image}
                alt="Case study preview"
                className="w-full h-40 object-cover rounded-md border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full shadow hover:bg-white transition-colors"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full sm:w-64 h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
              {uploading ? (
                <span className="text-sm text-gray-500">Uploading...</span>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                  <span className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 2MB</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/case-study')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{isEditMode ? 'Update Case Study' : 'Save Case Study'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseStudyForm;