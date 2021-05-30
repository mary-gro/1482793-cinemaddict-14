import UserRankView from '../view/user-rank.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {getUserRank} from '../utils/statistics.js';

export default class UserProfile {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._userProfileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._filmsModel.getFilms();
    const watchedFilmsCount = films.filter((film) => film.userDetails.alreadyWatched).length;

    if (watchedFilmsCount) {
      this._userProfileComponent = new UserRankView(getUserRank(films));
      render(this._container, this._userProfileComponent, RenderPosition.BEFOREEND);
    }
  }

  _update() {
    remove(this._userProfileComponent);
    this.init();
  }

  _handleModelEvent() {
    this._update();
  }
}
