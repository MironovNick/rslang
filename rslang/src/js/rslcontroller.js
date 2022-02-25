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
        if (localStorage.getItem('rslang_state')) {
            const data = localStorage.getItem('rslang_state');
            if (data) {
                const state = JSON.parse(data);
                this.rslModel.user = state.user;
                this.rslModel.group = state.group;
                this.rslModel.page = state.page;
                this.rslModel.levelRsl = state.levelRsl;
                this.logInUser({ email: this.rslModel.user.email, password: this.rslModel.user.password });
                if (this.rslModel.user.id && this.rslModel.user.token) {
                    this.mainView.loginBtn.textContent = 'выйти';
                }
                else {
                    this.mainView.loginBtn.textContent = 'войти';
                }
                this.viewUserNameAll();
                this.render();
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
    render() {
        if (this.getLevelRsl() === 1) {
            this.mainView.main.style.display = 'none';
            this.textBookView.textBook.style.display = 'block';
            this.textBookView.render();
        }
        else if (this.getLevelRsl() === 2) {
            this.mainView.main.style.display = 'none';
            this.tbWordsView.textBookWords.style.display = 'block';
            this.tbWordsView.expLevelBtnActivate(this.rslModel.group);
            if (this.rslModel.group < 6)
                this.getWords();
            else
                this.hardWordsView();
        }
    }
    setLocalStorage() {
        const state = {
            user: this.rslModel.user,
            group: this.rslModel.group,
            page: this.rslModel.page,
            levelRsl: this.rslModel.levelRsl,
        };
        localStorage.setItem('rslang_state', JSON.stringify(state));
    }
    async getWords() {
        if (this.rslModel.user.id) {
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
        }
        else {
            await this.getWhithoutUserWords(true);
        }
        if (this.getLevelRsl() === 2)
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
    async getWhithoutUserWords(clear) {
        if (clear) {
            this.rslModel.textBook.splice(0, this.rslModel.textBook.length);
        }
        await this.rslModel.getTmpWords(this.rslModel.group, this.rslModel.page);
        const tWords = this.rslModel.tmpWords;
        for (let i = 0; i < tWords.length; i++) {
            const word = {
                _id: tWords[i].id,
                group: tWords[i].group,
                page: tWords[i].page,
                word: tWords[i].word,
                image: tWords[i].image,
                audio: tWords[i].audio,
                audioMeaning: tWords[i].audioMeaning,
                audioExample: tWords[i].audioExample,
                textMeaning: tWords[i].textMeaning,
                textExample: tWords[i].textExample,
                transcription: tWords[i].transcription,
                textExampleTranslate: tWords[i].textExampleTranslate,
                textMeaningTranslate: tWords[i].textMeaningTranslate,
                wordTranslate: tWords[i].wordTranslate,
                userWord: {
                    difficulty: 'learn',
                    optional: {
                        state: 'learn',
                        correctCnt: 0,
                        incorrectCnt: 0,
                    },
                },
            };
            this.rslModel.textBook.push(word);
        }
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
    gameLevelClick(e) {
        const elem = e.currentTarget;
        const id = elem.getAttribute('data-id');
        if (id) {
            this.rslModel.group = +id;
            this.rslModel.page = Math.floor(Math.random() * 30);
            this.gamesView.expLevelBtnActivate(this.rslModel.group);
            this.getWords();
        }
    }
    async deleteUserWordsAll(userId) {
        this.rslModel.tmpUserWords.splice(0, this.rslModel.tmpUserWords.length);
        await this.rslModel.getUserWordsAll(userId);
        const promArr = [];
        const words = this.rslModel.tmpUserWords;
        for (let i = 0; i < words.length; i++) {
            promArr.push(this.rslModel.deleteUserWord(words[i].wordId));
        }
        await Promise.all(promArr);
        this.rslModel.tmpUserWords.splice(0, this.rslModel.tmpUserWords.length);
    }
    async createUserWord(idx, diff) {
        await this.rslModel.createUserWord(idx, diff);
    }
    async updateStateUserWord(idx, state) {
        this.rslModel.textBook[idx].userWord.optional.state = state;
        await this.rslModel.updateUserWord(idx);
    }
    async updateUserWords() {
        if (!this.rslModel.user.id || !this.rslModel.user.token)
            return;
        const promArr = [];
        for (let i = 0; i < this.rslModel.textBook.length; i++) {
            promArr.push(this.rslModel.updateUserWord(i));
        }
        await Promise.all(promArr);
    }
    isHardWord(idx) {
        return this.rslModel.textBook[idx].userWord.optional.state === 'hard';
    }
    isEasyWord(idx) {
        return this.rslModel.textBook[idx].userWord.optional.state === 'easy';
    }
    setLevelRsl(levelRsl) {
        this.rslModel.levelRsl = levelRsl;
    }
    getLevelRsl() {
        return this.rslModel.levelRsl;
    }
}
export default RslController;
