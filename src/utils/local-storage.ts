export const setLocalStorage = (name: string, value: string) => {
  localStorage.setItem(name, JSON.stringify(value));
};

export const getLocalStorage = (name: string) => {
  const valueJSON = localStorage.getItem(name) || '';
  const value = JSON.parse(valueJSON);
  return value;
};
