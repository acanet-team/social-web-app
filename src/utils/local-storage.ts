export const setLocalStorage = (name: string, value: string) => {
  localStorage.setItem(name, value);
};

export const getLocalStorage = (name: string) => {
  const initialValue = localStorage.getItem(name) || '';
  if (typeof initialValue === 'string') {
    const value = JSON.parse(initialValue);
    return value;
  }
  return initialValue;
};
