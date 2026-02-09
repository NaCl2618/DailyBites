/**
 * bkend.ai Client Configuration (Mock)
 *
 * 실제 bkend.ai 서비스 연동 전까지 사용하는 Mock 구현.
 * 인메모리 저장소를 사용하여 레시피 CRUD를 지원합니다.
 * (서버 재시작 시 데이터 초기화)
 */

// 인메모리 저장소 (globalThis로 HMR에서도 데이터 유지)
const g = globalThis as any;
if (!g.__mockStore) {
  g.__mockStore = { recipes: [] };
  g.__mockIdCounter = 1;
}
const store: Record<string, any[]> = g.__mockStore;

function generateId(): string {
  return `mock-${Date.now()}-${g.__mockIdCounter++}`;
}

export const bkend = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      return {
        user: { id: '1', email: credentials.email },
        token: `token-${credentials.email}`,
      };
    },
    register: async (data: { email: string; password: string; name?: string }) => {
      return {
        user: { id: '1', email: data.email, name: data.name },
        token: `token-${data.email}`,
      };
    },
    getCurrentUser: async (token: string) => {
      if (!token || token === 'invalid') {
        return null;
      }
      return {
        _id: 'mock-user-id',
        email: 'user@example.com',
        name: 'Mock User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    logout: () => {},
  },
  collection: (name: string) => {
    // 컬렉션이 없으면 생성
    if (!store[name]) {
      store[name] = [];
    }

    return {
      find: (filters?: any) => {
        let results = [...store[name]];

        // 필터 적용
        if (filters) {
          results = results.filter((item) => {
            return Object.entries(filters).every(([key, value]) => {
              if (value && typeof value === 'object' && '$regex' in (value as any)) {
                const regex = new RegExp((value as any).$regex, (value as any).$options || '');
                return regex.test(item[key]);
              }
              return item[key] === value;
            });
          });
        }

        // 체이닝 메서드
        const chain = {
          sort: (sortOptions: any) => {
            const [field, order] = Object.entries(sortOptions)[0] || ['createdAt', -1];
            results.sort((a, b) => {
              const aVal = a[field as string];
              const bVal = b[field as string];
              if (aVal < bVal) return (order as number) === -1 ? 1 : -1;
              if (aVal > bVal) return (order as number) === -1 ? -1 : 1;
              return 0;
            });
            return chain;
          },
          skip: (n: number) => {
            results = results.slice(n);
            return chain;
          },
          limit: async (n: number) => {
            return results.slice(0, n);
          },
        };

        return chain;
      },

      findOne: async (filters?: any) => {
        if (!filters) return store[name][0] || null;
        return store[name].find((item) =>
          Object.entries(filters).every(([key, value]) => item[key] === value)
        ) || null;
      },

      findById: async (id: string) => {
        return store[name].find((item) => item._id === id) || null;
      },

      count: async (filters?: any) => {
        if (!filters) return store[name].length;
        return store[name].filter((item) =>
          Object.entries(filters).every(([key, value]) => {
            if (value && typeof value === 'object' && '$regex' in (value as any)) {
              const regex = new RegExp((value as any).$regex, (value as any).$options || '');
              return regex.test(item[key]);
            }
            return item[key] === value;
          })
        ).length;
      },

      create: async (data: any) => {
        const doc = {
          _id: generateId(),
          ...data,
          createdAt: data.createdAt || new Date(),
          updatedAt: new Date(),
        };
        store[name].push(doc);
        console.log(`[Mock DB] Created in '${name}': ${doc._id} (total: ${store[name].length})`);
        return doc;
      },

      update: async (id: string, data: any) => {
        const index = store[name].findIndex((item) => item._id === id);
        if (index === -1) return null;
        store[name][index] = { ...store[name][index], ...data, updatedAt: new Date() };
        return store[name][index];
      },

      delete: async (id: string) => {
        const index = store[name].findIndex((item) => item._id === id);
        if (index === -1) return { success: false };
        store[name].splice(index, 1);
        console.log(`[Mock DB] Deleted from '${name}': ${id} (total: ${store[name].length})`);
        return { success: true };
      },

      deleteOne: async (filters?: any) => {
        if (!filters) return { success: false };
        const index = store[name].findIndex((item) =>
          Object.entries(filters).every(([key, value]) => item[key] === value)
        );
        if (index === -1) return { success: false };
        store[name].splice(index, 1);
        return { success: true };
      },
    };
  },
};
