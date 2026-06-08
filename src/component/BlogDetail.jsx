// import React from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useGetBlogQuery, useDeleteBlogMutation } from '../store/api/blogApi';
// import toast from 'react-hot-toast';

// const BlogDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const { data: response, isLoading, error } = useGetBlogQuery(id);
//   const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

//   // Extract blog from response (in case your API returns { success: true, data: blog })
//   const blog = response?.data || response;

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this blog post?')) {
//       try {
//         await deleteBlog(id).unwrap();
//         toast.success('Blog post deleted successfully');
//         navigate('/');
//       } catch (error) {
//         toast.error('Failed to delete blog post');
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading blog post...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-600 mb-4">
//             {error ? 'Error Loading Blog' : 'Blog Not Found'}
//           </h2>
//           <p className="text-gray-500 mb-4">
//             {error ? 'Something went wrong while loading the blog post.' : 'The requested blog post could not be found.'}
//           </p>
//           <Link 
//             to="/" 
//             className="text-blue-600 hover:text-blue-800 underline"
//           >
//             Back to Blog List
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // Debug: Log the blog object to see its structure
//   // console.log('Blog object:', blog);

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header with navigation and actions */}
//       <div className="mb-6">
//         <Link 
//           to="/" 
//           className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
//         >
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           Back to Blog List
//         </Link>
        
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog.title || 'Untitled'}</h1>
//             <p className="text-gray-600 text-sm">
//               {blog.createdAt && `Published on ${formatDate(blog.createdAt)}`}
//               {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
//                 <span> • Updated on {formatDate(blog.updatedAt)}</span>
//               )}
//             </p>
//           </div>
          
//           <div className="flex space-x-2 ml-4">
//             <Link
//               to={`/edit/${blog.id || blog._id}`}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//             >
//               Edit
//             </Link>
//             <button
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isDeleting ? 'Deleting...' : 'Delete'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Blog content - FIXED: Now renders HTML properly */}
//       <article className="bg-white rounded-lg shadow-md p-8">
//         <div className="prose prose-lg max-w-none">
//           {blog.content ? (
//             <div 
//               className="text-gray-700 leading-relaxed"
//               dangerouslySetInnerHTML={{ __html: blog.content }}
//             />
//           ) : (
//             <p className="text-gray-500 italic">No content available</p>
//           )}
//         </div>
//       </article>

//       {/* Author section */}
//       {blog.author && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Author:</h3>
//           <p className="text-gray-700">{blog.author}</p>
//         </div>
//       )}

