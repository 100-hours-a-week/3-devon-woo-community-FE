const STORAGE_KEY = 'postDraft';
const API_BASE_URL = 'http://localhost:8080/api/v1';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const MOCK_TAGS = [
    'JavaScript', 'React', 'Vue', 'Angular', 'Node.js',
    'TypeScript', 'Python', 'Java', 'Spring', 'Django',
    'Backend', 'Frontend', 'DevOps', 'AWS', 'Docker',
    'Kubernetes', 'Database', 'SQL', 'MongoDB', 'Redis',
    'Architecture', 'Design Pattern', 'Algorithm', 'Data Structure',
    'Web', 'Mobile', 'iOS', 'Android', 'Flutter'
];

const MOCK_SERIES = [
    { id: 1, name: 'Backend 개발 시리즈' },
    { id: 2, name: 'Frontend 기초부터 심화까지' },
    { id: 3, name: '클라우드 아키텍처' },
    { id: 4, name: '알고리즘 정복하기' }
];

class PublishController {
    constructor() {
        this.postData = null;
        this.selectedTags = [];
        this.thumbnailUrl = null;
        this.selectedSeries = null;

        this.postTitlePreview = document.getElementById('postTitlePreview');
        this.summaryInput = document.getElementById('summaryInput');
        this.summaryCharCount = document.getElementById('summaryCharCount');
        this.tagsInput = document.getElementById('tagsInput');
        this.tagsContainer = document.getElementById('tagsContainer');
        this.tagsSuggestions = document.getElementById('tagsSuggestions');
        this.selectedTagsContainer = document.getElementById('selectedTags');
        this.thumbnailPreview = document.getElementById('thumbnailPreview');
        this.thumbnailInput = document.getElementById('thumbnailInput');
        this.seriesSelect = document.getElementById('seriesSelect');

        this.init();
    }

    init() {
        this.loadDraft();
        this.initSummaryInput();
        this.initTagsInput();
        this.initThumbnail();
        this.initSeries();
        this.initActions();
    }

    loadDraft() {
        const draftJson = localStorage.getItem(STORAGE_KEY);
        if (!draftJson) {
            alert('저장된 초안이 없습니다. 글 작성 페이지로 돌아갑니다.');
            window.location.href = 'create.html';
            return;
        }

        try {
            this.postData = JSON.parse(draftJson);
            this.postTitlePreview.textContent = this.postData.title || '제목 없음';

            if (this.postData.images && this.postData.images.length > 0) {
                this.thumbnailUrl = this.postData.images[0];
                this.displayThumbnail(this.thumbnailUrl);
            }
        } catch (e) {
            console.error('Failed to load draft:', e);
            alert('초안을 불러오는데 실패했습니다.');
            window.location.href = 'create.html';
        }
    }

    initSummaryInput() {
        this.summaryInput.addEventListener('input', () => {
            const length = this.summaryInput.value.length;
            this.summaryCharCount.textContent = length;
        });
    }

