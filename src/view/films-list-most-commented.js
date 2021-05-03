import AbstractView from './abstract.js';

const createFilmsListMostCommentedTemplate = () => {
  return `<section class="films-list films-list--extra films-list--most-commented">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container" id="most-commented">
    </div>
  </section>`;
};

export default class FilmsListMostCommented extends AbstractView {
  getTemplate() {
    return createFilmsListMostCommentedTemplate();
  }
}
