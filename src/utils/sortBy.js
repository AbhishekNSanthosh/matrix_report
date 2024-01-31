export const sortBy = function (data, key) {
  return data.sort((a, b) => a[key] - b[key]);
};
