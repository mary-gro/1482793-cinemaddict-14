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

const renderElement = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderElements = (container, template, place, count) => {
  for (let i = 0; i < count; i++) {
    renderElement(container, template, place);
  }
};

renderElement(headerElement, createUserRankTemplate(), 'beforeend');

renderElement(mainElement, createSiteMenuTemplate(), 'beforeend');

renderElement(mainElement, createFilmsFilterTemplate(), 'beforeend');

renderElement(mainElement, createFilmsListTemplate(), 'beforeend');

const filmsElement = mainElement.querySelector('.films');

const filmsListContainerElement = filmsElement.querySelector('.films-list .films-list__container');

renderElements(filmsListContainerElement, createFilmCardTemplate(), 'beforeend', FILMS_COUNT);

renderElement(filmsListContainerElement, createShowMoreButtonTemplate(), 'beforeend');

const filmsListTopRatedContainerElement = filmsElement.querySelector('.films-list--top-rated .films-list__container');

renderElements(filmsListTopRatedContainerElement, createFilmCardTemplate(), 'beforeend', FILMS_COUNT_EXTRA);

const filmsListMostCommentedContainerElement = filmsElement.querySelector('.films-list--most-commented .films-list__container');

renderElements(filmsListMostCommentedContainerElement, createFilmCardTemplate(), 'beforeend', FILMS_COUNT_EXTRA);

const siteStatisticsElement = footerElement.querySelector('.footer__statistics');

renderElement(siteStatisticsElement, createStaticticsTemplate(), 'beforeend');

renderElement(bodyElement, createFilmPopupTemplate(), 'beforeend');
