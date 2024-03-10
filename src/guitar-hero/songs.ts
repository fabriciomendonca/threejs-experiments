import { Song } from "./types";

export const SONGS: Song[] = [
  {
    id: 1,
    title: "All of me",
    introTime: 4,
    duration: 36,
    bpm: 60,
    file: "all-of-me.mp3",
    notes: [
      { time: 4, lane: 1 },
      { time: 4.66, lane: 3 },
      { time: 5, lane: 2 },
      { time: 6, lane: 2 },
      { time: 7, lane: 2 },
      { time: 8, lane: 1 },
      { time: 9, lane: 1 },
      { time: 10, lane: 1 },
      { time: 11, lane: 2 },
      { time: 12, lane: 2 },
      { time: 12.66, lane: 4 },
      { time: 13, lane: 4 },
      { time: 14, lane: 4 },
      { time: 15, lane: 3 },
      { time: 16, lane: 2 },
      { time: 16.66, lane: 3 },
      { time: 17, lane: 2 },
      { time: 18, lane: 1 },
      { time: 19, lane: 2 },
      { time: 20, lane: 1 },
      { time: 20.66, lane: 1 },
      { time: 22, lane: 3 },
      { time: 23, lane: 3 },
      { time: 24, lane: 4 },
      { time: 24.66, lane: 2 },
      { time: 25, lane: 4 },
      { time: 26, lane: 2 },
      { time: 27, lane: 2 },
      { time: 28, lane: 3 },
      { time: 28.66, lane: 4 },
      { time: 29, lane: 1 },
      { time: 30, lane: 3 },
      { time: 31, lane: 4 },
      { time: 32, lane: 2 },
      { time: 32.66, lane: 1 },
      { time: 33, lane: 1 },
      { time: 34, lane: 3 },
      { time: 35, lane: 4 },
    ],
  },
  {
    id: 2,
    title: "All of me",
    introTime: 2,
    duration: 18,
    bpm: 120,
    file: "all-of-me-120bpm.mp3",
    notes: [
      { time: 2.0, lane: 1 },
      { time: 2.33, lane: 3 },
      { time: 2.5, lane: 2 },
      { time: 3, lane: 2 },
      { time: 3.5, lane: 2 },
      { time: 4, lane: 1 },
      { time: 4.5, lane: 1 },
      { time: 5, lane: 1 },
      { time: 5.5, lane: 2 },
      { time: 6, lane: 2 },
      { time: 6.33, lane: 4 },
      { time: 6.5, lane: 4 },
      { time: 7, lane: 4 },
      { time: 7.5, lane: 3 },
      { time: 8, lane: 2 },
      { time: 8.33, lane: 3 },
      { time: 8.5, lane: 2 },
      { time: 9, lane: 1 },
      { time: 9.5, lane: 2 },
      { time: 10, lane: 1 },
      { time: 10.33, lane: 1 },
      { time: 11, lane: 3 },
      { time: 11.5, lane: 3 },
      { time: 12, lane: 4 },
      { time: 12.33, lane: 2 },
      { time: 12.5, lane: 4 },
      { time: 13, lane: 2 },
      { time: 13.5, lane: 2 },
      { time: 14, lane: 3 },
      { time: 14.33, lane: 4 },
      { time: 14.5, lane: 1 },
      { time: 15, lane: 3 },
      { time: 15.5, lane: 4 },
      { time: 16, lane: 2 },
      { time: 16.33, lane: 1 },
      { time: 16.5, lane: 1 },
      { time: 17, lane: 3 },
      { time: 17.5, lane: 4 },
    ],
  },
  {
    id: 3,
    title: "All of me",
    introTime: 3,
    duration: 28,
    bpm: 78,
    file: "all-of-me-78bpm.mp3",
    notes: [
      // quarter note 0.769
      // triplet 0.256
      // Swing add 0.512
      { time: 3.0, lane: 1 },
      { time: 3.512, lane: 3 },
      { time: 3.769, lane: 2 },
      { time: 4.448, lane: 2 },
      { time: 5.217, lane: 2 },
      { time: 5.986, lane: 1 },
      { time: 6.775, lane: 1 },
      { time: 7.524, lane: 1 },
      { time: 8.293, lane: 2 },
      { time: 9.062, lane: 2 },
      // { time: 6.33, lane: 4 },
      // { time: 6.5, lane: 4 },
      // { time: 7, lane: 4 },
      // { time: 7.5, lane: 3 },
      // { time: 8, lane: 2 },
      // { time: 8.33, lane: 3 },
      // { time: 8.5, lane: 2 },
      // { time: 9, lane: 1 },
      // { time: 9.5, lane: 2 },
      // { time: 10, lane: 1 },
      // { time: 10.33, lane: 1 },
      // { time: 11, lane: 3 },
      // { time: 11.5, lane: 3 },
      // { time: 12, lane: 4 },
      // { time: 12.33, lane: 2 },
      // { time: 12.5, lane: 4 },
      // { time: 13, lane: 2 },
      // { time: 13.5, lane: 2 },
      // { time: 14, lane: 3 },
      // { time: 14.33, lane: 4 },
      // { time: 14.5, lane: 1 },
      // { time: 15, lane: 3 },
      // { time: 15.5, lane: 4 },
      // { time: 16, lane: 2 },
      // { time: 16.33, lane: 1 },
      // { time: 16.5, lane: 1 },
      // { time: 17, lane: 3 },
      // { time: 17.5, lane: 4 },
    ],
  },
  {
    id: 4,
    title: "Rock in Rio",
    introTime: 0.634,
    duration: 13,
    bpm: 146,
    file: "rock-in-rio-refrao.mp3",
    notes: [
      {
        time: 0.634,
        lane: 1,
      },
      {
        time: 0.834,
        lane: 2,
      },
      // {
      //   time: 1.034,
      //   lane: 3,
      // },
      {
        time: 1.234,
        lane: 3,
      },
      {
        time: 2.234,
        lane: 1,
      },
      {
        time: 2.434,
        lane: 2,
      },
      // {
      //   time: 2.634,
      //   lane: 3,
      // },
      {
        time: 2.834,
        lane: 3,
      },
      {
        time: 3.834,
        lane: 1,
      },
      {
        time: 4.034,
        lane: 2,
      },
      // {
      //   time: 4.234,
      //   lane: 3,
      // },
      {
        time: 4.434,
        lane: 3,
      },
      {
        time: 4.834,
        lane: 3,
      },
      {
        time: 5.234,
        lane: 3,
      },
      {
        time: 5.634,
        lane: 3,
      },
      // {
      //   time: 5.834,
      //   lane: 3,
      // },
      // wait 0.2 + 0.4 + 0.4 = 1s
      // starts at 6.834
      {
        time: 6.834,
        lane: 1,
      },
      {
        time: 7.034,
        lane: 2,
      },
      // {
      //   time: 7.234,
      //   lane: 3,
      // },
      {
        time: 7.434,
        lane: 3,
      },
      {
        time: 8.434,
        lane: 1,
      },
      {
        time: 8.634,
        lane: 2,
      },
      // {
      //   time: 8.834,
      //   lane: 3,
      // },
      {
        time: 9.034,
        lane: 3,
      },
      {
        time: 10.034,
        lane: 1,
      },
      {
        time: 10.234,
        lane: 2,
      },
      // {
      //   time: 10.434,
      //   lane: 3,
      // },
      {
        time: 10.634,
        lane: 3,
      },
      {
        time: 11.034,
        lane: 3,
      },
      {
        time: 11.434,
        lane: 3,
      },
      {
        time: 11.834,
        lane: 3,
      },
      // {
      //   time: 12.034,
      //   lane: 3,
      // },
    ],
  },
];

// 24.79 --- 999
// y --- x

// 999y = 24.79x
// 999 * y / 24.79

// 15.74 * 999 / 24.79 =

// 150 bpm -> 2.5bps
//
