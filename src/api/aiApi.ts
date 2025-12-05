import { AI_API_BASE_URL } from '@/config/env'

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
    const url = `${AI_API_BASE_URL}/ai/generate`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('AI generate request failed')
    }

    return response.text()
  },

  summarize: async (data: SummarizeRequest): Promise<string> => {
    const url = `${AI_API_BASE_URL}/ai/summarize`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('AI summarize request failed')
    }

    return response.text()
  },

  reviewStream: async (
    data: ReviewRequest,
    onMessage: (chunk: string) => void
  ): Promise<void> => {
    const url = `${AI_API_BASE_URL}/ai/review/stream`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

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
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`AI 서버에 연결할 수 없습니다. 서버 주소를 확인하세요: ${url}`)
      }
      throw error
    }
  },
}

export default aiApi
