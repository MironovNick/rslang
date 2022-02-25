class MainView {
    constructor(rc) {
        this.rslcontroller = rc;
        this.main = document.querySelector('.main_page');
        this.loginBtn = this.main.querySelector('.log_in_button');
        this.modalBody = this.main.querySelector('.modal_body');
        this.logInWindow = this.main.querySelector('#log_in_window');
        this.logInEmail = this.logInWindow.querySelector('.log_in_window_input_email');
        this.logInPswd = this.logInWindow.querySelector('.log_in_window_input_pswd');
        this.signInWindow = this.main.querySelector('#sign_in_window');
        this.signInName = this.signInWindow.querySelector('.sign_in_window_input_name');
        this.signInEmail = this.signInWindow.querySelector('.sign_in_window_input_email');
        this.signInPswd = this.signInWindow.querySelector('.sign_in_window_input_pswd');
        this.evInit = false;
        this.evetsInit();
    }
    evetsInit() {
        if (this.evInit)
            return;
        this.evInit = true;
        const textBook = this.main.querySelector('.textbook_page_ref');
        textBook?.addEventListener('click', () => { this.textBookClick(); });
        const games = this.main.querySelector('.games_page_ref');
        games.addEventListener('click', () => {
            this.main.style.display = 'none';
            this.rslcontroller.gamesView.games.style.display = 'block';
            this.rslcontroller.gamesView.render();
        });
        const login = this.main.querySelector('.log_in_button');
        login?.addEventListener('click', () => { this.logInMenuClick(); });
        const loginRegistr = this.main.querySelector('#modal_window_registration_button');
        loginRegistr?.addEventListener('click', () => { this.logInRegistrClick(); });
        const loginEnter = this.main.querySelector('.modal_window_log_in_enter');
        loginEnter?.addEventListener('click', () => { this.logInEnterClick(); });
        const signinCreate = this.main.querySelector('.modal_window_sign_in_create');
        signinCreate?.addEventListener('click', () => { this.signInCreateClick(); });
        const logCloses = this.main.querySelectorAll('.modal_log_close');
        for (let i = 0; i < logCloses.length; i++) {
            logCloses[i].addEventListener('click', () => {
                this.logCloseClick();
            });
        }
    }
    textBookClick() {
        this.main.style.display = 'none';
        this.rslcontroller.textBookView.textBook.style.display = 'block';
        this.rslcontroller.textBookView.render();
        this.rslcontroller.setLevelRsl(1);
    }
    async logInMenuClick() {
        if (!this.rslcontroller.rslModel.user.id) {
            this.modalBody.style.visibility = 'visible';
            this.logInWindow.style.display = 'block';
            this.signInWindow.style.display = 'none';
            this.logInEmail.value = this.rslcontroller.rslModel.user.email;
            this.logInPswd.value = this.rslcontroller.rslModel.user.password;
        }
        else {
            await this.rslcontroller.deleteUserWordsAll(this.rslcontroller.rslModel.user.id);
            this.logInEmail.value = '';
            this.logInPswd.value = '';
            this.rslcontroller.rslModel.user.id = '';
            this.rslcontroller.rslModel.user.token = '';
            this.rslcontroller.rslModel.user.email = '';
            this.rslcontroller.rslModel.user.name = '';
            this.rslcontroller.rslModel.user.password = '';
            const login = this.main.querySelector('.log_in_button');
            login.textContent = 'войти';
            this.rslcontroller.viewUserNameAll();
            localStorage.removeItem('rslang_user');
        }
    }
    logCloseClick() {
        this.logInWindow.style.display = 'none';
        this.signInWindow.style.display = 'none';
        this.modalBody.style.visibility = 'hidden';
        this.loginBtn.textContent = 'выйти';
        this.rslcontroller.viewUserNameAll();
    }
    logInRegistrClick() {
        this.logInWindow.style.display = 'none';
        this.signInWindow.style.display = 'block';
    }
    async logInEnterClick() {
        const user = { email: this.logInEmail.value, password: this.logInPswd.value };
        if (!user.email || !user.password) {
            return;
        }
        await this.rslcontroller.logInUser(user);
        if (this.rslcontroller.rslModel.user.id && this.rslcontroller.rslModel.user.token) {
            this.logCloseClick();
        }
    }
    async signInCreateClick() {
        const user = {
            name: this.signInName.value, email: this.signInEmail.value, password: this.signInPswd.value,
        };
        if (!user.name || !user.email || !user.password) {
            return;
        }
        await this.rslcontroller.createUser(user);
        if (this.rslcontroller.rslModel.user.id && this.rslcontroller.rslModel.user.token) {
            this.logCloseClick();
        }
    }
}
export default MainView;
