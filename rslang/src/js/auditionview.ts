import RslController from './rslcontroller.js';

type AuditionWord = {
  id: string,
  group: number,
  page: number,
  word: string,
  audio: string,
  wordTranslate: string,
  correctCnt: number,
  errorCnt: number,
  state: number
  idx: number
}

class AuditionView {
  words: AuditionWord [];
  wordIdx: number;
  hearts: number;
  correctAnsvers: number;

  timeOut: number;
  question: { idx: number, translate: string, errTranlate: string [], trueNum: number };
  audio: HTMLAudioElement;
  audio1: HTMLAudioElement;

  timeOutlId: NodeJS.Timer;
  rslcontroller: RslController;
  audition: HTMLElement;
  modalBody: HTMLElement;
  resultWindow: HTMLElement;
  stasticWindow: HTMLElement;

  ansversBarElem: HTMLElement;

  evInit: boolean;

  constructor(rc: RslController) {
    this.rslcontroller = rc;

    this.words = [];
    this.wordIdx = -1;
    this.hearts = 5;
    this.correctAnsvers = 0;
    this.timeOut = 5000;
    this.question = {
      idx: -1, translate: 'string', errTranlate: ['', '', ''], trueNum: -1,
    };
    this.audio = new Audio();
    this.audio.volume = 0.2;

    this.audio1 = new Audio();
    this.audio1.volume = 0.1;

    this.audition = document.querySelector<HTMLElement>('.audition_page')!;
    this.modalBody = this.audition.querySelector<HTMLElement>('.modal_body')!;
    this.resultWindow = this.audition.querySelector<HTMLElement>('#result_window')!;
    this.stasticWindow = this.audition.querySelector<HTMLElement>('#stastic_window')!;
    this.ansversBarElem = this.audition.querySelector<HTMLElement>('.words_bar')!;
    this.evInit = false;

    this.evetsInit();
    this.timeOutlId = null as unknown as NodeJS.Timer;
  }

  evetsInit(): void {
    if (this.evInit) return;

    const repeetElem = this.audition.querySelector<HTMLElement>('.top_bar_image')!;
    repeetElem.addEventListener('click', () => { this.audioPlay(); });

    const ansvers = this.ansversBarElem.querySelectorAll<HTMLElement>('p');
    for (let i = 0; i < ansvers.length; i++) {
      ansvers[i].addEventListener('click', (e) => { this.ansversClick(e); });
    }

    const exitBtn = this.audition.querySelector<HTMLElement>('.exit_button')!;
    exitBtn.addEventListener('click', () => { this.exitBtnClick(); });

    const statBtn = this.resultWindow.querySelector<HTMLElement>('.statistic_button')!;
    statBtn.addEventListener('click', () => { this.statisticBtnClick(); });

    const nextSprintBtn = this.resultWindow.querySelector<HTMLElement>('.next_button')!;
    nextSprintBtn.addEventListener('click', () => { this.nextAuditionBtnClick(); });

    const gamesBtn = this.resultWindow.querySelector<HTMLElement>('.games_button')!;
    gamesBtn.addEventListener('click', () => { this.gamesBtnClick(); });

    const resultBtn = this.stasticWindow.querySelector<HTMLElement>('.result_button')!;
    resultBtn.addEventListener('click', () => { this.resultBtnClick(); });
  }

  ansversClick(e: MouseEvent): void {
    const elem = <HTMLElement>e.currentTarget;
    if (!elem) return;
    const idx = elem.getAttribute('data-id');
    if (idx) {
      if (this.timeOutlId) clearTimeout(this.timeOutlId);
      this.setAnsver(this.question.idx, idx === '1');
      this.nextQuestion();
    }
  }

  onTimeOut() {
    this.setAnsver(this.question.idx, false);
    this.nextQuestion();
  }

  setAnsver(idx: number, result: boolean) {
    if (result) {
      this.words[idx].correctCnt++;
      this.correctAnsvers++;
      this.audio1.src = './images/correct.mp3';
      this.audio1.play();
    } else {
      this.words[idx].errorCnt++;
      this.audio1.src = './images/error.mp3';
      this.audio1.play();
      this.hearts--;
    }
  }

  auditionInit() {
    this.wordIdx = -1;
    this.hearts = 5;
    this.correctAnsvers = 0;
    this.timeOut = 6000;
    this.question = {
      idx: -1, translate: 'string', errTranlate: ['', '', ''], trueNum: -1,
    };
    this.timeOutlId = null as unknown as NodeJS.Timer;
  }

  prepareWords(): void {
    this.auditionInit();
    this.words.splice(0, this.words.length);
    const words = this.rslcontroller.rslModel.textBook;
    for (let i = 0; i < this.rslcontroller.rslModel.textBook.length; i++) {
      if (words[i].userWord.optional.state === 'learn') {
        const word = {
          id: words[i]._id,
          group: words[i].group,
          page: words[i].page,
          word: words[i].word,
          audio: words[i].audio,
          wordTranslate: words[i].wordTranslate,
          correctCnt: 0,
          errorCnt: 0,
          state: 0,
          idx: i,
        };
        this.words.push(word);
      }
    }

    this.nextQuestion();
  }

