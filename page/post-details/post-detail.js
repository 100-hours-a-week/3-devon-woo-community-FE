// 상태 관리
const state = {
    postId: null,
    post: null,
    comments: [],
    isLiked: false,
    isLoading: false,
    editingCommentId: null,
    currentUser: {
        id: 1,
        name: '더미 작성자 1'
    }
};

// DOM 요소
const elements = {
    backButton: document.querySelector('.back-button'),
    editButton: document.querySelector('.edit-btn'),
    deleteButton: document.querySelector('.delete-btn'),
    postTitle: document.querySelector('.post-title'),
    postDate: document.querySelector('.post-date'),
    postContent: document.querySelector('.post-content'),
    postImage: document.querySelector('.post-image-container'),
    likeCount: document.querySelector('.like-count'),
    viewCount: document.querySelector('.view-count'),
    commentCountDisplay: document.querySelector('.comment-count'),
    commentInput: document.querySelector('.comment-input'),
    commentSubmitBtn: document.querySelector('.comment-submit-btn'),
    commentList: document.querySelector('.comment-list'),
    noComments: document.querySelector('.no-comments'),
    deleteModal: document.getElementById('deleteModal'),
    deleteCommentModal: document.getElementById('deleteCommentModal')
};

// 유틸리티 함수: 숫자를 k 단위로 변환
function formatCount(count) {
    if (count >= 100000) {
        return Math.floor(count / 1000) + 'k';
    } else if (count >= 10000) {
        return Math.floor(count / 1000) + 'k';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
}

// 유틸리티 함수: 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// URL에서 게시글 ID 추출
function getPostIdFromUrl() {
    // TODO: 실제 URL에서 ID 추출 로직
    // 예: /posts/123 -> 123
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

// 모달 제어
function openModal(modalElement) {
    modalElement.style.display = 'flex';
    document.body.classList.add('modal-active');
}

function closeModal(modalElement) {
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-active');
}

// API: 게시글 상세 조회
async function fetchPostDetail(postId) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: postId,
                title: '제목 1',
                content: `무엇을 해야할까요? 이렇게하면, 실은 할일 눈앞에 모방하여, 그것은 권위와 소리다. 피어나는 지혜는 이것이 자신과 것이다.

자라는 이매들을 위하여도 무엇을 우리의 것은 그들의 사랑의 영원히 시대를 자리를 밝는다. 그것서 우리의 싶은 소유하고나 위대나 있습니다.

자라는 이매들을 이아니기기는 우리 물봄들은 여봉에다. 우리는 끓지는 자신의 작업을 위란에서 우리의 대한인는다. 달, 피와, 슬, 하늘 등 모드 것이 우리를 눕파오 인간초지다니다. 자라는 우려의 성명 우는 받을 봄은다.

이저러로, 사사를 협력 반담는 향식 형원들은 여봉에다. 우리는 중의와 우리의 우리들 더 쟁이의다 배우고 편려한 무 있인이습니다.

그럼 애아에서, 실은 얼학님은그로 기능 사그 있는습니다. 새로운 경험를 풍가한 지긔와으로 기능 작 있는습니다.

고자 나아가기, 과이 중요니다.`,
                createdAt: '2021-01-01T00:00:00',
                viewCount: 1234,
                commentCount: 123,
                likeCount: 123,
                author: {
                    id: 1,
                    name: '더미 작성자 1'
                },
                isLiked: false
            });
        }, 300);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
    */
}

// API: 댓글 목록 조회
async function fetchComments(postId) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    content: '댓글 내용',
                    createdAt: '2021-01-01T00:00:00',
                    author: {
                        id: 1,
                        name: '더미 작성자 1'
                    }
                },
                {
                    id: 2,
                    content: '댓글 내용',
                    createdAt: '2021-01-01T00:00:00',
                    author: {
                        id: 2,
                        name: '더미 작성자 2'
                    }
                },
                {
                    id: 3,
                    content: '댓글 내용',
                    createdAt: '2021-01-01T00:00:00',
                    author: {
                        id: 1,
                        name: '더미 작성자 1'
                    }
                }
            ]);
        }, 300);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
    */
}

// API: 게시글 삭제
async function deletePost(postId) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 300);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete post');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
    */
}

// API: 좋아요 토글
async function toggleLike(postId, isLiked) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 300);
    });

    /*
    // 실제 API 호출 예시
    const method = isLiked ? 'DELETE' : 'POST';
    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: method
        });
        if (!response.ok) {
            throw new Error('Failed to toggle like');
        }
        return await response.json();
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
    */
}

// API: 댓글 작성
async function createComment(postId, content) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Date.now(),
                content: content,
                createdAt: new Date().toISOString(),
                author: state.currentUser
            });
        }, 300);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        if (!response.ok) {
            throw new Error('Failed to create comment');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
    */
}

// API: 댓글 수정
async function updateComment(commentId, content) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 300);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        if (!response.ok) {
            throw new Error('Failed to update comment');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
    */
}

// API: 댓글 삭제
async function deleteComment(commentId) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 300);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
    */
}

