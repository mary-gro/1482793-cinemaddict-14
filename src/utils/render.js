import Abstract from '../view/abstract.js';

export const render = (container, child) => {
  let containerElement = container;
  let childElement = child;

  if (containerElement instanceof Abstract) {
    containerElement = containerElement.getElement();
  }

  if (childElement instanceof Abstract) {
    childElement = childElement.getElement();
  }

  containerElement.append(childElement);
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};
