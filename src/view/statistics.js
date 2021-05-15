import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUserRank, getTotalDuration, filterByDate, getGenresStatistics, getTopGenre} from '../utils/statistics.js';
import {StatisticsFilter} from '../const.js';

const renderStatisticsChart = (films, statisticsCtx) => {
  const BAR_HEIGHT = 50;

  const genresNames = [];
  const genresCounts = [];

  Object
    .entries(getGenresStatistics(films))
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => {
      genresNames.push(name);
      genresCounts.push(count);
    });

  statisticsCtx.height = BAR_HEIGHT * Object.values(genresNames).length;

  return new Chart(statisticsCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresNames,
      datasets: [{
        data: genresCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (data, unfilteredFilms) => {
  const {films, currentStatisticsFilter} = data;
  const rank = getUserRank(unfilteredFilms);
  const watchedFilmsCount = films.length;
  const durationHours = getTotalDuration(films).HOURS;
  const durationMinutes = getTotalDuration(films).MINUTES;
  const topGenre = getTopGenre(films);

  return `<section class="statistic">
    ${rank
    ? `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>`
    : ''}
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${StatisticsFilter.ALL_TIME === currentStatisticsFilter ? 'checked' : ''}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${StatisticsFilter.TODAY === currentStatisticsFilter ? 'checked' : ''}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${StatisticsFilter.WEEK === currentStatisticsFilter ? 'checked' : ''}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${StatisticsFilter.MONTH === currentStatisticsFilter ? 'checked' : ''}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${StatisticsFilter.YEAR === currentStatisticsFilter ? 'checked' : ''}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

  </section>`;
};

export default class Stats extends SmartView {
  constructor(films) {
    super();
    this._films = films;
    this._watchedFilms = films.filter((film) => film.userDetails.alreadyWatched);
    this._data = {
      films: this._watchedFilms,
      currentStatisticsFilter: StatisticsFilter.ALL_TIME,
    };

    this._chart = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._setChart();
    this._setFilterChangeHandler();
  }

  getTemplate() {
    return createStatisticsTemplate(this._data, this._films);
  }

  removeElement() {
    super.removeElement();
    if (this._chart !== null) {
      this._chart = null;
    }
  }

  restoreHandlers() {
    this._setFilterChangeHandler();
    this._setChart();
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();
    const newFilter = evt.target.value;

    switch (newFilter) {
      case StatisticsFilter.ALL_TIME:
        this.updateData({
          films: this._watchedFilms,
          currentStatisticsFilter: StatisticsFilter.ALL_TIME,
        });
        break;

      case StatisticsFilter.TODAY:
        this.updateData({
          films: filterByDate(this._watchedFilms, StatisticsFilter.TODAY),
          currentStatisticsFilter: StatisticsFilter.TODAY,
        });
        break;
      case StatisticsFilter.WEEK:
        this.updateData({
          films: filterByDate(this._watchedFilms, StatisticsFilter.WEEK),
          currentStatisticsFilter: StatisticsFilter.WEEK,
        });
        break;
      case StatisticsFilter.MONTH:
        this.updateData({
          films: filterByDate(this._watchedFilms, StatisticsFilter.MONTH),
          currentStatisticsFilter: StatisticsFilter.MONTH,
        });
        break;
      case StatisticsFilter.YEAR:
        this.updateData({
          films: filterByDate(this._watchedFilms, StatisticsFilter.YEAR),
          currentStatisticsFilter: StatisticsFilter.YEAR,
        });
        break;
    }
  }

  _setFilterChangeHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._filterChangeHandler);
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticsCtx = this.getElement().querySelector('.statistic__chart');

    this._chart = renderStatisticsChart(this._data.films, statisticsCtx);
  }
}

