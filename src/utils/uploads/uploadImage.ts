import uploadApi from '@/api/uploadApi'

export interface UploadImageOptions {
  type?: string
}

interface CloudinaryUploadResponse {
  secure_url?: string
  url?: string
  error?: {
    message?: string
  }
}

export async function uploadImage(file: File, options: UploadImageOptions = {}): Promise<string> {
  const { type = 'post' } = options
  const signatureResponse = await uploadApi.getImageSignature({ type })

  if (!signatureResponse.success || !signatureResponse.data) {
    throw new Error(signatureResponse.message ?? '이미지 업로드 서명을 가져오지 못했습니다.')
  }

  const signature = signatureResponse.data
  const uploadUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', signature.apiKey)
  formData.append('timestamp', signature.timestamp.toString())
  formData.append('signature', signature.signature)
  formData.append('upload_preset', signature.uploadPreset)
  if (signature.folder) {
    formData.append('folder', signature.folder)
  }

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  })

  const result = (await response.json()) as CloudinaryUploadResponse

  if (!response.ok) {
    throw new Error(result.error?.message ?? '이미지 업로드에 실패했습니다.')
  }

  const url = result.secure_url || result.url
  if (!url) {
    throw new Error('업로드된 이미지 URL을 확인할 수 없습니다.')
  }

  return url
}

export default uploadImage
