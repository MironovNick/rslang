class GamesView {
    constructor(rc) {
        this.rslcontroller = rc;
        this.games = document.querySelector('.games_page');
        this.evInit = false;
        this.levelSelected = false;
        this.evetsInit();
    }
    evetsInit() {
        if (this.evInit)
            return;
        const main = this.games.querySelector('.main_page_ref');
        main?.addEventListener('click', () => { this.mainMenuClick(); });
        const textBook = this.games.querySelector('.textbook_page_ref');
        textBook?.addEventListener('click', () => { this.textBookClick(); });
        const levelBtns = this.games.querySelectorAll('.experience_level_button');
        for (let i = 0; i < levelBtns.length; i++) {
            levelBtns[i].setAttribute('data-id', `${i}`);
            levelBtns[i].addEventListener('click', (e) => {
                this.rslcontroller.gameLevelClick(e);
                this.levelSelected = true;
            });
        }
        const sprint = this.games.querySelector('.sprint');
        sprint?.addEventListener('click', () => { this.sprintClick(); });
        const audition = this.games.querySelector('.audition');
        audition?.addEventListener('click', () => { this.auditionClick(); });
    }
    render() {
        const levelsElem = this.games.querySelector('.experience_level_bar');
        if (this.rslcontroller.getLevelRsl() > 1)
            levelsElem.style.display = 'none';
        else {
            levelsElem.style.display = 'flex';
            this.levelSelected = false;
            const levelBtns = this.games.querySelectorAll('.experience_level_button');
            for (let i = 0; i < levelBtns.length; i++) {
                const parent = levelBtns[i].parentElement;
                if (parent)
                    parent.className = 'experience_level_block';
            }
        }
    }
    mainMenuClick() {
        this.games.style.display = 'none';
        this.rslcontroller.mainView.main.style.display = 'block';
        this.rslcontroller.setLevelRsl(0);
    }
    textBookClick() {
        this.games.style.display = 'none';
        this.rslcontroller.textBookView.textBook.style.display = 'block';
        this.rslcontroller.textBookView.render();
        this.rslcontroller.setLevelRsl(1);
    }
    sprintClick() {
        if (this.rslcontroller.getLevelRsl() < 2 && !this.levelSelected)
            return;
        this.games.style.display = 'none';
        this.rslcontroller.sprintView.sprint.style.display = 'block';
        this.rslcontroller.sprintView.prepareWords();
    }
    auditionClick() {
        if (this.rslcontroller.getLevelRsl() < 2 && !this.levelSelected)
            return;
        this.games.style.display = 'none';
        this.rslcontroller.auditionView.audition.style.display = 'block';
        this.rslcontroller.auditionView.prepareWords();
    }
    expLevelBtnActivate(idx) {
        const levelBtns = this.games.querySelectorAll('.experience_level_button');
        for (let i = 0; i < levelBtns.length; i++) {
            const id = levelBtns[i].getAttribute('data-id');
            const parent = levelBtns[i].parentElement;
            if (id && parent) {
                if (idx !== +id) {
                    parent.className = 'experience_level_block';
                }
                else {
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
}
export default GamesView;
