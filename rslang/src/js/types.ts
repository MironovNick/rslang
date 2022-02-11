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

export type User = {
  id: string,
  name: string,
  email: string,
  password: string,
  token: string
}

export type UserWordOpt = {
  state: string,
  correctCnt: number,
  incorrectCnt: number
}

export default Word;
