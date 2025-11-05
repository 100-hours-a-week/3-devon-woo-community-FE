// 정규식
const REGEX = {
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/
};

// 상태 관리
const state = {
    password: '',
    passwordConfirm: '',
    isLoading: false,
    validation: {
        password: false,
        passwordConfirm: false
    }
};

// DOM 요소
const elements = {
    // 헤더
    profileIconBtn: document.getElementById('profileIconBtn'),
    dropdownMenu: document.getElementById('dropdownMenu'),
    logoutBtn: document.getElementById('logoutBtn'),

    // 비밀번호 폼
    passwordForm: document.getElementById('passwordForm'),
    passwordInput: document.getElementById('passwordInput'),
    passwordConfirmInput: document.getElementById('passwordConfirmInput'),
    passwordHelperText: document.getElementById('passwordHelperText'),
    passwordConfirmHelperText: document.getElementById('passwordConfirmHelperText'),
    submitBtn: document.getElementById('submitBtn'),

    // Toast
    toastMessage: document.getElementById('toastMessage')
};

// 드롭다운 토글
function toggleDropdown() {
    const isVisible = elements.dropdownMenu.style.display === 'block';
    elements.dropdownMenu.style.display = isVisible ? 'none' : 'block';
}

// 드롭다운 닫기
function closeDropdown() {
    elements.dropdownMenu.style.display = 'none';
}

// 외부 클릭 시 드롭다운 닫기
function handleClickOutside(event) {
    if (!elements.profileIconBtn.contains(event.target) &&
        !elements.dropdownMenu.contains(event.target)) {
        closeDropdown();
    }
}

// Helper text 표시
function showHelperText(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

// Helper text 숨기기
function hideHelperText(element) {
    element.classList.remove('show');
    element.textContent = '* helper text';
}

// 입력 필드 에러 상태 설정
function setInputError(input, hasError) {
    if (hasError) {
        input.classList.add('error');
    } else {
        input.classList.remove('error');
    }
}

// 비밀번호 유효성 검사
function validatePassword() {
    const password = elements.passwordInput.value;

    // 빈값 체크
    if (!password) {
        showHelperText(elements.passwordHelperText, '*비밀번호를 입력해주세요.');
        setInputError(elements.passwordInput, true);
        state.validation.password = false;
        return false;
    }

    // 조건 체크 (8-20자, 대소문자/숫자/특수문자 각 1개 이상)
    if (!REGEX.password.test(password)) {
        showHelperText(elements.passwordHelperText, '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
        setInputError(elements.passwordInput, true);
        state.validation.password = false;
        return false;
    }

    // 비밀번호 확인과 일치 여부 체크
    const passwordConfirm = elements.passwordConfirmInput.value;
    if (passwordConfirm && password !== passwordConfirm) {
        showHelperText(elements.passwordHelperText, '*비밀번호 확인과 다릅니다.');
        setInputError(elements.passwordInput, true);
        state.validation.password = false;
        return false;
    }

    // 성공
    hideHelperText(elements.passwordHelperText);
    setInputError(elements.passwordInput, false);
    state.validation.password = true;
    state.password = password;

    // 비밀번호 확인 필드가 입력되어 있으면 재검증
    if (passwordConfirm) {
        validatePasswordConfirm();
    }

    return true;
}

// 비밀번호 확인 유효성 검사
function validatePasswordConfirm() {
    const passwordConfirm = elements.passwordConfirmInput.value;
    const password = elements.passwordInput.value;

    // 빈값 체크
    if (!passwordConfirm) {
        showHelperText(elements.passwordConfirmHelperText, '*비밀번호를 한 번 더 입력해주세요.');
        setInputError(elements.passwordConfirmInput, true);
        state.validation.passwordConfirm = false;
        return false;
    }

    // 일치 체크
    if (passwordConfirm !== password) {
        showHelperText(elements.passwordConfirmHelperText, '*비밀번호와 다릅니다.');
        setInputError(elements.passwordConfirmInput, true);
        state.validation.passwordConfirm = false;
        return false;
    }

    // 성공
    hideHelperText(elements.passwordConfirmHelperText);
    setInputError(elements.passwordConfirmInput, false);
    state.validation.passwordConfirm = true;
    state.passwordConfirm = passwordConfirm;
    return true;
}

// 폼 전체 유효성 검사
function validateForm() {
    const isValid = state.validation.password && state.validation.passwordConfirm;
    elements.submitBtn.disabled = !isValid;
    return isValid;
}

// API: 비밀번호 변경
async function changePassword(password) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch('/api/users/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ password })
        });

        if (!response.ok) {
            throw new Error('Failed to change password');
        }

        return await response.json();
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
    */
}

