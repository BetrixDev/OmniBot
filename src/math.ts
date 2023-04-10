export const round = (num: number, place: number) => {
  return Math.round(num * place) / place;
};

export const convertTimeToHours = (time: number) => {
  return round(time / 60 / 60, 10);
};
