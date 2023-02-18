import {
  addInputIntoFilterOnOpen,
  getDataForIngredientsFilter,
  getDataForAppliancesFilter,
  getDataForUstensilsFilter,
  handleClickOnFilterElement,
  sortFilterElementsOnSearchInput,
} from './filters.js';
import { getIdOfRecipesSearch } from './recipes-search.js';

addInputIntoFilterOnOpen();
getDataForIngredientsFilter();
getDataForAppliancesFilter();
getDataForUstensilsFilter();
handleClickOnFilterElement();
sortFilterElementsOnSearchInput();
getIdOfRecipesSearch();
