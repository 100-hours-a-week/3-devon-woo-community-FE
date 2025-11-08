// 페이지 모드 (create 또는 edit)
const pageMode = {
    isEditMode: false,
    postId: null
};

// 상태 관리
const state = {
    title: '',
    content: '',
    imageFile: null,
    imagePreviewUrl: null,
    isLoading: false,
    existingImageUrl: null
};

// DOM 요소
const elements = {
    backButton: document.querySelector('.back-button'),
    formTitle: document.querySelector('.form-title'),
    postForm: document.getElementById('postForm'),
    titleInput: document.getElementById('titleInput'),
    contentInput: document.getElementById('contentInput'),
    currentCount: document.querySelector('.current-count'),
    charCount: document.querySelector('.char-count'),
    imageUploadBtn: document.getElementById('imageUploadBtn'),
    imageInput: document.getElementById('imageInput'),
    imageUploadText: document.querySelector('.image-upload-text'),
    imagePreviewContainer: document.getElementById('imagePreviewContainer'),
    imagePreview: document.getElementById('imagePreview'),
    imageRemoveBtn: document.getElementById('imageRemoveBtn'),
    submitBtn: document.getElementById('submitBtn')
};

// 페이지 모드 확인
function checkPageMode() {
    // TODO: URL에서 모드 확인
    // 예: /posts/create -> create 모드
    //     /posts/123/edit -> edit 모드
    const path = window.location.pathname;
    const pathParts = path.split('/');

    if (pathParts.includes('edit')) {
        pageMode.isEditMode = true;
        pageMode.postId = pathParts[pathParts.length - 2];
        elements.formTitle.textContent = '게시글 수정';
        elements.submitBtn.textContent = '수정';
    } else {
        pageMode.isEditMode = false;
        elements.formTitle.textContent = '게시글 작성';
        elements.submitBtn.textContent = '완료';
    }
}

// 제목 글자 수 업데이트
function updateCharCount() {
    const length = elements.titleInput.value.length;
    elements.currentCount.textContent = length;

    // 26자 제한 경고
    if (length >= 26) {
        elements.charCount.classList.add('warning');
    } else {
        elements.charCount.classList.remove('warning');
    }

    validateForm();
}

// 폼 유효성 검사
function validateForm() {
    const title = elements.titleInput.value.trim();
    const content = elements.contentInput.value.trim();

    state.title = title;
    state.content = content;

    // 제목과 내용이 모두 입력되었는지 확인
    const isValid = title.length > 0 && content.length > 0;

    // 버튼 활성화/비활성화
    elements.submitBtn.disabled = !isValid;

    return isValid;
}

// 이미지 파일 선택 처리
function handleImageSelect(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        alert('이미지 파일만 업로드 가능합니다. (jpg, png, gif)');
        elements.imageInput.value = '';
        return;
    }

    // 파일 크기 검증 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        elements.imageInput.value = '';
        return;
    }

    // 이미지 미리보기 생성
    state.imageFile = file;
    const reader = new FileReader();

    reader.onload = (e) => {
        state.imagePreviewUrl = e.target.result;
        elements.imagePreview.src = e.target.result;
        elements.imagePreviewContainer.style.display = 'block';
        elements.imageUploadText.textContent = file.name;
    };

    reader.readAsDataURL(file);
}

// 이미지 제거
function removeImage() {
    state.imageFile = null;
    state.imagePreviewUrl = null;
    state.existingImageUrl = null;
    elements.imageInput.value = '';
    elements.imagePreview.src = '';
    elements.imagePreviewContainer.style.display = 'none';
    elements.imageUploadText.textContent = '파일을 선택해주세요.';
}

// API: 게시글 생성
async function createPost(data) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                postId: Date.now()
            });
        }, 1000);
    });

    /*
    // 실제 API 호출 예시
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to create post');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
    */
}

// API: 게시글 수정
async function updatePost(postId, data) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                postId: postId
            });
        }, 1000);
    });

    /*
    // 실제 API 호출 예시
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await fetch(`/api/posts/${postId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update post');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
    */
}

