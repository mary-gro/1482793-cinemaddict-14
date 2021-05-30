import {MUNUTES_IN_HOUR_COUNT} from '../const.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

export const sortByDate = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

export const sortByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export const getRuntime = (duration) => {
  const hours = Math.trunc(duration / MUNUTES_IN_HOUR_COUNT);
  const minutes = duration % MUNUTES_IN_HOUR_COUNT;
  return `${hours}h ${minutes}m`;
};

export const getCommentDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