    initTagsInput() {
        this.tagsInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value) {
                this.showTagSuggestions(value);
            } else {
                this.hideTagSuggestions();
            }
        });

        this.tagsInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.tagsInput.value.trim()) {
                e.preventDefault();
                this.addTag(this.tagsInput.value.trim());
                this.tagsInput.value = '';
                this.hideTagSuggestions();
            }
        });

        this.tagsContainer.addEventListener('click', () => {
            this.tagsInput.focus();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tags-input-wrapper')) {
                this.hideTagSuggestions();
            }
        });
    }

    showTagSuggestions(query) {
        const suggestions = MOCK_TAGS.filter(tag =>
            tag.toLowerCase().includes(query.toLowerCase()) &&
            !this.selectedTags.includes(tag)
        );

        if (suggestions.length === 0) {
            this.hideTagSuggestions();
            return;
        }

        this.tagsSuggestions.innerHTML = suggestions
            .slice(0, 5)
            .map(tag => `
                <div class="tag-suggestion-item" data-tag="${tag}">
                    ${tag}
                </div>
            `)
            .join('');

        this.tagsSuggestions.style.display = 'block';

        this.tagsSuggestions.querySelectorAll('.tag-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.addTag(item.dataset.tag);
                this.tagsInput.value = '';
                this.hideTagSuggestions();
            });
        });
    }

    hideTagSuggestions() {
        this.tagsSuggestions.style.display = 'none';
        this.tagsSuggestions.innerHTML = '';
    }

    addTag(tag) {
        if (this.selectedTags.includes(tag)) return;
        if (this.selectedTags.length >= 5) {
            alert('태그는 최대 5개까지 추가할 수 있습니다.');
            return;
        }

        this.selectedTags.push(tag);
        this.renderTags();
    }

    removeTag(tag) {
        this.selectedTags = this.selectedTags.filter(t => t !== tag);
        this.renderTags();
    }

    renderTags() {
        this.selectedTagsContainer.innerHTML = this.selectedTags
            .map(tag => `
                <div class="tag-chip">
                    ${tag}
                    <button onclick="publishController.removeTag('${tag}')">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            `)
            .join('');
    }

    initThumbnail() {
        document.getElementById('uploadThumbnailBtn').addEventListener('click', () => {
            this.thumbnailInput.click();
        });

        this.thumbnailInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                alert('이미지 파일만 업로드할 수 있습니다.');
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                alert('파일 크기가 너무 큽니다. (최대 10MB)');
                return;
            }

            try {
                const imageUrl = await this.uploadThumbnail(file);
                this.thumbnailUrl = imageUrl;
                this.displayThumbnail(imageUrl);
            } catch (error) {
                console.error('Upload failed:', error);
                alert('썸네일 업로드에 실패했습니다.');
            }

            e.target.value = '';
        });

        document.getElementById('removeThumbnailBtn').addEventListener('click', () => {
            this.thumbnailUrl = null;
            this.displayThumbnail(null);
        });
    }

    displayThumbnail(url) {
        if (url) {
            this.thumbnailPreview.classList.add('has-image');
            this.thumbnailPreview.innerHTML = `<img src="${url}" alt="썸네일">`;
            document.getElementById('removeThumbnailBtn').style.display = 'block';
        } else {
            this.thumbnailPreview.classList.remove('has-image');
            this.thumbnailPreview.innerHTML = `
                <div class="thumbnail-placeholder">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" stroke-width="3"/>
                        <circle cx="18" cy="18" r="4" fill="currentColor"/>
                        <path d="M42 30l-10-10-15 15-5-5-6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>썸네일 이미지를 선택하세요</p>
                </div>
            `;
            document.getElementById('removeThumbnailBtn').style.display = 'none';
        }
    }

    async uploadThumbnail(file) {
        const signResponse = await fetch(`${API_BASE_URL}/images/sign?type=post`);
        if (!signResponse.ok) {
            throw new Error('이미지 서명 요청 실패');
        }

        const signData = await signResponse.json();

        const formData = new FormData();
        Object.keys(signData.uploadParams).forEach(key => {
            formData.append(key, signData.uploadParams[key]);
        });
        formData.append('file', file);

        const uploadResponse = await fetch(signData.uploadUrl, {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error('이미지 업로드 실패');
        }

        const uploadResult = await uploadResponse.json();
        return uploadResult.secure_url || uploadResult.url;
    }

    initSeries() {
        MOCK_SERIES.forEach(series => {
            const option = document.createElement('option');
            option.value = series.id;
            option.textContent = series.name;
            this.seriesSelect.appendChild(option);
        });

        this.seriesSelect.addEventListener('change', (e) => {
            this.selectedSeries = e.target.value || null;
        });

        document.getElementById('createSeriesBtn').addEventListener('click', () => {
            this.showSeriesModal();
        });

        document.getElementById('closeSeriesModal').addEventListener('click', () => {
            this.hideSeriesModal();
        });

        document.getElementById('cancelSeriesBtn').addEventListener('click', () => {
            this.hideSeriesModal();
        });

        document.getElementById('createSeriesSubmitBtn').addEventListener('click', () => {
            this.createSeries();
        });

        document.getElementById('seriesModal').querySelector('.modal-backdrop').addEventListener('click', () => {
            this.hideSeriesModal();
        });
    }

    showSeriesModal() {
        document.getElementById('seriesModal').classList.add('active');
        document.getElementById('seriesNameInput').value = '';
        document.getElementById('seriesDescInput').value = '';
    }

    hideSeriesModal() {
        document.getElementById('seriesModal').classList.remove('active');
    }

    createSeries() {
        const name = document.getElementById('seriesNameInput').value.trim();
        const description = document.getElementById('seriesDescInput').value.trim();

        if (!name) {
            alert('시리즈 이름을 입력해주세요.');
            return;
        }

        const newSeriesId = MOCK_SERIES.length + 1;
        const newSeries = { id: newSeriesId, name, description };
        MOCK_SERIES.push(newSeries);

        const option = document.createElement('option');
        option.value = newSeriesId;
        option.textContent = name;
        this.seriesSelect.appendChild(option);

        this.seriesSelect.value = newSeriesId;
        this.selectedSeries = newSeriesId;

        this.hideSeriesModal();
        alert(`"${name}" 시리즈가 생성되었습니다.`);
    }

    initActions() {
        document.getElementById('cancelBtn').addEventListener('click', () => {
            if (confirm('작성을 취소하시겠습니까? 작성 페이지로 돌아갑니다.')) {
                window.location.href = 'create.html';
            }
        });

        document.getElementById('publishBtn').addEventListener('click', () => {
            this.publishPost();
        });
    }

    async publishPost() {
        const summary = this.summaryInput.value.trim();
        const visibility = document.querySelector('input[name="visibility"]:checked').value;

        if (!this.postData.title || !this.postData.content) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        const postPayload = {
            memberId: 1,
            title: this.postData.title,
            content: this.postData.content,
            image: this.thumbnailUrl || (this.postData.images && this.postData.images.length > 0 ? this.postData.images[0] : null),
            summary: summary || null,
            tags: this.selectedTags,
            seriesId: this.selectedSeries,
            visibility: visibility,
            isDraft: false
        };

        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = 'flex';

        try {
            console.log('Publishing post:', postPayload);

            await new Promise(resolve => setTimeout(resolve, 2000));

            localStorage.removeItem(STORAGE_KEY);

            alert('게시글이 성공적으로 출간되었습니다!');

            window.location.href = '../tech-blog-detail/detail.html';

        } catch (error) {
            console.error('Failed to publish post:', error);
            alert('게시글 출간에 실패했습니다. 다시 시도해주세요.');
            loadingOverlay.style.display = 'none';
        }
    }
}

let publishController;

document.addEventListener('DOMContentLoaded', () => {
    publishController = new PublishController();
});
