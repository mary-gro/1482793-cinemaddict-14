import FilmsSortingView from '../view/films-sorting.js';
import FilmsSectionView from '../view/films-section.js';
import FilmsListView from '../view/films-list.js';
import FilmsListEmptyView from '../view/films-list-empty.js';
import FilmsListTopRatedView from '../view/films-list-top-rated.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import LoadingView from '../view/loading.js';
import FilmPresenter from './film.js';
import {filter} from '../utils/filter.js';
import {sortByDate, sortByRating} from '../utils/film.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortType, UpdateType} from '../const.js';

const SHOWED_FILMS_COUNT = 5;
const FILMS_COUNT_EXTRA = 2;

export default class FilmsList {
  constructor(filmsContainer, filmsModel, filterModel, api) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsContainer = filmsContainer;
    this._renderedFilmsCount = SHOWED_FILMS_COUNT;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._filmPresenters = {
      allFilmPresenter: {},
      topRatedFilmPresenter: {},
      mostCommentedFilmPresenter: {},
    };

    this._filmsSortingComponent = null;
    this._showMoreButtonComponent = null;
    this._filmsListTopRatedComponent = null;
    this._filmsListMostCommentedComponent = null;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListEmptyComponent = new FilmsListEmptyView();
    this._loadingComponent = new LoadingView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._filmsContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderFilmsList();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList({resetRenderedFilmsCount: true});
    this._renderFilmsList();
  }

  _renderSort() {
    if (this._filmsSortingComponent !== null) {
      this._filmsSortingComponent = null;
    }

    this._filmsSortingComponent = new FilmsSortingView(this._currentSortType);
    this._filmsSortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsContainer, this._filmsSortingComponent, RenderPosition.BEFOREEND);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._api);
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

  _renderFilms(container, films) {
    films.forEach((film) => this._renderFilm(container, film));
  }

  _renderEmptyList() {
    render(this._filmsContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent, this._filmsListEmptyComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + SHOWED_FILMS_COUNT);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilms(this._filmsListContainer, films);
    this._renderedFilmsCount = newRenderedFilmsCount;
    if (this._renderedFilmsCount >= filmsCount) {
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

  _handleViewAction(updateType, update) {
    this._api.updateFilm(update).then((response) => {
      this._filmsModel.updateFilm(updateType, response);
    });
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateFilmInList(data);
        break;
      case UpdateType.MINOR:
        this._clearFilmsList();
        this._renderFilmsList();
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderFilmsList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsList();
        break;
    }
  }

  _updateFilmInList(data) {
    Object
      .values(this._filmPresenters)
      .forEach((presenter) => {
        if (data.id in presenter) {
          presenter[data.id].init(data);
        }
      });
  }

  _renderShowMoreButton() {
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setShowMoreClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderMostCommentedList() {
    const mostCommentedFilms = this._getFilms()
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, FILMS_COUNT_EXTRA);

    if (mostCommentedFilms.filter((film) => film.comments.length > 0).length > 0) {
      this._filmsListMostCommentedComponent = new FilmsListMostCommentedView();
      render(this._filmsSectionComponent, this._filmsListMostCommentedComponent, RenderPosition.BEFOREEND);
      this._mostCommentedContainer = this._filmsListMostCommentedComponent.getElement().querySelector('.films-list__container');
      this._renderFilms(this._mostCommentedContainer, mostCommentedFilms);
    }
  }

  _renderTopRatedList() {
    const topRatedFilms = this._getFilms()
      .slice()
      .sort(sortByRating)
      .slice(0, FILMS_COUNT_EXTRA);

    if (topRatedFilms.filter((film) => film.filmInfo.totalRating > 0).length > 0) {
      this._filmsListTopRatedComponent = new FilmsListTopRatedView();
      render(this._filmsSectionComponent, this._filmsListTopRatedComponent, RenderPosition.BEFOREEND);
      this._topRatedContainer = this._filmsListTopRatedComponent.getElement().querySelector('.films-list__container');
      this._renderFilms(this._topRatedContainer, topRatedFilms);
    }
  }

  _renderLoading() {
    render(this._filmsSectionComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _clearFilmsList({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object
      .values(this._filmPresenters.allFilmPresenter)
      .forEach((presenter) => presenter.destroy());

    this._filmPresenters.allFilmPresenter = {};

    remove(this._showMoreButtonComponent);
    remove(this._filmsSortingComponent);
    remove(this._loadingComponent);
    remove(this._filmsListEmptyComponent);

    if (this._filmsListMostCommentedComponent) {
      remove(this._filmsListMostCommentedComponent);
    }

    if (this._filmsListTopRatedComponent) {
      remove(this._filmsListTopRatedComponent);
    }

    this._renderedFilmsCount = resetRenderedFilmsCount ? SHOWED_FILMS_COUNT : Math.min(filmsCount, this._renderedFilmsCount);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderEmptyList();
      return;
    }

    this._renderSort();
    render(this._filmsContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPosition.AFTERBEGIN);
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector('.films-list__container');
    this._renderFilms(this._filmsListContainer, films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));
    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
    this._renderMostCommentedList();
    this._renderTopRatedList();
  }

  destroy() {
    this._clearFilmsList({resetRenderedFilmsCount: true, resetSortType: true});

    remove(this._filmsSectionComponent);
    remove(this._filmsListComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }
}
