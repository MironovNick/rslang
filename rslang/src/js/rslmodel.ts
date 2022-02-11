/* eslint-disable linebreak-style */
/* eslint-disable import/named */
/* eslint-disable no-plusplus */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
import RslController from './rslcontroller.js';
import { Word, User, UserWordOpt } from './types';

class RslModel {
  serverUrl: string;
  racecontroller: RslController;
  group: number;
  page: number;
  textBook: Word [];
  currWord: number;
  user: User;
  audio = new Audio();
  audioTrackNum = -1;

  constructor(rc: RslController) {
    this.serverUrl = 'http://localhost:27027';
    this.racecontroller = rc;
    this.group = 0;
    this.page = 0;
    this.textBook = [];
    this.currWord = 0;
    this.user = {
      id: '', name: '', email: '', password: '', token: '',
    };

    //this.getWords(this.group, this.page);
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

  async getWords(group: number, page: number): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/words?group=${group}&page=${page}`, {
        method: 'GET',
      });
      if (response.ok) {
        this.textBook = await response.json();
      } else {
        // eslint-disable-next-line no-console
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка:', error);
    }
  }

  async getUserWords(userId: string, token: string): Promise<void> {
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
      } else {
        // eslint-disable-next-line no-console
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка:', error);
    }
  }

  async createWord(userId: string, wordId: string, token: string, diff: string): Promise<void> {
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
      } else {
        // eslint-disable-next-line no-console
        console.error('Ошибка:', response.status);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка:', error);
    }
  }
}
export default RslModel;
