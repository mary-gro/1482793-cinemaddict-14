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
import {render, remove} from './utils/render.js';

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

  render(container, filmCardComponent);

  filmCardComponent.showFilmPopupHandler(() => {
    renderPopup(filmCard);
  });
};

const renderPopup = (filmCard) => {
  const popupComponent = new FilmPopupView(filmCard);

  const closePopup = () => {
    remove(popupComponent);
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
  popupComponent.setClosePopupClickHandler(() => {
    closePopup();
  });
};

const renderFilmCards = (container, array, count) => {
  for (let i = 0; i < count; i++) {
    renderFilmCard(container, array[i]);
  }
};

render(headerElement, new UserRankView());

render(mainElement, new SiteMenuView(filters));

const renderFilms = (filmCards) => {
  if (filmCards.length === 0) {
    render(mainElement, new FilmsListEmptyView());
  } else {
    render(mainElement, new FilmsSortingView());

    render(mainElement, new FilmsListView());

    const filmsElement = mainElement.querySelector('.films');

    const filmsListElement = filmsElement.querySelector('.films-list');

    const filmsListContainerElement = filmsListElement.querySelector('.films-list .films-list__container');

    renderFilmCards(filmsListContainerElement, filmCards, SHOWED_FILMS_COUNT);

    if (filmCards.length > SHOWED_FILMS_COUNT) {
      const showMoreButtonComponent = new ShowMoreButtonView();

      let renderedFilmsCount = SHOWED_FILMS_COUNT;

      render(filmsListElement, showMoreButtonComponent);

      showMoreButtonComponent.setShowMoreClickHandler(() => {
        filmCards
          .slice(renderedFilmsCount, renderedFilmsCount + SHOWED_FILMS_COUNT)
          .forEach((filmCard) => renderFilmCard(filmsListContainerElement, filmCard));
        renderedFilmsCount += SHOWED_FILMS_COUNT;

        if (renderedFilmsCount >= filmCards.length) {
          remove(showMoreButtonComponent);
        }
      });
    }

    render(filmsElement, new FilmsListTopRatedView());

    const topRatedContainerElement = filmsElement.querySelector('.films-list--top-rated .films-list__container');

    renderFilmCards(topRatedContainerElement, filmCards, FILMS_COUNT_EXTRA);

    render(filmsElement, new FilmsListMostCommenteddView());

    const mostCommentedContainerElement = filmsElement.querySelector('.films-list--most-commented .films-list__container');

    renderFilmCards(mostCommentedContainerElement, filmCards, FILMS_COUNT_EXTRA);
  }
};

renderFilms(filmCards);

const siteStatisticsElement = footerElement.querySelector('.footer__statistics');

render(siteStatisticsElement, new StatisticsView(filmCards.length));
