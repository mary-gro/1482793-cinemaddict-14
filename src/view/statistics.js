import AbstractView from './abstract.js';

const createStatisticsTemplate = (count) => {
  return `<p>
    ${count} movies inside
  </p>`;
};

export default class Statistics extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createStatisticsTemplate(this._count);
  }
}
