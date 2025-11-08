// 정규식
const REGEX = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/
};

// 상태 관리
const state = {
    profileImage: null,
    profileImageUrl: null,
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    isLoading: false,
    validation: {
        email: false,
        password: false,
        passwordConfirm: false,
        nickname: false
    }
};

// DOM 요소
const elements = {
    backButton: document.querySelector('.back-button'),
    signupForm: document.getElementById('signupForm'),

    // 프로필 이미지
    profileImageContainer: document.getElementById('profileImageContainer'),
    profileImage: document.getElementById('profileImage'),
    profilePlaceholder: document.getElementById('profilePlaceholder'),
    profileInput: document.getElementById('profileInput'),
    profileDeleteBtn: document.getElementById('profileDeleteBtn'),
    profileHelperText: document.getElementById('profileHelperText'),

    // 입력 필드
    emailInput: document.getElementById('emailInput'),
    passwordInput: document.getElementById('passwordInput'),
    passwordConfirmInput: document.getElementById('passwordConfirmInput'),
    nicknameInput: document.getElementById('nicknameInput'),

    // Helper text
    emailHelperText: document.getElementById('emailHelperText'),
    passwordHelperText: document.getElementById('passwordHelperText'),
    passwordConfirmHelperText: document.getElementById('passwordConfirmHelperText'),
    nicknameHelperText: document.getElementById('nicknameHelperText'),

    // 제출 버튼
    submitBtn: document.getElementById('submitBtn')
};

// Helper text 표시
function showHelperText(element, message, isError = true) {
    element.textContent = message;
    element.classList.add('show');
    if (isError) {
        element.classList.add('error');
        element.classList.remove('success');
    } else {
        element.classList.add('success');
        element.classList.remove('error');
    }
}

// Helper text 숨기기
function hideHelperText(element) {
    element.classList.remove('show');
    element.textContent = '';
}

// 입력 필드 에러 상태 설정
function setInputError(input, hasError) {
    if (hasError) {
        input.classList.add('error');
        input.classList.remove('success');
    } else {
        input.classList.remove('error');
        input.classList.add('success');
    }
}

// 입력 필드 정상 상태로 리셋
function resetInputState(input) {
    input.classList.remove('error', 'success');
}

// 이메일 유효성 검사
async function validateEmail() {
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

    // 중복 체크 API
    try {
        const isDuplicate = await checkEmailDuplicate(email);
        if (isDuplicate) {
            showHelperText(elements.emailHelperText, '중복된 이메일입니다');
            setInputError(elements.emailInput, true);
            state.validation.email = false;
            return false;
        }
    } catch (error) {
        console.error('Email duplicate check error:', error);
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

    // 비밀번호 확인 필드가 입력되어 있으면 재검증
    if (elements.passwordConfirmInput.value) {
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
        showHelperText(elements.passwordConfirmHelperText, '비밀번호를 한번더 입력해주세요');
        setInputError(elements.passwordConfirmInput, true);
        state.validation.passwordConfirm = false;
        return false;
    }

    // 일치 체크
    if (passwordConfirm !== password) {
        showHelperText(elements.passwordConfirmHelperText, '비밀번호가 다릅니다');
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

// 닉네임 유효성 검사
async function validateNickname() {
    const nickname = elements.nicknameInput.value.trim();

    // 빈값 체크
    if (!nickname) {
        showHelperText(elements.nicknameHelperText, '닉네임을 입력해주세요');
        setInputError(elements.nicknameInput, true);
        state.validation.nickname = false;
        return false;
    }

    // 길이 체크 (2자 이상)
    if (nickname.length < 2) {
        showHelperText(elements.nicknameHelperText, '닉네임은 2글자 이상 입력해주세요');
        setInputError(elements.nicknameInput, true);
        state.validation.nickname = false;
        return false;
    }

    // 길이 체크 (10자 이하)
    if (nickname.length > 10) {
        showHelperText(elements.nicknameHelperText, '닉네임은 최대 10자까지 작성 가능합니다');
        setInputError(elements.nicknameInput, true);
        state.validation.nickname = false;
        return false;
    }

    // 중복 체크 API
    try {
        const isDuplicate = await checkNicknameDuplicate(nickname);
        if (isDuplicate) {
            showHelperText(elements.nicknameHelperText, '중복된 닉네임입니다');
            setInputError(elements.nicknameInput, true);
            state.validation.nickname = false;
            return false;
        }
    } catch (error) {
        console.error('Nickname duplicate check error:', error);
    }

    // 성공
    hideHelperText(elements.nicknameHelperText);
    setInputError(elements.nicknameInput, false);
    state.validation.nickname = true;
    state.nickname = nickname;
    return true;
}

// 폼 전체 유효성 검사
function validateForm() {
    const isValid =
        state.validation.email &&
        state.validation.password &&
        state.validation.passwordConfirm &&
        state.validation.nickname;

    elements.submitBtn.disabled = !isValid;
    return isValid;
}

// API: 이메일 중복 체크
async function checkEmailDuplicate(email) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            // 테스트용: test@test.com은 중복으로 처리
            resolve(email === 'test@test.com');
        }, 300);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
            throw new Error('Failed to check email');
        }
        const data = await response.json();
        return data.isDuplicate;
    } catch (error) {
        console.error('Error checking email:', error);
        throw error;
    }
    */
}

