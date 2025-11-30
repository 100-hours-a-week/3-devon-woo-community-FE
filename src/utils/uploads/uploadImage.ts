import uploadApi, {
  type CreatePresignedUploadParams,
  type ImageUploadProvider,
  type PresignedUploadPayload,
} from '@/api/uploadApi'

export interface UploadImageOptions {
  provider: ImageUploadProvider
}

const buildPresignParams = (
  file: File,
  provider: ImageUploadProvider
): CreatePresignedUploadParams => ({
  fileName: file.name,
  fileType: file.type || 'application/octet-stream',
  provider,
})

const uploadWithFormData = async (payload: PresignedUploadPayload, file: File) => {
  const formData = new FormData()

  if (payload.fields) {
    Object.entries(payload.fields).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  formData.append('file', file)

  const response = await fetch(payload.uploadUrl, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패했습니다 (폼 업로드).')
  }
}

const uploadWithPut = async (payload: PresignedUploadPayload, file: File) => {
  const headers = new Headers(payload.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', file.type || 'application/octet-stream')
  }

  const response = await fetch(payload.uploadUrl, {
    method: 'PUT',
    headers,
    body: file,
  })

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패했습니다 (PUT 업로드).')
  }
}

export async function uploadImage(file: File, options: UploadImageOptions): Promise<string> {
  const { provider } = options
  const presignResponse = await uploadApi.createPresignedUpload(
    buildPresignParams(file, provider)
  )

  if (!presignResponse.success || !presignResponse.data) {
    throw new Error(presignResponse.message ?? '업로드 URL을 가져오지 못했습니다.')
  }

  const payload = presignResponse.data

  if (payload.fields) {
    await uploadWithFormData(payload, file)
  } else {
    await uploadWithPut(payload, file)
  }

  return payload.fileUrl
}

export default uploadImage
