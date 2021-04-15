import SiteMenuView from './view/site-menu.js';
import FilmsSortingView from './view/films-sorting.js';
import UserRankView from './view/user-rank.js';
import FilmsListView from './view/films-list.js';
import FilmsListEmptyView from './view/films-list.js';
import FilmsListTopRatedView from './view/films-list-top-rated.js';
import FilmsListMostCommenteddView from './view/films-list-most-commented.js';
import FilmCardView from './view/film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import StatisticsView from './view/statistics.js';
import FilmPopupView from './view/film-popup.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateFilter} from './mock/filter.js';
import {render} from './utils.js';

const SHOWED_FILMS_COUNT = 5;
const FILMS_COUNT_EXTRA = 2;
const FILM_CARDS_COUNT = 20;

const filmCards = new Array(FILM_CARDS_COUNT).fill().map(() => generateFilmCard());

const filters = generateFilter(filmCards);

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.header');
const mainElement = bodyElement.querySelector('.main');
const footerElement = bodyElement.querySelector('.footer');

const renderFilmCard = (container, filmCard) => {
  const filmCardComponent = new FilmCardView(filmCard);

  filmCardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    renderPopup(filmCard);
  });

  filmCardComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    renderPopup(filmCard);
  });

  filmCardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    renderPopup(filmCard);
  });

  render(container, filmCardComponent.getElement());
};

const renderPopup = (filmCard) => {
  const popupComponent = new FilmPopupView(filmCard);

  const closePopup = () => {
    popupComponent.getElement().remove();
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
    }
  };

  render(bodyElement, popupComponent.getElement());
  bodyElement.classList.add('hide-overflow');
  document.addEventListener('keydown', onEscKeyDown);
  popupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    closePopup();
  });
};

const renderFilmCards = (container, array, count) => {
  for (let i = 0; i < count; i++) {
    renderFilmCard(container, array[i]);
  }
};

render(headerElement, new UserRankView().getElement());

render(mainElement, new SiteMenuView(filters).getElement());

if (filmCards.length === 0) {
  render(mainElement, new FilmsListEmptyView().getElement());
} else {
  render(mainElement, new FilmsSortingView().getElement());

  render(mainElement, new FilmsListView().getElement());

  const filmsElement = mainElement.querySelector('.films');

  const filmsListElement = filmsElement.querySelector('.films-list');

  const filmsListContainerElement = filmsListElement.querySelector('.films-list .films-list__container');

  renderFilmCards(filmsListContainerElement, filmCards, SHOWED_FILMS_COUNT);

  let renderedFilmsCount = SHOWED_FILMS_COUNT;

  const showMoreFilms = (evt) => {
    const showMoreButton = evt.target;
    evt.preventDefault();

    filmCards
      .slice(renderedFilmsCount, renderedFilmsCount + SHOWED_FILMS_COUNT)
      .forEach((filmCard) => renderFilmCard(filmsListContainerElement, filmCard));

    renderedFilmsCount += SHOWED_FILMS_COUNT;

    if (renderedFilmsCount >= filmCards.length) {
      showMoreButton.remove();
    }
  };

  if (filmCards.length > SHOWED_FILMS_COUNT) {
    const showMoreButton = new ShowMoreButtonView().getElement();

    render(filmsListElement, showMoreButton);

    showMoreButton.addEventListener('click', (evt) => {
      showMoreFilms(evt);
    });
  }

  render(filmsElement, new FilmsListTopRatedView().getElement());

  const filmsListTopRatedContainerElement = filmsElement.querySelector('.films-list--top-rated .films-list__container');

  renderFilmCards(filmsListTopRatedContainerElement, filmCards, FILMS_COUNT_EXTRA);

  render(filmsElement, new FilmsListMostCommenteddView().getElement());

  const filmsListMostCommentedContainerElement = filmsElement.querySelector('.films-list--most-commented .films-list__container');

  renderFilmCards(filmsListMostCommentedContainerElement, filmCards, FILMS_COUNT_EXTRA);
}

const siteStatisticsElement = footerElement.querySelector('.footer__statistics');

render(siteStatisticsElement, new StatisticsView(filmCards.length).getElement());
