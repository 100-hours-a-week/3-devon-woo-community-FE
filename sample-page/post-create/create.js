const AUTOSAVE_INTERVAL = 30000;
const STORAGE_KEY = 'postDraft';
const API_BASE_URL = 'http://localhost:8080/api/v1';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

class MarkdownEditor {
    constructor() {
        this.titleInput = document.getElementById('titleInput');
        this.contentTextarea = document.getElementById('contentTextarea');
        this.previewContent = document.getElementById('previewContent');
        this.previewPane = document.getElementById('previewPane');
        this.editorPane = document.getElementById('editorPane');
        this.previewToggle = document.getElementById('previewToggle');
        this.autosaveStatus = document.getElementById('autosaveStatus');

        this.isPreviewMode = false;
        this.autosaveTimer = null;
        this.uploadedImages = [];

        this.init();
    }

    init() {
        this.loadDraft();
        this.initToolbar();
        this.initAutoSave();
        this.initImageUpload();
        this.initKeyboardShortcuts();
        this.initFooterActions();
    }

    initToolbar() {
        const toolbar = document.getElementById('toolbar');
        toolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('.toolbar-btn');
            if (!btn) return;

            const action = btn.dataset.action;
            if (action === 'preview') {
                this.togglePreview();
            } else if (action === 'image') {
                document.getElementById('imageInput').click();
            } else {
                this.applyFormat(action);
            }
        });
    }

    applyFormat(format) {
        const textarea = this.contentTextarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);

        let newText = '';
        let cursorOffset = 0;

        switch (format) {
            case 'bold':
                newText = `**${selectedText || '텍스트'}**`;
                cursorOffset = selectedText ? newText.length : 2;
                break;
            case 'italic':
                newText = `*${selectedText || '텍스트'}*`;
                cursorOffset = selectedText ? newText.length : 1;
                break;
            case 'strikethrough':
                newText = `~~${selectedText || '텍스트'}~~`;
                cursorOffset = selectedText ? newText.length : 2;
                break;
            case 'h1':
                newText = `\n# ${selectedText || '제목 1'}\n`;
                cursorOffset = selectedText ? newText.length - 1 : 2;
                break;
            case 'h2':
                newText = `\n## ${selectedText || '제목 2'}\n`;
                cursorOffset = selectedText ? newText.length - 1 : 3;
                break;
            case 'h3':
                newText = `\n### ${selectedText || '제목 3'}\n`;
                cursorOffset = selectedText ? newText.length - 1 : 4;
                break;
            case 'h4':
                newText = `\n#### ${selectedText || '제목 4'}\n`;
                cursorOffset = selectedText ? newText.length - 1 : 5;
                break;
            case 'quote':
                newText = `\n> ${selectedText || '인용문'}\n`;
                cursorOffset = selectedText ? newText.length - 1 : 2;
                break;
            case 'code':
                newText = '\n```\n' + (selectedText || '코드') + '\n```\n';
                cursorOffset = selectedText ? 4 + selectedText.length : 4;
                break;
            case 'link':
                newText = `[${selectedText || '링크 텍스트'}](url)`;
                cursorOffset = selectedText ? newText.length - 4 : 1;
                break;
            case 'ul':
                newText = `\n- ${selectedText || '목록 항목'}\n`;
                cursorOffset = selectedText ? newText.length - 1 : 2;
                break;
            case 'ol':
                newText = `\n1. ${selectedText || '목록 항목'}\n`;
                cursorOffset = selectedText ? newText.length - 1 : 3;
                break;
            case 'checkbox':
                newText = `\n- [ ] ${selectedText || '할 일'}\n`;
                cursorOffset = selectedText ? newText.length - 1 : 6;
                break;
            case 'divider':
                newText = '\n---\n';
                cursorOffset = newText.length;
                break;
            default:
                return;
        }

        textarea.value = beforeText + newText + afterText;
        textarea.focus();
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);

        this.triggerAutoSave();
    }

    togglePreview() {
        this.isPreviewMode = !this.isPreviewMode;

        if (this.isPreviewMode) {
            this.editorPane.classList.remove('active');
            this.previewPane.classList.add('active');
            this.previewToggle.classList.add('active');
            this.renderPreview();
        } else {
            this.previewPane.classList.remove('active');
            this.editorPane.classList.add('active');
            this.previewToggle.classList.remove('active');
        }
    }

    renderPreview() {
        const markdown = this.contentTextarea.value;
        const html = this.parseMarkdown(markdown);
        this.previewContent.innerHTML = html || '<p class="preview-placeholder">미리보기 내용이 여기에 표시됩니다</p>';
    }

    parseMarkdown(markdown) {
        if (!markdown.trim()) return '';

        let html = markdown;

        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        html = html.replace(/^- \[ \] (.*)$/gim, '<ul class="checklist"><li>$1</li></ul>');
        html = html.replace(/^- \[x\] (.*)$/gim, '<ul class="checklist"><li class="checked">$1</li></ul>');
        html = html.replace(/^- (.*)$/gim, '<ul><li>$1</li></ul>');
        html = html.replace(/^\d+\. (.*)$/gim, '<ol><li>$1</li></ol>');

        html = html.replace(/<\/ul>\s*<ul>/g, '');
        html = html.replace(/<\/ul>\s*<ul class="checklist">/g, '');
        html = html.replace(/<\/ul class="checklist">\s*<ul class="checklist">/g, '');
        html = html.replace(/<\/ol>\s*<ol>/g, '');
        html = html.replace(/<\/blockquote>\s*<blockquote>/g, '\n');

        html = html.replace(/^---$/gim, '<hr>');

        html = html.split('\n').map(line => {
            if (line.trim() &&
                !line.match(/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div)/) &&
                !line.match(/<\/(h[1-6]|ul|ol|li|blockquote|pre|code|div)>$/)) {
                return `<p>${line}</p>`;
            }
            return line;
        }).join('\n');

        return html;
    }

    initAutoSave() {
        const autoSave = () => {
            this.saveDraftToLocalStorage();
            this.updateAutoSaveStatus('saved');
        };

        [this.titleInput, this.contentTextarea].forEach(element => {
            element.addEventListener('input', () => {
                this.triggerAutoSave();
            });
        });

        this.autosaveTimer = setInterval(autoSave, AUTOSAVE_INTERVAL);
    }

    triggerAutoSave() {
        this.updateAutoSaveStatus('saving');
        clearInterval(this.autosaveTimer);

        setTimeout(() => {
            this.saveDraftToLocalStorage();
            this.updateAutoSaveStatus('saved');
        }, 1000);

        this.autosaveTimer = setInterval(() => {
            this.saveDraftToLocalStorage();
            this.updateAutoSaveStatus('saved');
        }, AUTOSAVE_INTERVAL);
    }

    updateAutoSaveStatus(status) {
        const statusText = this.autosaveStatus.querySelector('.status-text');
        const statusTime = this.autosaveStatus.querySelector('.status-time');

        if (status === 'saving') {
            this.autosaveStatus.classList.add('saving');
            statusText.textContent = '저장 중...';
        } else {
            this.autosaveStatus.classList.remove('saving');
            statusText.textContent = '모든 변경사항 저장됨';
            const now = new Date();
            statusTime.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
    }

    saveDraftToLocalStorage() {
        const draft = {
            title: this.titleInput.value,
            content: this.contentTextarea.value,
            images: this.uploadedImages,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }

    loadDraft() {
        const draftJson = localStorage.getItem(STORAGE_KEY);
        if (!draftJson) return;

        try {
            const draft = JSON.parse(draftJson);
            this.titleInput.value = draft.title || '';
            this.contentTextarea.value = draft.content || '';
            this.uploadedImages = draft.images || [];

            if (draft.lastSaved) {
                const lastSaved = new Date(draft.lastSaved);
                this.autosaveStatus.querySelector('.status-time').textContent =
                    `${lastSaved.getHours()}:${String(lastSaved.getMinutes()).padStart(2, '0')}`;
            }
        } catch (e) {
            console.error('Failed to load draft:', e);
        }
    }

    clearDraft() {
        localStorage.removeItem(STORAGE_KEY);
        this.uploadedImages = [];
    }

    initImageUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const uploadOverlay = document.getElementById('uploadOverlay');
        const imageInput = document.getElementById('imageInput');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadOverlay.classList.add('active');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => {
                uploadOverlay.classList.remove('active');
            });
        });

        uploadZone.addEventListener('drop', (e) => {
            const files = Array.from(e.dataTransfer.files).filter(file =>
                ALLOWED_IMAGE_TYPES.includes(file.type)
            );
            if (files.length > 0) {
                this.handleImageFiles(files);
            }
        });

        imageInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                this.handleImageFiles(files);
            }
            e.target.value = '';
        });
    }

    async handleImageFiles(files) {
        const modal = document.getElementById('imageUploadModal');
        const progressList = document.getElementById('uploadProgressList');

        modal.classList.add('active');
        progressList.innerHTML = '';

        const cursorPosition = this.contentTextarea.selectionStart;
        let insertText = '';

        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                alert(`${file.name}은(는) 파일 크기가 너무 큽니다. (최대 10MB)`);
                continue;
            }

            const progressItem = this.createProgressItem(file.name);
            progressList.appendChild(progressItem);

            try {
                const imageUrl = await this.uploadImage(file, progressItem);
                insertText += `\n![${file.name}](${imageUrl})\n`;
                this.uploadedImages.push(imageUrl);
                this.updateProgressItem(progressItem, 'success');
            } catch (error) {
                console.error('Upload failed:', error);
                this.updateProgressItem(progressItem, 'error', error.message);
            }
        }

        if (insertText) {
            const beforeText = this.contentTextarea.value.substring(0, cursorPosition);
            const afterText = this.contentTextarea.value.substring(cursorPosition);
            this.contentTextarea.value = beforeText + insertText + afterText;
            this.contentTextarea.focus();
            this.triggerAutoSave();
        }

        setTimeout(() => {
            modal.classList.remove('active');
        }, 2000);
    }

    createProgressItem(filename) {
        const item = document.createElement('div');
        item.className = 'upload-progress-item';
        item.innerHTML = `
            <div class="upload-progress-icon uploading">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="50" stroke-dashoffset="25"/>
                </svg>
            </div>
            <div class="upload-progress-info">
                <div class="upload-progress-name">${filename}</div>
                <div class="upload-progress-bar">
                    <div class="upload-progress-fill" style="width: 0%"></div>
                </div>
                <div class="upload-progress-status">업로드 중...</div>
            </div>
        `;
        return item;
    }

    updateProgressItem(item, status, message = '') {
        const icon = item.querySelector('.upload-progress-icon');
        const statusText = item.querySelector('.upload-progress-status');
        const progressFill = item.querySelector('.upload-progress-fill');

        icon.classList.remove('uploading');
        icon.classList.add(status);

        if (status === 'success') {
            progressFill.style.width = '100%';
            statusText.textContent = '업로드 완료';
            icon.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.67 6L7.5 15.17 3.33 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else if (status === 'error') {
            statusText.textContent = message || '업로드 실패';
            icon.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 18.33A8.33 8.33 0 1 0 10 1.67a8.33 8.33 0 0 0 0 16.66zM10 6.67V10M10 13.33h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
    }

    async uploadImage(file, progressItem) {
        const progressFill = progressItem.querySelector('.upload-progress-fill');

        progressFill.style.width = '30%';

        const signResponse = await fetch(`${API_BASE_URL}/images/sign?type=post`);
        if (!signResponse.ok) {
            throw new Error('이미지 서명 요청 실패');
        }

        const signData = await signResponse.json();

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

        if (!uploadResponse.ok) {
            throw new Error('이미지 업로드 실패');
        }

        const uploadResult = await uploadResponse.json();

        progressFill.style.width = '100%';

        return uploadResult.secure_url || uploadResult.url;
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.applyFormat('bold');
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                this.applyFormat('italic');
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.applyFormat('link');
            } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveDraftToBackend();
            }
        });
    }

    initFooterActions() {
        document.getElementById('exitBtn').addEventListener('click', () => {
            if (confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
                window.location.href = '../tech-blog/blog.html';
            }
        });

        document.getElementById('tempSaveBtn').addEventListener('click', () => {
            this.saveDraftToBackend();
        });

        document.getElementById('publishBtn').addEventListener('click', () => {
            this.navigateToPublish();
        });
    }

    async saveDraftToBackend() {
        const title = this.titleInput.value.trim();
        const content = this.contentTextarea.value.trim();

        if (!title || !content) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        this.updateAutoSaveStatus('saving');

        try {
            const draftData = {
                title,
                content,
                images: this.uploadedImages,
                isDraft: true
            };

            console.log('Saving draft to backend:', draftData);

            setTimeout(() => {
                alert('임시 저장되었습니다.');
                this.updateAutoSaveStatus('saved');
            }, 500);

        } catch (error) {
            console.error('Failed to save draft:', error);
            alert('임시 저장에 실패했습니다.');
            this.updateAutoSaveStatus('saved');
        }
    }

    navigateToPublish() {
        const title = this.titleInput.value.trim();
        const content = this.contentTextarea.value.trim();

        if (!title) {
            alert('제목을 입력해주세요.');
            this.titleInput.focus();
            return;
        }

        if (!content) {
            alert('내용을 입력해주세요.');
            this.contentTextarea.focus();
            return;
        }

        this.saveDraftToLocalStorage();

        window.location.href = 'publish.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MarkdownEditor();
});
