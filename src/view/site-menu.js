import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

// const createFilterItemTemplate = (filter, currentFilterType) => {
//   const {type, name, count} = filter;
//   return (
//     type === 'All' ?
//       `<a href="#all" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter="${type}">All movies</a>` :
//       `<a href="#${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter="${type}">
//         ${name[0].toUpperCase() + name.slice(1)}
//         <span class="main-navigation__item-count">${count}</span>
//       </a>`
//   );
// };

// const createSiteMenuTemplate = (filterItems, currentFilterType) => {
//   const filterItemsTemplate = filterItems
//     .map((filter) => createFilterItemTemplate(filter, currentFilterType))
//     .join('\n');

//   return `<nav class="main-navigation">
//     <div class="main-navigation__items">
//       ${filterItemsTemplate}
//     </div>
//     <a href="#stats" class="main-navigation__additional">Stats</a>
//   </nav>`;
// };

const createFilterItemTemplate = (filter, currentFilterType, currentMenuSection) => {
  const {type, name, count} = filter;
  return (
    type === 'All' ?
      `<a href="#all" class="main-navigation__item ${type === currentFilterType && currentMenuSection === MenuItem.FILMS ? 'main-navigation__item--active' : ''}" data-filter="${type}">All movies</a>` :
      `<a href="#${name}" class="main-navigation__item ${type === currentFilterType && currentMenuSection === MenuItem.FILMS ? 'main-navigation__item--active' : ''}" data-filter="${type}">
        ${name[0].toUpperCase() + name.slice(1)}
        <span class="main-navigation__item-count">${count}</span>
      </a>`
  );
};

const createSiteMenuTemplate = (filterItems, currentFilterType, currentMenuSection) => {
  // currentFilterType = currentMenuItem === MenuItem.FILMS ? currentFilterType : '';
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType, currentMenuSection))
    .join('\n');

  // return `<nav class="main-navigation">
  //   <div class="main-navigation__items">
  //     ${filterItemsTemplate}
  //   </div>
  //   <a href="#stats" class="main-navigation__additional ${currentMenuItem === MenuItem.STATISTICS ? 'main-navigation__additional--active' : ''}" data-menu="${MenuType.STATISTICS}">Stats</a>
  // </nav>`;
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${currentMenuSection === MenuItem.STATISTICS ? 'main-navigation__additional--active' : ''}">Stats</a>
  </nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType, currentMenuSection) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._currentMenuSection = currentMenuSection;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statisticsClickHandler = this._statisticsClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilterType, this._currentMenuSection);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
    // if (evt.target.tagName === 'A') {
    //   evt.preventDefault();
    //   this._callback.filterTypeChange(evt.target.dataset.filter);
    // }
  }

  _statisticsClickHandler(evt) {
    evt.preventDefault();
    this._callback.openStatistics(evt);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((item) => item.addEventListener('click', this._filterTypeChangeHandler));
  }

  setStatisticsClickHandler(callback) {
    this._callback.openStatistics = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._statisticsClickHandler);
  }
}
