export type Note = {
  time: number;
  lane: number;
};

export type Song = {
  id: number;
  title: string;
  introTime: number;
  duration: number;
  bpm: number;
  file: string;
  notes: Note[];
};
