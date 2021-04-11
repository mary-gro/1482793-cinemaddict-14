import dayjs from 'dayjs';
import {getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArray} from '../utils.js';

const TITLES = [
  'Made For Each Other',
  'Popeye Meets Sinbad',
  'Sagebrush Trail',
  'Santa Claus Conquers The Martians',
  'The Dance Of Life',
  'The Great Flamarion',
  'The Man With The Golden Arm',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const AGE_RATINGS = [
  '0+',
  '6+',
  '12+',
  '16+',
  '18+',
];

const PEOPLE = [
  'George Clooney',
  'Ben Affleck',
  'Brad Pitt',
  'David Lynch',
  'Madonna',
];

const COUNTRIES = [
  'USA',
  'Great Britain',
  'France',
  'Germany',
  'India',
  'Russia',
];

const GENRES = [
  'Musical',
  'Adventure',
  'Drama',
  'Action',
  'Comedy',
  'Horror',
  'Historical',
  'Thriller',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const DESCRIPTION_MAX_LENGTH = 5;

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const COMMENTS_COUNT = 5;

const COMMENTS_YEARS_GAP_START = -5;

const FILMS_YEARS_GAP_START = -90;

const getRuntime = (duration) => {
  const hours = Math.trunc(duration/60);
  const minutes = duration % 60;
  return `${hours}h ${minutes}m`;
};

const FilmDuration = {
  MIN: 45,
  MAX: 180,
};

const getDate = (yearsGapStart) => {
  const yearsGap = getRandomInteger(yearsGapStart, 0);
  return dayjs().add(yearsGap, 'year').toDate();
};

const generateComment = () => {
  return  {
    text: getRandomArrayElement(DESCRIPTIONS),
    author: getRandomArrayElement(PEOPLE),
    emoji: getRandomArrayElement(EMOTIONS),
    date: dayjs(getDate(COMMENTS_YEARS_GAP_START)).format('YYYY/DD/MM HH:mm'),
  };
};

export const generateFilmCard = () => {
  const IsAlreadyWatched = Boolean(getRandomInteger(0, 1));
  const watchingDate = IsAlreadyWatched ? getDate(-5) : null;

  return {
    comments: new Array(getRandomInteger(0, COMMENTS_COUNT)).fill().map(() => generateComment()),
    filmInfo: {
      title: getRandomArrayElement(TITLES),
      alternativeTitle: getRandomArrayElement(TITLES),
      totalRating: getRandomFloat(0, 10),
      poster: getRandomArrayElement(POSTERS),
      ageRating: getRandomArrayElement(AGE_RATINGS),
      director: getRandomArrayElement(PEOPLE),
      writers: getRandomArray(PEOPLE).join(', '),
      actors: getRandomArray(PEOPLE).join(', '),
      release: {
        date: getDate(FILMS_YEARS_GAP_START),
        releaseCountry: getRandomArrayElement(COUNTRIES),
      },
      runtime: getRuntime(getRandomInteger(FilmDuration.MIN, FilmDuration.MAX)),
      genres: getRandomArray(GENRES),
      description: getRandomArray(DESCRIPTIONS, DESCRIPTION_MAX_LENGTH).join(' '),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: IsAlreadyWatched,
      watchingDate: watchingDate,
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};
