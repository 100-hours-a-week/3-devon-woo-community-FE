// 개인정보 페이지
function ProfilePage() {
  // TODO: API에서 사용자 정보 가져오기
  const user = {
    name: '홍길동',
    email: 'hong@example.com',
    joined: '2024-01-01',
    postCount: 15,
    commentCount: 42
  };

  return `
    <div class="profile-page">
      <div class="profile-container">
        <h1>내 정보</h1>
        <div class="profile-info">
          <div class="profile-item">
            <label>이름</label>
            <span>${user.name}</span>
          </div>
          <div class="profile-item">
            <label>이메일</label>
            <span>${user.email}</span>
          </div>
          <div class="profile-item">
            <label>가입일</label>
            <span>${user.joined}</span>
          </div>
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-label">작성한 게시글</span>
              <span class="stat-value">${user.postCount}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">작성한 댓글</span>
              <span class="stat-value">${user.commentCount}</span>
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn-primary" id="editProfileBtn">정보 수정</button>
          <button class="btn-secondary" id="logoutBtn">로그아웃</button>
        </div>
      </div>
    </div>
  `;
}

// 개인정보 페이지 이벤트 리스너 등록
export function initProfilePage() {
  const editBtn = document.getElementById('editProfileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      // TODO: 정보 수정 페이지로 이동
      console.log('정보 수정 버튼 클릭됨');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // TODO: 로그아웃 로직 구현
      console.log('로그아웃 버튼 클릭됨');
      // window.location.hash = '/login';
    });
  }
}

export default ProfilePage;
