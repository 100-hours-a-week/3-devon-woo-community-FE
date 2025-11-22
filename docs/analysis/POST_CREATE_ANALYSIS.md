# Post Create/Edit Page Analysis

## Overview
Advanced markdown editor with toolbar, image upload, preview mode, and publishing settings.

**Reference**: `new_design/post-create/`

---

## Layout Structure

```
┌──────────────────────────────────────────────────────┐
│  Header (Logo + Autosave Status)                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌────────────────────────────────────────────┐     │
│  │ Title Input (Large, 42px)                  │     │
│  ├────────────────────────────────────────────┤     │
│  │ Toolbar (Sticky)                           │     │
│  │ [B][I][S][H1][H2]...[Image][Preview]       │     │
│  ├────────────────────────────────────────────┤     │
│  │                                            │     │
│  │ Markdown Textarea / Preview                │     │
│  │ (Drag & Drop Image Support)                │     │
│  │                                            │     │
│  │                                            │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
├──────────────────────────────────────────────────────┤
│  Footer (나가기 | 임시 저장 | 출간하기)               │
└──────────────────────────────────────────────────────┘
```

### Key Layout Specifications
- **Container**: Max-width 900px
- **Padding**: 48px 40px 120px (bottom padding for fixed footer)
- **Min-height**: calc(100vh - 64px - 72px)
- **Fixed Footer**: Bottom sticky bar

---

## Component Breakdown

### 1. Header (Simplified)
**Specifications**:
- Height: 64px (smaller than blog list)
- Logo: 24px
- No navigation, no search
- Autosave status on right

**Autosave Status**:
```
[✓] 모든 변경사항 저장됨  2분 전
```

**Status Specifications**:
- Display: flex, gap 8px
- Font-size: 13px
- Color: #999
- Icon: 16×16 checkmark
- Icon color: #4caf50 (saved), #ff9800 (saving with pulse animation)

**Animation**:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.autosave-status.saving .save-icon {
  animation: pulse 1s infinite;
}
```

### 2. Title Input
**Specifications**:
- Width: 100%
- Border: none
- Font-size: 42px
- Font-weight: 700
- Line-height: 1.3
- Color: #000
- Placeholder color: #d0d0d0
- Placeholder: "제목을 입력하세요"
- Maxlength: 200
- Resize: none
- No outline

### 3. Toolbar Component (NEW)
**Component to Create**:
```
src/components/MarkdownToolbar/
├── index.js
└── style.css
```

**Container Specifications**:
- Display: flex, gap 4px
- Padding: 12px 16px
- Background: #fafafa
- Border: 1px solid #e5e5e5
- Border-radius: 8px
- Margin-bottom: 16px
- **Position: sticky**
- Top: 72px (below header)
- Z-index: 50
- Flex-wrap: wrap

**Button Groups** (separated by dividers):
1. **Text Formatting**: Bold, Italic, Strikethrough
2. **Headings**: H1, H2, H3, H4
3. **Blocks**: Quote, Code, Link
4. **Lists**: UL, OL, Checkbox
5. **Media**: Image, Divider
6. **Preview**: Toggle preview

**Toolbar Button Specifications**:
- Size: 36px × 36px
- Background: transparent
- Border: none
- Border-radius: 6px
- Color: #666
- SVG icons: 18×18
- Cursor: pointer

**Button States**:
```css
.toolbar-btn:hover {
  background: #e8e8e8;
  color: #333;
}

.toolbar-btn:active {
  background: #d8d8d8;
}

.toolbar-btn.active {
  background: #667eea;
  color: white;
}
```

**Toolbar Divider**:
- Width: 1px
- Height: 24px
- Background: #d0d0d0
- Margin: 0 8px

**Toggle Button** (Preview):
- Width: auto
- Padding: 0 12px
- Gap: 6px (icon + text)
- Text: "미리보기"

### 4. Editor Container
**Dual Pane System**: Textarea OR Preview (toggle)

**Structure**:
```javascript
<div class="editor-container">
  <div class="editor-pane active">
    <div class="upload-zone">
      <div class="upload-overlay"></div>
      <textarea class="content-textarea"></textarea>
    </div>
  </div>
  <div class="preview-pane">
    <div class="preview-content"></div>
  </div>
</div>
```

**Only one pane visible at a time** (toggle with .active class)

### 5. Drag & Drop Image Upload (NEW)
**Component to Create**:
```
src/components/ImageUploader/
├── index.js
└── style.css
```

**Upload Overlay**:
- Position: absolute over textarea
- Background: rgba(102, 126, 234, 0.95)
- Color: white
- Display: none (flex when active)
- Flex-direction: column, center
- Gap: 16px
- Z-index: 10
- Border-radius: 8px
- Pointer-events: none

**Overlay Content**:
- Upload icon SVG (48×48)
- Text: "이미지를 여기에 드롭하세요" (18px, 600 weight)

**Drag Events**:
```javascript
textarea.addEventListener('dragenter', () => {
  overlay.classList.add('active');
});

