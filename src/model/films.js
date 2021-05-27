import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t  update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        filmInfo: {
          title: film.film_info.title,
          alternativeTitle: film.film_info.alternative_title,
          totalRating: film.film_info.total_rating,
          poster: film.film_info.poster,
          ageRating: film.film_info.age_rating,
          director: film.film_info.director,
          writers: film.film_info.writers,
          actors: film.film_info.actors,
          release: {
            date: film.film_info.release.date,
            releaseCountry: film.film_info.release.release_country,
          },
          runtime: film.film_info.runtime,
          genres: film.film_info.genre,
          description: film.film_info.description,
        },
        userDetails: {
          watchlist: film.user_details.watchlist,
          alreadyWatched: film.user_details.already_watched,
          watchingDate: film.user_details.watching_date,
          favorite: film.user_details.favorite,
        },
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          'title': film.filmInfo.title,
          'alternative_title': film.filmInfo.alternativeTitle,
          'poster': film.filmInfo.poster,
          'description': film.filmInfo.description,
          'total_rating': film.filmInfo.totalRating,
          'release': {
            'date': film.filmInfo.release.date,
            'release_country': film.filmInfo.release.releaseCountry,
          },
          'runtime': film.filmInfo.runtime,
          'genre': film.filmInfo.genres,
          'director': film.filmInfo.director,
          'writers': film.filmInfo.writers,
          'actors': film.filmInfo.actors,
          'age_rating': film.filmInfo.ageRating,
        },
        'user_details': {
          'watchlist': film.userDetails.watchlist,
          'already_watched': film.userDetails.alreadyWatched,
          'watching_date': film.userDetails.watchingDate,
          'favorite': film.userDetails.favorite,
        },
      },
    );

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  }
}

