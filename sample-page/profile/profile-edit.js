const initialProfileData = {
    name: 'John Doe',
    handle: 'A passionate developer',
    bio: '',
    profileImage: 'https://via.placeholder.com/160',
    socialLinks: {
        github: '',
        twitter: '',
        website: ''
    }
};

let currentProfileData = { ...initialProfileData };
let hasChanges = false;
let uploadedImageFile = null;

function loadProfileData() {
    document.getElementById('nameInput').value = currentProfileData.name;
    document.getElementById('handleInput').value = currentProfileData.handle;
    document.getElementById('bioInput').value = currentProfileData.bio;
    document.getElementById('profileImagePreview').src = currentProfileData.profileImage;

    document.getElementById('githubInput').value = currentProfileData.socialLinks.github;
    document.getElementById('twitterInput').value = currentProfileData.socialLinks.twitter;
    document.getElementById('websiteInput').value = currentProfileData.socialLinks.website;

    updateCharCount();
}

function updateCharCount() {
    const bioInput = document.getElementById('bioInput');
    const charCount = document.getElementById('bioCharCount');
    charCount.textContent = bioInput.value.length;
}

function validateName() {
    const nameInput = document.getElementById('nameInput');
    const nameError = document.getElementById('nameError');
    const name = nameInput.value.trim();

    if (name === '') {
        nameError.textContent = '이름을 입력해주세요';
        nameInput.classList.add('error');
        return false;
    }

    if (name.length > 50) {
        nameError.textContent = '이름은 50자 이하로 입력해주세요';
        nameInput.classList.add('error');
        return false;
    }

    nameError.textContent = '';
    nameInput.classList.remove('error');
    return true;
}

function validateURL(input, errorElement) {
    const url = input.value.trim();

    if (url === '') {
        errorElement.textContent = '';
        input.classList.remove('error');
        return true;
    }

    try {
        new URL(url);
        errorElement.textContent = '';
        input.classList.remove('error');
        return true;
    } catch (e) {
        errorElement.textContent = '올바른 URL을 입력해주세요';
        input.classList.add('error');
        return false;
    }
}

function validateForm() {
    const isNameValid = validateName();

    const githubInput = document.getElementById('githubInput');
    const githubError = document.getElementById('githubError');
    const isGithubValid = validateURL(githubInput, githubError);

    const twitterInput = document.getElementById('twitterInput');
    const twitterError = document.getElementById('twitterError');
    const isTwitterValid = validateURL(twitterInput, twitterError);

    const websiteInput = document.getElementById('websiteInput');
    const websiteError = document.getElementById('websiteError');
    const isWebsiteValid = validateURL(websiteInput, websiteError);

    return isNameValid && isGithubValid && isTwitterValid && isWebsiteValid;
}

function checkForChanges() {
    const nameInput = document.getElementById('nameInput').value.trim();
    const handleInput = document.getElementById('handleInput').value.trim();
    const bioInput = document.getElementById('bioInput').value.trim();
    const githubInput = document.getElementById('githubInput').value.trim();
    const twitterInput = document.getElementById('twitterInput').value.trim();
    const websiteInput = document.getElementById('websiteInput').value.trim();

    hasChanges =
        nameInput !== initialProfileData.name ||
        handleInput !== initialProfileData.handle ||
        bioInput !== initialProfileData.bio ||
        githubInput !== initialProfileData.socialLinks.github ||
        twitterInput !== initialProfileData.socialLinks.twitter ||
        websiteInput !== initialProfileData.socialLinks.website ||
        uploadedImageFile !== null;

    return hasChanges;
}

function handleProfileImageUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        showToast('JPG, PNG, GIF 형식만 지원합니다', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('이미지 파일은 5MB 이하로 업로드해주세요', 'error');
        return;
    }

    uploadedImageFile = file;

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('profileImagePreview').src = e.target.result;
        checkForChanges();
    };
    reader.readAsDataURL(file);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;

    if (type === 'error') {
        toast.style.backgroundColor = 'var(--error-color)';
    } else {
        toast.style.backgroundColor = 'var(--success-color)';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

async function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        showToast('입력 항목을 확인해주세요', 'error');
        return;
    }

    showLoading();

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const formData = {
            name: document.getElementById('nameInput').value.trim(),
            handle: document.getElementById('handleInput').value.trim(),
            bio: document.getElementById('bioInput').value.trim(),
            socialLinks: {
                github: document.getElementById('githubInput').value.trim(),
                twitter: document.getElementById('twitterInput').value.trim(),
                website: document.getElementById('websiteInput').value.trim()
            }
        };

        if (uploadedImageFile) {
            console.log('Uploading profile image:', uploadedImageFile.name);
        }

        console.log('Saving profile data:', formData);

        hideLoading();
        showToast('프로필이 저장되었습니다!');

        hasChanges = false;

        setTimeout(() => {
            console.log('Redirecting to profile page...');
        }, 1000);

    } catch (error) {
        hideLoading();
        showToast('저장 중 오류가 발생했습니다', 'error');
        console.error('Error saving profile:', error);
    }
}

function handleCancel() {
    if (checkForChanges()) {
        const confirmLeave = confirm('변경된 내용이 저장되지 않았습니다. 정말 나가시겠습니까?');
        if (confirmLeave) {
            console.log('Redirecting to profile page...');
        }
    } else {
        console.log('Redirecting to profile page...');
    }
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Search query:', query);
            alert(`"${query}"로 검색합니다.`);
        }
    };

    searchBtn.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function initFormValidation() {
    const nameInput = document.getElementById('nameInput');
    const bioInput = document.getElementById('bioInput');
    const githubInput = document.getElementById('githubInput');
    const twitterInput = document.getElementById('twitterInput');
    const websiteInput = document.getElementById('websiteInput');

    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', checkForChanges);

    bioInput.addEventListener('input', () => {
        updateCharCount();
        checkForChanges();
    });

    document.getElementById('handleInput').addEventListener('input', checkForChanges);

    githubInput.addEventListener('blur', () => {
        validateURL(githubInput, document.getElementById('githubError'));
    });
    githubInput.addEventListener('input', checkForChanges);

    twitterInput.addEventListener('blur', () => {
        validateURL(twitterInput, document.getElementById('twitterError'));
    });
    twitterInput.addEventListener('input', checkForChanges);

    websiteInput.addEventListener('blur', () => {
        validateURL(websiteInput, document.getElementById('websiteError'));
    });
    websiteInput.addEventListener('input', checkForChanges);
}

function initImageUpload() {
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const profileImageInput = document.getElementById('profileImageInput');

    changePhotoBtn.addEventListener('click', () => {
        profileImageInput.click();
    });

    profileImageInput.addEventListener('change', handleProfileImageUpload);
}

function initFormSubmit() {
    const profileForm = document.getElementById('profileForm');
    const cancelBtn = document.getElementById('cancelBtn');

    profileForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', handleCancel);
}

function initBeforeUnload() {
    window.addEventListener('beforeunload', (e) => {
        if (checkForChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function init() {
    loadProfileData();
    initThemeToggle();
    initSearch();
    initFormValidation();
    initImageUpload();
    initFormSubmit();
    initBeforeUnload();
}

document.addEventListener('DOMContentLoaded', init);
