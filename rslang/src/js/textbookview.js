class TextBookView {
    constructor(rc) {
        this.rslcontroller = rc;
        this.textBook = document.querySelector('.textbook_page');
        this.levelContent = this.textBook.querySelector('.textbook_page_content_right');
        this.evInit = false;
        this.evetsInit();
    }
    evetsInit() {
        if (this.evInit)
            return;
        const main = this.textBook.querySelector('.main_page_ref');
        main?.addEventListener('click', () => { this.mainMenuClick(); });
        const hardWords = this.textBook.querySelector('.unit_page_diff_words_ref');
        hardWords?.addEventListener('click', () => {
            this.hardWorsdMenuClick();
        });
        const games = this.textBook.querySelector('.games_page_ref');
        games.addEventListener('click', () => {
            this.textBook.style.display = 'none';
            this.rslcontroller.gamesView.games.style.display = 'block';
            this.rslcontroller.gamesView.render();
        });
        this.evInit = true;
        const levels = this.textBook.querySelectorAll('.level_box');
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
    render() {
        const hardWords = this.textBook.querySelector('.unit_page_diff_words_ref');
        if (this.rslcontroller.rslModel.user.id && this.rslcontroller.rslModel.user) {
            hardWords.style.display = 'block';
        }
        else {
            hardWords.style.display = 'none';
        }
    }
    levelClick(e) {
        this.textBook.style.display = 'none';
        this.rslcontroller.tbWordsView.textBookWords.style.display = 'block';
        this.rslcontroller.tbLevelClick(e);
        this.rslcontroller.setLevelRsl(2);
    }
    mainMenuClick() {
        this.textBook.style.display = 'none';
        this.rslcontroller.mainView.main.style.display = 'block';
        this.rslcontroller.setLevelRsl(0);
    }
    hardWorsdMenuClick() {
        this.textBook.style.display = 'none';
        this.rslcontroller.tbWordsView.textBookWords.style.display = 'block';
        this.rslcontroller.hardWordsView();
        this.rslcontroller.setLevelRsl(2);
    }
    levelMouseOver(e) {
        const levelNames = [
            '?????????????????? ?????????????? A1',
            '???????????????????????? ?????????????? A2',
            '?????????????? ?????????????? B1',
            '????????????-?????????????????????? ?????????????? B2',
            '?????????????????????? ?????????????? C1',
            '???????????????? ?? ???????????????????????? C2',
        ];
        const elem = e.currentTarget;
        const id = elem.getAttribute('data-id');
        if (id) {
            const img = this.levelContent.querySelector('div');
            img.style.backgroundImage = `url(./images/${(+id + 1)}.jpg)`;
            const name = this.levelContent.querySelector('h4');
            name.textContent = levelNames[+id];
        }
    }
}
export default TextBookView;
