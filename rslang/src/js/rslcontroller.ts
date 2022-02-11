/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
import RslModel from './rslmodel.js';
import MainView from './mainview.js';
import TextBookView from './textbookview.js';
import TbWordsView from './tbwordsview.js';

class RslController {
  rslModel: RslModel;
  tbWordsView: TbWordsView;
  textBookView: TextBookView;
  mainView: MainView;

  constructor() {
    this.rslModel = new RslModel(this);
    this.mainView = new MainView(this);
    this.textBookView = new TextBookView(this);
    this.tbWordsView = new TbWordsView(this);
    //this.getWords();
  }

  async getWords(): Promise<void> {
    await this.rslModel.getWords(this.rslModel.group, this.rslModel.page);
    this.tbWordsView.render(this.rslModel.textBook);
  }

  async createUser(user: { name: string, email: string, password: string}): Promise<void> {
    await this.rslModel.createUser(user);
  }

  async logInUser(user: { email: string, password: string}): Promise<void> {
    await this.rslModel.logInUser(user);
  }

  setGroup(cnt: number): void {
    if (this.rslModel.group >= 0 && this.rslModel.group <= 5) { this.rslModel.group = cnt; }
  }

  nextWordsPage(): void {
    if (this.rslModel.page < 29) {
      this.rslModel.page++;
      this.getWords();
    }
  }

  prevWordsPage(): void {
    if (this.rslModel.page > 0) {
      this.rslModel.page--;
      this.getWords();
    }
  }

  setPage(cnt: number): void {
    if (this.rslModel.page >= 0 && this.rslModel.page <= 29) { this.rslModel.page = cnt; }
  }

  nexWord(): void {
    if (this.rslModel.currWord < 19) { this.rslModel.currWord++; }
  }

  prevWord(): void {
    if (this.rslModel.currWord > 0) { this.rslModel.currWord--; }
  }

  setWord(cnt: number): void {
    if (cnt >= 0 && cnt <= 19) { this.rslModel.currWord = cnt; }
  }

  audioClick(e: MouseEvent): void {
    const elem = <HTMLElement>e.currentTarget;
    const id = elem.getAttribute('data-id');
    if (id) {
      this.rslModel.currWord = +id;
      this.rslModel.playAudio();
    }
  }

  tbLevelClick(e: MouseEvent): void {
    const elem = <HTMLElement>e.currentTarget;
    const id = elem.getAttribute('data-id');
    if (id) {
      this.rslModel.group = +id;
      this.rslModel.page = 0;
      this.getWords();
    }
  }
}
export default RslController;
