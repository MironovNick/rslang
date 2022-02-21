class GamesView {
    constructor(rc) {
        this.rslcontroller = rc;
        this.games = document.querySelector('.games_page');
        this.evInit = false;
        this.evetsInit();
    }
    evetsInit() {
        if (this.evInit)
            return;
        const main = this.games.querySelector('.main_page_ref');
        main?.addEventListener('click', () => { this.mainMenuClick(); });
        const textBook = this.games.querySelector('.textbook_page_ref');
        textBook?.addEventListener('click', () => { this.textBookClick(); });
        const sprint = this.games.querySelector('.sprint');
        sprint?.addEventListener('click', () => { this.sprintClick(); });
        const audition = this.games.querySelector('.audition');
        audition?.addEventListener('click', () => { this.auditionClick(); });
    }
    mainMenuClick() {
        this.games.style.display = 'none';
        this.rslcontroller.mainView.main.style.display = 'block';
    }
    textBookClick() {
        this.games.style.display = 'none';
        this.rslcontroller.textBookView.textBook.style.display = 'block';
    }
    sprintClick() {
        this.games.style.display = 'none';
        this.rslcontroller.sprintView.sprint.style.display = 'block';
        this.rslcontroller.sprintView.prepareWords();
    }
    auditionClick() {
        this.games.style.display = 'none';
        this.rslcontroller.auditionView.audition.style.display = 'block';
    }
}
export default GamesView;
