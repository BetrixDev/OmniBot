export const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map((word) => `${word[0].toUpperCase()}${word.substring(1)}`)
    .join(" ");
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};