// API: 게시글 상세 조회 (수정 모드용)
async function fetchPostForEdit(postId) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: postId,
                title: '수정할 게시글 제목',
                content: '수정할 게시글 내용입니다.\n여러 줄로 작성된 내용입니다.',
                imageUrl: null // 또는 이미지 URL
            });
        }, 500);
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

// 수정 모드: 기존 데이터 로드
async function loadPostDataForEdit() {
    if (!pageMode.isEditMode || !pageMode.postId) {
        return;
    }

    try {
        const post = await fetchPostForEdit(pageMode.postId);

        // 폼에 데이터 채우기
        elements.titleInput.value = post.title;
        elements.contentInput.value = post.content;

        // 이미지가 있는 경우
        if (post.imageUrl) {
            state.existingImageUrl = post.imageUrl;
            elements.imagePreview.src = post.imageUrl;
            elements.imagePreviewContainer.style.display = 'block';
            elements.imageUploadText.textContent = '기존 이미지';
        }

        // 글자 수 업데이트
        updateCharCount();
        validateForm();

    } catch (error) {
        console.error('Error loading post for edit:', error);
        alert('게시글을 불러오는 중 오류가 발생했습니다.');
    }
}

// 폼 제출 처리
async function handleSubmit(event) {
    event.preventDefault();

    // 중복 제출 방지
    if (state.isLoading) {
        return;
    }

    // 유효성 검사
    if (!validateForm()) {
        alert('제목, 내용을 모두 작성해주세요.');
        return;
    }

    // 로딩 상태 시작
    state.isLoading = true;
    elements.submitBtn.disabled = true;
    elements.submitBtn.classList.add('loading');

    try {
        const postData = {
            title: state.title,
            content: state.content,
            image: state.imageFile
        };

        let result;
        if (pageMode.isEditMode) {
            // 수정 모드
            result = await updatePost(pageMode.postId, postData);
            alert('게시글이 수정되었습니다.');
            // TODO: 상세 페이지로 이동
            console.log(`Navigate to /posts/${pageMode.postId}`);
            // window.location.href = `/posts/${pageMode.postId}`;
        } else {
            // 생성 모드
            result = await createPost(postData);
            alert('게시글이 작성되었습니다.');
            // TODO: 상세 페이지 또는 목록으로 이동
            console.log(`Navigate to /posts/${result.postId}`);
            // window.location.href = `/posts/${result.postId}`;
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        alert('게시글 저장 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
        elements.submitBtn.disabled = false;
        elements.submitBtn.classList.remove('loading');
    }
}

// 뒤로가기 버튼 처리
function handleBackClick() {
    // 작성 중인 내용이 있으면 확인
    if (state.title || state.content || state.imageFile) {
        const confirmed = confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?');
        if (!confirmed) {
            return;
        }
    }

    // TODO: 이전 페이지로 이동
    console.log('Navigate back');
    // window.history.back();
}

// 이벤트 리스너 등록
function initEventListeners() {
    // 뒤로가기
    elements.backButton.addEventListener('click', handleBackClick);

    // 제목 입력
    elements.titleInput.addEventListener('input', updateCharCount);

    // 내용 입력
    elements.contentInput.addEventListener('input', validateForm);

    // 이미지 업로드 버튼
    elements.imageUploadBtn.addEventListener('click', () => {
        elements.imageInput.click();
    });

    // 이미지 파일 선택
    elements.imageInput.addEventListener('change', handleImageSelect);

    // 이미지 제거
    elements.imageRemoveBtn.addEventListener('click', removeImage);

    // 폼 제출
    elements.postForm.addEventListener('submit', handleSubmit);

    // 페이지 이탈 방지 (작성 중인 경우)
    window.addEventListener('beforeunload', (e) => {
        if ((state.title || state.content || state.imageFile) && !state.isLoading) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// 초기화
async function init() {
    checkPageMode();
    initEventListeners();

    // 수정 모드인 경우 데이터 로드
    if (pageMode.isEditMode) {
        await loadPostDataForEdit();
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
