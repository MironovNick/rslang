import RslModel from './rslmodel.js';
import MainView from './mainview.js';
import TextBookView from './textbookview.js';
import TbWordsView from './tbwordsview.js';
import GamesView from './gamesview.js';
import SprintView from './sprintview.js';
import AuditionView from './auditionview.js';
class RslController {
    constructor() {
        this.rslModel = new RslModel(this);
        this.mainView = new MainView(this);
        this.textBookView = new TextBookView(this);
        this.tbWordsView = new TbWordsView(this);
        this.gamesView = new GamesView(this);
        this.sprintView = new SprintView(this);
        this.auditionView = new AuditionView(this);
        window.addEventListener('beforeunload', () => this.setLocalStorage());
        this.getLocalStorage();
    }
    getLocalStorage() {
        if (localStorage.getItem('rslang_user')) {
            const data = localStorage.getItem('rslang_user');
            if (data) {
                this.rslModel.user = JSON.parse(data);
                this.logInUser({ email: this.rslModel.user.email, password: this.rslModel.user.password });
                if (this.rslModel.user.id && this.rslModel.user.token) {
                    this.mainView.loginBtn.textContent = 'выйти';
                }
                else {
                    this.mainView.loginBtn.textContent = 'войти';
                }
                this.viewUserNameAll();
            }
        }
    }
    viewUserNameAll() {
        const nameElems = document.querySelectorAll('.user_name');
        let name = '';
        if (this.rslModel.user.id && this.rslModel.user.token) {
            name = this.rslModel.user.name;
        }
        for (let i = 0; i < nameElems.length; i++) {
            nameElems[i].textContent = name;
        }
    }
    setLocalStorage() {
        localStorage.setItem('rslang_user', JSON.stringify(this.rslModel.user));
    }
    async getWords() {
        await this.getUserWords(true);
        if (this.rslModel.textBook.length === 0) {
            await this.rslModel.getTmpWords(this.rslModel.group, this.rslModel.page);
            const promArr = [];
            for (let i = 0; i < this.rslModel.tmpWords.length; i++) {
                promArr.push(this.rslModel.createUserWord(i, 'learn'));
            }
            await Promise.all(promArr);
            await this.getUserWords(false);
            this.rslModel.tmpWords.splice(0, this.rslModel.tmpWords.length);
        }
        this.tbWordsView.render(this.rslModel.textBook);
    }
    async getUserWords(clear) {
        if (clear) {
            this.rslModel.textBook.splice(0, this.rslModel.textBook.length);
        }
        const params = `?wordsPerPage=20&filter={"$and":[{"userWord.difficulty":"learn", "group":${this.rslModel.group}, "page":${this.rslModel.page}}]}`;
        await this.rslModel.getUserAggregatedWords(params);
    }
    async hardWordsView() {
        this.rslModel.textBook.splice(0, this.rslModel.textBook.length);
        await this.rslModel.getUserAggregatedWords('?wordsPerPage=40&filter={"$and":[{"userWord.difficulty":"learn", "userWord.optional.state":"hard"}]}');
        this.rslModel.group = 6;
        this.tbWordsView.expLevelBtnActivate(this.rslModel.group);
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
            this.rslModel.pages[this.rslModel.group] = this.rslModel.page;
            this.getWords();
        }
    }
    prevWordsPage() {
        if (this.rslModel.page > 0) {
            this.rslModel.page--;
            this.rslModel.pages[this.rslModel.group] = this.rslModel.page;
            this.getWords();
        }
    }
    setPage(cnt) {
        if (this.rslModel.page >= 0 && this.rslModel.page <= 29) {
            this.rslModel.page = cnt;
            this.rslModel.pages[this.rslModel.group] = this.rslModel.page;
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
            this.rslModel.page = this.rslModel.pages[this.rslModel.group];
            this.tbWordsView.expLevelBtnActivate(this.rslModel.group);
            this.getWords();
        }
    }
    async deleteUserWord(idx, hardOrEasy) {
        await this.rslModel.deleteUserWord(idx);
        await this.getUserWords(hardOrEasy);
    }
    async createUserWord(idx, diff) {
        await this.rslModel.createUserWord(idx, diff);
    }
    async updateUserWord(idx, state) {
        this.rslModel.textBook[idx].userWord.optional.state = state;
        await this.rslModel.updateUserWord(idx);
    }
    isHardWord(idx) {
        return this.rslModel.textBook[idx].userWord.optional.state === 'hard';
    }
    isEasyWord(idx) {
        return this.rslModel.textBook[idx].userWord.optional.state === 'easy';
    }
}
export default RslController;
