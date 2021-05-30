import {RankScore, RankType, MUNUTES_IN_HOUR_COUNT} from '../const.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const getUserRank = (films) => {
  const watchedFilmsCount = films.filter((film) => film.userDetails.alreadyWatched).length;

  if (!watchedFilmsCount) {
    return false;
  }

  if (watchedFilmsCount >= RankScore.NOVICE.MIN && watchedFilmsCount <= RankScore.NOVICE.MAX) {
    return RankType.NOVICE;
  }

  if (watchedFilmsCount >= RankScore.FAN.MIN && watchedFilmsCount <= RankScore.FAN.MAX) {
    return RankType.FAN;
  }

  if (watchedFilmsCount > RankScore.FAN.MAX) {
    return RankType.MOVIE_BUFF;
  }
};

export const getTotalDuration = (films) => {
  const totalDuration = films.reduce((duration, film) => {
    return duration + film.filmInfo.runtime;
  }, 0);
  return {
    HOURS: Math.floor(totalDuration / MUNUTES_IN_HOUR_COUNT),
    MINUTES: totalDuration % MUNUTES_IN_HOUR_COUNT,
  };
};

export const getGenresStatistics = (films) => {
  const genresStatistics = {};

  films
    .reduce((acc, film) => acc.concat(film.filmInfo.genres), [])
    .forEach((genre) => {
      if (!genresStatistics[genre]) {
        genresStatistics[genre] = 0;
      }
      genresStatistics[genre]++;
    });

  return genresStatistics;
};

export const getTopGenre = (films) => {
  if (films.length === 0) {
    return '';
  }

  const genresStatistics = getGenresStatistics(films);
  const topGenreStatistics = Object.entries(genresStatistics).sort((a, b) => b[1] - a[1])[0];
  const topGenreName = topGenreStatistics[0];
  return topGenreName;
};

export const filterByDate = (films, filterType) => {
  return films.filter((film) => {
    const startDate = filterType === 'day' ? dayjs().startOf('day') : dayjs().startOf('day').subtract(1, filterType);
    return dayjs(film.userDetails.watchingDate).isBetween(startDate, dayjs());
  });
};
