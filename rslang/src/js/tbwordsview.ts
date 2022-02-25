import RslController from './rslcontroller.js';
import { AggrWord } from './types';

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

    const main = this.textBookWords.querySelector<HTMLElement>('.main_page_ref');
    main?.addEventListener('click', () => { this.mainMenuClick(); });

    const textBook = this.textBookWords.querySelector<HTMLElement>('.textbook_page_ref');
    textBook?.addEventListener('click', () => { this.textBookClick(); });

    const hardWords = this.textBookWords.querySelector<HTMLElement>('.unit_page_diff_words_ref');
    hardWords?.addEventListener('click', () => {
      this.rslcontroller.hardWordsView();
    });

    const games = this.textBookWords.querySelector<HTMLElement>('.games_page_ref')!;
    games.addEventListener('click', () => { this.gamesClick(); });

    const levelBtns = this.textBookWords.querySelectorAll<HTMLElement>('.experience_level_button');
    for (let i = 0; i < levelBtns.length; i++) {
      levelBtns[i].setAttribute('data-id', `${i}`);
      levelBtns[i].addEventListener('click', (e) => {
        this.levelClick(e);
      });
    }

    this.evInit = true;
    const nextBtn = this.textBookWords.querySelector<HTMLElement>('.fa-angle-right');
    nextBtn?.addEventListener('click', () => { this.rslcontroller.nextWordsPage(); });

    const prevBtn = this.textBookWords.querySelector<HTMLElement>('.fa-angle-left');
    prevBtn?.addEventListener('click', () => { this.rslcontroller.prevWordsPage(); });
  }

  mainMenuClick(): void {
    this.textBookWords.style.display = 'none';
    this.rslcontroller.mainView.main.style.display = 'block';
    this.rslcontroller.setLevelRsl(0);
  }

  textBookClick(): void {
    this.textBookWords.style.display = 'none';
    this.rslcontroller.textBookView.textBook.style.display = 'block';
    this.rslcontroller.textBookView.render();
    this.rslcontroller.setLevelRsl(1);
  }

  gamesClick(): void {
    this.textBookWords.style.display = 'none';
    this.rslcontroller.gamesView.games.style.display = 'block';
    this.rslcontroller.gamesView.render();
  }

  levelClick(e: MouseEvent): void {
    this.rslcontroller.tbLevelClick(e);
  }

  render(words: AggrWord[]): void {
    this.removeWorsEvens();

    const hardWords = this.textBookWords.querySelector<HTMLElement>('.unit_page_diff_words_ref')!;
    if (this.rslcontroller.rslModel.user.id && this.rslcontroller.rslModel.user) {
      hardWords.style.display = 'block';
    } else {
      hardWords.style.display = 'none';
    }

    const content = this.textBookWords.querySelector<HTMLElement>('.unit_page_content')!;
    content.innerHTML = '';
    for (let i = 0; i < words.length; i++) {
      content.appendChild(this.wordHTML(`${i}`, words[i]));
    }

    const pageScroller = this.textBookWords.querySelector<HTMLElement>('.page_scroller')!;
    const games = this.textBookWords.querySelector<HTMLElement>('.games_page_ref')!;
    if (this.rslcontroller.rslModel.group === 6) {
      pageScroller.style.display = 'none';
      games.style.display = 'none';
    } else {
      pageScroller.style.display = 'flex';
      games.style.display = 'block';
      this.setActualPage(`${this.rslcontroller.rslModel.page + 1}`);
    }

    this.addWorsEvens();
  }

  wordHTML(idx: string, word: AggrWord): HTMLElement {
    const divRoot = document.createElement('div');
    divRoot.className = 'unit_item';
    divRoot.setAttribute('data-id', idx);

    let content = '<div class="unit_item_cover" '
        + `style="background-image: url(${this.rslcontroller.rslModel.serverUrl}/${word.image})"></div>`
    + '<div class="unit_item_icons_bar">';
    const hard = this.rslcontroller.isHardWord(+idx) ? 'on' : 'off';
    const learned = this.rslcontroller.isEasyWord(+idx) ? 'on' : 'off';
    content += this.rslcontroller.rslModel.user.token ? `<i class="fas fa-star-of-life ${hard}" data-id="${idx}"></i>` : '';
    content += this.rslcontroller.rslModel.user.token ? `<i class="fas fa-thumbs-up ${learned}" data-id="${idx}"></i>` : '';
    if (this.rslcontroller.rslModel.user.token) {
      content += `<p class="rigth_answer_number">${word.userWord.optional.correctCnt}</p>`
        + '<p class="slash">/</p>'
        + `<p class="wrong_answer_number">${word.userWord.optional.incorrectCnt}</p>`;
    }
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

  expLevelBtnActivate(idx: number) {
    const levelBtns = this.textBookWords.querySelectorAll<HTMLElement>('.experience_level_button');
    for (let i = 0; i < levelBtns.length; i++) {
      const id = levelBtns[i].getAttribute('data-id');
      const parent = levelBtns[i].parentElement;
      if (id && parent) {
        if (idx !== +id) {
          parent.className = 'experience_level_block';
        } else {
          let s = 'experience_level_block_';
          switch (+id) {
            case 0:
              s += 'a1';
              break;
            case 1:
              s += 'a2';
              break;
            case 2:
              s += 'b1';
              break;
            case 3:
              s += 'b2';
              break;
            case 4:
              s += 'c1';
              break;
            case 5:
              s += 'c2';
              break;
            default:
              s += 'h';
          }
          s += '_active';
          parent.className = s;
        }
      }
    }
  }

  setActualPage(page: string): void {
    const elem = this.textBookWords.querySelector<HTMLElement>('.actual_page');
    if (elem) {
      elem.textContent = page;
    }
  }

  removeWorsEvens() {
    const audios = this.textBookWords.querySelectorAll<HTMLElement>('.fa-volume-up')!;
    for (let i = 0; i < audios.length; i++) {
      audios[i].removeEventListener('click', (e) => {
        this.rslcontroller.audioClick(e);
      });
    }

    const hardWords = this.textBookWords.querySelectorAll<HTMLElement>('.fa-star-of-life')!;
    hardWords.forEach((elem) => {
      elem.removeEventListener('click', (e) => {
        this.hardWordClick(e);
      });
    });

    const learnWords = this.textBookWords.querySelectorAll<HTMLElement>('.fa-thumbs-up')!;
    learnWords.forEach((elem) => {
      elem.removeEventListener('click', (e) => {
        this.easyWordClick(e);
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

    const hardWords = this.textBookWords.querySelectorAll<HTMLElement>('.fa-star-of-life')!;
    hardWords.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        this.hardWordClick(e);
      });
    });

    const learnWords = this.textBookWords.querySelectorAll<HTMLElement>('.fa-thumbs-up')!;
    learnWords.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        this.easyWordClick(e);
      });
    });
  }

  async hardWordClick(e: MouseEvent): Promise<void> {
    const elem = <HTMLElement>e.currentTarget;
    const id = elem.getAttribute('data-id');
    if (id) {
      if (this.rslcontroller.isEasyWord(+id)) return;
      if (elem.classList.contains('off')) {
        elem.classList.remove('off');
        elem.classList.add('on');
        await this.rslcontroller.updateStateUserWord(+id, 'hard');
      } else {
        elem.classList.remove('on');
        elem.classList.add('off');
        await this.rslcontroller.updateStateUserWord(+id, 'learn');
      }
    }
  }

  async easyWordClick(e: MouseEvent): Promise<void> {
    const elem = <HTMLElement>e.currentTarget;
    const id = elem.getAttribute('data-id');
    if (id) {
      if (this.rslcontroller.isHardWord(+id)) return;
      if (elem.classList.contains('off')) {
        elem.classList.remove('off');
        elem.classList.add('on');
        await this.rslcontroller.updateStateUserWord(+id, 'easy');
      } else {
        elem.classList.remove('on');
        elem.classList.add('off');
        await this.rslcontroller.updateStateUserWord(+id, 'learn');
      }
    }
  }
}

export default TbWordsView;
