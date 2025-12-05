import httpClient from './httpClient'

interface GenerateRequest {
  content: string
  instruction: string
}

interface SummarizeRequest {
  text: string
}

interface ReviewRequest {
  text: string
}

export const aiApi = {
  generate: async (data: GenerateRequest): Promise<string> => {
    return httpClient.post('/ai/generate', data)
  },

  summarize: async (data: SummarizeRequest): Promise<string> => {
    return httpClient.post('/ai/summarize', data)
  },

  reviewStream: async (
    data: ReviewRequest,
    onMessage: (chunk: string) => void
  ): Promise<void> => {
    const response = await fetch('/ai/review/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      onMessage(chunk)
    }
  },
}

export default aiApi
