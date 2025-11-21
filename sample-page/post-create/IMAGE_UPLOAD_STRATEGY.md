# 이미지 업로드 전략 분석

게시글 작성 시스템의 이미지 업로드 방식에 대한 기술 문서

## 📋 목차

1. [현재 구현 방식](#현재-구현-방식)
2. [이미지 업로드 전략 비교](#이미지-업로드-전략-비교)
3. [방식별 상세 분석](#방식별-상세-분석)
4. [비교표](#비교표)
5. [최종 권장사항](#최종-권장사항)
6. [구현 가이드](#구현-가이드)

---

## 현재 구현 방식

### ✅ 즉시 업로드 (Immediate Upload) 방식

현재 시스템은 사용자가 이미지를 선택하는 즉시 S3/Cloudinary에 업로드하는 방식을 채택하고 있습니다.

### 동작 플로우

```
[사용자] 이미지 드래그 앤 드롭/선택
    ↓
[프론트엔드] handleImageFiles() 호출
    ↓
[백엔드] GET /api/v1/images/sign?type=post
    ← Pre-signed URL + 업로드 파라미터 반환
    ↓
[Cloudinary/S3] 이미지 직접 업로드
    ← 업로드된 이미지 URL 반환
    ↓
[프론트엔드] 마크다운에 ![](url) 삽입
    ↓
[localStorage] uploadedImages 배열에 URL 저장
    ↓
[게시 시점] 이미 업로드된 URL만 전달
```

### 코드 구현

```javascript
// create.js - uploadImage()
async uploadImage(file, progressItem) {
    const progressFill = progressItem.querySelector('.upload-progress-fill');

    // 1. Pre-signed URL 요청
    progressFill.style.width = '30%';
    const signResponse = await fetch(`${API_BASE_URL}/images/sign?type=post`);
    const signData = await signResponse.json();

    // 2. S3/Cloudinary에 즉시 업로드
    progressFill.style.width = '50%';
    const formData = new FormData();
    Object.keys(signData.uploadParams).forEach(key => {
        formData.append(key, signData.uploadParams[key]);
    });
    formData.append('file', file);

    const uploadResponse = await fetch(signData.uploadUrl, {
        method: 'POST',
        body: formData
    });

    const uploadResult = await uploadResponse.json();
    progressFill.style.width = '100%';

    // 3. URL 반환 (이미 업로드 완료)
    return uploadResult.secure_url || uploadResult.url;
}

// 4. 마크다운에 삽입
const imageUrl = await this.uploadImage(file, progressItem);
insertText += `\n![${file.name}](${imageUrl})\n`;
this.uploadedImages.push(imageUrl);
```

### 특징

- ✅ 이미지 선택 즉시 업로드 시작
- ✅ 진행률 실시간 표시 (30% → 50% → 100%)
- ✅ 업로드 완료된 URL로 즉시 미리보기
- ✅ 게시 시점에는 URL만 전달 (추가 업로드 없음)

---

## 이미지 업로드 전략 비교

### 1️⃣ 즉시 업로드 방식 (Immediate Upload)

**채택 서비스**: Velog, Medium, Notion, Dev.to

```
이미지 선택 → 즉시 S3 업로드 → URL 삽입 → 게시 시 URL만 전달
```

### 2️⃣ 지연 업로드 방식 (Deferred Upload)

**채택 서비스**: GitHub Issues, Stack Overflow

```
이미지 선택 → Base64/Blob 저장 → 미리보기 → 게시 시점에 일괄 업로드
```

### 3️⃣ 하이브리드 방식 (Hybrid)

**채택 서비스**: Tistory, WordPress 일부

```
이미지 선택 → 임시 폴더에 즉시 업로드 → 게시 시 정식 폴더로 이동
```

---

## 방식별 상세 분석

### 1️⃣ 즉시 업로드 방식 (현재 구현)

#### 장점

**🎯 탁월한 사용자 경험**
- 이미지 업로드 즉시 미리보기 가능
- 업로드 진행 상황 실시간 확인
- 업로드 완료 후 바로 작성 계속 가능
- 게시 버튼 클릭 시 즉각 반응 (이미 업로드 완료)

**⚡ 빠른 게시 속도**
- 이미지가 이미 업로드되어 있어 게시가 즉각적
- 대용량 이미지 10개를 첨부해도 게시 지연 없음
- 사용자 이탈률 감소

**🎨 정확한 에디터 미리보기**
- 실제 CDN URL로 렌더링
- 깨진 이미지를 사전에 확인 가능
- WYSIWYG (What You See Is What You Get)

**📱 외부 공유 가능**
- 작성 중인 글도 이미지는 실제 URL
- 미리보기 링크 공유 가능

#### 단점

**💸 고아 이미지 문제 (Orphaned Images)**
- 사용자가 글 작성을 중단하면 이미지만 S3에 남음
- 스토리지 낭비 발생
- 예시:
  ```
  사용자가 이미지 5개 업로드
  → 글 작성 중단
  → 5개 이미지가 영구히 S3에 남음
  ```

**🚨 악의적 사용 가능**
- 무한 이미지 업로드 후 게시 안 하는 공격 가능
- CDN 트래픽 비용 증가
- Rate Limiting 필수

**🗑️ 이미지 삭제 복잡**
- 게시글에서 이미지 제거해도 S3에는 남음
- 별도 가비지 컬렉션 로직 필요
- 어떤 이미지가 실제 사용 중인지 추적 필요

#### 해결 방안

**1. 임시 이미지 TTL 설정**
```javascript
// 이미지 업로드 시 만료 시간 설정
{
  imageId: 123,
  url: "https://cdn.example.com/temp/abc.jpg",
  status: "temporary",
  expiresAt: "2025-11-28T00:00:00Z"  // 7일 후
}
```

**2. 게시 시 이미지 활성화**
```javascript
// 게시글 생성 시 사용된 이미지를 영구로 전환
POST /api/v1/posts
{
  title: "...",
  content: "...",
  imageIds: [123, 124, 125]  // 활성화할 이미지 ID
}

// 백엔드에서 status를 "permanent"로 변경
UPDATE images SET status = 'permanent' WHERE id IN (123, 124, 125);
```

**3. 스케줄러로 정리**
```java
@Scheduled(cron = "0 0 3 * * ?")  // 매일 새벽 3시
public void deleteOrphanImages() {
    List<Image> expiredImages = imageRepository
        .findByStatusAndExpiresAtBefore("temporary", LocalDateTime.now());

    expiredImages.forEach(image -> {
        cloudinaryService.delete(image.getPublicId());
        imageRepository.delete(image);
    });
}
```

---

### 2️⃣ 지연 업로드 방식

#### 장점

**💰 스토리지 효율 최고**
- 실제 게시된 이미지만 저장
- 작성 포기 시 비용 발생 없음
- 고아 이미지 문제 없음

**🔒 트랜잭션 일관성**
- 게시글 생성과 이미지 업로드가 원자적 처리 가능
- 실패 시 전체 롤백 용이
- DB와 스토리지 상태 항상 일치

**🛡️ 악용 방지**
- 무분별한 업로드 원천 차단
- Rate Limiting 불필요

#### 단점

**⏱️ 게시 시점 지연**
- 이미지가 많을수록 게시 버튼 후 대기 시간 증가
- 예시: 이미지 10개 × 각 2초 = 20초 대기
- 사용자 이탈 가능성 증가

**💾 브라우저 메모리 부담**
- Base64로 변환 시 메모리 사용량 급증
- 원본 크기의 약 133% 메모리 필요
- 큰 이미지 여러 개 시 브라우저 느려짐 또는 크래시

**🔗 미리보기 제한**
- 로컬 Blob URL (blob:http://localhost/abc-123)
- 외부 공유 불가
- 새로고침 시 소실

**📱 모바일 환경 취약**
- 메모리 부족으로 앱 종료 가능
- 네트워크 불안정 시 전체 실패

#### 구현 예시

```javascript
// 이미지를 Base64로 변환하여 메모리에 보관
async function handleImageSelect(file) {
    const base64 = await fileToBase64(file);

    // localStorage나 메모리에 저장
    tempImages.push({
        file: file,
        base64: base64,
        preview: `data:image/jpeg;base64,${base64}`
    });

    // Blob URL로 미리보기
    const blobUrl = URL.createObjectURL(file);
    insertMarkdown(`![](${blobUrl})`);
}

// 게시 시점에 일괄 업로드
async function publish() {
    showLoading("이미지 업로드 중...");

    for (const img of tempImages) {
        const uploadedUrl = await uploadToS3(img.file);
        // Blob URL을 실제 URL로 교체
        content = content.replace(img.blobUrl, uploadedUrl);
    }

    await createPost(content);
}
```

---

### 3️⃣ 하이브리드 방식

#### 개념

```
임시 폴더: /temp/2025-11-21/user-123/
정식 폴더: /posts/2025/11/
```

- 이미지를 먼저 임시 폴더에 업로드
- 게시 시 정식 폴더로 이동 또는 status 변경
- 주기적으로 임시 폴더 청소

#### 장점

**⚡ 즉시 업로드의 UX 유지**
- 실시간 미리보기 가능
- 게시 속도 빠름

**💰 스토리지 관리 가능**
- 임시 폴더 주기적 청소 (7일 후)
- 정식 게시된 이미지만 영구 보관

**🎯 최적의 균형**
- 사용자 경험과 비용 효율 모두 달성

#### 단점

**🔧 구현 복잡도 매우 높음**
- 파일 이동 또는 복사 로직 필요
- 임시/정식 폴더 관리 인프라
- 스케줄러 구현 및 모니터링

**⚠️ 장애 포인트 증가**
- 이동 중 실패 처리
- 동시성 문제 (같은 이미지 중복 이동)
- 트랜잭션 관리 복잡

**💸 비용 증가 가능**
- S3 객체 이동 시 복사 비용 발생
- 임시/정식 이중 저장 기간 발생

#### 구현 예시

```javascript
// 1. 임시 폴더에 업로드
POST /api/v1/images/temp
Response: {
  tempUrl: "https://cdn.example.com/temp/abc.jpg",
  imageId: 123
}

// 2. 게시 시 정식 폴더로 이동
POST /api/v1/posts
{
  content: "...",
  tempImageIds: [123, 124]
}

// 백엔드에서 처리
for (imageId : tempImageIds) {
    s3.copyObject(
        from: "/temp/abc.jpg",
        to: "/posts/2025/11/abc.jpg"
    );
    s3.deleteObject("/temp/abc.jpg");

    // DB 업데이트
    UPDATE images SET
        url = 'https://cdn.example.com/posts/2025/11/abc.jpg',
        status = 'permanent'
    WHERE id = imageId;
}

// 3. 스케줄러로 오래된 임시 파일 삭제
@Scheduled(cron = "0 0 4 * * ?")
deleteOldTempImages() {
    s3.deleteObjectsOlderThan("/temp/", days: 7);
}
```

---

## 📊 비교표

| 구분 | 즉시 업로드 | 지연 업로드 | 하이브리드 |
|------|-------------|-------------|------------|
| **사용자 경험** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **게시 속도** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **스토리지 효율** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **구현 난이도** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **악용 방지** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **메모리 사용** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **외부 공유** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| **에러 핸들링** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **모바일 호환** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **유지보수** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

### 채택 사례

| 방식 | 서비스 |
|------|--------|
| **즉시 업로드** | Velog, Medium, Notion, Dev.to, HashNode |
| **지연 업로드** | GitHub Issues, Stack Overflow, Reddit |
| **하이브리드** | Tistory, WordPress (일부 플러그인) |

---

## 🏆 최종 권장사항

### ✅ 채택: 즉시 업로드 방식 (현재 구현 유지)

#### 선정 이유

**1. 사용자 경험이 최우선**
- 블로그/커뮤니티 서비스는 작성 경험이 핵심 경쟁력
- 글 쓰기 중 지연이나 불편함은 치명적
- 이미지가 바로 보이는 것이 직관적

**2. 업계 표준**
- Velog, Medium, Notion 등 주요 서비스 모두 사용
- 검증된 방식으로 리스크 최소화
- 사용자들이 익숙한 UX

**3. 기술 부채 적음**
- 이미 구현되어 있음
- 추가 개선만 하면 됨
- 대규모 리팩토링 불필요

**4. 확장성**
- CDN 활용으로 글로벌 서비스 가능
- 이미지 최적화 적용 용이
- 캐싱 전략 수립 가능

#### ⚠️ 필수 추가 구현

**1. 고아 이미지 정리 (Critical)**
```java
// 우선순위: 높음
// 예상 개발 기간: 3일

@Entity
public class Image {
    private Long id;
    private String url;
    private String publicId;
    private ImageStatus status;  // TEMPORARY, PERMANENT
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}

@Scheduled(cron = "0 0 3 * * ?")
public void cleanupOrphanImages() {
    // 7일 지난 임시 이미지 삭제
    List<Image> orphans = imageRepository
        .findByStatusAndExpiresAtBefore(
            ImageStatus.TEMPORARY,
            LocalDateTime.now()
        );

    for (Image image : orphans) {
        cloudinaryService.delete(image.getPublicId());
        imageRepository.delete(image);
        log.info("Deleted orphan image: {}", image.getId());
    }
}
```

**2. 업로드 Rate Limiting (Critical)**
```java
// 우선순위: 높음
// 예상 개발 기간: 2일

@RestController
public class ImageController {

    @RateLimit(
        maxRequests = 10,
        windowMs = 60000,
        message = "이미지 업로드 한도를 초과했습니다. 1분 후 다시 시도해주세요."
    )
    @PostMapping("/api/v1/images/sign")
    public ResponseEntity<SignResponse> getSignedUrl(
        @RequestParam String type,
        @AuthUser Member member
    ) {
        // IP별, 사용자별 제한
        // 1분에 10개 이미지까지 허용
    }
}
```

**3. 이미지 사용 추적 (High)**
```javascript
// 우선순위: 중간
// 예상 개발 기간: 2일

// 게시글 저장 시 실제 사용된 이미지만 추출
function extractImagesFromMarkdown(content) {
    const regex = /!\[.*?\]\((https?:\/\/[^\)]+)\)/g;
    const matches = content.matchAll(regex);
    return Array.from(matches, m => m[1]);
}

async function publishPost(postData) {
    const usedImages = extractImagesFromMarkdown(postData.content);

    // 업로드했지만 사용 안 한 이미지 삭제
    const unusedImages = uploadedImages.filter(
        url => !usedImages.includes(url)
    );

    if (unusedImages.length > 0) {
        await deleteImages(unusedImages);
    }

    // 사용된 이미지만 영구 등록
    await activateImages(usedImages);
}
```

#### 🔧 선택적 개선 사항

**1. 이미지 최적화 (Medium)**
```javascript
// WebP 자동 변환
const cloudinaryConfig = {
    transformation: [
        { width: 1920, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }  // WebP 지원 브라우저에 자동 제공
    ]
};

// 반응형 이미지
<img
    srcset="
        image-400.webp 400w,
        image-800.webp 800w,
        image-1200.webp 1200w
    "
    sizes="(max-width: 768px) 100vw, 800px"
/>
```

**2. 업로드 진행률 개선 (Low)**
```javascript
// XMLHttpRequest 사용으로 실시간 진행률
const xhr = new XMLHttpRequest();

xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        updateProgressBar(percentComplete);
    }
});
```

**3. 이미지 편집 기능 (Low)**
```javascript
// 크롭, 회전, 필터 등
import ImageEditor from '@toast-ui/image-editor';

const editor = new ImageEditor('#editor', {
    includeUI: {
        menu: ['crop', 'rotate', 'filter']
    }
});
```

---

## 🛠️ 구현 가이드

### Phase 1: 즉시 배포 (1주)

**1. Rate Limiting 추가**
```java
// Spring Boot + Bucket4j
@Configuration
public class RateLimitConfig {

    @Bean
    public RateLimiter imagUploadLimiter() {
        Bandwidth limit = Bandwidth.classic(
            10,  // 10개
            Refill.intervally(10, Duration.ofMinutes(1))
        );
        return RateLimiter.builder()
            .addRule(limit)
            .build();
    }
}
```

**2. 이미지 만료 시간 설정**
```java
@Service
public class ImageService {

    public Image uploadTemporary(MultipartFile file, Long memberId) {
        String url = cloudinaryService.upload(file);

        Image image = Image.builder()
            .url(url)
            .status(ImageStatus.TEMPORARY)
            .expiresAt(LocalDateTime.now().plusDays(7))
            .memberId(memberId)
            .build();

        return imageRepository.save(image);
    }
}
```

### Phase 2: 백그라운드 작업 (2주)

**1. 스케줄러 구현**
```java
@Component
@EnableScheduling
public class ImageCleanupScheduler {

    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupOrphanImages() {
        log.info("Starting orphan image cleanup...");

        List<Image> orphans = imageRepository
            .findByStatusAndExpiresAtBefore(
                ImageStatus.TEMPORARY,
                LocalDateTime.now()
            );

        int deleted = 0;
        for (Image image : orphans) {
            try {
                cloudinaryService.delete(image.getPublicId());
                imageRepository.delete(image);
                deleted++;
            } catch (Exception e) {
                log.error("Failed to delete image: {}", image.getId(), e);
            }
        }

        log.info("Cleanup completed. Deleted {} images.", deleted);
    }
}
```

**2. 모니터링 추가**
```java
@Component
public class ImageMetrics {

    private final MeterRegistry meterRegistry;

    public void recordUpload() {
        meterRegistry.counter("image.upload.count").increment();
    }

    public void recordOrphan() {
        meterRegistry.counter("image.orphan.count").increment();
    }

    @Scheduled(fixedRate = 300000)  // 5분마다
    public void checkStorageUsage() {
        long totalSize = imageRepository.sumFileSize();
        meterRegistry.gauge("image.storage.bytes", totalSize);
    }
}
```

### Phase 3: 최적화 (1개월)

**1. 이미지 최적화 파이프라인**
```javascript
// 클라이언트 사이드 리사이징
async function optimizeBeforeUpload(file) {
    if (file.size < 500 * 1024) return file;  // 500KB 이하는 그대로

    const options = {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.8,
        mimeType: 'image/jpeg'
    };

    return await imageCompression(file, options);
}

// Cloudinary 설정
const transformation = [
    { width: 1920, crop: 'limit' },
    { quality: 'auto:good' },
    { fetch_format: 'auto' },
    { flags: 'progressive' }  // Progressive JPEG
];
```

**2. CDN 캐싱 전략**
```nginx
# Cloudinary CDN 설정
location ~* \.(jpg|jpeg|png|gif|webp)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header Vary "Accept";  # WebP 지원용
}
```

---

## 📈 예상 효과

### 비용 절감

**현재 (개선 전)**
- 월 평균 업로드: 10,000개 이미지
- 게시 완료율: 60%
- 낭비: 4,000개 × 평균 2MB = 8GB
- S3 비용: $0.18/월 (8GB × $0.023/GB)

**개선 후**
- 7일 후 자동 삭제로 낭비 제거
- 예상 절감: **$0.18/월 → 거의 0**
- 연간 절감: **약 $2.16**

### 성능 개선

**업로드 속도**
- 현재: 평균 2.5초/이미지
- 최적화 후: 평균 1.8초/이미지 (-28%)
- 리사이징으로 파일 크기 50% 감소

**게시 속도**
- 이미 업로드 완료되어 있어 즉시 게시
- 사용자 대기 시간 0초 유지

---

## 🔍 모니터링 지표

### 추적해야 할 메트릭

```javascript
// 1. 업로드 성공률
image.upload.success.rate =
    (성공 건수 / 전체 시도 건수) × 100

// 2. 고아 이미지 발생률
image.orphan.rate =
    (삭제된 임시 이미지 / 전체 업로드) × 100

// 3. 평균 업로드 시간
image.upload.duration.avg

// 4. 스토리지 사용량
image.storage.total.bytes

// 5. CDN 트래픽
image.cdn.bandwidth.bytes
```

### 알람 설정

```yaml
# Prometheus Alert Rules
groups:
  - name: image_upload
    rules:
      - alert: HighOrphanRate
        expr: image_orphan_rate > 50
        annotations:
          summary: "고아 이미지 발생률 50% 초과"

      - alert: UploadFailureRate
        expr: image_upload_failure_rate > 10
        annotations:
          summary: "업로드 실패율 10% 초과"
```

---

## 📚 참고 자료

### 관련 문서
- [AWS S3 수명 주기 정책](https://docs.aws.amazon.com/s3/lifecycle-configuration.html)
- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_images)
- [Pre-signed URL 보안 가이드](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)

### 벤치마크
- [Medium Image Upload Strategy](https://medium.engineering/)
- [Velog 기술 블로그](https://velog.io/@velog/velog-engineering)
- [Notion 아키텍처](https://www.notion.so/blog/)

---

## 🎯 결론

**즉시 업로드 방식**은 사용자 경험 측면에서 명백히 우수하며, 고아 이미지 문제는 **TTL 기반 자동 정리**로 충분히 해결 가능합니다.

주요 개선사항 3가지만 구현하면:
- ✅ 탁월한 UX 유지
- ✅ 스토리지 비용 절감
- ✅ 악용 방지

**추천 타임라인:**
- Week 1: Rate Limiting + TTL 설정
- Week 2-3: 스케줄러 구현 및 테스트
- Week 4-5: 모니터링 및 최적화
- 이후: 점진적 개선

이 방식으로 **업계 표준**을 따르면서도 **비용 효율적**인 시스템을 구축할 수 있습니다.
