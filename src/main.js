import {createSiteMenuTemplate} from './view/site-menu.js';
import {createFilmsFilterTemplate} from './view/films-filter.js';
import {createUserRankTemplate} from './view/user-rank.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createStaticticsTemplate} from './view/statistics.js';
import {createFilmPopupTemplate} from './view/film-popup.js';

const FILMS_COUNT = 5;

const FILMS_COUNT_EXTRA = 2;

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.header');
const mainElement = bodyElement.querySelector('.main');
const footerElement = bodyElement.querySelector('.footer');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(headerElement, createUserRankTemplate(), 'beforeend');

render(mainElement, createSiteMenuTemplate(), 'beforeend');

render(mainElement, createFilmsFilterTemplate(), 'beforeend');

render(mainElement, createFilmsListTemplate(), 'beforeend');

const filmsElement = mainElement.querySelector('.films');

const filmsListContainerElement = filmsElement.querySelector('.films-list .films-list__container');
for (let i = 0; i < FILMS_COUNT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(), 'beforeend');
}
render(filmsListContainerElement, createShowMoreButtonTemplate(), 'beforeend');

const filmsListTopRatedContainerElement = filmsElement.querySelector('.films-list--top-rated .films-list__container');
for (let i = 0; i < FILMS_COUNT_EXTRA; i++) {
  render(filmsListTopRatedContainerElement, createFilmCardTemplate(), 'beforeend');
}

const filmsListMostCommentedContainerElement = filmsElement.querySelector('.films-list--most-commented .films-list__container');
for (let i = 0; i < FILMS_COUNT_EXTRA; i++) {
  render(filmsListMostCommentedContainerElement, createFilmCardTemplate(), 'beforeend');
}

const siteStatisticsElement = footerElement.querySelector('.footer__statistics');
render(siteStatisticsElement, createStaticticsTemplate(), 'beforeend');

render(bodyElement, createFilmPopupTemplate(), 'beforeend');
