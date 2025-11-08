// 정규식
const REGEX = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/
};

// 상태 관리
const state = {
    email: '',
    password: '',
    isLoading: false,
    validation: {
        email: false,
        password: false
    }
};

// DOM 요소
const elements = {
    loginForm: document.getElementById('loginForm'),
    emailInput: document.getElementById('emailInput'),
    passwordInput: document.getElementById('passwordInput'),
    emailHelperText: document.getElementById('emailHelperText'),
    passwordHelperText: document.getElementById('passwordHelperText'),
    submitBtn: document.getElementById('submitBtn')
};

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

// 이메일 유효성 검사
function validateEmail() {
    const email = elements.emailInput.value.trim();

    // 빈값 체크
    if (!email) {
        showHelperText(elements.emailHelperText, '이메일을 입력해주세요');
        setInputError(elements.emailInput, true);
        state.validation.email = false;
        return false;
    }

    // 형식 체크
    if (!REGEX.email.test(email)) {
        showHelperText(elements.emailHelperText, '올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)');
        setInputError(elements.emailInput, true);
        state.validation.email = false;
        return false;
    }

    // 성공
    hideHelperText(elements.emailHelperText);
    setInputError(elements.emailInput, false);
    state.validation.email = true;
    state.email = email;
    return true;
}

// 비밀번호 유효성 검사
function validatePassword() {
    const password = elements.passwordInput.value;

    // 빈값 체크
    if (!password) {
        showHelperText(elements.passwordHelperText, '비밀번호를 입력해주세요');
        setInputError(elements.passwordInput, true);
        state.validation.password = false;
        return false;
    }

    // 조건 체크
    if (!REGEX.password.test(password)) {
        showHelperText(elements.passwordHelperText, '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
        setInputError(elements.passwordInput, true);
        state.validation.password = false;
        return false;
    }

    // 성공
    hideHelperText(elements.passwordHelperText);
    setInputError(elements.passwordInput, false);
    state.validation.password = true;
    state.password = password;
    return true;
}

// 폼 전체 유효성 검사
function validateForm() {
    const isValid = state.validation.email && state.validation.password;
    elements.submitBtn.disabled = !isValid;
    return isValid;
}

// API: 로그인
async function login(email, password) {
    // TODO: 실제 API 호출
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 테스트용: test@test.com / Test1234! 으로 성공
            if (email === 'test@test.com' && password === 'Test1234!') {
                resolve({ success: true, token: 'mock-token' });
            } else {
                reject(new Error('로그인 실패'));
            }
        }, 1000);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();

        // 토큰 저장 (예: localStorage)
        if (data.token) {
            localStorage.setItem('authToken', data.token);
        }

        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
    */
}

// 폼 제출 처리
async function handleSubmit(event) {
    event.preventDefault();

    // 중복 제출 방지
    if (state.isLoading) {
        return;
    }

    // 유효성 검사
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    // 로딩 상태 시작
    state.isLoading = true;
    elements.submitBtn.disabled = true;
    elements.submitBtn.classList.add('loading');

    try {
        const result = await login(state.email, state.password);

        // 로그인 성공 - 게시글 목록으로 이동
        console.log('Login successful:', result);
        console.log('Navigate to /posts');
        // window.location.href = '/posts';

    } catch (error) {
        console.error('Login error:', error);

        // 로그인 실패 - 비밀번호 필드에 에러 표시
        showHelperText(elements.passwordHelperText, '아이디 또는 비밀번호를 확인해주세요');
        setInputError(elements.passwordInput, true);

    } finally {
        state.isLoading = false;
        elements.submitBtn.classList.remove('loading');
        validateForm(); // 버튼 상태 재검증
    }
}

// 입력 필드 초기화 (포커스 시 에러 제거)
function handleInputFocus(input, helperText) {
    setInputError(input, false);
    if (input === elements.emailInput) {
        // 이메일 필드는 포커스 시 helper text 유지
    } else {
        // 비밀번호 필드는 포커스 시 에러 메시지 숨김
        hideHelperText(helperText);
    }
}

// 이벤트 리스너 등록
function initEventListeners() {
    // 이메일 입력
    elements.emailInput.addEventListener('input', () => {
        // 입력 중에는 에러 상태만 제거
        setInputError(elements.emailInput, false);
        hideHelperText(elements.emailHelperText);
    });

    elements.emailInput.addEventListener('blur', () => {
        validateEmail();
        validateForm();
    });

    // 비밀번호 입력
    elements.passwordInput.addEventListener('input', () => {
        // 입력 중에는 에러 상태만 제거
        setInputError(elements.passwordInput, false);
        hideHelperText(elements.passwordHelperText);
    });

    elements.passwordInput.addEventListener('blur', () => {
        validatePassword();
        validateForm();
    });

    // 포커스 이벤트
    elements.emailInput.addEventListener('focus', () => {
        handleInputFocus(elements.emailInput, elements.emailHelperText);
    });

    elements.passwordInput.addEventListener('focus', () => {
        handleInputFocus(elements.passwordInput, elements.passwordHelperText);
    });

    // 실시간 버튼 상태 업데이트
    elements.emailInput.addEventListener('input', () => {
        setTimeout(validateForm, 50);
    });

    elements.passwordInput.addEventListener('input', () => {
        setTimeout(validateForm, 50);
    });

    // 폼 제출
    elements.loginForm.addEventListener('submit', handleSubmit);

    // Enter 키로 제출
    elements.emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            elements.passwordInput.focus();
        }
    });

    elements.passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !elements.submitBtn.disabled) {
            elements.loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

// 초기화
function init() {
    initEventListeners();

    // Helper text 초기 상태 숨김
    hideHelperText(elements.emailHelperText);
    hideHelperText(elements.passwordHelperText);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
