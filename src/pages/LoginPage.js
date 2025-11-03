// 로그인 페이지
function LoginPage() {
  return `
    <div class="login-page">
      <div class="login-container">
        <h1>로그인</h1>
        <form class="login-form" id="loginForm">
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" name="email" placeholder="이메일을 입력하세요" required>
          </div>
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" name="password" placeholder="비밀번호를 입력하세요" required>
          </div>
          <button type="submit" class="btn-primary">로그인</button>
        </form>
        <p class="signup-link">계정이 없으신가요? <a href="#/signup">회원가입</a></p>
      </div>
    </div>
  `;
}

// 로그인 페이지 이벤트 리스너 등록
export function initLoginPage() {
  const form = document.getElementById('loginForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO: 로그인 로직 구현
      console.log('로그인 버튼 클릭됨');
      // TODO: API 호출 후 성공 시 메인 페이지로 이동
      // window.location.hash = '/posts';
    });
  }
}

export default LoginPage;
