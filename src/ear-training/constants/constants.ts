export type Interval = {
  id: string;
  name: string;
  distance: number;
};

export const INTERVALS: Interval[] = [
  { id: "1J", name: "Primeira Justa", distance: 0 },
  { id: "2m", name: "Segunda Menor", distance: 1 },
  { id: "2M", name: "Segunda Maior", distance: 2 },
  { id: "3m", name: "Terça Menor", distance: 3 },
  { id: "3M", name: "Terça Maior", distance: 4 },
  { id: "4J", name: "Quarta Justa", distance: 5 },
  { id: "4aum", name: "Quarta Aumentada", distance: 6 },
  { id: "5dim", name: "Quinta Diminuta", distance: 6 },
  { id: "5J", name: "Quinta Justa", distance: 7 },
  { id: "5aum", name: "Quinta Aumentada", distance: 8 },
  { id: "6m", name: "Sexta Menor", distance: 8 },
  { id: "6M", name: "Sexta Maior", distance: 9 },
  { id: "7", name: "Sétima Menor", distance: 10 },
  { id: "7M", name: "Sétima Maior", distance: 11 },
  { id: "8J", name: "Oitava Justa", distance: 12 },
  { id: "9m", name: "Nona Menor", distance: 13 },
  { id: "9M", name: "Nona Maior", distance: 14 },
  { id: "9aum", name: "Nona Aumentada", distance: 15 },
  { id: "10m", name: "Décima Menor", distance: 15 },
  { id: "10M", name: "Décima Maior", distance: 16 },
  { id: "11J", name: "Décima primeira Justa", distance: 17 },
  { id: "11aum", name: "Décima primeira Aumentada", distance: 18 },
  { id: "13m", name: "Décima terceira Menor", distance: 20 },
  { id: "13M", name: "Décima terceira Maior", distance: 21 },
];

const easy = ["1J", "2m", "2M", "3m", "3M", "4J", "5J", "8J"];
const normal = [...easy, "4aum", "5dim", "6m", "6M", "7", "7M"];
const hard = [
  ...normal,
  "9m",
  "9M",
  "9aum",
  "10m",
  "10M",
  "11J",
  "11aum",
  "13m",
  "13M",
];

export type LevelName = "easy" | "normal" | "hard";
export type Level = {
  intervals: string[];
  totalAnswers: number;
};
export const LEVELS: Record<LevelName, Level> = {
  easy: {
    intervals: easy,
    totalAnswers: 100,
  },
  normal: {
    intervals: normal,
    totalAnswers: 150,
  },
  hard: {
    intervals: hard,
    totalAnswers: 200,
  },
};

export type AudioLib = {
  id: number;
  instrument: string;
  firstNote: number;
  lastNote: number;
  folder: string;
};

export const AUDIO_LIBS: AudioLib[] = [
  {
    id: 1,
    instrument: "bass",
    firstNote: 35,
    lastNote: 79,
    folder: "audio/bass",
  },
];
