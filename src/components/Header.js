// 헤더 컴포넌트
function Header() {
  // TODO: 로그인 상태 확인
  const isLoggedIn = false; // 임시

  return `
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <a href="#/posts">커뮤니티</a>
        </div>
        <nav class="nav">
          <a href="#/posts">게시글</a>
          ${isLoggedIn ? `
            <a href="#/profile">내 정보</a>
            <button class="btn-logout" id="headerLogoutBtn">로그아웃</button>
          ` : `
            <a href="#/login">로그인</a>
          `}
        </nav>
      </div>
    </header>
  `;
}

export default Header;
