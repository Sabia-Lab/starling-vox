type Question = Record<
  string,
  {
    description: string;
    median: number;
    mean: number;
    distribution: [
      {
        likert: number;
        count: number;
        percentage: number;
      },
    ];
  }
>;

type DataPoint = {
  question: string;
  likert: string;
  count: number;
  percentage: number;
  prompt: string;
  mean: number;
  median: number;
};
