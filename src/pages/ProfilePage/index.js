import Component from '../../core/Component.js';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      nickname: '',
      profileImage: null,
      profileImageUrl: '',
      existingProfileImageUrl: '',
      nicknameError: '',
      isNicknameValid: true,
      showDeleteModal: false,
      showToast: false,
      isLoading: true
    };
    this.loadStyle('/src/pages/ProfilePage/style.css');
    this.originalNickname = '';
  }

  render() {
    if (this.state.isLoading) {
      return `
        <div class="main-container">
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
        </div>
      `;
    }

    return `
      <div class="main-container">
        <div class="profile-wrapper">
          <h2 class="profile-title">회원정보수정</h2>

          <form class="profile-form" id="profileForm">
            <!-- 프로필 이미지 -->
            <div class="form-group profile-image-group">
              <label class="form-label">프로필 사진*</label>
              <div class="profile-upload-section">
                <div class="profile-image-container" id="profileImageContainer">
                  ${this.state.profileImageUrl || this.state.existingProfileImageUrl ? `
                    <img src="${this.state.profileImageUrl || this.state.existingProfileImageUrl}" alt="프로필" class="profile-image">
                  ` : `
                    <div class="profile-placeholder">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <path d="M30 30C37.18 30 43 24.18 43 17C43 9.82 37.18 4 30 4C22.82 4 17 9.82 17 17C17 24.18 22.82 30 30 30ZM30 37C21.34 37 4 41.34 4 50V56H56V50C56 41.34 38.66 37 30 37Z" fill="#999"/>
                      </svg>
                    </div>
                  `}
                  <div class="profile-overlay">
                    <span class="profile-overlay-text">변경</span>
                  </div>
                </div>
                <input
                  type="file"
                  id="profileImageInput"
                  class="profile-input-hidden"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                >
              </div>
            </div>

            <!-- 이메일 (읽기 전용) -->
            <div class="form-group">
              <label for="emailInput" class="form-label">이메일</label>
              <input
                type="email"
                id="emailInput"
                class="form-input"
                value="${this.state.email}"
                disabled
              >
            </div>

            <!-- 닉네임 -->
            <div class="form-group">
              <label for="nicknameInput" class="form-label">닉네임</label>
              <input
                type="text"
                id="nicknameInput"
                class="form-input ${this.state.nicknameError ? 'error' : ''}"
                placeholder="닉네임을 입력해주세요"
                maxlength="10"
                value="${this.state.nickname}"
              >
              <p class="helper-text ${this.state.nicknameError ? 'show' : ''}" id="nicknameHelper">
                ${this.state.nicknameError}
              </p>
            </div>

            <!-- 버튼 그룹 -->
            <div class="button-group">
              <button
                type="submit"
                class="submit-btn"
                id="submitBtn"
                ${this.isFormValid() ? '' : 'disabled'}
              >
                수정하기
              </button>
              <button
                type="button"
                class="delete-account-btn"
                id="deleteAccountBtn"
              >
                회원 탈퇴
              </button>
            </div>
          </form>
        </div>

        <!-- 회원 탈퇴 모달 -->
        <div class="modal-overlay" id="deleteModal" style="display: ${this.state.showDeleteModal ? 'flex' : 'none'}">
          <div class="modal-content">
            <h3 class="modal-title">회원 탈퇴</h3>
            <p class="modal-message">정말로 탈퇴하시겠습니까?<br>모든 데이터가 삭제됩니다.</p>
            <div class="modal-actions">
              <button class="modal-btn cancel-btn" id="modalCancelBtn">취소</button>
              <button class="modal-btn confirm-btn" id="modalConfirmBtn">확인</button>
            </div>
          </div>
        </div>

        <!-- 토스트 메시지 -->
        <div class="toast-message" id="toastMessage" style="display: ${this.state.showToast ? 'block' : 'none'}">
          수정 완료
        </div>
      </div>
    `;
  }

  // 최초 마운트 시에만 1회 호출
  mounted() {
    // 뒤로가기 버튼 표시
    if (window.headerComponent) {
      window.headerComponent.showBackButton(true);
    }

    // 사용자 프로필 데이터 로딩 (1회만 실행됨)
    this.loadUserProfile();

    // 이벤트 리스너 등록
    this.setupEventListeners();
  }

  // 업데이트 시마다 호출
  updated() {
    // DOM이 교체되므로 이벤트 리스너 재등록
    this.setupEventListeners();
  }

  setupEventListeners() {
    const profileImageContainer = this.$el.querySelector('#profileImageContainer');
    const profileImageInput = this.$el.querySelector('#profileImageInput');
    const nicknameInput = this.$el.querySelector('#nicknameInput');
    const form = this.$el.querySelector('#profileForm');
    const deleteAccountBtn = this.$el.querySelector('#deleteAccountBtn');

    // 프로필 이미지 클릭
    if (profileImageContainer) {
      profileImageContainer.addEventListener('click', () => {
        profileImageInput.click();
      });
    }

    // 프로필 이미지 변경
    if (profileImageInput) {
      profileImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          // 파일 타입 검증
          const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
          if (!validTypes.includes(file.type)) {
            alert('이미지 파일만 업로드 가능합니다. (JPEG, PNG, JPG, GIF)');
            profileImageInput.value = '';
            return;
          }

          // 파일 크기 검증 (5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert('이미지 크기는 5MB 이하로 업로드해주세요.');
            profileImageInput.value = '';
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            this.setState({
              profileImage: file,
              profileImageUrl: e.target.result,
              existingProfileImageUrl: ''
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // 닉네임 입력
    if (nicknameInput) {
      nicknameInput.addEventListener('input', (e) => {
        this.setState({
          nickname: e.target.value,
          nicknameError: '',
          isNicknameValid: true
        });
      });

      nicknameInput.addEventListener('blur', () => {
        this.validateNickname();
      });
    }

    // 폼 제출
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    // 회원 탈퇴 버튼
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', () => {
        this.setState({ showDeleteModal: true });
        document.body.classList.add('modal-active');
      });
    }

    // 모달 버튼 (이벤트 위임)
    this.$el.addEventListener('click', (e) => {
      const cancelBtn = e.target.closest('#modalCancelBtn');
      const confirmBtn = e.target.closest('#modalConfirmBtn');

      if (cancelBtn) {
        this.setState({ showDeleteModal: false });
        document.body.classList.remove('modal-active');
      }

      if (confirmBtn) {
        this.handleDeleteAccount();
      }
    });
  }

  beforeUnmount() {
    // 뒤로가기 버튼 숨김
    if (window.headerComponent) {
      window.headerComponent.showBackButton(false);
    }
    // body 클래스 정리
    document.body.classList.remove('modal-active');
  }

  // 사용자 프로필 로드
  async loadUserProfile() {
    try {
      // TODO: API 호출
      // const response = await apiGet('/api/v1/users/profile');

      // 임시 더미 데이터
      await new Promise(resolve => setTimeout(resolve, 500));

      const dummyUser = {
        email: 'user@example.com',
        nickname: '사용자닉네임',
        profileImageUrl: null
      };

      this.originalNickname = dummyUser.nickname;

      this.setState({
        email: dummyUser.email,
        nickname: dummyUser.nickname,
        existingProfileImageUrl: dummyUser.profileImageUrl || '',
        isLoading: false
      });
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      this.setState({ isLoading: false });
      alert('프로필을 불러오는데 실패했습니다.');
    }
  }

  // 닉네임 유효성 검사
  async validateNickname() {
    const nickname = this.state.nickname.trim();

    // 빈 값 검사
    if (!nickname) {
      this.setState({
        nicknameError: '*닉네임을 입력해주세요.',
        isNicknameValid: false
      });
      return false;
    }

    // 길이 검사
    if (nickname.length > 10) {
      this.setState({
        nicknameError: '*닉네임은 최대 10자까지 작성 가능합니다.',
        isNicknameValid: false
      });
      return false;
    }

    // 닉네임이 변경되지 않았으면 중복 체크 생략
    if (nickname === this.originalNickname) {
      this.setState({
        nicknameError: '',
        isNicknameValid: true
      });
      return true;
    }

    // 중복 체크 (API 호출)
    try {
      // TODO: API 호출
      // const response = await apiGet(`/api/v1/users/check-nickname?nickname=${nickname}`);
      // const isDuplicate = response.isDuplicate;

      // 임시: 랜덤으로 중복 체크 (실제로는 API 응답 사용)
      const isDuplicate = Math.random() < 0.3;

      if (isDuplicate) {
        this.setState({
          nicknameError: '*중복된 닉네임입니다.',
          isNicknameValid: false
        });
        return false;
      }

      this.setState({
        nicknameError: '',
        isNicknameValid: true
      });
      return true;
    } catch (error) {
      console.error('닉네임 중복 체크 실패:', error);
      return false;
    }
  }

  // 폼 유효성 검사
  isFormValid() {
    return this.state.nickname.trim() !== '' && this.state.isNicknameValid;
  }

  // 폼 제출 처리
  async handleSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    // 최종 유효성 검사
    const isValid = await this.validateNickname();
    if (!isValid) {
      return;
    }

    try {
      console.log('프로필 수정:', {
        nickname: this.state.nickname,
        profileImage: this.state.profileImage
      });

      // TODO: API 호출
      // const formData = new FormData();
      // formData.append('nickname', this.state.nickname);
      // if (this.state.profileImage) {
      //   formData.append('profileImage', this.state.profileImage);
      // }
      // await apiPut('/api/v1/users/profile', formData);

      // 성공 시 토스트 메시지 표시
      this.showToast();

      // originalNickname 업데이트
      this.originalNickname = this.state.nickname;
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다.');
    }
  }

  // 회원 탈퇴 처리
  async handleDeleteAccount() {
    try {
      console.log('회원 탈퇴 처리');

      // TODO: API 호출
      // await apiDelete('/api/v1/users/account');

      // 성공 시
      alert('회원 탈퇴가 완료되었습니다.');

      // localStorage 정리
      localStorage.removeItem('token');

      // 로그인 페이지로 이동
      window.router.navigate('/login');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴에 실패했습니다.');
      this.setState({ showDeleteModal: false });
      document.body.classList.remove('modal-active');
    }
  }

  // 토스트 메시지 표시
  showToast() {
    this.setState({ showToast: true });

    // 3초 후 자동 숨김
    setTimeout(() => {
      this.setState({ showToast: false });
    }, 3000);
  }
}

export default ProfilePage;
