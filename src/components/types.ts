export class Level {
  level: number = 0;
  bpm: number = 0;
  randomSize: number[] = [];
  Lst: number[] = [];
}
export class High {
  startTime: number = 0;
  endTime: number = 0;
}
export class Song {
  name: string = "";
  url: string = "";
  imgUrl: string = "";
  nan: Level[] = [];
  startTime: number = 0;
  endTime: number = 0;
  time: number = 0;
  rpm: number = 0;
  bpm: number = 0;
  stepTime: number[] = [];
  tag: string = "";
}

export enum good {
  ok,
  great,
  perfact,
  miss,
}

export class Score {
  value: number = 0;
  len: number = 0;
  good: good = good.miss;
  constructor(n: number, g: good, l: number) {
    this.good = g;
    this.value = n;
    this.len = l;
  }
}
