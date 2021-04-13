import dayjs from 'dayjs';
import {createElement} from '../utils.js';

const createFilmCardTemplate = (filmCard) => {
  const DESCRIPTION_LENGTH = 140;

  const {title, totalRating, release, description, genres, runtime, poster} = filmCard.filmInfo;
  const {watchlist, alreadyWatched, favorite} = filmCard.userDetails;

  const cutDescription = (description) => {
    return description.split('').slice(0, 140).join('') + '...';
  };

  const setActiveClass = (control) => {
    return control ? 'film-card__controls-item--active' : '';
  };

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(release.date).format('YYYY')}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genres.join(', ')}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description.length >= DESCRIPTION_LENGTH ? cutDescription(description) : description}</p>
    <a class="film-card__comments">${filmCard.comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${setActiveClass(watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${setActiveClass(alreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${setActiveClass(favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard {
  constructor(filmCard) {
    this._filmCard = filmCard;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmCard);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
