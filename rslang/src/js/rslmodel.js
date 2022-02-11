class RslModel {
    constructor(rc) {
        this.audio = new Audio();
        this.audioTrackNum = -1;
        this.serverUrl = 'http://localhost:27027';
        this.racecontroller = rc;
        this.group = 0;
        this.page = 0;
        this.textBook = [];
        this.currWord = 0;
        this.user = {
            id: '', name: '', email: '', password: '', token: '',
        };
        this.audio.onended = () => this.onEndPlay();
        this.audio.loop = false;
    }
    playAudio() {
        this.audioTrackNum = 0;
        this.audio.src = `${this.serverUrl}/${this.textBook[this.currWord].audio}`;
        this.audio.play();
    }
    onEndPlay() {
        if (this.audioTrackNum === 0) {
            this.audio.src = `${this.serverUrl}/${this.textBook[this.currWord].audioMeaning}`;
            this.audioTrackNum = 1;
            this.audio.play();
        }
        else if (this.audioTrackNum === 1) {
            this.audio.src = `${this.serverUrl}/${this.textBook[this.currWord].audioExample}`;
            this.audioTrackNum = -1;
            this.audio.play();
        }
        else {
            this.audio.pause();
        }
    }
    async getWords(group, page) {
        try {
            const response = await fetch(`${this.serverUrl}/words?group=${group}&page=${page}`, {
                method: 'GET',
            });
            if (response.ok) {
                this.textBook = await response.json();
            }
            else {
                console.error('Ошибка:', response.status);
            }
        }
        catch (error) {
            console.error('Ошибка:', error);
        }
    }
    async createUser(user) {
        try {
            const response = await fetch(`${this.serverUrl}/users`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
            });
            if (response.ok) {
                const newUser = await response.json();
                this.user.id = newUser.id;
                this.user.name = '';
                this.user.email = '';
                this.user.password = '';
                await this.logInUser({ email: user.email, password: user.password });
            }
            else {
                console.error('Ошибка:', response.status);
            }
        }
        catch (error) {
            console.error('Ошибка:', error);
        }
    }
    async logInUser(user) {
        try {
            const response = await fetch(`${this.serverUrl}/signin`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email, password: user.password }),
            });
            if (response.ok) {
                const logUser = await response.json();
                this.user.token = logUser.token;
                this.user.id = logUser.userId;
                this.user.name = logUser.name;
                this.user.email = user.email;
                this.user.password = user.password;
            }
            else {
                console.error('Ошибка:', response.status);
            }
        }
        catch (error) {
            console.error('Ошибка:', error);
        }
    }
    async getUserWords(userId, token) {
        try {
            const response = await fetch(`${this.serverUrl}/users/${userId}/words`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            if (response.ok) {
                const words = await response.json();
            }
            else {
                console.error('Ошибка:', response.status);
            }
        }
        catch (error) {
            console.error('Ошибка:', error);
        }
    }
    async createWord(userId, wordId, token, diff) {
        try {
            const response = await fetch(`${this.serverUrl}/users/${userId}/words/${wordId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ difficulty: diff, optional: { str: 'слово' } }),
            });
            if (response.ok) {
                const newWord = await response.json();
            }
            else {
                console.error('Ошибка:', response.status);
            }
        }
        catch (error) {
            console.error('Ошибка:', error);
        }
    }
}
export default RslModel;
