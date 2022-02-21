/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/extensions */
import RslController from './rslcontroller.js';

class AuditionView {
  rslcontroller: RslController;
  audition: HTMLElement;
  evInit: boolean;

  constructor(rc: RslController) {
    this.rslcontroller = rc;

    this.audition = document.querySelector<HTMLElement>('.audition_page')!;
    this.evInit = false;
  }
}
export default AuditionView;
