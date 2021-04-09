import {createSiteMenuTemplate} from './view/site-menu.js';
import {createFilmsSortingTemplate} from './view/films-sorting.js';
import {createUserRankTemplate} from './view/user-rank.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createStaticticsTemplate} from './view/statistics.js';
import {createFilmPopupTemplate} from './view/film-popup.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateFilter} from './mock/filter.js';

const SHOWED_FILMS_COUNT = 5;
const FILMS_COUNT_EXTRA = 2;
const FILM_CARDS_COUNT = 20;

const filmCards = new Array(FILM_CARDS_COUNT).fill().map(() => generateFilmCard());
const filters = generateFilter(filmCards);

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.header');
const mainElement = bodyElement.querySelector('.main');
const footerElement = bodyElement.querySelector('.footer');

const renderElement = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderElements = (container, array, place, count) => {
  for (let i = 0; i < count; i++) {
    const template = createFilmCardTemplate(array[i]);
    container.insertAdjacentHTML(place, template);
  }
};

renderElement(headerElement, createUserRankTemplate(), 'beforeend');

renderElement(mainElement, createSiteMenuTemplate(filters), 'beforeend');

renderElement(mainElement, createFilmsSortingTemplate(), 'beforeend');

renderElement(mainElement, createFilmsListTemplate(), 'beforeend');

const filmsElement = mainElement.querySelector('.films');

const filmsListContainerElement = filmsElement.querySelector('.films-list .films-list__container');

renderElements(filmsListContainerElement, filmCards, 'beforeend', SHOWED_FILMS_COUNT);

let renderedFilmsCount = SHOWED_FILMS_COUNT;

const showMoreFilms = (evt) => {
  const showMoreButton = evt.target;
  evt.preventDefault();

  filmCards
    .slice(renderedFilmsCount, renderedFilmsCount + SHOWED_FILMS_COUNT)
    .forEach((filmCard) => renderElement(filmsListContainerElement, createFilmCardTemplate(filmCard), 'beforeend'));

  renderedFilmsCount += SHOWED_FILMS_COUNT;

  if (renderedFilmsCount >= filmCards.length) {
    showMoreButton.remove();
  }
};

if (filmCards.length > SHOWED_FILMS_COUNT) {
  renderElement(filmsListContainerElement, createShowMoreButtonTemplate(), 'afterend');
  const showMoreButton = mainElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    showMoreFilms(evt);
  });
}

const filmsListTopRatedContainerElement = filmsElement.querySelector('.films-list--top-rated .films-list__container');

renderElements(filmsListTopRatedContainerElement, filmCards, 'beforeend', FILMS_COUNT_EXTRA);

const filmsListMostCommentedContainerElement = filmsElement.querySelector('.films-list--most-commented .films-list__container');

renderElements(filmsListMostCommentedContainerElement, filmCards, 'beforeend', FILMS_COUNT_EXTRA);

const siteStatisticsElement = footerElement.querySelector('.footer__statistics');

renderElement(siteStatisticsElement, createStaticticsTemplate(filmCards.length), 'beforeend');

renderElement(bodyElement, createFilmPopupTemplate(filmCards[0]), 'beforeend');
