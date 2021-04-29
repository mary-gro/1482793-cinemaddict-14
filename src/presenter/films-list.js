import FilmsSortingView from '../view/films-sorting.js';
import FilmsSectionView from '../view/films-section.js';
import FilmsListView from '../view/films-list.js';
import FilmsListEmptyView from '../view/films-list.js';
import FilmsListTopRatedView from '../view/films-list-top-rated.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmPresenter from './film.js';
import {updateItem} from '../utils/common.js';
import {render, remove} from '../utils/render.js';

const SHOWED_FILMS_COUNT = 5;
const FILMS_COUNT_EXTRA = 2;

export default class FilmsList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = SHOWED_FILMS_COUNT;

    this._filmPresenters = {
      allFilmPresenter: {},
      topRatedFilmPresenter: {},
      mostCommentedFilmPresenter: {},
    };

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsSortingComponent = new FilmsSortingView();
    this._filmsListEmptyComponent = new FilmsListEmptyView();
    this._filmsListTopRatedComponent = new FilmsListTopRatedView();
    this._filmsListMostCommentedComponent = new FilmsListMostCommentedView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._renderSort();
    render(this._filmsContainer, this._filmsSectionComponent);
    this._renderFilmsList();
  }

  _renderSort() {
    render(this._filmsContainer, this._filmsSortingComponent);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);

    switch (container.id) {
      case 'top-rated':
        this._filmPresenters.topRatedFilmPresenter[film.id] = filmPresenter;
        break;
      case 'most-commented':
        this._filmPresenters.mostCommentedFilmPresenter[film.id] = filmPresenter;
        break;
      default:
        this._filmPresenters.allFilmPresenter[film.id] = filmPresenter;
    }
  }

  _renderFilms(container, films, from, to) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }

  _renderEmptyList() {
    render(this._filmsSectionComponent, this._filmsListEmptyComponent);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._filmsListContainer, this._films, this._renderedFilmsCount, this._renderedFilmsCount + SHOWED_FILMS_COUNT);
    this._renderedFilmsCount += SHOWED_FILMS_COUNT;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenters)
      .forEach((presenter) => {
        Object
          .values(presenter)
          .forEach((item) => item.resetView());
      });
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);

    Object
      .values(this._filmPresenters)
      .forEach((presenter) => {
        if (updatedFilm.id in presenter) {
          presenter[updatedFilm.id].init(updatedFilm);
        }
      });
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setShowMoreClickHandler(this._handleShowMoreButtonClick);
  }

  _renderMainFilmsList() {
    render(this._filmsSectionComponent, this._filmsListComponent);
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector('.films-list__container');
    this._renderFilms(this._filmsListContainer, this._films, 0, Math.min(this._films.length, SHOWED_FILMS_COUNT));

    if (this._films.length > SHOWED_FILMS_COUNT) {
      this._renderShowMoreButton();
    }
  }

  _renderMostCommentedList() {
    render(this._filmsSectionComponent, this._filmsListMostCommentedComponent);
    this._mostCommentedContainer = this._filmsListMostCommentedComponent.getElement().querySelector('.films-list__container');

    const mostCommentedFilms = this._films
      .sort((a, b) => b.comments.length - a.comments.length);
    this._renderFilms(this._mostCommentedContainer, mostCommentedFilms, 0, FILMS_COUNT_EXTRA);
  }

  _renderTopRatedList() {
    render(this._filmsSectionComponent, this._filmsListTopRatedComponent);
    this._topRatedContainer = this._filmsListTopRatedComponent.getElement().querySelector('.films-list__container');
    const topRatedFilms = this._films
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this._renderFilms(this._topRatedContainer, topRatedFilms, 0, FILMS_COUNT_EXTRA);
  }

  _clearMainFilmsList() {
    Object
      .values(this._filmPresenters.allFilmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenters.allFilmPresenter = {};
    this._renderedFilmsCount = SHOWED_FILMS_COUNT;
    remove(this._showMoreButtonComponent);
  }

  _renderFilmsList() {
    if (this._films.length === 0) {
      this._renderEmptyList();
      return;
    } else {
      this._renderMainFilmsList();
      this._renderMostCommentedList();
      this._renderTopRatedList();
    }
  }
}
