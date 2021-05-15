import AbstractView from './abstract.js';

const createFooterStatisticsTemplate = (count) => {
  return `<p>
    ${count} movies inside
  </p>`;
};

export default class FooterStatistics extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._count);
  }
}
