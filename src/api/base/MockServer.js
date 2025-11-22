export default class MockServer {
  async delay() {
    return new Promise(r => setTimeout(r, 100));
  }

  async handle(method, url, body) {
    await this.delay();

    // ---------------- AUTH ----------------
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

    // ---------------- MEMBER ----------------
    if (url.match(/\/members\/\d+$/) && method === 'GET') {
      const MemberResponse = (await import('../../dto/response/member/MemberResponse.js')).default;
      const id = parseInt(url.match(/\/members\/(\d+)/)[1]);
      return { success: true, data: MemberResponse.createDummy(id) };
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

    // ---------------- POSTS ----------------
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

    if (url.match(/\/api\/v1\/posts\/\d+(\?.*)?$/) && method === 'GET' && !url.includes('/comments')) {
      const PostResponse = (await import('../../dto/response/post/PostResponse.js')).default;
      const id = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      return { success: true, data: PostResponse.createDummy(id) };
    }

    if (url.match(/\/api\/v1\/posts\/\d+(\?.*)?$/) && method === 'PATCH') {
      const PostResponse = (await import('../../dto/response/post/PostResponse.js')).default;
      const id = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      return { success: true, data: PostResponse.createDummy(id) };
    }

    if (url.match(/\/api\/v1\/posts\/\d+(\?.*)?$/) && method === 'DELETE') {
      return { success: true, data: null };
    }

    if (url.includes('/posts/') && url.includes('/like') && method === 'POST') {
      return { success: true, data: null };
    }

    if (url.includes('/posts/') && url.includes('/like') && method === 'DELETE') {
      return { success: true, data: null };
    }

    // ---------------- COMMENTS ----------------
    // 댓글 목록 조회: GET /posts/{postId}/comments
    if (url.match(/\/api\/v1\/posts\/\d+\/comments(\?.*)?$/) && method === 'GET') {
      const CommentResponse = (await import('../../dto/response/comment/CommentResponse.js')).default;
      const PageResponse = (await import('../../dto/response/common/PageResponse.js')).default;
      const postId = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      const items = CommentResponse.createDummyList(10, postId);
      return { success: true, data: PageResponse.createDummy(items, 0, 10, 50) };
    }

    // 댓글 생성: POST /posts/{postId}/comments
    if (url.match(/\/api\/v1\/posts\/\d+\/comments$/) && method === 'POST') {
      const CommentResponse = (await import('../../dto/response/comment/CommentResponse.js')).default;
      return { success: true, data: CommentResponse.createDefault() };
    }

    if (url.match(/\/api\/v1\/comments\/\d+$/) && method === 'GET') {
      const CommentResponse = (await import('../../dto/response/comment/CommentResponse.js')).default;
      const id = parseInt(url.match(/\/comments\/(\d+)/)[1]);
      return { success: true, data: CommentResponse.createDummy(id) };
    }

    if (url.match(/\/api\/v1\/comments\/\d+$/) && method === 'PATCH') {
      const CommentResponse = (await import('../../dto/response/comment/CommentResponse.js')).default;
      const id = parseInt(url.match(/\/comments\/(\d+)/)[1]);
      return { success: true, data: CommentResponse.createDummy(id) };
    }

    if (url.match(/\/api\/v1\/comments\/\d+$/) && method === 'DELETE') {
      return { success: true, data: null };
    }

    // ---------------- DEFAULT ----------------
    console.warn(`[MOCK] No mock data for ${method} ${url}`);
    return { success: true, data: null };
  }
}
