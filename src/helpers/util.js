export const delay = function (ms) {
  return new Promise((res) => setTimeout(() => res(), ms));
};