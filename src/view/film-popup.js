import dayjs from 'dayjs';
import he from 'he';
import {getRuntime, getCommentDate} from '../utils/film.js';
import SmartView from './smart.js';

export const createFilmPopupTemplate = (filmCard, isOnline) => {
  const {title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors, release, runtime, genres, description} = filmCard.filmInfo;
  const {watchlist, alreadyWatched, favorite} = filmCard.userDetails;
  const comment = filmCard.comment;
  const emotion = filmCard.emotion;
  const comments = filmCard.comments;
  const isDisabled = filmCard.isDisabled;
  const isDeleting = filmCard.isDeleting;
  const deletingCommentId = filmCard.deletingCommentId;

  const renderComments = (comments) => {
    return comments
      .map((comment) => {
        return `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
          </span>
          <div>
            <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${getCommentDate(comment.date)}</span>
              <button class="film-details__comment-delete" data-id="${comment.id}" ${isDeleting && comment.id === deletingCommentId ? 'disabled' : ''}>${isDeleting && comment.id === deletingCommentId ? 'Deleting...' : 'Delete'}</button>
            </p>
          </div>
        </li>`;
      })
      .join('');
  };

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">
            <p class="film-details__age">${ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dayjs(release.date).format('DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getRuntime(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">
                  ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}
                </td>
              </tr>
            </table>
            <p class="film-details__film-description">${description}</p>
          </div>
        </div>
        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlist ? 'checked' : ''}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${alreadyWatched ? 'checked' : ''}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorite ? 'checked' : ''}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>
      <div class="film-details__bottom-container ${isOnline ? '' : 'visually-hidden'}">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list">
            ${renderComments(comments)}
          </ul>
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${!emotion ? '' : `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`}</div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${comment ? comment : ''}</textarea>
            </label>
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmPopup extends SmartView {
  constructor(filmCard, comments, status) {
    super();
    this._data = Object.assign(
      {},
      filmCard,
      {
        comments,
        comment: '',
        emotion: '',
        isDeleting: false,
        deletingCommentId: '',
        isDisabled: false,
      },
    );
    this._status = status;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data, this._status);
  }

  updatePopup(comments) {
    this.updateData({
      comments,
      comment: '',
      emotion: '',
      isDeleting: false,
      deletingCommentId: '',
      isDisabled: false,
    });
  }

  getNewComment() {
    const newComment = {
      comment: this._data.comment,
      emotion: this._data.emotion,
    };
    return newComment;
  }

  _closeButtonClickHandler() {
    this._callback.closeButtonClick();
  }

  _watchlistClickHandler() {
    this.updateData({
      userDetails: Object.assign(
        {},
        this._data.userDetails,
        {watchlist: !this._data.userDetails.watchlist},
      ),
    });
    this._callback.watchlistClick();
  }

  _watchedClickHandler() {
    this.updateData({
      userDetails: Object.assign(
        {},
        this._data.userDetails,
        {alreadyWatched: !this._data.userDetails.alreadyWatched},
      ),
    });
    this._callback.watchedClick();
  }

  _favoritesClickHandler() {
    this.updateData({
      userDetails: Object.assign(
        {},
        this._data.userDetails,
        {favorite: !this._data.userDetails.favorite},
      ),
    });
    this._callback.favoritesClick();
  }

  _commentInputHandler(evt) {
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _emojiChangeHandler(evt) {
    this.updateData({
      emotion: evt.target.value,
    });
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    const id = evt.target.dataset.id;
    this._callback.commentDelete(id);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((element) => {
        element.addEventListener('change', this._emojiChangeHandler);
      });
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
  }

  setClosePopupClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closeButtonClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement()
      .querySelector('#watchlist')
      .addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement()
      .querySelector('#watched')
      .addEventListener('click', this._watchedClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement()
      .querySelector('#favorite')
      .addEventListener('click', this._favoritesClickHandler);
  }

  setCommentDeleteHandler(callback) {
    this._callback.commentDelete = callback;
    const deleteButtons = this.getElement().querySelectorAll('.film-details__comment-delete');
    deleteButtons.forEach((button) => button.addEventListener('click', this._commentDeleteHandler));
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClosePopupClickHandler(this._callback.closeButtonClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setCommentDeleteHandler(this._callback.commentDelete);
  }
}