//       {/* Tags section */}
//       {blog.tags && blog.tags.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags:</h3>
//           <div className="flex flex-wrap gap-2">
//             {blog.tags.map((tag, index) => (
//               <span
//                 key={index}
//                 className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Related actions */}
//       <div className="mt-8 pt-6 border-t border-gray-200">
//         <div className="flex justify-between items-center">
//           <Link
//             to="/create"
//             className="text-green-600 hover:text-green-800 font-medium"
//           >
//             Write a new blog post
//           </Link>
//           <Link
//             to="/"
//             className="text-blue-600 hover:text-blue-800 font-medium"
//           >
//             View all posts
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetail;

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetBlogQuery, useDeleteBlogMutation } from '../store/api/blogApi';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, error } = useGetBlogQuery(id);
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const blog = response?.data || response;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(id).unwrap();
        toast.success('Blog post deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const sanitizeContent = (html) => {
    if (!html) return '';

    // Step 1: Agar Quill ne HTML as escaped text save kiya ho toh unescape karo
    let clean = html
      .replace(
        /&lt;a\s+href=["']([^"']+)["'][^&]*&gt;(.*?)&lt;\/a&gt;/gi,
        (m, href, text) =>
          `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
      )
      .replace(/&lt;a&gt;(.*?)&lt;\/a&gt;/gi, '$1')
      .replace(/&lt;a\s[^&]*&gt;(.*?)&lt;\/a&gt;/gi, '$1');

    // Step 2: Inline color/background styles strip karo
    clean = clean.replace(
      /(<[^>]+)\sstyle="([^"]*)"/gi,
      (match, tag, styleVal) => {
        const cleaned = styleVal
          .replace(/color\s*:[^;]+;?/gi, '')
          .replace(/background-color\s*:[^;]+;?/gi, '')
          .trim();
        return cleaned ? `${tag} style="${cleaned}"` : tag;
      }
    );

    // Step 3: <a href="..."> — proper clickable link banao
    clean = clean.replace(/<a([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs, innerText) => {
      const hrefMatch = attrs.match(/href\s*=\s*["']([^"']+)["']/i);
      if (hrefMatch) {
        const href = hrefMatch[1];
        // target aur rel already hai toh dobara mat lagao
        const hasTarget = /target\s*=/i.test(attrs);
        const hasRel = /rel\s*=/i.test(attrs);
        let newAttrs = attrs;
        if (!hasTarget) newAttrs += ' target="_blank"';
        if (!hasRel) newAttrs += ' rel="noopener noreferrer"';
        return `<a${newAttrs}>${innerText}</a>`;
      }
      // href nahi hai — plain span banao
      return `<span>${innerText}</span>`;
    });

    return clean;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            {error ? 'Error Loading Blog' : 'Blog Not Found'}
          </h2>
          <p className="text-gray-500 mb-4">
            {error
              ? 'Something went wrong while loading the blog post.'
              : 'The requested blog post could not be found.'}
          </p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
            Back to Blog List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .blog-rich-content {
          color: #374151;
        }

        .blog-rich-content a[href] {
          color: #1d4ed8 !important;
          text-decoration: underline !important;
          text-underline-offset: 3px;
          font-weight: 600 !important;
          background-color: #eff6ff;
          padding: 1px 5px;
          border-radius: 3px;
          cursor: pointer !important;
          transition: color 0.2s ease, background-color 0.2s ease;
          word-break: break-word;
          display: inline;
          pointer-events: all !important;
        }
        .blog-rich-content a[href]:hover {
          color: #ffffff !important;
          background-color: #1d4ed8 !important;
          text-decoration: none !important;
        }
        .blog-rich-content a[href]:visited {
          color: #1e40af !important;
          background-color: #eff6ff !important;
        }

        .blog-rich-content a:not([href]) {
          color: inherit !important;
          text-decoration: none !important;
          background: transparent !important;
          font-weight: inherit !important;
          pointer-events: none !important;
          cursor: text !important;
          padding: 0 !important;
        }

        .blog-rich-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem;
          color: #111827 !important;
          line-height: 1.3;
        }
        .blog-rich-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1.25rem 0 0.75rem;
          color: #1f2937 !important;
          line-height: 1.35;
        }
        .blog-rich-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          color: #374151 !important;
        }
        .blog-rich-content p {
          margin: 0.75rem 0;
          line-height: 1.8;
          color: #374151 !important;
        }
        .blog-rich-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .blog-rich-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .blog-rich-content li {
          margin: 0.35rem 0;
          line-height: 1.7;
          color: #374151 !important;
        }
        .blog-rich-content strong {
          font-weight: 700 !important;
          color: #111827 !important;
          background-color: transparent !important;
        }
        .blog-rich-content span {
          color: #374151 !important;
          background-color: transparent !important;
        }
        .blog-rich-content em {
          font-style: italic;
        }
        .blog-rich-content blockquote {
          border-left: 4px solid #6366f1;
          padding: 0.5rem 0 0.5rem 1rem;
          margin: 1rem 0;
          background-color: #f5f3ff;
          border-radius: 0 6px 6px 0;
          color: #4b5563 !important;
          font-style: italic;
        }
        .blog-rich-content pre,
        .blog-rich-content code {
          background-color: #f3f4f6;
          border-radius: 4px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.9em;
        }
        .blog-rich-content pre {
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .blog-rich-content code {
          padding: 2px 6px;
        }
        .blog-rich-content img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1rem 0;
        }
        .blog-rich-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 1.5rem 0;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog List
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog.title || 'Untitled'}</h1>
              <p className="text-gray-600 text-sm">
                {blog.createdAt && `Published on ${formatDate(blog.createdAt)}`}
                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                  <span> • Updated on {formatDate(blog.updatedAt)}</span>
                )}
              </p>
            </div>

            <div className="flex space-x-2 ml-4">
              <Link
                to={`/edit/${blog.id || blog._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* Blog Images */}
        {blog.images && blog.images.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {blog.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.name || `Blog image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        )}

        {/* Blog Content */}
        <article className="bg-white rounded-lg shadow-md p-8">
          {blog.content ? (
            <div
              className="blog-rich-content text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeContent(blog.content) }}
            />
          ) : (
            <p className="text-gray-500 italic">No content available</p>
          )}
        </article>

        {/* Author */}
        {blog.author && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Author:</h3>
            <p className="text-gray-700">{blog.author}</p>
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link to="/create" className="text-green-600 hover:text-green-800 font-medium">
              Write a new blog post
            </Link>
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
              View all posts
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;