// API: 로그아웃
async function logout() {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            // 토큰 삭제
            localStorage.removeItem('authToken');
            resolve({ success: true });
        }, 500);
    });
}

// Toast 메시지 표시
function showToast(message, duration = 3000) {
    elements.toastMessage.textContent = message;
    elements.toastMessage.style.display = 'block';

    setTimeout(() => {
        elements.toastMessage.style.display = 'none';
    }, duration);
}

// 폼 제출 처리
async function handleSubmit(event) {
    event.preventDefault();

    // 중복 제출 방지
    if (state.isLoading) {
        return;
    }

    // 유효성 검사
    const isPasswordValid = validatePassword();
    const isPasswordConfirmValid = validatePasswordConfirm();

    if (!isPasswordValid || !isPasswordConfirmValid) {
        return;
    }

    // 로딩 상태 시작
    state.isLoading = true;
    elements.submitBtn.disabled = true;
    elements.submitBtn.classList.add('loading');

    try {
        await changePassword(state.password);

        // 성공 처리
        showToast('수정 완료');

        // 입력 필드 초기화
        elements.passwordInput.value = '';
        elements.passwordConfirmInput.value = '';
        state.password = '';
        state.passwordConfirm = '';
        state.validation.password = false;
        state.validation.passwordConfirm = false;

        // 옵션: 로그인 페이지로 리다이렉트
        // setTimeout(() => {
        //     console.log('Navigate to /login');
        //     window.location.href = '/login';
        // }, 2000);

    } catch (error) {
        console.error('Error changing password:', error);
        alert('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
        validateForm();
        elements.submitBtn.classList.remove('loading');
    }
}

// 로그아웃 처리
async function handleLogout() {
    closeDropdown();

    try {
        await logout();

        alert('로그아웃되었습니다.');

        // 로그인 페이지로 이동
        console.log('Navigate to /login');
        // window.location.href = '/login';

    } catch (error) {
        console.error('Error logging out:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
    }
}

// 이벤트 리스너 등록
function initEventListeners() {
    // 드롭다운
    elements.profileIconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', handleClickOutside);

    // 로그아웃
    elements.logoutBtn.addEventListener('click', handleLogout);

    // 비밀번호 입력
    elements.passwordInput.addEventListener('input', () => {
        setInputError(elements.passwordInput, false);
        hideHelperText(elements.passwordHelperText);
    });

    elements.passwordInput.addEventListener('blur', () => {
        validatePassword();
        validateForm();
    });

    // 비밀번호 확인 입력
    elements.passwordConfirmInput.addEventListener('input', () => {
        setInputError(elements.passwordConfirmInput, false);
        hideHelperText(elements.passwordConfirmHelperText);
    });

    elements.passwordConfirmInput.addEventListener('blur', () => {
        validatePasswordConfirm();
        validateForm();
    });

    // 실시간 버튼 상태 업데이트
    elements.passwordInput.addEventListener('input', () => {
        setTimeout(validateForm, 50);
    });

    elements.passwordConfirmInput.addEventListener('input', () => {
        setTimeout(validateForm, 50);
    });

    // 폼 제출
    elements.passwordForm.addEventListener('submit', handleSubmit);

    // Enter 키로 제출
    elements.passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            elements.passwordConfirmInput.focus();
        }
    });

    elements.passwordConfirmInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !elements.submitBtn.disabled) {
            e.preventDefault();
            elements.passwordForm.dispatchEvent(new Event('submit'));
        }
    });
}

// 초기화
function init() {
    initEventListeners();

    // Helper text 초기 상태 숨김
    hideHelperText(elements.passwordHelperText);
    hideHelperText(elements.passwordConfirmHelperText);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
