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
  evInit: boolean;

  constructor(rc: RslController) {
    this.rslcontroller = rc;

    this.textBook = document.querySelector<HTMLElement>('.textbook_page')!;
    this.evInit = false;

    this.evetsInit();
  }

  evetsInit(): void {
    if (this.evInit) return;

    this.evInit = true;
    const levels = this.textBook.querySelectorAll<HTMLButtonElement>('.level_box');
    for (let i = 0; i < levels.length; i++) {
      levels[i].setAttribute('data-id', `${i}`);
      levels[i].addEventListener('click', (e) => {
        this.levelClick(e);
      });
    }
  }

  levelClick(e: MouseEvent): void {
    this.textBook.style.display = 'none';
    this.rslcontroller.tbWordsView.textBookWords.style.display = 'block';
    this.rslcontroller.tbLevelClick(e);
  }
}

export default TextBookView;
