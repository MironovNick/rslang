import RslController from './rslcontroller.js';
import {
  Word, AggrWord, User, UserWord,
} from './types';

class RslModel {
  serverUrl: string;
  rslController: RslController;
  group: number;
  page: number;
  pages: number [];
  levelRsl: number;
  textBook: AggrWord [];
  tmpWords: Word [];
  tmpUserWords: UserWord [];
  currWord: number;
  user: User;
  audio = new Audio();
  audioTrackNum = -1;

  constructor(rc: RslController) {
    this.serverUrl = 'https://react-learnwords-example-1988.herokuapp.com';
    this.rslController = rc;
    this.group = 0;
    this.page = 0;
    this.levelRsl = 0;
    this.pages = [0, 0, 0, 0, 0, 0, 0];
    this.textBook = [];
    this.tmpWords = [];
    this.tmpUserWords = [];
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
    } else if (this.audioTrackNum === 1) {
      this.audio.src = `${this.serverUrl}/${this.textBook[this.currWord].audioExample}`;
      this.audioTrackNum = -1;
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  async getTmpWords(group: number, page: number): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/words?group=${group}&page=${page}`, {
        method: 'GET',
      });
      if (response.ok) {
        this.tmpWords = await response.json();
      } else {
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  async getUserWordsAll(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/users/${userId}/words`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        this.tmpUserWords = await response.json();
      } else {
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  async createUser(user: { name: string, email: string, password: string}): Promise<void> {
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
      } else {
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  async logInUser(user: { email: string, password: string}): Promise<void> {
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
      } else {
        this.user.token = '';
        this.user.id = '';
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  async createUserWord(idx: number, diff: string): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/users/${this.user.id}/words/${this.tmpWords[idx].id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty: diff, optional: { state: 'learn', correctCnt: 0, incorrectCnt: 0 } }),
      });
      if (response.ok) {
        const newWord = await response.json();
      } else {
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  async updateUserWord(idx: number): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/users/${this.user.id}/words/${this.textBook[idx]._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty: 'learn',
          optional: {
            state: this.textBook[idx].userWord.optional.state,
            correctCnt: this.textBook[idx].userWord.optional.correctCnt,
            incorrectCnt: this.textBook[idx].userWord.optional.incorrectCnt,
          },
        }),
      });
      if (response.ok) {
        const newWord = await response.json();
      } else {
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  async deleteUserWord(wordId: string): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/users/${this.user.id}/words/${wordId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });
      if (!response.ok) {
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  async getUserAggregatedWords(params: string): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/users/${this.user.id}/aggregatedWords${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.user.token}`,
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        const words = await response.json();
        if (words.length > 0) {
          this.textBook = words[0].paginatedResults;
        }
      } else {
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  }
}
export default RslModel;
