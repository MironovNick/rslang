/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
import RslController from './rslcontroller.js';

class GamesView {
  rslcontroller: RslController;
  games: HTMLElement;
  evInit: boolean;

  constructor(rc: RslController) {
    this.rslcontroller = rc;

    this.games = document.querySelector<HTMLElement>('.games_page')!;
    this.evInit = false;

    this.evetsInit();
  }

  evetsInit(): void {
    if (this.evInit) return;

    const main = this.games.querySelector<HTMLElement>('.main_page_ref');
    main?.addEventListener('click', () => { this.mainMenuClick(); });

    const textBook = this.games.querySelector<HTMLElement>('.textbook_page_ref');
    textBook?.addEventListener('click', () => { this.textBookClick(); });

    const sprint = this.games.querySelector<HTMLElement>('.sprint');
    sprint?.addEventListener('click', () => { this.sprintClick(); });

    const audition = this.games.querySelector<HTMLElement>('.audition');
    audition?.addEventListener('click', () => { this.auditionClick(); });
  }

  mainMenuClick(): void {
    this.games.style.display = 'none';
    this.rslcontroller.mainView.main.style.display = 'block';
  }

  textBookClick(): void {
    this.games.style.display = 'none';
    this.rslcontroller.textBookView.textBook.style.display = 'block';
  }

  sprintClick(): void {
    this.games.style.display = 'none';
    this.rslcontroller.sprintView.sprint.style.display = 'block';
    this.rslcontroller.sprintView.prepareWords();
  }

  auditionClick(): void {
    this.games.style.display = 'none';
    this.rslcontroller.auditionView.audition.style.display = 'block';
  }
}
export default GamesView;
