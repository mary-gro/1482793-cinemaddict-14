import SiteMenuView from './view/site-menu.js';
import UserRankView from './view/user-rank.js';
import StatisticsView from './view/statistics.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateFilter} from './mock/filter.js';
import FilmsListPresenter from './presenter/films-list.js';
import {render, RenderPosition} from './utils/render.js';

const FILM_CARDS_COUNT = 20;

const filmCards = new Array(FILM_CARDS_COUNT).fill().map(() => generateFilmCard());

const filters = generateFilter(filmCards);

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.header');
const mainElement = bodyElement.querySelector('.main');
const footerElement = bodyElement.querySelector('.footer');

render(headerElement, new UserRankView(), RenderPosition.BEFOREEND);

render(mainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);

const filmListPresenter = new FilmsListPresenter(mainElement);
filmListPresenter.init(filmCards);

const siteStatisticsElement = footerElement.querySelector('.footer__statistics');

render(siteStatisticsElement, new StatisticsView(filmCards.length), RenderPosition.BEFOREEND);
