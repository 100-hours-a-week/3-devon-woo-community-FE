const API_BASE_URL = 'http://localhost:8080/api/v1';
const VERIFICATION_TIME = 300;

class SignupController {
    constructor() {
        this.signupForm = document.getElementById('signupForm');
        this.emailInput = document.getElementById('emailInput');
        this.verificationCodeInput = document.getElementById('verificationCodeInput');
        this.nicknameInput = document.getElementById('nicknameInput');
        this.passwordInput = document.getElementById('passwordInput');
        this.passwordConfirmInput = document.getElementById('passwordConfirmInput');
        this.sendCodeBtn = document.getElementById('sendCodeBtn');
        this.verifyCodeBtn = document.getElementById('verifyCodeBtn');
        this.signupBtn = document.getElementById('signupBtn');
        this.termsAll = document.getElementById('termsAll');
        this.termsItems = document.querySelectorAll('.terms-item');
        this.verificationGroup = document.getElementById('verificationGroup');
        this.timerElement = document.getElementById('timer');

        this.isEmailVerified = false;
        this.timer = null;
        this.remainingTime = 0;

        this.init();
    }

    init() {
        this.initEmailVerification();
        this.initPasswordToggles();
        this.initPasswordValidation();
        this.initNicknameValidation();
        this.initTermsAgreement();
        this.initFormSubmit();
    }

    initEmailVerification() {
        this.sendCodeBtn.addEventListener('click', async () => {
            await this.sendVerificationCode();
        });

        this.verifyCodeBtn.addEventListener('click', async () => {
            await this.verifyCode();
        });

        this.emailInput.addEventListener('input', () => {
            this.isEmailVerified = false;
            this.verificationGroup.style.display = 'none';
            this.clearTimer();
            this.updateSignupButton();
        });
    }