textarea.addEventListener('dragleave', () => {
  overlay.classList.remove('active');
});

textarea.addEventListener('drop', async (e) => {
  e.preventDefault();
  overlay.classList.remove('active');

  const files = Array.from(e.dataTransfer.files)
    .filter(f => f.type.startsWith('image/'));

  await uploadImages(files);
});
```

### 6. Markdown Textarea
**Specifications**:
- Width: 100%
- Min-height: 500px
- Border: 1px solid #e5e5e5
- Border-radius: 8px
- Padding: 20px
- Font-size: 17px
- Line-height: 1.8
- Font-family: inherit (not monospace!)
- Color: #333
- Resize: vertical
- Focus border-color: #667eea
- Placeholder: "내용을 입력하세요..."
- Spellcheck: false

### 7. Preview Pane
**Container**:
- Min-height: 500px
- Padding: 20px
- Border: 1px solid #e5e5e5
- Border-radius: 8px

**Content Styling** (Same as post detail):
```css
.preview-content {
  font-size: 17px;
  line-height: 1.8;
  color: #333;
}

.preview-content h1 { font-size: 36px; font-weight: 700; margin: 40px 0 24px; }
.preview-content h2 { font-size: 32px; font-weight: 700; margin: 48px 0 24px; }
.preview-content h3 { font-size: 24px; font-weight: 600; margin: 36px 0 20px; }
.preview-content h4 { font-size: 20px; font-weight: 600; margin: 28px 0 16px; }
.preview-content p { margin-bottom: 16px; }
.preview-content blockquote {
  margin: 24px 0;
  padding: 16px 20px;
  border-left: 4px solid #667eea;
  background: #f8f9ff;
  color: #666;
  font-style: italic;
}
.preview-content pre {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
}
.preview-content code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
}
.preview-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 24px 0;
}
```

### 8. Footer Actions Bar
**Container**:
- Position: fixed
- Bottom: 0, left: 0, right: 0
- Background: #ffffff
- Border-top: 1px solid #e5e5e5
- Z-index: 90

**Content**:
- Max-width: 900px
- Margin: 0 auto
- Padding: 16px 40px
- Display: flex, justify-between

**Buttons**:
1. **나가기** (left): Secondary style
2. **임시 저장** (right): Secondary style with save icon
3. **출간하기** (right): Primary style

**Button Specifications**:
```css
.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
}

.btn-primary:hover { background: #5568d3; }
.btn-primary:active { background: #4557bc; }

.btn-secondary {
  background: transparent;
  color: #666;
  border: 1px solid #e5e5e5;
}

.btn-secondary:hover {
  background: #f5f5f5;
  color: #333;
}
```

### 9. Image Upload Modal (NEW)
**Purpose**: Show upload progress for multiple images

**Structure**:
```
Modal Backdrop (full screen, rgba(0,0,0,0.5))
  └─ Modal Content (centered card)
       ├─ "이미지 업로드 중" (title)
       └─ Progress List
            ├─ Image 1: [Icon] Filename [Progress Bar] Status
            ├─ Image 2: [Icon] Filename [Progress Bar] Status
            └─ ...
```

**Progress Item**:
- Display: flex, gap 12px, align-center
- Icon: 20×20 (spinner/checkmark/error)
- Filename: 14px, #333
- Progress bar: width 100%, height 4px, background #e5e5e5
- Progress fill: background #667eea, transition 0.3s
- Status: 12px, #999 ("업로드 중...", "완료", "실패")

**Icon States**:
- Uploading: Spin animation
- Success: #4caf50 checkmark
- Error: #f44336 X

---

## Toolbar Actions

### Text Formatting
```javascript
function insertMarkdown(before, after = '') {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);

  textarea.value =
    text.substring(0, start) +
    before + selected + after +
    text.substring(end);

  textarea.focus();
  textarea.selectionStart = start + before.length;
  textarea.selectionEnd = start + before.length + selected.length;
}

// Bold: **text**
toolbar.bold.onclick = () => insertMarkdown('**', '**');

// Italic: *text*
toolbar.italic.onclick = () => insertMarkdown('*', '*');

// Strikethrough: ~~text~~
toolbar.strikethrough.onclick = () => insertMarkdown('~~', '~~');
```

### Headings
```javascript
toolbar.h1.onclick = () => insertMarkdown('# ');
toolbar.h2.onclick = () => insertMarkdown('## ');
toolbar.h3.onclick = () => insertMarkdown('### ');
toolbar.h4.onclick = () => insertMarkdown('#### ');
```

### Blocks
```javascript
// Quote
toolbar.quote.onclick = () => insertMarkdown('> ');

// Code block
toolbar.code.onclick = () => insertMarkdown('```\n', '\n```');

// Link
toolbar.link.onclick = () => {
  const url = prompt('URL을 입력하세요:');
  if (url) insertMarkdown('[', `](${url})`);
};
```

### Lists
```javascript
toolbar.ul.onclick = () => insertMarkdown('- ');
toolbar.ol.onclick = () => insertMarkdown('1. ');
toolbar.checkbox.onclick = () => insertMarkdown('- [ ] ');
```

### Media
```javascript
toolbar.image.onclick = () => {
  document.getElementById('imageInput').click();
};

toolbar.divider.onclick = () => insertMarkdown('\n---\n');
```

### Preview Toggle
```javascript
toolbar.preview.onclick = () => {
  const editorPane = document.getElementById('editorPane');
  const previewPane = document.getElementById('previewPane');
  const isPreview = previewPane.classList.contains('active');

  if (isPreview) {
    // Switch to editor
    previewPane.classList.remove('active');
    editorPane.classList.add('active');
    toolbar.preview.classList.remove('active');
  } else {
    // Switch to preview
    editorPane.classList.remove('active');
    previewPane.classList.add('active');
    toolbar.preview.classList.add('active');
    renderPreview();
  }
};
```

---

## Image Upload Flow

```javascript
async function uploadImages(files) {
  showUploadModal();

  for (const file of files) {
    const progressItem = createProgressItem(file.name);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        onUploadProgress: (e) => {
          const percent = (e.loaded / e.total) * 100;
          updateProgress(progressItem, percent);
        }
      });

      const { url } = await response.json();

      markComplete(progressItem);
      insertImageMarkdown(url);

    } catch (error) {
      markError(progressItem, error.message);
    }
  }

  setTimeout(hideUploadModal, 1000);
}

