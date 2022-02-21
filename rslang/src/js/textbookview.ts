/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
import RslController from './rslcontroller.js';
import { Word, User } from './types';

class TextBookView {
  rslcontroller: RslController;
  textBook: HTMLElement;
  levelContent: HTMLElement;
  evInit: boolean;

  constructor(rc: RslController) {
    this.rslcontroller = rc;

    this.textBook = document.querySelector<HTMLElement>('.textbook_page')!;
    this.levelContent = this.textBook.querySelector<HTMLElement>('.textbook_page_content_right')!;
    this.evInit = false;

    this.evetsInit();
  }

  evetsInit(): void {
    if (this.evInit) return;

    const main = this.textBook.querySelector<HTMLElement>('.main_page_ref');
    main?.addEventListener('click', () => { this.mainMenuClick(); });

    const hardWords = this.textBook.querySelector<HTMLElement>('.unit_page_diff_words_ref');
    hardWords?.addEventListener('click', () => {
      this.hardWorsdMenuClick();
    });

    this.evInit = true;
    const levels = this.textBook.querySelectorAll<HTMLButtonElement>('.level_box');
    for (let i = 0; i < levels.length; i++) {
      levels[i].setAttribute('data-id', `${i}`);
      levels[i].addEventListener('click', (e) => {
        this.levelClick(e);
      });
      levels[i].addEventListener('mouseover', (e) => {
        this.levelMouseOver(e);
      });
    }
  }

  levelClick(e: MouseEvent): void {
    this.textBook.style.display = 'none';
    this.rslcontroller.tbWordsView.textBookWords.style.display = 'block';
    this.rslcontroller.tbLevelClick(e);
  }

  mainMenuClick(): void {
    this.textBook.style.display = 'none';
    this.rslcontroller.mainView.main.style.display = 'block';
  }

  hardWorsdMenuClick() {
    this.textBook.style.display = 'none';
    this.rslcontroller.tbWordsView.textBookWords.style.display = 'block';
    this.rslcontroller.hardWordsView();
  }

  levelMouseOver(e: MouseEvent): void {
    const levelNames = [
      'Начальный уровень A1',
      'Элементарный уровень A2',
      'Средний уровень B1',
      'Средне-продвинутый уровень B2',
      'Продвинутый уровень C1',
      'Владение в совершенстве C2',
    ];

    const elem = <HTMLElement>e.currentTarget;
    const id = elem.getAttribute('data-id');
    if (id) {
      const img = this.levelContent.querySelector('div')!;
      img.style.backgroundImage = `url(./images/${(+id + 1)}.jpg)`;
      const name = this.levelContent.querySelector('h4')!;
      name.textContent = levelNames[+id];
    }
  }
}

export default TextBookView;
