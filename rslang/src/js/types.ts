/* eslint-disable linebreak-style */
export type Word = {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string
};

export type AggrWord = {
  _id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string,
  userWord: {
    difficulty: string,
    optional: {
      state: string,
      correctCnt: number,
      incorrectCnt: number
    }
  }
};

export type User = {
  id: string,
  name: string,
  email: string,
  password: string,
  token: string
}

export type UserWord = {
  id: string,
  difficulty: string,
  optional: {
    state: string,
    correctCnt: number,
    incorrectCnt: number
  },
  wordId: string
}

export type UserWordOpt = {
  state: string,
  correctCnt: number,
  incorrectCnt: number
}

export default Word;
