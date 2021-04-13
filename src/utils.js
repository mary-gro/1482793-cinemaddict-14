const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloat = (a = 0, b = 1, digitsAfterComma = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return (lower + Math.random() * (upper - lower)).toFixed(digitsAfterComma);
};

const getRandomArrayElement = (elements) => {
  return elements[getRandomInteger(0, elements.length - 1)];
};

const getRandomArray = (elements, maxLength = elements.length) => {
  return new Array(getRandomInteger(1, maxLength)).fill().map(() => elements[getRandomInteger(0, elements.length -  1)]);
};

const render = (container, element) => {
  container.append(element);
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export {getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArray, render, createElement};
