import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArray} from '../utils/common.js';

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

const WATCHING_DATE_DAYS_GAP_START = -40;

const FilmDuration = {
  MIN: 45,
  MAX: 180,
};

const getDate = (daysGapStart) => {
  const daysGap = getRandomInteger(daysGapStart, 0);
  return dayjs().add(daysGap, 'day').toDate();
};

const generateComment = () => {
  return  {
    id: nanoid(),
    text: getRandomArrayElement(DESCRIPTIONS),
    author: getRandomArrayElement(PEOPLE),
    emoji: getRandomArrayElement(EMOTIONS),
    date: getDate(COMMENTS_YEARS_GAP_START),
  };
};

export const generateFilmCard = () => {
  return {
    id: nanoid(),
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
      runtime: getRandomInteger(FilmDuration.MIN, FilmDuration.MAX),
      genres: getRandomArray(GENRES),
      description: getRandomArray(DESCRIPTIONS, DESCRIPTION_MAX_LENGTH).join(' '),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: getDate(WATCHING_DATE_DAYS_GAP_START),
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};
