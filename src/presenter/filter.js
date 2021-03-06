import SiteMenuView from '../view/site-menu.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType, MenuItem} from '../const.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel, changeMenuSection) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._currentFilter = null;
    this._changeMenuSection = changeMenuSection;
    this._currentMenuSection = MenuItem.FILMS;

    this._filterComponent = null;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statisticsClickHandler = this._statisticsClickHandler.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    this._currentFilter = this._filterModel.getFilter();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new SiteMenuView(filters, this._currentFilter, this._currentMenuSection);
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);
    this._filterComponent.setStatisticsClickHandler(this._statisticsClickHandler);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init(this._handleMenuClick);
  }

  _filterTypeChangeHandler(filterType) {
    if (this._currentFilter === filterType && this._currentMenuSection === MenuItem.FILMS) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    this._changeMenuSection(MenuItem.FILMS);
    this._currentMenuSection = MenuItem.FILMS;
    this.init();
  }

  _statisticsClickHandler() {
    if (this._currentMenuSection === MenuItem.STATISTICS) {
      return;
    }
    this._changeMenuSection(MenuItem.STATISTICS);
    this._currentMenuSection = MenuItem.STATISTICS;
    this.init();
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    const FilterTypeResource = {
      [FilterType.ALL]: 'All',
      [FilterType.WATCHLIST]: 'Watchlist',
      [FilterType.HISTORY]: 'History',
      [FilterType.FAVORITES]: 'Favorites',
    };

    return [
      {
        type: FilterType.ALL,
        name: FilterTypeResource[FilterType.ALL],
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: FilterTypeResource[FilterType.WATCHLIST],
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: FilterTypeResource[FilterType.HISTORY],
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: FilterTypeResource[FilterType.FAVORITES],
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
