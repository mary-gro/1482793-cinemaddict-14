import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';
import {UpdateType, UserAction, PopupState} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmsContainer, changeData, changeMode, commentsModel, filmsModel, api) {
    this._filmsContainer = filmsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;
    this._filmsModel = filmsModel;
    this._api = api;

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
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._commentAddHandler = this._commentAddHandler.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
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

  _handleModelEvent() {
    this._scroll = this._popupComponent.getElement().scrollTop;

    this._closePopup();
    this._renderPopup();

    this._popupComponent.getElement().scrollTop = this._scroll;
  }

  destroy() {
    remove(this._filmComponent, this._comments);
  }

  _renderPopup() {
    this._changeMode();
    this._mode = Mode.POPUP;

    this._popupComponent = new FilmPopupView(this._film, this._commentsModel);

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoritesClickHandler(this._handleFavoritesClick);
    this._popupComponent.setClosePopupClickHandler(this._handleClosePopupClick);
    this._popupComponent.setCommentDeleteHandler(this._handleCommentDeleteClick);
    this._popupComponent.setCommentAddHandler(this._commentAddHandler);
    this._commentsModel.addObserver(this._handleModelEvent);

    render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    this._bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleShowFilmPopupClick() {
    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._renderPopup();
      })
      .catch(() => {
        this._commentsModel.setComments([]);
        this._renderPopup();
      });
  }

  _closePopup() {
    this._changeData(UpdateType.MINOR, this._film);
    remove(this._popupComponent);
    this._commentsModel.removeObserver(this._handleModelEvent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
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
    const updatedFilm = Object.assign({}, this._film, {userDetails: details});
    this._changeData(this._mode === Mode.DEFAULT ? UpdateType.MINOR : this._mode === Mode.POPUP ? UpdateType.PATCH : '', updatedFilm);
  }

  _handleWatchlistClick() {
    const updatedUserDetails = Object.assign({}, this._film.userDetails, {watchlist: !this._film.userDetails.watchlist});
    this._updateFilm(updatedUserDetails);
  }

  _handleWatchedClick() {
    const updatedUserDetails = Object.assign({}, this._film.userDetails, {alreadyWatched: !this._film.userDetails.alreadyWatched});
    this._updateFilm(updatedUserDetails);
  }

  _handleFavoritesClick() {
    const updatedUserDetails = Object.assign({}, this._film.userDetails, {favorite: !this._film.userDetails.favorite});
    this._updateFilm(updatedUserDetails);
  }

  _commentAddHandler(newComment) {
    this._handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      this._film,
      newComment,
    );
  }

  _handleCommentDeleteClick(id) {
    this._handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          comments: this._film.comments.filter((filmCommentId) => filmCommentId !== id),
        },
      ),
      id,
    );
  }

  _handleViewAction(actionType, updateType, update, comment) {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.setViewState(PopupState.SENDING);
        this._api.addComment(update, comment)
          .then((response) => {
            this._commentsModel.addComment(updateType, response.film, response.comments);
            this._filmsModel.updateFilm(updateType, response.film);
          })
          .catch(() => {
            this.setViewState(PopupState.ABORTING);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this.setViewState(PopupState.DELETING, comment);
        this._api.deleteComment(comment)
          .then(() => {
            this._commentsModel.deleteComment(updateType, comment);
            this._filmsModel.updateFilm(updateType, update);
          })
          .catch(() => {
            this.setViewState(PopupState.ABORTING);
          });
        break;
    }
  }

  setViewState(state, id) {
    const resetState = () => {
      this._popupComponent.updateData({
        isDeleting: false,
        deletingCommentId: '',
        isDisabled: false,
      });
    };

    switch (state) {
      case PopupState.SENDING:
        this._popupComponent.updateData({
          isDisabled: true,
        });
        break;
      case PopupState.DELETING:
        this._popupComponent.updateData({
          isDeleting: true,
          deletingCommentId: id,
        });
        break;
      case PopupState.ABORTING:
        this._popupComponent.shake(resetState);
        break;
    }
  }
}
