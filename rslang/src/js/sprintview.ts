/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
import RslController from './rslcontroller.js';
import {
  Word, AggrWord, User, UserWordOpt,
} from './types';

type SprintWord = {
  id: string,
  group: number,
  page: number,
  word: string,
  audio: string,
  wordTranslate: string,
  correctCnt: number,
  errorCnt: number,
  state: number
}

class SprintView {
//==Model=========
  words: SprintWord [];
  wordIdx: number;
  points: number;
  totalPoints: number;
  series: number;
  bestSeries: number;
  timeOut: number;
  question: { idx: number, word: string, translate: string, result: boolean };
  audio: HTMLAudioElement;

//==Model=========

  intervalId: NodeJS.Timer;
  rslcontroller: RslController;
  sprint: HTMLElement;
  modalBody: HTMLElement;
  resultWindow: HTMLElement;
  stasticWindow: HTMLElement;
  wordElem: HTMLElement;
  translateElem: HTMLElement;
  pointsElem: HTMLElement;
  totalPointsElem: HTMLElement;

  evInit: boolean;

  constructor(rc: RslController) {
    this.rslcontroller = rc;

    this.words = [];
    this.wordIdx = -1;
    this.points = 20;
    this.totalPoints = 0;
    this.series = 0;
    this.bestSeries = 0;
    this.timeOut = 60;
    this.question = {
      idx: -1, word: '', translate: '', result: true,
    };
    this.audio = new Audio();
    this.audio.volume = 0.1;

    this.sprint = document.querySelector<HTMLElement>('.sprint_page')!;
    this.modalBody = this.sprint.querySelector<HTMLElement>('.modal_body')!;
    this.resultWindow = this.sprint.querySelector<HTMLElement>('#result_window')!;
    this.stasticWindow = this.sprint.querySelector<HTMLElement>('#stastic_window')!;
    this.wordElem = this.sprint.querySelector<HTMLElement>('.sprint_question_word')!;
    this.translateElem = this.sprint.querySelector<HTMLElement>('.sprint_question_translate')!;
    this.pointsElem = this.sprint.querySelector<HTMLElement>('.points')!;
    this.totalPointsElem = this.sprint.querySelector<HTMLElement>('.total_points')!;

    this.evInit = false;

    this.evetsInit();
    this.intervalId = null as unknown as NodeJS.Timer;
  }

  evetsInit(): void {
    if (this.evInit) return;

    const wrongBtn = this.sprint.querySelector<HTMLElement>('.wrong_button')!;
    wrongBtn.addEventListener('click', () => { this.wrongBtnClick(); });

    const correctBtn = this.sprint.querySelector<HTMLElement>('.correct_button')!;
    correctBtn.addEventListener('click', () => { this.correctBtnClick(); });

    const exitBtn = this.sprint.querySelector<HTMLElement>('.exit_button')!;
    exitBtn.addEventListener('click', () => { this.exitBtnClick(); });

    const statBtn = this.resultWindow.querySelector<HTMLElement>('.statistic_button')!;
    statBtn.addEventListener('click', () => { this.statisticBtnClick(); });

    const nextSprintBtn = this.resultWindow.querySelector<HTMLElement>('.next_button')!;
    nextSprintBtn.addEventListener('click', () => { this.nextSprintBtnClick(); });

    const gamesBtn = this.resultWindow.querySelector<HTMLElement>('.games_button')!;
    gamesBtn.addEventListener('click', () => { this.gamesBtnClick(); });

    const resultBtn = this.stasticWindow.querySelector<HTMLElement>('.result_button')!;
    resultBtn.addEventListener('click', () => { this.resultBtnClick(); });
  }

  sprintInit() {
    this.wordIdx = -1;
    this.points = 20;
    this.totalPoints = 0;
    this.series = 0;
    this.bestSeries = 0;
    this.timeOut = 60;
    this.question = {
      idx: -1, word: '', translate: '', result: true,
    };
  }

  nextQuestion(): void {
    this.wordIdx++;
    if (this.wordIdx >= this.words.length) this.wordIdx = 0;
    this.question.idx = this.wordIdx;
    this.question.word = this.words[this.question.idx].word;
    this.question.result = Math.floor(Math.random() * 2) > 0;
    if (this.question.result) {
      this.question.translate = this.words[this.question.idx].wordTranslate;
    } else {
      let idx = Math.floor(Math.random() * this.words.length);
      if (idx === this.question.idx) {
        idx++;
        if (idx >= this.words.length) idx = 0;
      }
      this.question.translate = this.words[idx].wordTranslate;
    }
    this.render();
  }

