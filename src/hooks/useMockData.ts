import { USE_MOCK } from '@/config/env'

export function useMockData<T>(mockData: T, realDataFn: () => Promise<T>): () => Promise<T> {
  return async () => {
    if (USE_MOCK) {
      return Promise.resolve(mockData)
    }
    return realDataFn()
  }
}

export function useMockDataSync<T>(mockData: T, realData: T): T {
  return USE_MOCK ? mockData : realData
}

export default useMockData
