/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
import RslController from './rslcontroller.js';
import { Word, User } from './types';

class TbWordsView {
  rslcontroller: RslController;
  textBookWords: HTMLElement;
  evInit: boolean;

  constructor(rc: RslController) {
    this.rslcontroller = rc;

    this.textBookWords = document.querySelector<HTMLElement>('.unit_page')!;
    this.evInit = false;

    this.evetsInit();
  }

  evetsInit(): void {
    if (this.evInit) return;

    this.evInit = true;
    const nextBtn = this.textBookWords.querySelector<HTMLElement>('.fa-angle-right');
    nextBtn?.addEventListener('click', () => { this.rslcontroller.nextWordsPage(); });

    const prevBtn = this.textBookWords.querySelector<HTMLElement>('.fa-angle-left');
    prevBtn?.addEventListener('click', () => { this.rslcontroller.prevWordsPage(); });
  }

  render(words: Word[]): void {
    this.removeWorsEvens();
    const content = this.textBookWords.querySelector<HTMLElement>('.unit_page_content')!;
    content.innerHTML = '';
    for (let i = 0; i < words.length; i++) {
      content.appendChild(this.wordHTML(`${i}`, words[i]));
    }

    this.setActualPage(`${this.rslcontroller.rslModel.page + 1}`);

    this.addWorsEvens();
  }

  wordHTML(idx: string, word: Word): HTMLElement {
    const divRoot = document.createElement('div');
    divRoot.className = 'unit_item';
    divRoot.setAttribute('data-id', idx);

    let content = '<div class="unit_item_cover" '
        + `style="background-image: url(${this.rslcontroller.rslModel.serverUrl}/${word.image})"></div>`
    + '<div class="unit_item_icons_bar">';
    content += this.rslcontroller.rslModel.user.token ? `<i class="fas fa-star-of-life off" data-id="${idx}"></i>` : '';
    content += this.rslcontroller.rslModel.user.token ? `<i class="fas fa-thumbs-up off" data-id="${idx}"></i>` : '';
    content += '</div>'
    + `<div class="unit_item_title"><h2>${word.word}</h2></div>`
    + '<div class="unit_item_string string1">'
      + `<p>${word.wordTranslate}</p>`
      + `<p>${word.transcription}</p>`
      + `<i class="fas fa-volume-up" data-id="${idx}"></i>`
    + '</div>'
    + `<div class="unit_item_string string2"><p>${word.textMeaning}</p></div>`
    + `<div class="unit_item_string string3"><p>${word.textExample}</p></div>`
    + '<div class="divide_string"></div>'
    + `<div class="unit_item_string string4"><p>${word.textMeaningTranslate}</p></div>`
    + `<div class="unit_item_string string5"><p>${word.textExampleTranslate}</p></div>`;

    divRoot.innerHTML = content;

    return divRoot;
  }

  setActualPage(page: string): void {
    const elem = this.textBookWords.querySelector<HTMLElement>('.actual_page');
    if (elem)
      elem.textContent = page;
  }

  removeWorsEvens() {
    const audios = this.textBookWords.querySelectorAll<HTMLElement>('.fa-volume-up')!;
    for (let i = 0; i < audios.length; i++) {
      audios[i].removeEventListener('click', (e) => {
        this.rslcontroller.audioClick(e);
      });
    }

    const diffWords = this.textBookWords.querySelectorAll<HTMLElement>('.fa-star-of-life')!;
    diffWords.forEach((elem) => {
      elem.removeEventListener('click', (e) => {
        this.diffWordClick(e);
      });
    });
  }

  addWorsEvens() {
    const audios = this.textBookWords.querySelectorAll<HTMLElement>('.fa-volume-up')!;
    for (let i = 0; i < audios.length; i++) {
      audios[i].addEventListener('click', (e) => {
        this.rslcontroller.audioClick(e);
      });
    }

    const diffWords = this.textBookWords.querySelectorAll<HTMLElement>('.fa-star-of-life')!;
    diffWords.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        this.diffWordClick(e);
      });
    });
  }

  diffWordClick(e: MouseEvent) {
    const elem = <HTMLElement>e.currentTarget;
    if (elem.classList.contains('off')) {
      elem.classList.remove('off');
      elem.classList.add('on');
    } else {
      elem.classList.remove('on');
      elem.classList.add('off');
    }
    const id = elem.getAttribute('data-id');
  }

  learnWordClick(e: MouseEvent) {
    const elem = <HTMLElement>e.currentTarget;
    if (elem.classList.contains('off')) {
      elem.classList.remove('off');
      elem.classList.add('on');
    } else {
      elem.classList.remove('on');
      elem.classList.add('off');
    }
    const id = elem.getAttribute('data-id');
  }
}

export default TbWordsView;
