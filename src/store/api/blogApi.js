// // import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// // // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zwolfconsultancyservice-backend.onrender.com/api';


// // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zwolfconsultancy.com/api';


// // export const blogApi = createApi({
// //   reducerPath: 'blogApi',
// //   baseQuery: fetchBaseQuery({
// //     baseUrl: API_BASE_URL,
// //     prepareHeaders: (headers, { endpoint }) => {
// //       // Don't set Content-Type for file uploads - let the browser handle it
// //       if (endpoint !== 'uploadImage') {
// //         headers.set('Content-Type', 'application/json');
// //       }
// //       return headers;
// //     },
// //   }),
// //   tagTypes: ['Blog', 'Tags', 'Authors'],
// //   endpoints: (builder) => ({
// //     // Get all blogs with filters
// //     getBlogs: builder.query({
// //       query: ({ page = 1, limit = 10, search = '', author = '', tags = '', sortBy = '' } = {}) => {
// //         const params = new URLSearchParams();
// //         if (page) params.append('page', page.toString());
// //         if (limit) params.append('limit', limit.toString());
// //         if (search) params.append('search', search);
// //         if (author) params.append('author', author);
// //         if (tags) params.append('tags', tags);
// //         if (sortBy) params.append('sortBy', sortBy);
        
// //         return `/blogs/fetch?${params.toString()}`;
// //       },
// //       providesTags: ['Blog'],
// //     }),

// //     // Get single blog
// //     getBlog: builder.query({
// //       query: (id) => `/blogs/${id}`,
// //       providesTags: (result, error, id) => [{ type: 'Blog', id }],
// //     }),

// //     // Create blog
// //     createBlog: builder.mutation({
// //       query: (blogData) => ({
// //         url: '/blogs/create',
// //         method: 'POST',
// //         body: blogData,
// //       }),
// //       invalidatesTags: ['Blog'],
// //     }),

// //     // Update blog
// //     updateBlog: builder.mutation({
// //       query: ({ id, ...blogData }) => ({
// //         url: `/blogs/${id}`,
// //         method: 'PUT',
// //         body: blogData,
// //       }),
// //       invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }, 'Blog'],
// //     }),

// //     // Delete blog
// //     deleteBlog: builder.mutation({
// //       query: (id) => ({
// //         url: `/blogs/${id}`,
// //         method: 'DELETE',
// //       }),
// //       invalidatesTags: ['Blog'],
// //     }),

// //     // Upload image - Fixed to handle FormData properly
// //     uploadImage: builder.mutation({
// //       query: (formData) => ({
// //         url: '/blogs/upload-image',
// //         method: 'POST',
// //         body: formData,
// //         // Don't set Content-Type header - browser will set it with boundary
// //       }),
// //     }),

// //     // Get tags
// //     getTags: builder.query({
// //       query: () => '/blogs/tags',
// //       providesTags: ['Tags'],
// //     }),

// //     // Get authors
// //     getAuthors: builder.query({
// //       query: () => '/blogs/authors',
// //       providesTags: ['Authors'],
// //     }),
// //   }),
// // });

// // export const {
// //   useGetBlogsQuery,
// //   useGetBlogQuery,
// //   useCreateBlogMutation,
// //   useUpdateBlogMutation,
// //   useDeleteBlogMutation,
// //   useUploadImageMutation,
// //   useGetTagsQuery,
// //   useGetAuthorsQuery,
// // } = blogApi;



// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zwolfconsultancy.com/api';

// export const blogApi = createApi({
//   reducerPath: 'blogApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_BASE_URL,
//     prepareHeaders: (headers, { endpoint }) => {
//       if (endpoint !== 'uploadImage') {
//         headers.set('Content-Type', 'application/json');
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ['Blog', 'Tags', 'Authors'],
//   endpoints: (builder) => ({
//     // Get all blogs for public website
//     getBlogs: builder.query({
//       query: ({ page = 1, limit = 10, search = '', author = '', tags = '', sortBy = '' } = {}) => {
//         const params = new URLSearchParams();
//         if (page) params.append('page', page.toString());
//         if (limit) params.append('limit', limit.toString());
//         if (search) params.append('search', search);
//         if (author) params.append('author', author);
//         if (tags) params.append('tags', tags);
//         if (sortBy) params.append('sortBy', sortBy);
//         return `/blogs?${params.toString()}`; // <-- public website route
//       },
//       providesTags: ['Blog'],
//     }),

//     // Get single blog
//     getBlog: builder.query({
//       query: (id) => `/blogs/${id}`,
//       providesTags: (result, error, id) => [{ type: 'Blog', id }],
//     }),

//     // Get tags
//     getTags: builder.query({
//       query: () => '/blogs/tags',
//       providesTags: ['Tags'],
//     }),

//     // Get authors
//     getAuthors: builder.query({
//       query: () => '/blogs/authors',
//       providesTags: ['Authors'],
//     }),
//   }),
// });

// export const {
//   useGetBlogsQuery,
//   useGetBlogQuery,
//   useGetTagsQuery,
//   useGetAuthorsQuery,
// } = blogApi;




import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ⭐ UPDATED - Use environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zwolfconsultancy.com';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { endpoint }) => {
      if (endpoint !== 'uploadImage') {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  }),
  tagTypes: ['Blog', 'Tags', 'Authors'],
  endpoints: (builder) => ({
    // Get all blogs for public website
    getBlogs: builder.query({
      query: ({ page = 1, limit = 10, search = '', author = '', tags = '', sortBy = '' } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (author) params.append('author', author);
        if (tags) params.append('tags', tags);
        if (sortBy) params.append('sortBy', sortBy);
        return `/api/blogs/fetch?${params.toString()}`; // ⭐ CHANGED - Added /fetch
      },
      providesTags: ['Blog'],
    }),

    // Get single blog
    getBlog: builder.query({
      query: (id) => `/api/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),

    // Create blog
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: '/api/blogs/create',
        method: 'POST',
        body: blogData,
      }),
      invalidatesTags: ['Blog'],
    }),

    // Update blog
    updateBlog: builder.mutation({
      query: ({ id, ...blogData }) => ({
        url: `/api/blogs/${id}`,
        method: 'PUT',
        body: blogData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),

    // Delete blog
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/api/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),

    // Upload image
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: '/api/blogs/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),

    // Get tags
    getTags: builder.query({
      query: () => '/api/blogs/tags',
      providesTags: ['Tags'],
    }),

    // Get authors
    getAuthors: builder.query({
      query: () => '/api/blogs/authors',
      providesTags: ['Authors'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUploadImageMutation,
  useGetTagsQuery,
  useGetAuthorsQuery,
} = blogApi;