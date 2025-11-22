function calculatePasswordStrength(password) {
    if (!password) return { strength: '', text: '' };

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) {
        return { strength: 'weak', text: '약함' };
    } else if (score <= 4) {
        return { strength: 'medium', text: '보통' };
    } else {
        return { strength: 'strong', text: '강함' };
    }
}

function updatePasswordStrength() {
    const newPassword = document.getElementById('newPassword').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (!newPassword) {
        strengthFill.className = 'strength-fill';
        strengthText.textContent = '';
        strengthText.className = 'strength-text';
        return;
    }

    const { strength, text } = calculatePasswordStrength(newPassword);

    strengthFill.className = `strength-fill ${strength}`;
    strengthText.textContent = `비밀번호 강도: ${text}`;
    strengthText.className = `strength-text ${strength}`;
}

function validateCurrentPassword() {
    const currentPassword = document.getElementById('currentPassword');
    const currentPasswordError = document.getElementById('currentPasswordError');

    if (!currentPassword.value.trim()) {
        currentPasswordError.textContent = '현재 비밀번호를 입력해주세요';
        currentPassword.classList.add('error');
        return false;
    }

    currentPasswordError.textContent = '';
    currentPassword.classList.remove('error');
    return true;
}

function validateNewPassword() {
    const newPassword = document.getElementById('newPassword');
    const newPasswordError = document.getElementById('newPasswordError');
    const currentPassword = document.getElementById('currentPassword').value;

    if (!newPassword.value.trim()) {
        newPasswordError.textContent = '새 비밀번호를 입력해주세요';
        newPassword.classList.add('error');
        return false;
    }

    if (newPassword.value.length < 8) {
        newPasswordError.textContent = '비밀번호는 8자 이상이어야 합니다';
        newPassword.classList.add('error');
        return false;
    }

    if (newPassword.value === currentPassword) {
        newPasswordError.textContent = '현재 비밀번호와 다른 비밀번호를 입력해주세요';
        newPassword.classList.add('error');
        return false;
    }

    newPasswordError.textContent = '';
    newPassword.classList.remove('error');
    return true;
}

function validateConfirmPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    if (!confirmPassword.value.trim()) {
        confirmPasswordError.textContent = '새 비밀번호를 다시 입력해주세요';
        confirmPassword.classList.add('error');
        return false;
    }

    if (confirmPassword.value !== newPassword) {
        confirmPasswordError.textContent = '비밀번호가 일치하지 않습니다';
        confirmPassword.classList.add('error');
        return false;
    }

    confirmPasswordError.textContent = '';
    confirmPassword.classList.remove('error');
    return true;
}

function validateForm() {
    const isCurrentValid = validateCurrentPassword();
    const isNewValid = validateNewPassword();
    const isConfirmValid = validateConfirmPassword();

    return isCurrentValid && isNewValid && isConfirmValid;
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

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;

        console.log('Changing password...');
        console.log('Current password length:', currentPassword.length);
        console.log('New password length:', newPassword.length);

        hideLoading();
        showToast('비밀번호가 성공적으로 변경되었습니다!');

        setTimeout(() => {
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            updatePasswordStrength();

            console.log('Redirecting to profile page...');
        }, 1500);

    } catch (error) {
        hideLoading();
        showToast('비밀번호 변경 중 오류가 발생했습니다', 'error');
        console.error('Error changing password:', error);
    }
}

function handleCancel() {
    const hasInput =
        document.getElementById('currentPassword').value.trim() ||
        document.getElementById('newPassword').value.trim() ||
        document.getElementById('confirmPassword').value.trim();

    if (hasInput) {
        const confirmLeave = confirm('입력한 내용이 저장되지 않았습니다. 정말 나가시겠습니까?');
        if (confirmLeave) {
            console.log('Redirecting to settings page...');
        }
    } else {
        console.log('Redirecting to settings page...');
    }
}

function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);
            const eyeIcon = button.querySelector('.eye-icon');
            const eyeOffIcon = button.querySelector('.eye-off-icon');

            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.style.display = 'none';
                eyeOffIcon.style.display = 'block';
            } else {
                input.type = 'password';
                eyeIcon.style.display = 'block';
                eyeOffIcon.style.display = 'none';
            }
        });
    });
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
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    currentPassword.addEventListener('blur', validateCurrentPassword);

    newPassword.addEventListener('input', () => {
        updatePasswordStrength();
        if (confirmPassword.value) {
            validateConfirmPassword();
        }
    });

    newPassword.addEventListener('blur', validateNewPassword);

    confirmPassword.addEventListener('input', validateConfirmPassword);
    confirmPassword.addEventListener('blur', validateConfirmPassword);
}

function initFormSubmit() {
    const passwordForm = document.getElementById('passwordForm');
    const cancelBtn = document.getElementById('cancelBtn');

    passwordForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', handleCancel);
}

function init() {
    initPasswordToggle();
    initThemeToggle();
    initSearch();
    initFormValidation();
    initFormSubmit();
}

document.addEventListener('DOMContentLoaded', init);