// API: 닉네임 중복 체크
async function checkNicknameDuplicate(nickname) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            // 테스트용: testuser는 중복으로 처리
            resolve(nickname === 'testuser');
        }, 300);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch(`/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`);
        if (!response.ok) {
            throw new Error('Failed to check nickname');
        }
        const data = await response.json();
        return data.isDuplicate;
    } catch (error) {
        console.error('Error checking nickname:', error);
        throw error;
    }
    */
}

// API: 회원가입
async function signup(data) {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });

    /*
    // 실제 API 호출 예시
    try {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('nickname', data.nickname);
        if (data.profileImage) {
            formData.append('profileImage', data.profileImage);
        }

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to signup');
        }

        return await response.json();
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
    */
}

// 프로필 이미지 선택 처리
function handleProfileImageSelect(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        alert('이미지 파일만 업로드 가능합니다. (jpg, png)');
        elements.profileInput.value = '';
        return;
    }

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        elements.profileInput.value = '';
        return;
    }

    // 이미지 미리보기 생성
    state.profileImage = file;
    const reader = new FileReader();

    reader.onload = (e) => {
        state.profileImageUrl = e.target.result;
        elements.profileImage.src = e.target.result;
        elements.profileImage.style.display = 'block';
        elements.profilePlaceholder.style.display = 'none';
        elements.profileDeleteBtn.style.display = 'block';
    };

    reader.readAsDataURL(file);
}

// 프로필 이미지 삭제
function deleteProfileImage() {
    state.profileImage = null;
    state.profileImageUrl = null;
    elements.profileInput.value = '';
    elements.profileImage.src = '';
    elements.profileImage.style.display = 'none';
    elements.profilePlaceholder.style.display = 'flex';
    elements.profileDeleteBtn.style.display = 'none';
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
        alert('모든 필수 항목을 올바르게 입력해주세요.');
        return;
    }

    // 로딩 상태 시작
    state.isLoading = true;
    elements.submitBtn.disabled = true;
    elements.submitBtn.classList.add('loading');

    try {
        const signupData = {
            email: state.email,
            password: state.password,
            nickname: state.nickname,
            profileImage: state.profileImage
        };

        await signup(signupData);

        alert('회원가입이 완료되었습니다.');

        // 로그인 페이지로 이동
        console.log('Navigate to /login');
        // window.location.href = '/login';

    } catch (error) {
        console.error('Error during signup:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        state.isLoading = false;
        elements.submitBtn.disabled = false;
        elements.submitBtn.classList.remove('loading');
        validateForm(); // 버튼 상태 재검증
    }
}

// 뒤로가기 버튼 처리
function handleBackClick() {
    // 입력 중인 내용이 있으면 확인
    if (state.email || state.password || state.nickname || state.profileImage) {
        const confirmed = confirm('입력 중인 내용이 있습니다. 정말 나가시겠습니까?');
        if (!confirmed) {
            return;
        }
    }

    console.log('Navigate back');
    // window.history.back();
}

// Debounce 함수 (API 호출 최적화)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 이벤트 리스너 등록
function initEventListeners() {
    // 뒤로가기
    elements.backButton.addEventListener('click', handleBackClick);

    // 프로필 이미지
    elements.profileImageContainer.addEventListener('click', () => {
        elements.profileInput.click();
    });
    elements.profileInput.addEventListener('change', handleProfileImageSelect);
    elements.profileDeleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProfileImage();
    });

    // 이메일 검증 (debounce 적용)
    const debouncedEmailValidation = debounce(validateEmail, 500);
    elements.emailInput.addEventListener('input', () => {
        resetInputState(elements.emailInput);
        hideHelperText(elements.emailHelperText);
        debouncedEmailValidation();
    });
    elements.emailInput.addEventListener('blur', validateEmail);

    // 비밀번호 검증
    elements.passwordInput.addEventListener('input', () => {
        resetInputState(elements.passwordInput);
        hideHelperText(elements.passwordHelperText);
    });
    elements.passwordInput.addEventListener('blur', validatePassword);

    // 비밀번호 확인 검증
    elements.passwordConfirmInput.addEventListener('input', () => {
        resetInputState(elements.passwordConfirmInput);
        hideHelperText(elements.passwordConfirmHelperText);
    });
    elements.passwordConfirmInput.addEventListener('blur', validatePasswordConfirm);

    // 닉네임 검증 (debounce 적용)
    const debouncedNicknameValidation = debounce(validateNickname, 500);
    elements.nicknameInput.addEventListener('input', () => {
        resetInputState(elements.nicknameInput);
        hideHelperText(elements.nicknameHelperText);
        debouncedNicknameValidation();
    });
    elements.nicknameInput.addEventListener('blur', validateNickname);

    // 모든 입력 필드에서 입력 시 폼 유효성 재검증
    const allInputs = [
        elements.emailInput,
        elements.passwordInput,
        elements.passwordConfirmInput,
        elements.nicknameInput
    ];

    allInputs.forEach(input => {
        input.addEventListener('input', () => {
            // 즉시 버튼 상태만 업데이트 (validation은 각 필드의 핸들러에서)
            setTimeout(validateForm, 100);
        });
    });

    // 폼 제출
    elements.signupForm.addEventListener('submit', handleSubmit);
}

// 초기화
function init() {
    initEventListeners();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
