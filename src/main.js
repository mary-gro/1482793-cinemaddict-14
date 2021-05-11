import UserRankView from './view/user-rank.js';
import StatisticsView from './view/statistics.js';
import {generateFilmCard} from './mock/film-card.js';
import FilterPresenter from './presenter/filter.js';
import FilmsListPresenter from './presenter/films-list.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {render, RenderPosition} from './utils/render.js';

const FILM_CARDS_COUNT = 20;

const filmCards = new Array(FILM_CARDS_COUNT).fill().map(() => generateFilmCard());

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.header');
const mainElement = bodyElement.querySelector('.main');
const footerElement = bodyElement.querySelector('.footer');

render(headerElement, new UserRankView(), RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);
const filmListPresenter = new FilmsListPresenter(mainElement, filmsModel, filterModel);

filterPresenter.init();
filmListPresenter.init();

const siteStatisticsElement = footerElement.querySelector('.footer__statistics');

render(siteStatisticsElement, new StatisticsView(filmCards.length), RenderPosition.BEFOREEND);
