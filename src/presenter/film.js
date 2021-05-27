import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import CommentsModel from '../model/comments.js';
import {render, remove, replace, RenderPosition} from '../utils/render.js';
import {isOnline} from '../utils/common.js';
import {toast} from '../utils/toast.js';
import {UpdateType, UserAction, PopupState} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmsContainer, changeData, changeMode, api) {
    this._filmsContainer = filmsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = new CommentsModel();
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

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel.addObserver(this._handleModelEvent);
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
    if (this._mode === Mode.DEFAULT) {
      remove(this._popupComponent);
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
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

  _renderPopup(comments) {
    this._changeMode();
    this._mode = Mode.POPUP;
    this._comments = comments;

    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new FilmPopupView(this._film, this._comments);

    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoritesClickHandler(this._handleFavoritesClick);
    this._popupComponent.setClosePopupClickHandler(this._handleClosePopupClick);
    this._popupComponent.setCommentDeleteHandler(this._handleCommentDeleteClick);

    this._bodyElement.classList.add('hide-overflow');

    document.addEventListener('keydown', this._escKeyDownHandler);
    document.addEventListener('keydown', this._commentAddHandler);

    if (prevPopupComponent === null) {
      render(this._bodyElement, this._popupComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.POPUP) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);
  }

  _closePopup() {
    this._changeData(UpdateType.MINOR, this._film);
    remove(this._popupComponent);
    this._commentsModel.removeObserver(this._handleModelEvent);
    this._bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    document.removeEventListener('keydown', this._commentAddHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleShowFilmPopupClick() {
    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._renderPopup(this._commentsModel.getComments());
      })
      .catch(() => {
        this._commentsModel.setComments([]);
        this._renderPopup(this._commentsModel.getComments());
      });
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
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

  _commentAddHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.code === 'Enter') {
      if (!isOnline()) {
        toast('You can\'t send comment offline');
        return;
      }

      const newComment = this._popupComponent.getNewComment();
      this.setViewState(PopupState.SENDING);
      this._api.addComment(this._film.id, newComment)
        .then((response) => {
          const addingComment = response.comments[response.comments.length - 1];
          return this._commentsModel.addComment(UserAction.ADD_COMMENT, addingComment);
        })
        .catch(() => {
          this.setViewState(PopupState.ABORTING);
        });
    }
  }

  _handleCommentDeleteClick(id) {
    if (!isOnline()) {
      toast('You can\'t delete comment offline');
      return;
    }

    this.setViewState(PopupState.DELETING, id);
    this._api.deleteComment(id)
      .then(() => {
        this._commentsModel.deleteComment(UserAction.DELETE_COMMENT, id);
      })
      .catch(() => {
        this.setViewState(PopupState.ABORTING);
      });
  }

  _handleModelEvent(userAction) {
    switch (userAction) {
      case UserAction.ADD_COMMENT:
        this._changeData(
          UpdateType.PATCH,
          Object.assign(
            {},
            this._film,
            {
              comments: this._commentsModel.getComments().map((item) => item.id),
            },
          ),
        );
        this._popupComponent.updatePopup(this._commentsModel.getComments());
        break;
      case UserAction.DELETE_COMMENT:
        this._changeData(
          UpdateType.PATCH,
          Object.assign(
            {},
            this._film,
            {
              comments: this._commentsModel.getComments().map((item) => item.id),
            },
          ),
        );
        this._popupComponent.updatePopup(this._commentsModel.getComments());
        break;
    }
  }
}
