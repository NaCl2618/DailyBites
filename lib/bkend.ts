/**
 * bkend.ai Client Configuration
 *
 * This file sets up the bkend.ai client for backend operations.
 * Make sure to set NEXT_PUBLIC_BKEND_API_KEY and NEXT_PUBLIC_BKEND_PROJECT_ID
 * in your .env.local file.
 */

// TODO: Install @bkend/client package
// npm install @bkend/client

// Uncomment when package is installed:
// import { createClient } from '@bkend/client';
//
// export const bkend = createClient({
//   apiKey: process.env.NEXT_PUBLIC_BKEND_API_KEY!,
//   projectId: process.env.NEXT_PUBLIC_BKEND_PROJECT_ID!,
// });

// Temporary mock for development without @bkend/client
export const bkend = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      console.warn('Mock login - install @bkend/client for real implementation');
      return {
        user: { id: '1', email: credentials.email },
        token: 'mock-token',
      };
    },
    register: async (data: { email: string; password: string; name?: string }) => {
      console.warn('Mock register - install @bkend/client for real implementation');
      return {
        user: { id: '1', email: data.email, name: data.name },
        token: 'mock-token',
      };
    },
    logout: () => {
      console.warn('Mock logout - install @bkend/client for real implementation');
    },
  },
  collection: (name: string) => ({
    find: async (filters?: any) => {
      console.warn(`Mock collection.find(${name}) - install @bkend/client for real implementation`);
      return [];
    },
    findById: async (id: string) => {
      console.warn(`Mock collection.findById(${name}, ${id}) - install @bkend/client for real implementation`);
      return null;
    },
    create: async (data: any) => {
      console.warn(`Mock collection.create(${name}) - install @bkend/client for real implementation`);
      return { _id: 'mock-id', ...data };
    },
    update: async (id: string, data: any) => {
      console.warn(`Mock collection.update(${name}, ${id}) - install @bkend/client for real implementation`);
      return { _id: id, ...data };
    },
    delete: async (id: string) => {
      console.warn(`Mock collection.delete(${name}, ${id}) - install @bkend/client for real implementation`);
      return { success: true };
    },
  }),
};