  nextQuestion(): void {
    if (this.words.length < 2) {
      if (this.timeOutlId) clearTimeout(this.timeOutlId);
      this.gamesBtnClick();
      return;
    }
    if (this.hearts < 1) {
      if (this.timeOutlId) clearTimeout(this.timeOutlId);
      this.resultAudition();
      this.updateResult();
      return;
    }
    const delay = this.wordIdx !== -1;
    this.wordIdx++;
    if (this.wordIdx >= this.words.length) this.wordIdx = 0;
    this.question.idx = this.wordIdx;
    this.question.translate = this.words[this.question.idx].wordTranslate;
    this.question.trueNum = Math.floor(Math.random() * 4);

    this.question.errTranlate.splice(0, this.question.errTranlate.length);
    while (this.words.length > 1 && this.question.errTranlate.length < 3) {
      let idx = Math.floor(Math.random() * this.words.length);
      if (idx === this.question.idx) {
        idx++;
        if (idx >= this.words.length) idx = 0;
      }
      this.question.errTranlate.push(this.words[idx].wordTranslate);
    }

    this.render();
    if (delay) setTimeout(() => { this.audioPlay(); }, 500);
    else this.audioPlay();
    if (this.hearts > 0) {
      this.timeOutlId = setTimeout(() => { this.onTimeOut(); }, this.timeOut);
    }
  }

  audioPlay() {
    this.audio.src = `${this.rslcontroller.rslModel.serverUrl}/${this.words[this.wordIdx].audio}`;
    this.audio.play();
  }

  render(): void {
    this.setHearts();

    const ansvers = this.ansversBarElem.querySelectorAll<HTMLElement>('p');
    let j = 0;
    for (let i = 0; i < ansvers.length; i++) {
      if (i === this.question.trueNum) {
        ansvers[i].textContent = this.question.translate;
        ansvers[i].setAttribute('data-id', '1');
      } else {
        ansvers[i].textContent = this.question.errTranlate[j];
        ansvers[i].setAttribute('data-id', '-1');
        j++;
      }
    }
  }

  setHearts(): void {
    const stars = this.audition.querySelectorAll<HTMLElement>('.hearts_bar i');
    for (let i = 0; i < stars.length; i++) {
      if (i < this.hearts) {
        stars[i].classList.remove('far', 'heart_inactive');
        stars[i].classList.add('fas', 'heart_active');
      } else {
        stars[i].classList.remove('fas', 'heart_active');
        stars[i].classList.add('far', 'heart_inactive');
      }
    }
  }

  exitBtnClick(): void {
    if (this.timeOutlId) clearTimeout(this.timeOutlId);
    this.resultAudition();
  }

  resultAudition(): void {
    const resElem = this.resultWindow.querySelector<HTMLElement>('h3')!;
    resElem.textContent = `Ваш результат ${this.correctAnsvers} угаданных слов`;

    this.modalBody.style.visibility = 'visible';
    this.resultWindow.style.display = 'flex';
    this.stasticWindow.style.display = 'none';
  }

  async updateResult() {
    if (!this.rslcontroller.rslModel.user.id || !this.rslcontroller.rslModel.user.token) return;

    const words = this.rslcontroller.rslModel.textBook;
    for (let i = 0; i < this.words.length; i++) {
      words[this.words[i].idx].userWord.optional.correctCnt += this.words[i].correctCnt;
      words[this.words[i].idx].userWord.optional.incorrectCnt += this.words[i].errorCnt;
    }
    await this.rslcontroller.updateUserWords();
  }

  statisticBtnClick(): void {
    this.stasticWindow.style.display = 'block';
    this.resultWindow.style.display = 'none';

    this.statisticRender();
  }

  nextAuditionBtnClick(): void {
    this.modalBody.style.visibility = 'hidden';
    this.stasticWindow.style.display = 'none';
    this.resultWindow.style.display = 'none';
    this.prepareWords();
  }

  gamesBtnClick(): void {
    this.modalBody.style.visibility = 'hidden';
    this.stasticWindow.style.display = 'none';
    this.resultWindow.style.display = 'none';
    this.audition.style.display = 'none';
    this.rslcontroller.gamesView.games.style.display = 'block';
  }

  statisticRender() {
    let audios = this.stasticWindow.querySelectorAll<HTMLElement>('i');
    for (let i = 0; i < audios.length; i++) {
      audios[i].removeEventListener('click', (e) => { this.statisticAudioClick(e); });
    }
    const resElem = this.stasticWindow.querySelector<HTMLElement>('h3')!;
    resElem.textContent = `Ваш результат ${this.correctAnsvers} угаданных слов`;
    const table = this.stasticWindow.querySelector<HTMLElement>('.statistic_table')!;
    table.innerHTML = '';
    let s = '<h5 class="mistakes_title">ошибок: </h5>';
    for (let i = 0; i < this.words.length; i++) {
      if (this.words[i].errorCnt > 0) {
        s += this.statisticRowHTML(i);
      }
    }

    s += '<h5 class="answers_title">угадано: </h5>';
    for (let i = 0; i < this.words.length; i++) {
      if (this.words[i].correctCnt > 0) {
        s += this.statisticRowHTML(i);
      }
    }

    table.innerHTML = s;

    audios = this.stasticWindow.querySelectorAll<HTMLElement>('i');
    for (let i = 0; i < audios.length; i++) {
      audios[i].addEventListener('click', (e) => { this.statisticAudioClick(e); });
    }
  }

  statisticRowHTML(idx: number): string {
    const res = '<div class="statistic_table_row">'
    + `<i class="fas fa-volume-up fas_statistic_table" data-id="${idx}"></i>`
    + `<p>${this.words[idx].word}</p>`
    + '<p> - </p>'
    + `<p>${this.words[idx].wordTranslate}</p>`
    + '</div>';

    return res;
  }

  resultBtnClick(): void {
    this.resultAudition();
  }

  statisticAudioClick(e: MouseEvent): void {
    const elem = <HTMLElement>e.currentTarget;
    if (!elem) return;
    const idx = elem.getAttribute('data-id');
    if (idx) {
      this.audio.src = `${this.rslcontroller.rslModel.serverUrl}/${this.words[+idx].audio}`;
      this.audio.play();
    }
  }
}
export default AuditionView;