// 게시글 렌더링
function renderPost(post) {
    elements.postTitle.textContent = post.title;
    elements.postDate.textContent = formatDate(post.createdAt);
    elements.postContent.textContent = post.content;
    elements.likeCount.textContent = formatCount(post.likeCount);
    elements.viewCount.textContent = formatCount(post.viewCount);
    elements.commentCountDisplay.textContent = formatCount(post.commentCount);

    state.isLiked = post.isLiked;

    // 이미지가 있는 경우
    if (post.imageUrl) {
        elements.postImage.style.display = 'block';
        elements.postImage.querySelector('.post-image').src = post.imageUrl;
    }
}

// 댓글 카드 생성
function createCommentCard(comment) {
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.dataset.commentId = comment.id;

    const isOwnComment = comment.author.id === state.currentUser.id;

    commentItem.innerHTML = `
        <div class="comment-header">
            <div class="comment-author-info">
                <div class="comment-avatar"></div>
                <div class="comment-author-details">
                    <span class="comment-author-name">${comment.author.name}</span>
                    <span class="comment-date">${formatDate(comment.createdAt)}</span>
                </div>
            </div>
            ${isOwnComment ? `
                <div class="comment-actions">
                    <button class="comment-action-btn edit-comment-btn">수정</button>
                    <button class="comment-action-btn delete-comment-btn">삭제</button>
                </div>
            ` : ''}
        </div>
        <div class="comment-content">${comment.content}</div>
        <div class="comment-edit-container">
            <textarea class="comment-edit-input" rows="3">${comment.content}</textarea>
            <div class="comment-edit-actions">
                <button class="comment-edit-btn cancel">취소</button>
                <button class="comment-edit-btn save">댓글 수정</button>
            </div>
        </div>
    `;

    // 이벤트 리스너
    if (isOwnComment) {
        const editBtn = commentItem.querySelector('.edit-comment-btn');
        const deleteBtn = commentItem.querySelector('.delete-comment-btn');
        const cancelBtn = commentItem.querySelector('.comment-edit-btn.cancel');
        const saveBtn = commentItem.querySelector('.comment-edit-btn.save');

        editBtn.addEventListener('click', () => handleEditComment(comment.id));
        deleteBtn.addEventListener('click', () => handleDeleteCommentClick(comment.id));
        cancelBtn.addEventListener('click', () => cancelEditComment(comment.id));
        saveBtn.addEventListener('click', () => saveEditComment(comment.id));
    }

    return commentItem;
}

// 댓글 목록 렌더링
function renderComments(comments) {
    elements.commentList.innerHTML = '';

    if (comments.length === 0) {
        elements.noComments.style.display = 'block';
        return;
    }

    elements.noComments.style.display = 'none';
    comments.forEach(comment => {
        const commentCard = createCommentCard(comment);
        elements.commentList.appendChild(commentCard);
    });
}

// 댓글 입력 유효성 검사
function validateCommentInput() {
    const value = elements.commentInput.value.trim();
    elements.commentSubmitBtn.disabled = value.length === 0;
}

// 뒤로가기 핸들러
function handleBackClick() {
    // TODO: 목록 페이지로 이동
    console.log('Navigate to /posts');
    // window.location.href = '/posts';
}

// 수정 버튼 핸들러
function handleEditClick() {
    // TODO: 수정 페이지로 이동
    console.log(`Navigate to /posts/${state.postId}/edit`);
    // window.location.href = `/posts/${state.postId}/edit`;
}

// 삭제 버튼 클릭 핸들러
function handleDeleteClick() {
    openModal(elements.deleteModal);
}

// 게시글 삭제 확인 핸들러
async function confirmDeletePost() {
    if (state.isLoading) return;

    state.isLoading = true;
    closeModal(elements.deleteModal);

    try {
        await deletePost(state.postId);
        alert('게시글이 삭제되었습니다.');
        // TODO: 목록 페이지로 이동
        console.log('Navigate to /posts');
        // window.location.href = '/posts';
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
    }
}

// 좋아요 토글 핸들러
async function handleLikeToggle() {
    if (state.isLoading) return;

    state.isLoading = true;
    const previousIsLiked = state.isLiked;
    const previousCount = state.post.likeCount;

    // Optimistic update
    state.isLiked = !state.isLiked;
    state.post.likeCount += state.isLiked ? 1 : -1;
    elements.likeCount.textContent = formatCount(state.post.likeCount);

    try {
        await toggleLike(state.postId, previousIsLiked);
    } catch (error) {
        // Rollback on error
        state.isLiked = previousIsLiked;
        state.post.likeCount = previousCount;
        elements.likeCount.textContent = formatCount(previousCount);
        console.error('Error toggling like:', error);
        alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
    }
}

// 댓글 작성 핸들러
async function handleCommentSubmit() {
    const content = elements.commentInput.value.trim();
    if (!content || state.isLoading) return;

    state.isLoading = true;
    elements.commentSubmitBtn.disabled = true;

    try {
        const newComment = await createComment(state.postId, content);
        state.comments.unshift(newComment);
        renderComments(state.comments);
        elements.commentInput.value = '';

        // 댓글 수 업데이트
        state.post.commentCount++;
        elements.commentCountDisplay.textContent = formatCount(state.post.commentCount);
    } catch (error) {
        console.error('Error creating comment:', error);
        alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
        validateCommentInput();
    }
}

