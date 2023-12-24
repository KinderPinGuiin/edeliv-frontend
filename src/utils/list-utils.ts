export function preprend<T>(list: T[], value: T) {
  const newList = list.slice();
  newList.unshift(value);
  return newList;
}