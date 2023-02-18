import { recipes } from '../data/recipes.js';
import { sanitizeIngredientsMap } from './filters.js';

function makeNamesMap() {
  const amapOfNames = new Map();
  recipes.forEach((el) => {
    amapOfNames.set({ id: el.id }, { name: el.name });
  });
  return amapOfNames;
}

function makeDescriptionsMap() {
  const mapOfDescriptions = new Map();
  recipes.forEach((el) => {
    mapOfDescriptions.set({ id: el.id }, { desc: el.description });
  });
  return mapOfDescriptions;
}

function filteringDatas(stringValue, datas, context) {
  const arrayFromDatas = Array.from(datas);
  const filteredDatas = new Map();
  if (stringValue && stringValue.length >= 3) {
    arrayFromDatas.forEach((e, i) => {
      if (e[1][context].toLowerCase().includes(stringValue.toLowerCase())) {
        filteredDatas.set(i, e[0].id);
      }
    });
    return Array.from(filteredDatas.values()).sort(Intl.Collator().compare);
  } else {
    return arrayFromDatas.sort(Intl.Collator().compare);
  }
}

function mainFilterRecipesByNames(searchFilter) {
  const namesMap = makeNamesMap();
  return filteringDatas(searchFilter, namesMap, 'name');
}

function mainFilterRecipesByDescriptions(searchFilter) {
  const descriptionsMap = makeDescriptionsMap();
  return filteringDatas(searchFilter, descriptionsMap, 'desc');
}

function mainFilterRecipesByIngredients(searchFilter) {
  const ingredientsMap = sanitizeIngredientsMap();
  return filteringDatas(searchFilter, ingredientsMap, 'ingredient');
}

export function getIdOfRecipesSearch() {
  const mainSearchInput = document.getElementById('searchFormControlInput');
  mainSearchInput.addEventListener('keyup', (e) => {
    const filteredValues = new Map();

    if (e.target.value.length >= 3) {
      const byNames = mainFilterRecipesByNames(e.target.value);
      const byDesc = mainFilterRecipesByDescriptions(e.target.value);
      const byIngr = mainFilterRecipesByIngredients(e.target.value);
      [...byNames, ...byDesc, ...byIngr].sort((a, b) => a > b).forEach((el) => filteredValues.set(el, el));

      const arrayOfRecipesId = Array.from(filteredValues.values());
      arrayOfRecipesId.forEach((el) => {
        recipes.forEach((e) => {
          if (e.id === el) {
            getDomRecipes(e);
          }
        });
      });
    }
  });
}

export function getDomRecipes(element) {
  const dom = `
  <div class="col-md card-item-flex">
    <a href="#" class="text-decoration-none text-dark">
      <div class="card">
        <img src="https://via.placeholder.com/380x180.jpg" class="card-img-top" alt="..." />
        <div class="card-body card-item-container">
          <h5 class="card-title d-flex align-items-start justify-content-between fs-5 mb-1">
            ${element.name}
            <span class="fw-bold d-flex align-items-center recipe-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="clock-icon" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
              </svg>
              ${element.time} min
            </span>
          </h5>
          <div class="d-flex align-items-start justify-content-between gap-3 recipe-content-container">
            <div class="d-flex flex-column w-50 ingredients-container">
              ${element.ingredients
                .map((item) => {
                  return `<div class="card-text"><span class="fw-semibold">${item.ingredient} :</span> 
                ${item.quantity ? item.quantity : ''}
                ${item.unit ? (item.unit.length > 2 ? item.unit : ` ${item.unit}`) : ''}</div>`;
                })
                .join('')}
            </div>
            <div class="card-text card-text-custom w-50">${element.description}</div>
          </div>
        </div>
      </div>
    </a>
  </div>
  `;
  const mainContainer = document.querySelector('#recipes-container');
  mainContainer.innerHTML += dom;
}
