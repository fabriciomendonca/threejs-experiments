export type Ticker = {
  id: number;
  render: (time: number) => void;
  tick: (time: number) => void;
};