function insertImageMarkdown(url) {
  const markdown = `\n![](${url})\n`;
  insertAtCursor(textarea, markdown);
}
```

---

## Autosave Logic

```javascript
let autosaveTimeout;

textarea.addEventListener('input', () => {
  clearTimeout(autosaveTimeout);
  setStatus('saving');

  autosaveTimeout = setTimeout(async () => {
    await saveDraft();
    setStatus('saved');
  }, 2000); // Save after 2s of no typing
});

async function saveDraft() {
  const draft = {
    title: titleInput.value,
    content: textarea.value,
    updatedAt: new Date()
  };

  await api.saveDraft(draft);
  localStorage.setItem('draft', JSON.stringify(draft));
}

function loadDraft() {
  const saved = localStorage.getItem('draft');
  if (saved) {
    const draft = JSON.parse(saved);
    titleInput.value = draft.title || '';
    textarea.value = draft.content || '';
  }
}
```

---

## Publishing Flow

```javascript
publishBtn.addEventListener('click', async () => {
  // Show publish settings modal (from publish.html)
  showPublishModal({
    title: titleInput.value,
    content: textarea.value,
    onPublish: async (settings) => {
      const post = {
        title: settings.title,
        content: settings.content,
        category: settings.category,
        tags: settings.tags,
        series: settings.series,
        thumbnail: settings.thumbnail,
        visibility: settings.visibility
      };

      await api.createPost(post);
      localStorage.removeItem('draft');
      router.navigate(`/posts/${post.id}`);
    }
  });
});
```

---

## API Integration

### Save Draft
```javascript
POST /posts/draft
Request:
{
  "title": "Draft Title",
  "content": "Draft content..."
}
```

### Upload Image
```javascript
POST /upload/image
Content-Type: multipart/form-data

Response:
{
  "url": "https://cdn.example.com/images/abc123.jpg"
}
```

### Create Post
```javascript
POST /posts
Request:
{
  "title": "Post Title",
  "content": "Markdown content...",
  "category": "Tech",
  "tags": ["JavaScript", "React"],
  "series": null,
  "thumbnail": "https://...",
  "visibility": "public"
}
```

---

## Migration Tasks

1. Create `MarkdownToolbar` component
2. Create `ImageUploader` component
3. Create/update `PostCreatePage` and `PostEditPage`
4. Implement markdown preview rendering
5. Implement autosave
6. Add image upload to Cloudinary/CDN
7. Create publish settings modal

---

## Notes

- **Markdown Library**: Use marked.js or similar
- **Autosave**: 2-second debounce
- **Image Upload**: Support JPG, PNG, GIF, WebP
- **Max Image Size**: 10MB
- **Drag & Drop**: Visual feedback essential
- **Keyboard Shortcuts**: Ctrl+B (bold), Ctrl+I (italic), Ctrl+K (link)
- **Exit Warning**: Warn if unsaved changes
