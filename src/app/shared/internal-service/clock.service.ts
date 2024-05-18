import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClockService {
  // #region Global Variables
  private runningIndex: number;
  private testClocks = new BehaviorSubject<Clock[]>([]);
  private clocks: Clock[];
  private clockRemain: RunningClock[];
  private accumulatedTime: Clock;
  private timeRemaining: Clock;
  //#endregion

  //#region Anonimous Functions
  isAnyClock = (): boolean => this.clocks.length > 0 && this.clockRemain.length > 0;
  checkIfClockHasRemainingTime = (index: number): boolean => { let cI = this.clockRemain[index]; return cI.seconds !== 0 || cI.minutes !== 0 || cI.hours !== 0 }
  isClockRunning = (): boolean => this.runningIndex === -1;
  //#endregion

  constructor() {
    this.runningIndex = 0;
    this.clocks = [];
    this.clockRemain = [];
    this.accumulatedTime = { hours: 0, minutes: 0, seconds: 0 };
    this.timeRemaining = { hours: 0, minutes: 0, seconds: 0 };
    this.testClocks.next([{ hours: 0, minutes: 10, seconds: 5 }]);
  }

  //#region Externals APIs
  public getTestSubject(): BehaviorSubject<Clock[]> {
    return this.testClocks;
  }
  public play() {
    if (this.isAnyClock()) {
      this.runningIndex = 0;
      while (this.checkIfClockHasRemainingTime(this.runningIndex)) {
        this.runningIndex += 1;
      }
    }
    else
      return;

  }
  public stop() {
    this.runningIndex = -1;
  }
  public resetClocks() {
    this.runningIndex = -1;
    this.clockRemain = this.clocks;
  }
  public createClock(nClock: Clock) {
    this.clocks.concat(this.accomodateClock(nClock));
  }
  public addAddRunningClocks(nClock: Clock[] | Clock) {
    if (nClock instanceof Array) {
      nClock.map(x => this.accomodateClock(x));
    } else {
      nClock = this.accomodateClock(nClock);
    }

    this.clockRemain.concat(nClock);
  }
  public getClocks(): Clock[] {
    return this.clocks;
  }
  public getRemainings(): RunningClock[] {
    return this.clockRemain.map((x, i) => { x.clockStatus = i < this.runningIndex ? ClockStatus.done : i === this.runningIndex ? ClockStatus.running : ClockStatus.todo; return x });
  }
  public getAccumulated() {
    return this.accumulatedTime;
  }
  public getRemaining() {
    return this.timeRemaining;
  }
  public tic() {
    if (!this.isClockRunning())
      return;
    // Rest remining time
    this.clockRestSec();
    // Update time remainig
    this.updateRemainig();
  }
  //#endregion
  //#region Internal Operation
  private updateAccumulated() {
    var hours = this.clocks.map(x => x.hours).reduce((p, c) => p + c);
    var minutes = this.clocks.map(x => x.minutes).reduce((p, c) => p + c);
    var seconds = this.clocks.map(x => x.seconds).reduce((p, c) => p + c);

    minutes += seconds % 60;
    seconds = Math.floor(seconds / 60);
    hours += minutes % 60;
    minutes += Math.floor(minutes / 60);

    this.accumulatedTime = { hours: hours, minutes: minutes, seconds: seconds };
  }
  private updateRemainig() {
    var hours = this.clockRemain.map(x => x.hours).reduce((p, c) => p + c);
    var minutes = this.clockRemain.map(x => x.minutes).reduce((p, c) => p + c);
    var seconds = this.clockRemain.map(x => x.seconds).reduce((p, c) => p + c);

    minutes += seconds % 60;
    seconds = Math.floor(seconds / 60);
    hours += minutes % 60;
    minutes += Math.floor(minutes / 60);

    this.timeRemaining = { hours: hours, minutes: minutes, seconds: seconds };
  }
  private clockRestSec() {
    let actual = JSON.parse(JSON.stringify(this.clockRemain[this.runningIndex]));

    if (actual.seconds > 0) {
      actual.seconds -= 1;
      this.clockRemain = actual;
    }

    if (actual.minutes > 0 && actual.seconds === 0) {
      actual.minutes -= 1;
      actual.seconds = 59;
      this.clockRemain = actual;
    }

    if (actual.hours > 0 && actual.minutes === 0 && actual.seconds === 0) {
      actual.hours -= 1;
      actual.minutes = 59;
      actual.seconds = 59;
      this.clockRemain = actual;
    }

    if (actual.hours === 0 && actual.minutes === 0 && actual.seconds === 0) {
      this.runningIndex += 1;
    }
    if (this.runningIndex >= this.clockRemain.length) this.stop()
  }
  private accomodateClock(c: Clock): Clock {
    var result = JSON.parse(JSON.stringify(c))

    while (result.seconds > 59) {
      result.minutes += 1;
      result.seconds -= 59;
    }
    while (result.minutes > 59) {
      result.hours += 1;
      result.minutes -= 59;
    }

    return result;
  }
  //#endregion
}

export interface Clock {
  name?: string
  seconds: number
  minutes: number
  hours: number
}

export interface RunningClock extends Clock {
  clockStatus?: ClockStatus
}

export enum ClockStatus {
  done, running, todo
}