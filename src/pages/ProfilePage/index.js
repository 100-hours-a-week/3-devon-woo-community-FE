import Component from '../../core/Component.js';
import { getMemberProfile, updateMemberProfile, deleteMember } from '../../api/members.js';
import MemberUpdateRequest from '../../dto/request/member/MemberUpdateRequest.js';
import AuthService from '../../utils/AuthService.js';
import ProfileImageUploader from '../../components/ProfileImageUploader/index.js';
import Toast from '../../components/Toast/index.js';
import Modal from '../../components/Modal/index.js';
import { uploadProfileImage } from '../../utils/imageUpload.js';
import { navigate } from '../../core/Router.js';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      nickname: '',
      profileImage: null,
      profileImageUrl: '',
      selectedImageFile: null, // 선택된 File 객체 (제출 시 업로드)
      nicknameError: '',
      isNicknameValid: true,
      showDeleteModal: false,
      isLoading: true
    };
    this.loadStyle('/src/pages/ProfilePage/style.css');
    this.originalNickname = '';
    this.profileImageUploader = null; // ProfileImageUploader 인스턴스
    this.toast = null; // Toast 인스턴스
    this.deleteModal = null; // Modal 인스턴스
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
            <div class="form-group">
              ${this.renderProfileImageUploader()}
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
                disabled
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
        ${this.renderDeleteModal()}

        <!-- 토스트 메시지 -->
        ${this.renderToast()}
      </div>
    `;
  }

  renderDeleteModal() {
    if (!this.deleteModal) {
      this.deleteModal = new Modal({
        show: this.state.showDeleteModal,
        title: '회원 탈퇴',
        message: '정말로 탈퇴하시겠습니까?\n모든 데이터가 삭제됩니다.',
        id: 'deleteModal'
      });
    } else {
      this.deleteModal.props.show = this.state.showDeleteModal;
    }
    return this.deleteModal.render();
  }

  renderToast() {
    if (!this.toast) {
      this.toast = new Toast({
        show: false,
        message: ''
      });
    }
    return this.toast.render();
  }

  renderProfileImageUploader() {
    if (!this.profileImageUploader) {
      this.profileImageUploader = new ProfileImageUploader({
        imageUrl: this.state.profileImageUrl,
        onFileSelected: (file) => {
          // File 객체만 저장 (업로드는 제출 시)
          this.state.selectedImageFile = file;

          // 버튼 활성화 상태 업데이트
          const submitBtn = this.$el.querySelector('#submitBtn');
          this.updateSubmitButton(submitBtn);
        }
      });
    } else {
      // state 변경 시 이미지 URL 업데이트
      this.profileImageUploader.state.imageUrl = this.state.profileImageUrl;
    }
    return this.profileImageUploader.render();
  }

  // 최초 마운트 시에만 1회 호출
  mounted() {
    // Header 설정: 뒤로가기 표시, 프로필 아이콘 표시
    if (window.headerComponent) {
      window.headerComponent.showBackButton(true);
      window.headerComponent.showProfileIcon(true);
    }

    // 사용자 프로필 데이터 로딩 (1회만 실행됨)
    this.loadUserProfile();

    // 이벤트 리스너 등록
    this.setupEventListeners();

    // 초기 버튼 상태 체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  // 업데이트 시마다 호출
  updated() {
    // DOM이 교체되므로 이벤트 리스너 재등록
    this.setupEventListeners();

    // 버튼 상태 재체크
    const submitBtn = this.$el.querySelector('#submitBtn');
    this.updateSubmitButton(submitBtn);
  }

  setupEventListeners() {
    const nicknameInput = this.$el.querySelector('#nicknameInput');
    const form = this.$el.querySelector('#profileForm');
    const deleteAccountBtn = this.$el.querySelector('#deleteAccountBtn');
    const submitBtn = this.$el.querySelector('#submitBtn');

    // ProfileImageUploader의 DOM 요소 연결 및 이벤트 리스너 등록
    if (this.profileImageUploader) {
      const uploaderEl = this.$el.querySelector('.profile-image-uploader');
      if (uploaderEl) {
        this.profileImageUploader.$el = uploaderEl;
        this.profileImageUploader.setupEventListeners();
      }
    }

    // Toast의 DOM 요소 연결
    if (this.toast) {
      const toastEl = this.$el.querySelector('.toast-message');
      if (toastEl) {
        this.toast.$el = toastEl;
      }
    }

    // 닉네임 입력 - setState 없이 직접 업데이트
    if (nicknameInput) {
      nicknameInput.addEventListener('input', (e) => {
        this.state.nickname = e.target.value;
        this.state.nicknameError = '';
        this.state.isNicknameValid = true;

        // 헬퍼 텍스트 숨김
        const helperText = this.$el.querySelector('#nicknameHelper');
        if (helperText) {
          helperText.classList.remove('show');
        }

        // 입력 필드 에러 상태 제거
        nicknameInput.classList.remove('error');

        // 버튼 활성화 상태 업데이트
        this.updateSubmitButton(submitBtn);
      });

      nicknameInput.addEventListener('blur', () => {
        this.checkNicknameValidity();
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
    const deleteModal = this.$el.querySelector('#deleteModal');
    if (deleteModal) {
      deleteModal.addEventListener('click', (e) => {
        const btn = e.target.closest('.modal-btn');
        if (!btn) return;

        const action = btn.dataset.action;
        if (action === 'cancel') {
          this.setState({ showDeleteModal: false });
          document.body.classList.remove('modal-active');
        } else if (action === 'confirm') {
          this.handleDeleteAccount();
        }
      });
    }
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
    // 로그인 확인
    if (!AuthService.requireAuth()) {
      return;
    }

    try {
      const memberId = AuthService.getCurrentUserId();
      const profile = await getMemberProfile(memberId);

      this.originalNickname = profile.nickname;

      this.setState({
        email: profile.email || '',
        nickname: profile.nickname,
        profileImageUrl: profile.profileImage || '',
        isLoading: false
      });
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      this.setState({ isLoading: false });
      alert('프로필을 불러오는데 실패했습니다.');
    }
  }

  // 닉네임 유효성 검사 (blur 이벤트용)
  checkNicknameValidity() {
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

    // 에러가 있었거나 유효하지 않은 상태였을 때만 setState 호출
    // (불필요한 리렌더링 방지)
    if (this.state.nicknameError || !this.state.isNicknameValid) {
      this.setState({
        nicknameError: '',
        isNicknameValid: true
      });
    }

    return true;
  }

  // 닉네임 중복 체크 (제출 시에만 수행)
  async checkNicknameDuplicate() {
    const nickname = this.state.nickname.trim();

    // 닉네임이 변경되지 않았으면 중복 체크 생략
    if (nickname === this.originalNickname) {
      return true;
    }

    // 중복 체크 (API 호출)
    try {
      // TODO: API 호출
      // const response = await apiGet(`/api/v1/users/check-nickname?nickname=${nickname}`);
      // const isDuplicate = response.isDuplicate;

      // 임시: 중복 체크 (실제로는 API 응답 사용)
      const isDuplicate = false;

      if (isDuplicate) {
        this.setState({
          nicknameError: '*중복된 닉네임입니다.',
          isNicknameValid: false
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('닉네임 중복 체크 실패:', error);
      return false;
    }
  }

  // 폼 유효성 검사
  isFormValid() {
    const hasValidNickname = this.state.nickname.trim() !== '' && this.state.isNicknameValid;
    const nicknameChanged = this.state.nickname.trim() !== this.originalNickname;
    const imageChanged = this.state.selectedImageFile !== null;
    return hasValidNickname && (nicknameChanged || imageChanged);
  }

  // 제출 버튼 활성화 상태 업데이트
  updateSubmitButton(submitBtn) {
    if (submitBtn) {
      if (this.isFormValid()) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    }
  }

  // 폼 제출 처리
  async handleSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    // 로그인 확인
    if (!AuthService.requireAuth()) {
      return;
    }

    // 중복 체크 (닉네임이 변경된 경우에만)
    const isDuplicateValid = await this.checkNicknameDuplicate();
    if (!isDuplicateValid) {
      return;
    }

    try {
      const memberId = AuthService.getCurrentUserId();
      let imageUrl = this.state.profileImageUrl || null;

      // 새로운 이미지 파일이 선택되었다면 업로드
      if (this.state.selectedImageFile) {
        console.log('[ProfilePage] 이미지 업로드 시작...');

        try {
          // Cloudinary에 업로드
          imageUrl = await uploadProfileImage(this.state.selectedImageFile);
          console.log('[ProfilePage] 이미지 업로드 완료:', imageUrl);

          // 업로드 완료 후 state 업데이트
          this.state.profileImageUrl = imageUrl;
          this.state.selectedImageFile = null;

          if (this.toast) {
            this.toast.show('프로필 이미지가 업로드되었습니다.');
          }
        } catch (uploadError) {
          console.error('[ProfilePage] 이미지 업로드 실패:', uploadError);
          if (this.toast) {
            this.toast.show('이미지 업로드에 실패했습니다.', 'error');
          }
          return; // 업로드 실패 시 제출 중단
        }
      }

      // MemberUpdateRequest DTO 생성
      const updateData = new MemberUpdateRequest({
        nickname: this.state.nickname,
        profileImage: imageUrl
      });

      // API 호출
      await updateMemberProfile(memberId, updateData);

      // 성공 시 토스트 메시지 표시
      this.showToast();

      // originalNickname 업데이트 (다음 변경 감지를 위해)
      this.originalNickname = this.state.nickname;

      // 버튼 비활성화 (변경사항이 없으므로)
      const submitBtn = this.$el.querySelector('#submitBtn');
      this.updateSubmitButton(submitBtn);
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다.');
    }
  }

  // 회원 탈퇴 처리
  async handleDeleteAccount() {
    try {
      const memberId = AuthService.getCurrentUserId();

      // API 호출
      await deleteMember(memberId);

      // 성공 시
      alert('회원 탈퇴가 완료되었습니다.');

      // 로그아웃 처리
      AuthService.logout();

      // 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴에 실패했습니다.');
      this.setState({ showDeleteModal: false });
      document.body.classList.remove('modal-active');
    }
  }

  // 토스트 메시지 표시
  showToast(message = '수정 완료') {
    if (this.toast) {
      this.toast.show(message);
    }
  }
}

export default ProfilePage;
