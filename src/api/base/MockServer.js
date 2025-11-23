export default class MockServer {
  constructor() {
    this.memberStore = new Map();
    this.emailIndex = new Map();
    this.nextMemberId = 11;
    this._membersSeeded = false;
    this.seriesStore = new Map();
    this.nextSeriesId = 4;
    this.postStore = new Map();
    this.nextPostId = 101;
    this._seedSeries();
  }

  async delay() {
    return new Promise(r => setTimeout(r, 100));
  }

  async handle(method, url, body) {
    await this.delay();
    await this._ensureMembersSeeded();

    // ---------------- AUTH ----------------
    if (url.includes('/auth/login') && method === 'POST') {
      const LoginResponse = (await import('../../dto/response/auth/LoginResponse.js')).default;
      const member = body?.email ? await this._findMemberByEmail(body.email) : await this._getMember(1);
      const targetMember = member || await this._getMember(1);
      return {
        success: true,
        data: new LoginResponse({
          accessToken: `mock-access-token-${targetMember.memberId}`,
          refreshToken: `mock-refresh-token-${targetMember.memberId}`,
          member: targetMember
        })
      };
    }

    if (url.startsWith('/api/v1/tags') && method === 'GET') {
      const TagSummaryResponse = (await import('../../dto/response/post/TagSummaryResponse.js')).default;
      const queryString = url.split('?')[1] || '';
      const searchParams = new URLSearchParams(queryString);
      const limit = parseInt(searchParams.get('limit') || '20', 10);
      const items = TagSummaryResponse.createDummyList(limit);
      return { success: true, data: items };
    }

    if (url.includes('/auth/signup') && method === 'POST') {
      const SignupResponse = (await import('../../dto/response/auth/SignupResponse.js')).default;
      const member = await this._createMemberFromSignup(body || {});
      return {
        success: true,
        data: new SignupResponse({
          accessToken: `mock-access-token-${member.memberId}`,
          refreshToken: `mock-refresh-token-${member.memberId}`,
          member
        })
      };
    }

    if (url.includes('/auth/logout') && method === 'POST') {
      return { success: true, data: null };
    }

    if (url.startsWith('/api/v1/series') && method === 'GET') {
      return { success: true, data: Array.from(this.seriesStore.values()) };
    }

    if (url === '/api/v1/series' && method === 'POST') {
      const SeriesResponse = (await import('../../dto/response/post/SeriesResponse.js')).default;
      const name = (body?.name || '').trim();
      if (!name) {
        return { success: false, data: null, message: '시리즈 이름을 입력해주세요.' };
      }
      const description = (body?.description || '').trim();
      const seriesId = this.nextSeriesId++;
      const newSeries = new SeriesResponse({
        seriesId,
        name,
        description,
        postCount: 0
      });
      this.seriesStore.set(seriesId, newSeries);
      return { success: true, data: newSeries };
    }

    // ---------------- MEMBER ----------------
    if (url.match(/\/members\/\d+$/) && method === 'GET') {
      const id = parseInt(url.match(/\/members\/(\d+)/)[1]);
      const member = await this._getMember(id);
      return { success: true, data: member };
    }

    if (url.match(/\/members\/\d+$/) && method === 'PATCH') {
      const MemberUpdateResponse = (await import('../../dto/response/member/MemberUpdateResponse.js')).default;
      const id = parseInt(url.match(/\/members\/(\d+)/)[1]);
      const updatedMember = await this._updateMember(id, body || {});
      return { success: true, data: new MemberUpdateResponse(updatedMember) };
    }

    if (url.includes('/members/') && url.includes('/password') && method === 'PATCH') {
      return { success: true, data: null };
    }

    if (url.match(/\/members\/\d+$/) && method === 'DELETE') {
      return { success: true, data: null };
    }

    // ---------------- POSTS ----------------
    if (url === '/api/v1/posts' && method === 'POST') {
      const post = await this._createPost(body || {});
      return { success: true, data: post };
    }

    if (url.includes('/api/v1/posts?') && method === 'GET') {
      const PostSummaryResponse = (await import('../../dto/response/post/PostSummaryResponse.js')).default;
      const PageResponse = (await import('../../dto/response/common/PageResponse.js')).default;
      const queryString = url.split('?')[1] || '';
      const params = new URLSearchParams(queryString);
      const page = parseInt(params.get('page') || '0', 10);
      const size = parseInt(params.get('size') || '20', 10);
      const storedSummaries = Array.from(this.postStore.values()).map(post => this._mapPostToSummary(post));
      const dummyList = PostSummaryResponse.createDummyList(40);
      const dataset = [...storedSummaries, ...dummyList];
      const start = page * size;
      const items = dataset.slice(start, start + size);
      const totalElements = dataset.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      return {
        success: true,
        data: new PageResponse({
          items,
          page,
          size,
          totalElements,
          totalPages
        })
      };
    }

    if (url.match(/\/api\/v1\/posts\/\d+(\?.*)?$/) && method === 'GET' && !url.includes('/comments')) {
      const PostResponse = (await import('../../dto/response/post/PostResponse.js')).default;
      const id = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      if (this.postStore.has(id)) {
        return { success: true, data: this.postStore.get(id) };
      }
      return { success: true, data: PostResponse.createDummy(id) };
    }

    if (url.match(/\/api\/v1\/posts\/\d+(\?.*)?$/) && method === 'PATCH') {
      const id = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      const updated = await this._updatePost(id, body || {});
      return { success: true, data: updated };
    }

    if (url.match(/\/api\/v1\/posts\/\d+(\?.*)?$/) && method === 'DELETE') {
      const id = parseInt(url.match(/\/posts\/(\d+)/)[1]);
      this.postStore.delete(id);
      return { success: true, data: null };
    }

    if (url.includes('/posts/') && url.includes('/like') && method === 'POST') {
      return { success: true, data: null };
    }

    if (url.includes('/posts/') && url.includes('/like') && method === 'DELETE') {
      return { success: true, data: null };
    }

    if (url.match(/\/api\/v1\/posts\/\d+\/recommendations$/) && method === 'GET') {
      const PostSummaryResponse = (await import('../../dto/response/post/PostSummaryResponse.js')).default;
      const currentPostId = parseInt(url.match(/\/posts\/(\d+)/)[1]);

      const recommendedIds = [];
      let offset = (currentPostId * 7) % 10;
      for (let i = 0; i < 3; i++) {
        let recommendId = ((offset + i) % 10) + 1;
        if (recommendId === currentPostId) {
          recommendId = ((recommendId + 1) % 10) + 1;
        }
        recommendedIds.push(recommendId);
      }

      const recommendations = recommendedIds.map(id => PostSummaryResponse.createDummy(id));
      return { success: true, data: recommendations };
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

  async _ensureMembersSeeded() {
    if (this._membersSeeded) return;
    const MemberResponse = (await import('../../dto/response/member/MemberResponse.js')).default;
    for (let id = 1; id <= 5; id++) {
      const member = MemberResponse.createDummy(id);
      this._saveMember(member);
    }
    this._membersSeeded = true;
  }

  _saveMember(member) {
    const normalized = {
      ...member,
      id: member.memberId,
      socialLinks: {
        github: member.socialLinks?.github || '',
        website: member.socialLinks?.website || '',
        linkedin: member.socialLinks?.linkedin || '',
        notion: member.socialLinks?.notion || ''
      }
    };
    this.memberStore.set(normalized.memberId, normalized);
    if (normalized.email) {
      this.emailIndex.set(normalized.email, normalized.memberId);
    }
  }

  async _getMember(id) {
    if (this.memberStore.has(id)) {
      return this.memberStore.get(id);
    }
    const MemberResponse = (await import('../../dto/response/member/MemberResponse.js')).default;
    const member = MemberResponse.createDummy(id);
    this._saveMember(member);
    return this.memberStore.get(id);
  }

  async _findMemberByEmail(email) {
    if (!email) return null;
    const memberId = this.emailIndex.get(email);
    if (!memberId) return null;
    return this._getMember(memberId);
  }

  async _createMemberFromSignup(payload = {}) {
    const MemberResponse = (await import('../../dto/response/member/MemberResponse.js')).default;
    const memberId = this.nextMemberId++;
    const base = MemberResponse.createDummy(memberId);
    const newMember = {
      ...base,
      memberId,
      id: memberId,
      email: payload.email || base.email,
      nickname: payload.nickname || base.nickname,
      profileImage: payload.profileImage || base.profileImage,
      handle: payload.handle || base.handle,
      bio: payload.bio || base.bio,
      role: payload.role || base.role,
      company: payload.company || base.company,
      location: payload.location || base.location,
      primaryStack: Array.isArray(payload.primaryStack) ? payload.primaryStack : base.primaryStack,
      interests: Array.isArray(payload.interests) ? payload.interests : base.interests,
      socialLinks: {
        ...(base.socialLinks || {}),
        ...(payload.socialLinks || {})
      }
    };
    this._saveMember(newMember);
    return this.memberStore.get(memberId);
  }

  async _updateMember(id, payload = {}) {
    const existing = await this._getMember(id);
    const updated = {
      ...existing,
      nickname: payload.nickname ?? existing.nickname,
      profileImage: payload.profileImage ?? existing.profileImage,
      handle: payload.handle ?? existing.handle,
      bio: payload.bio ?? existing.bio,
      role: payload.role ?? existing.role,
      company: payload.company ?? existing.company,
      location: payload.location ?? existing.location,
      primaryStack: Array.isArray(payload.primaryStack) ? payload.primaryStack : existing.primaryStack,
      interests: Array.isArray(payload.interests) ? payload.interests : existing.interests,
      socialLinks: {
        ...(existing.socialLinks || {}),
        ...(payload.socialLinks || {})
      }
    };
    this._saveMember(updated);
    return updated;
  }

  _seedSeries() {
    const defaults = [
      { seriesId: 1, name: 'Backend 개발 시리즈', description: 'MSA, 이벤트 기반 아키텍처 정리', postCount: 6 },
      { seriesId: 2, name: 'Frontend 아키텍처', description: '디자인 시스템과 퍼포먼스 이야기', postCount: 4 },
      { seriesId: 3, name: '클라우드 네이티브 실전', description: '쿠버네티스/Helm 실무 적용기', postCount: 5 }
    ];
    defaults.forEach((series) => {
      this.seriesStore.set(series.seriesId, series);
    });
  }

  async _createPost(payload = {}, forcedId = null) {
    const PostResponse = (await import('../../dto/response/post/PostResponse.js')).default;
    const postId = forcedId || this.nextPostId++;
    const base = PostResponse.createDummy(postId);
    const tags = Array.isArray(payload.tags) ? payload.tags : [];
    const seriesId = payload.seriesId ? Number(payload.seriesId) : null;
    const seriesName = seriesId ? this.seriesStore.get(seriesId)?.name || '' : '';
    const newPost = {
      ...base,
      postId,
      title: payload.title || base.title,
      content: payload.content || base.content,
      summary: payload.summary || payload.content?.slice(0, 140) || base.summary,
      imageUrl: payload.image || base.imageUrl,
      tags,
      seriesId,
      seriesName,
      visibility: payload.visibility || 'public',
      isDraft: !!payload.isDraft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.postStore.set(postId, newPost);
    return newPost;
  }

  async _updatePost(id, payload = {}) {
    if (!this.postStore.has(id)) {
      return this._createPost(payload, id);
    }
    const existing = this.postStore.get(id);
    const tags = Array.isArray(payload.tags) ? payload.tags : existing.tags;
    const seriesId = payload.seriesId !== undefined ? Number(payload.seriesId) || null : existing.seriesId;
    const seriesName = seriesId ? this.seriesStore.get(seriesId)?.name || '' : '';
    const updated = {
      ...existing,
      title: payload.title ?? existing.title,
      content: payload.content ?? existing.content,
      summary: payload.summary ?? existing.summary,
      imageUrl: payload.image ?? existing.imageUrl,
      tags,
      seriesId,
      seriesName,
      visibility: payload.visibility ?? existing.visibility,
      isDraft: payload.isDraft ?? existing.isDraft,
      updatedAt: new Date().toISOString()
    };
    this.postStore.set(id, updated);
    return updated;
  }

  _mapPostToSummary(post) {
    return {
      postId: post.postId,
      title: post.title,
      summary: post.summary,
      thumbnail: post.imageUrl,
      member: post.member,
      createdAt: post.createdAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
    };
  }
}
