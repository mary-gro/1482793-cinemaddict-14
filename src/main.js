import FooterStatisticsView from './view/footer-statistics.js';
import StatisticsView from './view/statistics.js';
import FilterPresenter from './presenter/filter.js';
import FilmsListPresenter from './presenter/films-list.js';
import UserProfilePresenter from './presenter/user-profile.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem, UpdateType} from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic m1a2r3y4';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.header');
const mainElement = bodyElement.querySelector('.main');
const footerElement = bodyElement.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();

const filterModel = new FilterModel();

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
const filmListPresenter = new FilmsListPresenter(mainElement, filmsModel, filterModel, api);

filterPresenter.init();
filmListPresenter.init();
userProfilePresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(footerStatisticsElement, new FooterStatisticsView(films.length), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(footerStatisticsElement, new FooterStatisticsView(0), RenderPosition.BEFOREEND);
  });
