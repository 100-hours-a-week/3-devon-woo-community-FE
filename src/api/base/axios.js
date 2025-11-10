// Mock 모드 설정 (개발 중에는 true, 실제 API 사용 시 false)
const USE_MOCK = true;

class Axioxs{
  constructor(config = {}) {
    this.baseURL = config.baseURL || "";
    this.headers = config.headers || {};
    this.useMock = config.useMock !== undefined ? config.useMock : USE_MOCK;
  }

  async request(method, url, body, options = {}) {
    // Mock 모드일 때
    if (this.useMock) {
      console.log(`[MOCK] ${method} ${url}`);
      return await this.getMockResponse(method, url, body);
    }

    // 실제 API 호출
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
        ...options.headers,
      },
      body: this.prepareBody(body, options.headers),
    };

    try {
      const res = await fetch(this.baseURL + url, config);
      const data = await res.json();
      return data;
    } catch (e) {
      throw new Error(e.message || "Request failed");
    }
  }

  /**
   * Mock 응답 생성
   * URL 패턴 매칭으로 더미 데이터 반환
   */
  async getMockResponse(method, url, body) {
    // 약간의 지연 시뮬레이션 (실제 네트워크 느낌)
    await new Promise(resolve => setTimeout(resolve, 300));

    // 1. 인증 API
    if (url.includes('/auth/login') && method === 'POST') {
      const LoginResponse = (await import('../../dto/response/auth/LoginResponse.js')).default;
      return { success: true, data: LoginResponse.createDefault() };
    }

    if (url.includes('/auth/signup') && method === 'POST') {
      const SignupResponse = (await import('../../dto/response/auth/SignupResponse.js')).default;
      return { success: true, data: SignupResponse.createDefault() };
    }

    if (url.includes('/auth/logout') && method === 'POST') {
      return { success: true, data: null };
    }

    // 2. 회원 API
    if (url.match(/\/members\/\d+$/) && method === 'GET') {
      const MemberResponse = (await import('../../dto/response/member/MemberResponse.js')).default;
      const memberId = parseInt(url.match(/\/members\/(\d+)/)[1]);
      return { success: true, data: MemberResponse.createDummy(memberId) };
    }

    if (url.match(/\/members\/\d+$/) && method === 'PATCH') {
      const MemberUpdateResponse = (await import('../../dto/response/member/MemberUpdateResponse.js')).default;
      return { success: true, data: MemberUpdateResponse.createDefault() };
    }

    if (url.includes('/members/') && url.includes('/password') && method === 'PATCH') {
      return { success: true, data: null };
    }

    if (url.match(/\/members\/\d+$/) && method === 'DELETE') {
      return { success: true, data: null };
    }

    // 3. 게시글 API
    if (url === '/api/v1/posts' && method === 'POST') {
      const PostResponse = (await import('../../dto/response/post/PostResponse.js')).default;
      return { success: true, data: PostResponse.createDefault() };
    }

    if (url.includes('/api/v1/posts?') && method === 'GET') {
      const PostSummaryResponse = (await import('../../dto/response/post/PostSummaryResponse.js')).default;
      const PageResponse = (await import('../../dto/response/common/PageResponse.js')).default;
      const items = PostSummaryResponse.createDummyList(20);
      return { success: true, data: PageResponse.createDummy(items, 0, 20, 100) };
    }

    if (url.match(/\/posts\/\d+/) && method === 'GET') {
      const PostResponse = (await import('../../dto/response/post/PostResponse.js')).default;
      const postId = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      return { success: true, data: PostResponse.createDummy(postId) };
    }

    if (url.match(/\/posts\/\d+$/) && method === 'PATCH') {
      const PostResponse = (await import('../../dto/response/post/PostResponse.js')).default;
      const postId = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      return { success: true, data: PostResponse.createDummy(postId) };
    }

    if (url.match(/\/posts\/\d+$/) && method === 'DELETE') {
      return { success: true, data: null };
    }

    if (url.includes('/posts/') && url.includes('/like') && method === 'POST') {
      return { success: true, data: null };
    }

    if (url.includes('/posts/') && url.includes('/like') && method === 'DELETE') {
      return { success: true, data: null };
    }

    // 4. 댓글 API
    if (url.includes('/posts/') && url.includes('/comments') && method === 'POST') {
      const CommentResponse = (await import('../../dto/response/comment/CommentResponse.js')).default;
      const postId = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      return { success: true, data: CommentResponse.createDefault() };
    }

    if (url.includes('/posts/') && url.includes('/comments?') && method === 'GET') {
      const CommentResponse = (await import('../../dto/response/comment/CommentResponse.js')).default;
      const PageResponse = (await import('../../dto/response/common/PageResponse.js')).default;
      const postId = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      const items = CommentResponse.createDummyList(10, postId);
      return { success: true, data: PageResponse.createDummy(items, 0, 10, 50) };
    }

    if (url.match(/\/comments\/\d+$/) && method === 'GET') {
      const CommentResponse = (await import('../../dto/response/comment/CommentResponse.js')).default;
      const commentId = parseInt(url.match(/\/comments\/(\d+)/)[1]);
      return { success: true, data: CommentResponse.createDummy(commentId) };
    }

    if (url.match(/\/comments\/\d+$/) && method === 'PATCH') {
      const CommentResponse = (await import('../../dto/response/comment/CommentResponse.js')).default;
      const commentId = parseInt(url.match(/\/comments\/(\d+)/)[1]);
      return { success: true, data: CommentResponse.createDummy(commentId) };
    }

    if (url.match(/\/comments\/\d+$/) && method === 'DELETE') {
      return { success: true, data: null };
    }

    // 기본 응답 (매칭되지 않는 경우)
    console.warn(`[MOCK] No mock data for ${method} ${url}`);
    return { success: true, data: null };
  }

  prepareBody(body, headers = {}) {
    if (!body) return null;

    if (body instanceof FormData) {
      return body;
    }

    const contentType = headers["Content-Type"] || headers["content-type"];
    if (contentType && contentType.includes("multipart/form-data")) {
      return body;
    }

    return JSON.stringify(body);
  }

  async get(url, options = {}) {
    return this.request("GET", url, null, options);
  }

  async post(url, body, options = {}) {
    return this.request("POST", url, body, options);
  }

  async put(url, body, options = {}) {
    return this.request("PUT", url, body, options);
  }

  async patch(url, body, options = {}) {
    return this.request("PATCH", url, body, options);
  }

  async delete(url, options = {}) {
    return this.request("DELETE", url, null, options);
  }
}

export default Axioxs;
