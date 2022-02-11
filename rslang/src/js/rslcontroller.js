import RslModel from './rslmodel.js';
import MainView from './mainview.js';
import TextBookView from './textbookview.js';
import TbWordsView from './tbwordsview.js';
class RslController {
    constructor() {
        this.rslModel = new RslModel(this);
        this.mainView = new MainView(this);
        this.textBookView = new TextBookView(this);
        this.tbWordsView = new TbWordsView(this);
    }
    async getWords() {
        await this.rslModel.getWords(this.rslModel.group, this.rslModel.page);
        this.tbWordsView.render(this.rslModel.textBook);
    }
    async createUser(user) {
        await this.rslModel.createUser(user);
    }
    async logInUser(user) {
        await this.rslModel.logInUser(user);
    }
    setGroup(cnt) {
        if (this.rslModel.group >= 0 && this.rslModel.group <= 5) {
            this.rslModel.group = cnt;
        }
    }
    nextWordsPage() {
        if (this.rslModel.page < 29) {
            this.rslModel.page++;
            this.getWords();
        }
    }
    prevWordsPage() {
        if (this.rslModel.page > 0) {
            this.rslModel.page--;
            this.getWords();
        }
    }
    setPage(cnt) {
        if (this.rslModel.page >= 0 && this.rslModel.page <= 29) {
            this.rslModel.page = cnt;
        }
    }
    nexWord() {
        if (this.rslModel.currWord < 19) {
            this.rslModel.currWord++;
        }
    }
    prevWord() {
        if (this.rslModel.currWord > 0) {
            this.rslModel.currWord--;
        }
    }
    setWord(cnt) {
        if (cnt >= 0 && cnt <= 19) {
            this.rslModel.currWord = cnt;
        }
    }
    audioClick(e) {
        const elem = e.currentTarget;
        const id = elem.getAttribute('data-id');
        if (id) {
            this.rslModel.currWord = +id;
            this.rslModel.playAudio();
        }
    }
    tbLevelClick(e) {
        const elem = e.currentTarget;
        const id = elem.getAttribute('data-id');
        if (id) {
            this.rslModel.group = +id;
            this.rslModel.page = 0;
            this.getWords();
        }
    }
}
export default RslController;
