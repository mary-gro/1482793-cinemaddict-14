import FooterStatisticsView from './view/footer-statistics.js';
import StatisticsView from './view/statistics.js';
import {generateFilmCard} from './mock/film-card.js';
import FilterPresenter from './presenter/filter.js';
import FilmsListPresenter from './presenter/films-list.js';
import UserProfilePresenter from './presenter/user-profile.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem} from './const.js';

const FILM_CARDS_COUNT = 20;

const filmCards = new Array(FILM_CARDS_COUNT).fill().map(() => generateFilmCard());

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.header');
const mainElement = bodyElement.querySelector('.main');
const footerElement = bodyElement.querySelector('.footer');

let statisticsComponent = null;

const changeMenuSection = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      remove(statisticsComponent);
      filmListPresenter.destroy();
      filmListPresenter.init();
      break;
    case MenuItem.STATISTICS:
      filmListPresenter.destroy();
      statisticsComponent = new StatisticsView(filmsModel.getFilms());
      render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const userProfilePresenter = new UserProfilePresenter(headerElement, filmsModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, changeMenuSection);
const filmListPresenter = new FilmsListPresenter(mainElement, filmsModel, filterModel);

userProfilePresenter.init();
filterPresenter.init();
filmListPresenter.init();

const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

render(footerStatisticsElement, new FooterStatisticsView(filmCards.length), RenderPosition.BEFOREEND);