    async sendVerificationCode() {
        const email = this.emailInput.value.trim();

        if (!email) {
            this.showHelp('emailHelp', '이메일을 입력해주세요.', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showHelp('emailHelp', '올바른 이메일 형식이 아닙니다.', 'error');
            return;
        }

        try {
            this.sendCodeBtn.disabled = true;
            this.sendCodeBtn.textContent = '발송 중...';

            const response = await fetch(`${API_BASE_URL}/auth/email/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                this.showHelp('emailHelp', '인증코드가 발송되었습니다.', 'success');
                this.verificationGroup.style.display = 'block';
                this.startTimer();
                this.emailInput.disabled = true;
            } else {
                const error = await response.json();
                this.showHelp('emailHelp', error.message || '인증코드 발송에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error('Send verification code failed:', error);
            this.showHelp('emailHelp', '인증코드 발송 중 오류가 발생했습니다.', 'error');
        } finally {
            this.sendCodeBtn.disabled = false;
            this.sendCodeBtn.textContent = '재발송';
        }
    }

    async verifyCode() {
        const email = this.emailInput.value.trim();
        const code = this.verificationCodeInput.value.trim();

        if (!code) {
            this.showHelp('verificationHelp', '인증코드를 입력해주세요.', 'error');
            return;
        }

        if (code.length !== 6) {
            this.showHelp('verificationHelp', '인증코드는 6자리입니다.', 'error');
            return;
        }

        try {
            this.verifyCodeBtn.disabled = true;
            this.verifyCodeBtn.textContent = '확인 중...';

            const response = await fetch(`${API_BASE_URL}/auth/email/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            if (response.ok) {
                this.isEmailVerified = true;
                this.showHelp('verificationHelp', '이메일 인증이 완료되었습니다.', 'success');
                this.verificationCodeInput.disabled = true;
                this.verifyCodeBtn.disabled = true;
                this.verifyCodeBtn.classList.add('success');
                this.verifyCodeBtn.textContent = '인증 완료';
                this.clearTimer();
                this.updateSignupButton();
            } else {
                const error = await response.json();
                this.showHelp('verificationHelp', error.message || '인증코드가 올바르지 않습니다.', 'error');
                this.verifyCodeBtn.disabled = false;
                this.verifyCodeBtn.textContent = '확인';
            }
        } catch (error) {
            console.error('Verify code failed:', error);
            this.showHelp('verificationHelp', '인증 확인 중 오류가 발생했습니다.', 'error');
            this.verifyCodeBtn.disabled = false;
            this.verifyCodeBtn.textContent = '확인';
        }
    }

    startTimer() {
        this.remainingTime = VERIFICATION_TIME;
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.remainingTime--;
            this.updateTimerDisplay();

            if (this.remainingTime <= 0) {
                this.clearTimer();
                this.showHelp('verificationHelp', '인증 시간이 만료되었습니다. 재발송해주세요.', 'error');
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.timerElement.textContent = '';
    }

    initPasswordToggles() {
        const toggle1 = document.getElementById('passwordToggle1');
        const toggle2 = document.getElementById('passwordToggle2');

        toggle1?.addEventListener('click', () => {
            this.togglePasswordVisibility(this.passwordInput, toggle1);
        });

        toggle2?.addEventListener('click', () => {
            this.togglePasswordVisibility(this.passwordConfirmInput, toggle2);
        });
    }

    togglePasswordVisibility(input, button) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.classList.toggle('active');
    }

    initPasswordValidation() {
        this.passwordInput.addEventListener('input', () => {
            this.validatePassword();
            this.validatePasswordConfirm();
            this.updateSignupButton();
        });

        this.passwordConfirmInput.addEventListener('input', () => {
            this.validatePasswordConfirm();
            this.updateSignupButton();
        });
    }

    validatePassword() {
        const password = this.passwordInput.value;

        if (!password) {
            this.hideHelp('passwordHelp');
            return false;
        }

        if (password.length < 8) {
            this.showHelp('passwordHelp', '비밀번호는 8자 이상이어야 합니다.', 'error');
            return false;
        }

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasLetter || !hasNumber || !hasSpecial) {
            this.showHelp('passwordHelp', '영문, 숫자, 특수문자를 모두 포함해야 합니다.', 'error');
            return false;
        }

        this.showHelp('passwordHelp', '사용 가능한 비밀번호입니다.', 'success');
        return true;
    }

    validatePasswordConfirm() {
        const password = this.passwordInput.value;
        const passwordConfirm = this.passwordConfirmInput.value;

        if (!passwordConfirm) {
            this.hideHelp('passwordConfirmHelp');
            return false;
        }

        if (password !== passwordConfirm) {
            this.showHelp('passwordConfirmHelp', '비밀번호가 일치하지 않습니다.', 'error');
            return false;
        }

        this.showHelp('passwordConfirmHelp', '비밀번호가 일치합니다.', 'success');
        return true;
    }

    initNicknameValidation() {
        let nicknameTimeout;

        this.nicknameInput.addEventListener('input', () => {
            clearTimeout(nicknameTimeout);
            nicknameTimeout = setTimeout(() => {
                this.validateNickname();
                this.updateSignupButton();
            }, 500);
        });
    }

    async validateNickname() {
        const nickname = this.nicknameInput.value.trim();

        if (!nickname) {
            this.hideHelp('nicknameHelp');
            return false;
        }

        if (nickname.length < 2 || nickname.length > 20) {
            this.showHelp('nicknameHelp', '닉네임은 2-20자 이내여야 합니다.', 'error');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/members/check-nickname?nickname=${encodeURIComponent(nickname)}`);
            const data = await response.json();

            if (data.available) {
                this.showHelp('nicknameHelp', '사용 가능한 닉네임입니다.', 'success');
                return true;
            } else {
                this.showHelp('nicknameHelp', '이미 사용 중인 닉네임입니다.', 'error');
                return false;
            }
        } catch (error) {
            console.error('Nickname validation failed:', error);
            this.showHelp('nicknameHelp', '닉네임 확인 중 오류가 발생했습니다.', 'error');
            return false;
        }
    }

    initTermsAgreement() {
        this.termsAll.addEventListener('change', (e) => {
            this.termsItems.forEach(item => {
                item.checked = e.target.checked;
            });
            this.updateSignupButton();
        });

        this.termsItems.forEach(item => {
            item.addEventListener('change', () => {
                const allChecked = Array.from(this.termsItems).every(item => item.checked);
                this.termsAll.checked = allChecked;
                this.updateSignupButton();
            });
        });
    }

    updateSignupButton() {
        const requiredTerms = Array.from(this.termsItems)
            .filter(item => item.required)
            .every(item => item.checked);

        const formValid = this.isEmailVerified &&
            this.nicknameInput.value.trim() &&
            this.validatePassword() &&
            this.validatePasswordConfirm() &&
            requiredTerms;

        this.signupBtn.disabled = !formValid;
    }

    initFormSubmit() {
        this.signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSignup();
        });
    }

    async handleSignup() {
        if (!this.isEmailVerified) {
            alert('이메일 인증을 완료해주세요.');
            return;
        }

        const signupData = {
            email: this.emailInput.value.trim(),
            nickname: this.nicknameInput.value.trim(),
            password: this.passwordInput.value,
            marketingAgreed: Array.from(this.termsItems)[2].checked
        };

        try {
            this.signupBtn.disabled = true;
            this.signupBtn.textContent = '회원가입 중...';

            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData)
            });

            if (response.ok) {
                alert('회원가입이 완료되었습니다!');
                window.location.href = '../login/login.html';
            } else {
                const error = await response.json();
                alert(error.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('Signup failed:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            this.signupBtn.disabled = false;
            this.signupBtn.textContent = '회원가입';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showHelp(id, message, type) {
        const helpElement = document.getElementById(id);
        helpElement.textContent = message;
        helpElement.className = `help-text visible ${type}`;
    }

    hideHelp(id) {
        const helpElement = document.getElementById(id);
        helpElement.classList.remove('visible');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SignupController();
});
