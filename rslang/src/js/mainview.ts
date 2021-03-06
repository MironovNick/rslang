/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
import RslController from './rslcontroller.js';
//import { Word, User } from './types';

class MainView {
  rslcontroller: RslController;
  main: HTMLElement;
  modalBody: HTMLElement;
  loginBtn : HTMLElement;
  logInWindow: HTMLElement;
  logInEmail: HTMLInputElement;
  logInPswd: HTMLInputElement;
  signInWindow: HTMLElement;
  signInName: HTMLInputElement;
  signInEmail: HTMLInputElement;
  signInPswd: HTMLInputElement;
  evInit: boolean;

  constructor(rc: RslController) {
    this.rslcontroller = rc;

    this.main = document.querySelector<HTMLElement>('.main_page')!;
    this.loginBtn = this.main.querySelector<HTMLElement>('.log_in_button')!;
    this.modalBody = this.main.querySelector<HTMLElement>('.modal_body')!;
    this.logInWindow = this.main.querySelector<HTMLElement>('#log_in_window')!;
    this.logInEmail = this.logInWindow.querySelector<HTMLInputElement>('.log_in_window_input_email')!;
    this.logInPswd = this.logInWindow.querySelector<HTMLInputElement>('.log_in_window_input_pswd')!;
    this.signInWindow = this.main.querySelector<HTMLElement>('#sign_in_window')!;
    this.signInName = this.signInWindow.querySelector<HTMLInputElement>('.sign_in_window_input_name')!;
    this.signInEmail = this.signInWindow.querySelector<HTMLInputElement>('.sign_in_window_input_email')!;
    this.signInPswd = this.signInWindow.querySelector<HTMLInputElement>('.sign_in_window_input_pswd')!;
    this.evInit = false;

    this.evetsInit();
  }

  evetsInit(): void {
    if (this.evInit) return;

    this.evInit = true;
    const textBook = this.main.querySelector<HTMLElement>('.textbook_page_ref');
    textBook?.addEventListener('click', () => { this.textBookClick(); });

    const games = this.main.querySelector<HTMLElement>('.games_page_ref')!;
    games.addEventListener('click', () => {
      this.main.style.display = 'none';
      this.rslcontroller.gamesView.games.style.display = 'block';
      this.rslcontroller.gamesView.render();
    });

    const login = this.main.querySelector<HTMLElement>('.log_in_button');
    login?.addEventListener('click', () => { this.logInMenuClick(); });

    const loginRegistr = this.main.querySelector<HTMLElement>('#modal_window_registration_button');
    loginRegistr?.addEventListener('click', () => { this.logInRegistrClick(); });

    const loginEnter = this.main.querySelector<HTMLElement>('.modal_window_log_in_enter');
    loginEnter?.addEventListener('click', () => { this.logInEnterClick(); });

    const signinCreate = this.main.querySelector<HTMLElement>('.modal_window_sign_in_create');
    signinCreate?.addEventListener('click', () => { this.signInCreateClick(); });

    const logCloses = this.main.querySelectorAll<HTMLElement>('.modal_log_close');
    for (let i = 0; i < logCloses.length; i++) {
      logCloses[i].addEventListener('click', () => {
        this.logCloseClick();
      });
    }
  }

  textBookClick(): void {
    this.main.style.display = 'none';
    this.rslcontroller.textBookView.textBook.style.display = 'block';
    this.rslcontroller.textBookView.render();
    this.rslcontroller.setLevelRsl(1);
  }

  async logInMenuClick(): Promise<void> {
    if (!this.rslcontroller.rslModel.user.id) {
      this.modalBody.style.visibility = 'visible';
      this.logInWindow.style.display = 'block';
      this.signInWindow.style.display = 'none';
      this.logInEmail.value = this.rslcontroller.rslModel.user.email;
      this.logInPswd.value = this.rslcontroller.rslModel.user.password;
    } else {
      await this.rslcontroller.deleteUserWordsAll(this.rslcontroller.rslModel.user.id);
      this.logInEmail.value = '';
      this.logInPswd.value = '';
      this.rslcontroller.rslModel.user.id = '';
      this.rslcontroller.rslModel.user.token = '';
      this.rslcontroller.rslModel.user.email = '';
      this.rslcontroller.rslModel.user.name = '';
      this.rslcontroller.rslModel.user.password = '';
      const login = this.main.querySelector<HTMLElement>('.log_in_button')!;
      login.textContent = '??????????';
      this.rslcontroller.viewUserNameAll();
      localStorage.removeItem('rslang_user');
    }
  }

  logCloseClick(): void {
    this.logInWindow.style.display = 'none';
    this.signInWindow.style.display = 'none';
    this.modalBody.style.visibility = 'hidden';
    this.loginBtn.textContent = '??????????';
    this.rslcontroller.viewUserNameAll();
  }

  logInRegistrClick(): void {
    this.logInWindow.style.display = 'none';
    this.signInWindow.style.display = 'block';
  }

  async logInEnterClick(): Promise<void> {
    const user = { email: this.logInEmail.value, password: this.logInPswd.value };
    if (!user.email || !user.password) { return; }
    await this.rslcontroller.logInUser(user);
    if (this.rslcontroller.rslModel.user.id && this.rslcontroller.rslModel.user.token) {
      this.logCloseClick();
    }
  }

  async signInCreateClick(): Promise<void> {
    const user = {
      name: this.signInName.value, email: this.signInEmail.value, password: this.signInPswd.value,
    };
    if (!user.name || !user.email || !user.password) { return; }
    await this.rslcontroller.createUser(user);
    if (this.rslcontroller.rslModel.user.id && this.rslcontroller.rslModel.user.token) {
      this.logCloseClick();
    }
  }
}

export default MainView;