// 댓글 수정 모드 활성화
function handleEditComment(commentId) {
    const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (!commentItem) return;

    // 다른 수정 모드 취소
    if (state.editingCommentId && state.editingCommentId !== commentId) {
        cancelEditComment(state.editingCommentId);
    }

    commentItem.classList.add('editing');
    state.editingCommentId = commentId;

    // textarea에 포커스
    const textarea = commentItem.querySelector('.comment-edit-input');
    textarea.focus();
}

// 댓글 수정 취소
function cancelEditComment(commentId) {
    const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (!commentItem) return;

    commentItem.classList.remove('editing');

    // 원래 내용으로 복원
    const comment = state.comments.find(c => c.id === commentId);
    if (comment) {
        const textarea = commentItem.querySelector('.comment-edit-input');
        textarea.value = comment.content;
    }

    state.editingCommentId = null;
}

// 댓글 수정 저장
async function saveEditComment(commentId) {
    const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (!commentItem || state.isLoading) return;

    const textarea = commentItem.querySelector('.comment-edit-input');
    const newContent = textarea.value.trim();

    if (!newContent) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    state.isLoading = true;

    try {
        await updateComment(commentId, newContent);

        // 상태 업데이트
        const comment = state.comments.find(c => c.id === commentId);
        if (comment) {
            comment.content = newContent;
            const contentElement = commentItem.querySelector('.comment-content');
            contentElement.textContent = newContent;
        }

        commentItem.classList.remove('editing');
        state.editingCommentId = null;
    } catch (error) {
        console.error('Error updating comment:', error);
        alert('댓글 수정 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
    }
}

// 댓글 삭제 클릭 핸들러
function handleDeleteCommentClick(commentId) {
    state.deletingCommentId = commentId;
    openModal(elements.deleteCommentModal);
}

// 댓글 삭제 확인 핸들러
async function confirmDeleteComment() {
    if (state.isLoading || !state.deletingCommentId) return;

    state.isLoading = true;
    closeModal(elements.deleteCommentModal);

    try {
        await deleteComment(state.deletingCommentId);

        // 상태에서 제거
        state.comments = state.comments.filter(c => c.id !== state.deletingCommentId);
        renderComments(state.comments);

        // 댓글 수 업데이트
        state.post.commentCount--;
        elements.commentCountDisplay.textContent = formatCount(state.post.commentCount);

        state.deletingCommentId = null;
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('댓글 삭제 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
    }
}

// 이벤트 리스너 등록
function initEventListeners() {
    // 뒤로가기
    elements.backButton.addEventListener('click', handleBackClick);

    // 게시글 수정/삭제
    elements.editButton.addEventListener('click', handleEditClick);
    elements.deleteButton.addEventListener('click', handleDeleteClick);

    // 댓글 입력
    elements.commentInput.addEventListener('input', validateCommentInput);
    elements.commentSubmitBtn.addEventListener('click', handleCommentSubmit);

    // 댓글 입력 엔터키 (Shift+Enter는 줄바꿈)
    elements.commentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!elements.commentSubmitBtn.disabled) {
                handleCommentSubmit();
            }
        }
    });

    // 모달 이벤트
    // 게시글 삭제 모달
    const deleteModalCancel = elements.deleteModal.querySelector('.cancel-btn');
    const deleteModalConfirm = elements.deleteModal.querySelector('.confirm-btn');
    deleteModalCancel.addEventListener('click', () => closeModal(elements.deleteModal));
    deleteModalConfirm.addEventListener('click', confirmDeletePost);

    // 댓글 삭제 모달
    const deleteCommentModalCancel = elements.deleteCommentModal.querySelector('.cancel-btn');
    const deleteCommentModalConfirm = elements.deleteCommentModal.querySelector('.confirm-btn');
    deleteCommentModalCancel.addEventListener('click', () => closeModal(elements.deleteCommentModal));
    deleteCommentModalConfirm.addEventListener('click', confirmDeleteComment);

    // 모달 오버레이 클릭 시 닫기
    elements.deleteModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) {
            closeModal(elements.deleteModal);
        }
    });
    elements.deleteCommentModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteCommentModal) {
            closeModal(elements.deleteCommentModal);
        }
    });
}

// 페이지 로드
async function loadPage() {
    try {
        // URL에서 게시글 ID 추출
        state.postId = getPostIdFromUrl() || '1';

        // 게시글 상세 조회
        state.post = await fetchPostDetail(state.postId);
        renderPost(state.post);

        // 댓글 목록 조회
        state.comments = await fetchComments(state.postId);
        renderComments(state.comments);

    } catch (error) {
        console.error('Error loading page:', error);
        alert('페이지를 불러오는 중 오류가 발생했습니다.');
    }
}

// 초기화
async function init() {
    initEventListeners();
    await loadPage();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
