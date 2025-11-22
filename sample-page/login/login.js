const API_BASE_URL = 'http://localhost:8080/api/v1';

class LoginController {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.emailInput = document.getElementById('emailInput');
        this.passwordInput = document.getElementById('passwordInput');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.errorMessage = document.getElementById('errorMessage');

        this.init();
    }

    init() {
        this.initFormSubmit();
        this.initPasswordToggle();
        this.initOAuthButtons();
        this.initInputValidation();
    }

    initFormSubmit() {
        this.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
    }

    initPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const isPassword = this.passwordInput.type === 'password';
            this.passwordInput.type = isPassword ? 'text' : 'password';
            this.passwordToggle.classList.toggle('active');
        });
    }

    initOAuthButtons() {
        const googleBtn = document.querySelector('.oauth-btn.google');
        const githubBtn = document.querySelector('.oauth-btn.github');
        const kakaoBtn = document.querySelector('.oauth-btn.kakao');
        const naverBtn = document.querySelector('.oauth-btn.naver');

        googleBtn?.addEventListener('click', () => this.handleOAuthLogin('google'));
        githubBtn?.addEventListener('click', () => this.handleOAuthLogin('github'));
        kakaoBtn?.addEventListener('click', () => this.handleOAuthLogin('kakao'));
        naverBtn?.addEventListener('click', () => this.handleOAuthLogin('naver'));
    }

    initInputValidation() {
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('input', () => {
                this.hideError();
            });
        });
    }

    async handleLogin() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        if (!this.validateForm(email, password)) {
            return;
        }

        try {
            const response = await this.login(email, password);

            if (response.success) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(response.data.member));

                window.location.href = '../tech-blog/blog.html';
            } else {
                this.showError(response.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }

    validateForm(email, password) {
        if (!email) {
            this.showError('이메일을 입력해주세요.');
            this.emailInput.focus();
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showError('올바른 이메일 형식이 아닙니다.');
            this.emailInput.focus();
            return false;
        }

        if (!password) {
            this.showError('비밀번호를 입력해주세요.');
            this.passwordInput.focus();
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            if (response.status === 401) {
                return {
                    success: false,
                    message: '이메일 또는 비밀번호가 올바르지 않습니다.'
                };
            }
            throw new Error('Login request failed');
        }

        const data = await response.json();
        return {
            success: true,
            data: data
        };
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('visible');
    }

    hideError() {
        this.errorMessage.classList.remove('visible');
    }

    async handleOAuthLogin(provider) {
        console.log(`OAuth login with ${provider}`);

        window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginController();
});
