class SprintView {
    constructor(rc) {
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
        this.sprint = document.querySelector('.sprint_page');
        this.modalBody = this.sprint.querySelector('.modal_body');
        this.resultWindow = this.sprint.querySelector('#result_window');
        this.stasticWindow = this.sprint.querySelector('#stastic_window');
        this.wordElem = this.sprint.querySelector('.sprint_question_word');
        this.translateElem = this.sprint.querySelector('.sprint_question_translate');
        this.pointsElem = this.sprint.querySelector('.points');
        this.totalPointsElem = this.sprint.querySelector('.total_points');
        this.evInit = false;
        this.evetsInit();
        this.intervalId = null;
    }
    evetsInit() {
        if (this.evInit)
            return;
        const wrongBtn = this.sprint.querySelector('.wrong_button');
        wrongBtn.addEventListener('click', () => { this.wrongBtnClick(); });
        const correctBtn = this.sprint.querySelector('.correct_button');
        correctBtn.addEventListener('click', () => { this.correctBtnClick(); });
        const exitBtn = this.sprint.querySelector('.exit_button');
        exitBtn.addEventListener('click', () => { this.exitBtnClick(); });
        const statBtn = this.resultWindow.querySelector('.statistic_button');
        statBtn.addEventListener('click', () => { this.statisticBtnClick(); });
        const nextSprintBtn = this.resultWindow.querySelector('.next_button');
        nextSprintBtn.addEventListener('click', () => { this.nextSprintBtnClick(); });
        const gamesBtn = this.resultWindow.querySelector('.games_button');
        gamesBtn.addEventListener('click', () => { this.gamesBtnClick(); });
        const resultBtn = this.stasticWindow.querySelector('.result_button');
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
    nextQuestion() {
        if (this.words.length < 2) {
            this.gamesBtnClick();
            return;
        }
        this.wordIdx++;
        if (this.wordIdx >= this.words.length)
            this.wordIdx = 0;
        this.question.idx = this.wordIdx;
        this.question.word = this.words[this.question.idx].word;
        this.question.result = Math.floor(Math.random() * 2) > 0;
        if (this.question.result) {
            this.question.translate = this.words[this.question.idx].wordTranslate;
        }
        else {
            let idx = Math.floor(Math.random() * this.words.length);
            if (idx === this.question.idx) {
                idx++;
                if (idx >= this.words.length)
                    idx = 0;
            }
            this.question.translate = this.words[idx].wordTranslate;
        }
        this.render();
    }
    render() {
        this.wordElem.textContent = this.question.word;
        this.translateElem.textContent = this.question.translate;
        this.pointsElem.textContent = `+${this.points}`;
        this.totalPointsElem.textContent = `${this.totalPoints}`;
        this.setStars();
    }
    setStars() {
        const stars = this.sprint.querySelectorAll('.point_buster_bar i');
        for (let i = 0; i < stars.length; i++) {
            if (i <= this.series) {
                stars[i].classList.remove('star-inactive');
                stars[i].classList.add('star-active');
            }
            else {
                stars[i].classList.remove('star-active');
                stars[i].classList.add('star-inactive');
            }
        }
    }
    setTime() {
        if (this.timeOut >= 0) {
            const timeElem = this.sprint.querySelector('.timer_paragr');
            timeElem.textContent = `${this.timeOut}`;
            this.timeOut--;
        }
        else {
            this.resultSprint();
            this.updateResult();
        }
    }
    wrongBtnClick() {
        this.setAnsver(this.question.idx, !this.question.result);
        this.nextQuestion();
    }
    correctBtnClick() {
        this.setAnsver(this.question.idx, this.question.result);
        this.nextQuestion();
    }
    setAnsver(idx, result) {
        if (result) {
            this.words[idx].correctCnt++;
            this.audio.src = './images/correct.mp3';
            this.audio.play();
            this.series++;
            if (this.bestSeries < this.series)
                this.bestSeries = this.series;
            this.totalPoints += this.points;
            if (this.series < 4)
                this.points += 20;
        }
        else {
            this.words[idx].errorCnt++;
            this.audio.src = './images/error.mp3';
            this.audio.play();
            this.series = 0;
            this.points = 20;
        }
    }
    prepareWords() {
        this.sprintInit();
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
        if (this.words.length > 1) {
            this.intervalId = setInterval(() => { this.setTime(); }, 1000);
        }
    }
    exitBtnClick() {
        this.resultSprint();
    }
    resultSprint() {
        if (this.intervalId)
            clearInterval(this.intervalId);
        const resElem = this.resultWindow.querySelector('h3');
        resElem.textContent = `?????? ?????????????????? ${this.totalPoints} ??????????`;
        const seriesElem = this.resultWindow.querySelector('h4');
        seriesElem.textContent = `???????????? ?????????? ${this.bestSeries}`;
        this.modalBody.style.visibility = 'visible';
        this.resultWindow.style.display = 'flex';
        this.stasticWindow.style.display = 'none';
    }
    async updateResult() {
        if (!this.rslcontroller.rslModel.user.id || !this.rslcontroller.rslModel.user.token)
            return;
        const words = this.rslcontroller.rslModel.textBook;
        for (let i = 0; i < this.words.length; i++) {
            words[this.words[i].idx].userWord.optional.correctCnt += this.words[i].correctCnt;
            words[this.words[i].idx].userWord.optional.incorrectCnt += this.words[i].errorCnt;
        }
        await this.rslcontroller.updateUserWords();
    }
    statisticBtnClick() {
        this.stasticWindow.style.display = 'block';
        this.resultWindow.style.display = 'none';
        this.statisticRender();
    }
    nextSprintBtnClick() {
        this.modalBody.style.visibility = 'hidden';
        this.stasticWindow.style.display = 'none';
        this.resultWindow.style.display = 'none';
        this.prepareWords();
    }
    gamesBtnClick() {
        this.modalBody.style.visibility = 'hidden';
        this.stasticWindow.style.display = 'none';
        this.resultWindow.style.display = 'none';
        this.sprint.style.display = 'none';
        this.rslcontroller.gamesView.games.style.display = 'block';
    }
    resultBtnClick() {
        this.resultSprint();
    }
    statisticRender() {
        let audios = this.stasticWindow.querySelectorAll('i');
        for (let i = 0; i < audios.length; i++) {
            audios[i].removeEventListener('click', (e) => { this.statisticAudioClick(e); });
        }
        const resElem = this.stasticWindow.querySelector('h3');
        resElem.textContent = `?????? ?????????????????? ${this.totalPoints} ??????????`;
        const seriesElem = this.stasticWindow.querySelector('h4');
        seriesElem.textContent = `???????????? ?????????? ${this.bestSeries}`;
        const table = this.stasticWindow.querySelector('.statistic_table');
        table.innerHTML = '';
        let s = '<h5 class="mistakes_title">????????????: </h5>';
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].errorCnt > 0) {
                s += this.statisticRowHTML(i);
            }
        }
        s += '<h5 class="answers_title">??????????????: </h5>';
        for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].correctCnt > 0) {
                s += this.statisticRowHTML(i);
            }
        }
        table.innerHTML = s;
        audios = this.stasticWindow.querySelectorAll('i');
        for (let i = 0; i < audios.length; i++) {
            audios[i].addEventListener('click', (e) => { this.statisticAudioClick(e); });
        }
    }
    statisticRowHTML(idx) {
        const res = '<div class="statistic_table_row">'
            + `<i class="fas fa-volume-up fas_statistic_table" data-id="${idx}"></i>`
            + `<p>${this.words[idx].word}</p>`
            + '<p> - </p>'
            + `<p>${this.words[idx].wordTranslate}</p>`
            + '</div>';
        return res;
    }
    statisticAudioClick(e) {
        const elem = e.currentTarget;
        if (!elem)
            return;
        const idx = elem.getAttribute('data-id');
        if (idx) {
            this.audio.src = `${this.rslcontroller.rslModel.serverUrl}/${this.words[+idx].audio}`;
            this.audio.play();
        }
    }
}
export default SprintView;
