import AbstractView from './abstract.js';

const createFilmsListTopRatedTemplate = () => {
  return `<section class="films-list films-list--extra films-list--top-rated">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container" id="top-rated">
    </div>
  </section>`;
};

export default class FilmsListTopRated extends AbstractView {
  getTemplate() {
    return createFilmsListTopRatedTemplate();
  }
}
