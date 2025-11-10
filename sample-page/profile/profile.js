// 상태 관리
const state = {
    user: {
        email: 'startupcode@gmail.com',
        nickname: '스타트업코드',
        profileImage: null
    },
    profileImage: null,
    profileImageUrl: null,
    nickname: '',
    isLoading: false,
    originalNickname: '스타트업코드'
};

// DOM 요소
const elements = {
    // 헤더
    profileIconBtn: document.getElementById('profileIconBtn'),
    dropdownMenu: document.getElementById('dropdownMenu'),
    logoutBtn: document.getElementById('logoutBtn'),

    // 프로필 폼
    profileForm: document.getElementById('profileForm'),
    profileImageContainer: document.getElementById('profileImageContainer'),
    profileImage: document.getElementById('profileImage'),
    profilePlaceholder: document.getElementById('profilePlaceholder'),
    profileImageOverlay: document.getElementById('profileImageOverlay'),
    profileInput: document.getElementById('profileInput'),
    emailInput: document.getElementById('emailInput'),
    nicknameInput: document.getElementById('nicknameInput'),
    nicknameHelperText: document.getElementById('nicknameHelperText'),
    submitBtn: document.getElementById('submitBtn'),
    deleteAccountBtn: document.getElementById('deleteAccountBtn'),
    toastBtn: document.getElementById('toastBtn'),

    // 모달
    deleteModal: document.getElementById('deleteModal'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalConfirmBtn: document.getElementById('modalConfirmBtn'),

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
    element.textContent = '';
}

// 입력 필드 에러 상태 설정
function setInputError(input, hasError) {
    if (hasError) {
        input.classList.add('error');
    } else {
        input.classList.remove('error');
    }
}

// 닉네임 유효성 검사
async function validateNickname() {
    const nickname = elements.nicknameInput.value.trim();

    // 빈값 체크
    if (!nickname) {
        showHelperText(elements.nicknameHelperText, '*닉네임을 입력해주세요.');
        setInputError(elements.nicknameInput, true);
        return false;
    }

    // 길이 체크 (10자 이하)
    if (nickname.length > 10) {
        showHelperText(elements.nicknameHelperText, '*닉네임은 최대 10자까지 작성 가능합니다.');
        setInputError(elements.nicknameInput, true);
        return false;
    }

    // 변경사항이 없으면 중복 체크 생략
    if (nickname === state.originalNickname) {
        hideHelperText(elements.nicknameHelperText);
        setInputError(elements.nicknameInput, false);
        return true;
    }

    // 중복 체크 API
    try {
        const isDuplicate = await checkNicknameDuplicate(nickname);
        if (isDuplicate) {
            showHelperText(elements.nicknameHelperText, '*중복된 닉네임입니다.');
            setInputError(elements.nicknameInput, true);
            return false;
        }
    } catch (error) {
        console.error('Nickname duplicate check error:', error);
    }

    // 성공
    hideHelperText(elements.nicknameHelperText);
    setInputError(elements.nicknameInput, false);
    state.nickname = nickname;
    return true;
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
        const response = await fetch(`/api/users/check-nickname?nickname=${encodeURIComponent(nickname)}`);
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

// API: 프로필 업데이트
async function updateProfile(data) {
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
        formData.append('nickname', data.nickname);
        if (data.profileImage) {
            formData.append('profileImage', data.profileImage);
        }

        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
    */
}

// API: 회원 탈퇴
async function deleteAccount() {
    // TODO: 실제 API 호출
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch('/api/users/account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete account');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting account:', error);
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

    /*
    // 실제 API 호출 예시
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to logout');
        }

        // 토큰 삭제
        localStorage.removeItem('authToken');

        return await response.json();
    } catch (error) {
        console.error('Error logging out:', error);
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        alert('이미지 파일만 업로드 가능합니다. (jpg, png, gif)');
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
    };

    reader.readAsDataURL(file);
}

// Toast 메시지 표시
function showToast(message, duration = 3000) {
    elements.toastMessage.textContent = message;
    elements.toastMessage.style.display = 'block';

    setTimeout(() => {
        elements.toastMessage.style.display = 'none';
    }, duration);
}

// 모달 열기
function openModal(modalElement) {
    modalElement.style.display = 'flex';
    document.body.classList.add('modal-active');
}

// 모달 닫기
function closeModal(modalElement) {
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-active');
}

// 폼 제출 처리
async function handleSubmit(event) {
    event.preventDefault();

    // 중복 제출 방지
    if (state.isLoading) {
        return;
    }

    // 닉네임 유효성 검사
    const isValid = await validateNickname();
    if (!isValid) {
        return;
    }

    // 로딩 상태 시작
    state.isLoading = true;
    elements.submitBtn.disabled = true;
    elements.submitBtn.classList.add('loading');

    try {
        const updateData = {
            nickname: state.nickname || elements.nicknameInput.value.trim(),
            profileImage: state.profileImage
        };

        await updateProfile(updateData);

        // 성공 처리
        state.originalNickname = updateData.nickname;

        // Toast 메시지 표시
        showToast('수정 완료');

    } catch (error) {
        console.error('Error updating profile:', error);
        alert('프로필 수정 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
        elements.submitBtn.disabled = false;
        elements.submitBtn.classList.remove('loading');
    }
}

// 회원 탈퇴 버튼 클릭
function handleDeleteAccountClick() {
    openModal(elements.deleteModal);
}

// 회원 탈퇴 확인
async function confirmDeleteAccount() {
    closeModal(elements.deleteModal);

    // 로딩 상태
    state.isLoading = true;

    try {
        await deleteAccount();

        alert('회원 탈퇴가 완료되었습니다.');

        // 로그인 페이지로 이동
        console.log('Navigate to /login');
        // window.location.href = '/login';

    } catch (error) {
        console.error('Error deleting account:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
        state.isLoading = false;
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

    // 프로필 이미지
    elements.profileImageContainer.addEventListener('click', () => {
        elements.profileInput.click();
    });
    elements.profileInput.addEventListener('change', handleProfileImageSelect);

    // 닉네임 입력
    elements.nicknameInput.addEventListener('input', () => {
        setInputError(elements.nicknameInput, false);
        hideHelperText(elements.nicknameHelperText);
    });

    elements.nicknameInput.addEventListener('blur', validateNickname);

    // 폼 제출
    elements.profileForm.addEventListener('submit', handleSubmit);

    // 회원 탈퇴
    elements.deleteAccountBtn.addEventListener('click', handleDeleteAccountClick);

    // 모달 이벤트
    elements.modalCancelBtn.addEventListener('click', () => {
        closeModal(elements.deleteModal);
    });

    elements.modalConfirmBtn.addEventListener('click', confirmDeleteAccount);

    // 모달 오버레이 클릭 시 닫기
    elements.deleteModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) {
            closeModal(elements.deleteModal);
        }
    });
}

// 사용자 정보 로드
async function loadUserProfile() {
    // TODO: 실제 API에서 사용자 정보 가져오기
    // 임시로 state의 초기값 사용
    elements.emailInput.value = state.user.email;
    elements.nicknameInput.value = state.user.nickname;

    if (state.user.profileImage) {
        elements.profileImage.src = state.user.profileImage;
        elements.profileImage.style.display = 'block';
        elements.profilePlaceholder.style.display = 'none';
    }
}

// 초기화
function init() {
    initEventListeners();
    loadUserProfile();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
