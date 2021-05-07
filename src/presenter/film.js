import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmsContainer, changeData, changeMode) {
    this._filmsContainer = filmsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._bodyElement = document.body;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleShowFilmPopupClick = this._handleShowFilmPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(this._film);

    this._filmComponent.setShowPopupHandler(this._handleShowFilmPopupClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoritesClickHandler(this._handleFavoritesClick);

    if (prevFilmComponent === null) {
      return render(this._filmsContainer, this._filmComponent, RenderPosition.BEFOREEND);
    }

    if (this._filmsContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  _renderPopup() {
    this._changeMode();
    this._mode = Mode.POPUP;

    const prevPopupComponent = this._popupComponent;

    this._popupComponent = new FilmPopupView(this._film);

    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoritesClickHandler(this._handleFavoritesClick);
    this._popupComponent.setClosePopupClickHandler(this._handleClosePopupClick);

    if (prevPopupComponent === null) {
      render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
      this._bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeyDownHandler);
      return;
    }

    if (this._mode === Mode.POPUP) {
      replace(this._popupComponent, prevPopupComponent);
      this._bodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._escKeyDownHandler);
    }

    remove(prevPopupComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleShowFilmPopupClick() {
    this._renderPopup();
  }

  _closePopup() {
    if (this._mode !== Mode.DEFAULT) {
      this._popupComponent.reset(this._film);
      this._popupComponent.getElement().remove();
      this._popupComponent = null;
      this._mode = Mode.DEFAULT;
      this._bodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.__escKeyDownHandler);
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _handleClosePopupClick() {
    this._closePopup();
  }

  _updateFilm(details) {
    const film = this._film;
    const updatedFilm = Object.assign({}, film, {userDetails: details});
    this._changeData(updatedFilm);
  }

  _handleWatchlistClick() {
    const film = this._film;
    const updatedUserDetails = Object.assign({}, film.userDetails, {watchlist: !film.userDetails.watchlist});
    this._updateFilm(updatedUserDetails);
  }

  _handleWatchedClick() {
    const film = this._film;
    const updatedUserDetails = Object.assign({}, film.userDetails, {alreadyWatched: !film.userDetails.alreadyWatched});
    this._updateFilm(updatedUserDetails);
  }

  _handleFavoritesClick() {
    const film = this._film;
    const updatedUserDetails = Object.assign({}, film.userDetails, {favorite: !film.userDetails.favorite});
    this._updateFilm(updatedUserDetails);
  }
}