  render(): void {
    this.wordElem.textContent = this.question.word;
    this.translateElem.textContent = this.question.translate;
    this.pointsElem.textContent = `+${this.points}`;
    this.totalPointsElem.textContent = `${this.totalPoints}`;
    this.setStars();
  }

  setStars() {
    const stars = this.sprint.querySelectorAll<HTMLElement>('.point_buster_bar i');
    for (let i = 0; i < stars.length; i++) {
      if (i <= this.series) {
        stars[i].classList.remove('star-inactive');
        stars[i].classList.add('star-active');
      } else {
        stars[i].classList.remove('star-active');
        stars[i].classList.add('star-inactive');
      }
    }
  }

  setTime() {
    if (this.timeOut >= 0) {
      const timeElem = this.sprint.querySelector<HTMLElement>('.timer_paragr')!;
      timeElem.textContent = `${this.timeOut}`;
      this.timeOut--;
    } else {
      this.resultSprint();
    }
  }

  wrongBtnClick(): void {
    this.setAnsver(this.question.idx, !this.question.result);
    this.nextQuestion();
  }

  correctBtnClick(): void {
    this.setAnsver(this.question.idx, this.question.result);
    this.nextQuestion();
  }

  setAnsver(idx: number, result: boolean) {
    if (result) {
      this.words[idx].correctCnt++;
      this.audio.src = './images/correct.mp3';
      this.audio.play();
      this.series++;
      if (this.bestSeries < this.series) this.bestSeries = this.series;
      this.totalPoints += this.points;
      if (this.series < 4) this.points += 20;
    } else {
      this.words[idx].errorCnt++;
      this.audio.src = './images/error.mp3';
      this.audio.play();
      this.series = 0;
      this.points = 20;
    }
  }

  prepareWords(): void {
    this.sprintInit();
    this.words.splice(0, this.words.length);
    const words = this.rslcontroller.rslModel.textBook;
    for (let i = 0; i < this.rslcontroller.rslModel.textBook.length; i++) {
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
      };
      this.words.push(word);
    }

    this.nextQuestion();
    this.intervalId = setInterval(() => { this.setTime(); }, 1000);
  }

  exitBtnClick(): void {
    this.resultSprint();
  }

  resultSprint(): void {
    if (this.intervalId) clearInterval(this.intervalId);

    const resElem = this.resultWindow.querySelector<HTMLElement>('h3')!;
    resElem.textContent = `Ваш результат ${this.totalPoints} очков`;
    const seriesElem = this.resultWindow.querySelector<HTMLElement>('h4')!;
    seriesElem.textContent = `Длинна серии ${this.bestSeries}`;

    this.modalBody.style.visibility = 'visible';
    this.resultWindow.style.display = 'flex';
    this.stasticWindow.style.display = 'none';
  }

  statisticBtnClick(): void {
    this.stasticWindow.style.display = 'block';
    this.resultWindow.style.display = 'none';

    this.statisticRender();
  }

  nextSprintBtnClick(): void {
    this.modalBody.style.visibility = 'hidden';
    this.stasticWindow.style.display = 'none';
    this.resultWindow.style.display = 'none';
    this.prepareWords();
  }

  gamesBtnClick(): void {
    this.modalBody.style.visibility = 'hidden';
    this.stasticWindow.style.display = 'none';
    this.resultWindow.style.display = 'none';
    this.sprint.style.display = 'none';
    this.rslcontroller.gamesView.games.style.display = 'block';
  }

  resultBtnClick(): void {
    this.resultSprint();
  }

  statisticRender() {
    let audios = this.stasticWindow.querySelectorAll<HTMLElement>('i');
    for (let i = 0; i < audios.length; i++) {
      audios[i].removeEventListener('click', (e) => { this.statisticAudioClick(e); });
    }
    const resElem = this.stasticWindow.querySelector<HTMLElement>('h3')!;
    resElem.textContent = `Ваш результат ${this.totalPoints} очков`;
    const seriesElem = this.stasticWindow.querySelector<HTMLElement>('h4')!;
    seriesElem.textContent = `Длинна серии ${this.bestSeries}`;
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
export default SprintView;
