class TextBookView {
    constructor(rc) {
        this.rslcontroller = rc;
        this.textBook = document.querySelector('.textbook_page');
        this.evInit = false;
        this.evetsInit();
    }
    evetsInit() {
        if (this.evInit)
            return;
        this.evInit = true;
        const levels = this.textBook.querySelectorAll('.level_box');
        for (let i = 0; i < levels.length; i++) {
            levels[i].setAttribute('data-id', `${i}`);
            levels[i].addEventListener('click', (e) => {
                this.levelClick(e);
            });
        }
    }
    levelClick(e) {
        this.textBook.style.display = 'none';
        this.rslcontroller.tbWordsView.textBookWords.style.display = 'block';
        this.rslcontroller.tbLevelClick(e);
    }
}
export default TextBookView;
