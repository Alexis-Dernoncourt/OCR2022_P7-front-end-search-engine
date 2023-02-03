import { recipes } from '../data/recipes.js';
import { capitalizeText } from './utils.js';

export function addInputIntoFilterOnOpen() {
  const accordionElements = document.querySelectorAll('.accordion');
  accordionElements.forEach((e) => {
    e.addEventListener('click', function (e) {
      // toggle the display of filter form on click
      const inputForm = document.getElementById(`search-${this.id}`);
      const dropdownBtn = document.getElementById(`btn-${this.id}`);
      const dropdownInputContainer = document.getElementById(`${this.id}-input-container`);

      if (e.target !== inputForm) {
        if (e.target.parentNode.id === `${this.id}-input-container` || e.target.parentNode.id === `heading-${this.id}`) {
          inputForm.value = '';
          getDataForIngredientsFilter();
          getDataForAppliancesFilter();
          getDataForUstensilsFilter();
          handleClickOnFilterElement();
          handleDeleteFilterElement();
          dropdownBtn.classList.toggle('d-none');
          dropdownInputContainer.classList.toggle('d-none');
        }
      }
    });
  });
}

// TODO: refactor functions below (duplication)
function makeIngredientsArray() {
  const ingredientsMap = new Map();
  recipes.forEach((e) => {
    e.ingredients.forEach((el) => {
      const lowerCaseElement = el.ingredient.toLowerCase();
      ingredientsMap.set(capitalizeText(lowerCaseElement), capitalizeText(lowerCaseElement));
    });
  });
  return Array.from(ingredientsMap.values());
}

function sanitizeIngredientsArray() {
  const ingredientsMap = new Map();
  const arrayOfRecipes = makeIngredientsArray();
  arrayOfRecipes.forEach((e) => {
    const elementLength = e.length;
    const lastChar = e.charAt(elementLength - 1);
    const elementWithoutPlurality = e.substring(0, elementLength - 1);
    if (lastChar === 's' && arrayOfRecipes.includes(elementWithoutPlurality)) {
      return;
    } else {
      ingredientsMap.set(capitalizeText(e), capitalizeText(e));
    }
  });
  return Array.from(ingredientsMap.values());
}

function makeAppliancesArray() {
  let appliancesMap = new Map();
  recipes.forEach((e) => {
    appliancesMap.set(e.appliance, e.appliance);
  });
  return Array.from(appliancesMap.values());
}

function makeUstensilsArray() {
  let ustensilsMap = new Map();
  recipes.forEach((e) => {
    e.ustensils.forEach((el) => {
      const lowerCaseElement = el.toLowerCase();
      ustensilsMap.set(capitalizeText(lowerCaseElement), capitalizeText(lowerCaseElement));
    });
  });
  return Array.from(ustensilsMap.values());
}

function filterRecipesByIngredients(searchFilter) {
  const arrayOfIngredients = sanitizeIngredientsArray();
  if (searchFilter && searchFilter.length >= 3) {
    const filteredArray = arrayOfIngredients.filter((e) => e.toLowerCase().includes(searchFilter.toLowerCase()));
    return filteredArray.sort(Intl.Collator().compare);
  } else {
    return arrayOfIngredients.sort(Intl.Collator().compare);
  }
}

function filterRecipesByAppliances(searchFilter) {
  const arrayOfAppliances = makeAppliancesArray();
  if (searchFilter && searchFilter.length >= 3) {
    const filteredArray = arrayOfAppliances.filter((e) => e.toLowerCase().includes(searchFilter.toLowerCase()));
    return filteredArray.sort(Intl.Collator().compare);
  } else {
    return arrayOfAppliances.sort(Intl.Collator().compare);
  }
}

function filterRecipesByUstensils(searchFilter) {
  const arrayOfUstensils = makeUstensilsArray();
  if (searchFilter && searchFilter.length >= 3) {
    const filteredArray = arrayOfUstensils.filter((e) => e.toLowerCase().includes(searchFilter.toLowerCase()));
    return filteredArray.sort(Intl.Collator().compare);
  } else {
    return arrayOfUstensils.sort(Intl.Collator().compare);
  }
}

export function getDataForIngredientsFilter(targetValue) {
  const container = document.querySelector('.ingredients-items-body');
  const pElement = document.createElement('p');
  container.innerHTML = '';
  const ingredientsData = filterRecipesByIngredients(targetValue);
  ingredientsData.forEach((ingredient) => {
    const dom = `
      <p class="ingredient-element" data-ingredient="${ingredient}">${ingredient}</p>
    `;
    pElement.append(ingredient);
    container.innerHTML += dom;
  });
}

export function getDataForAppliancesFilter(targetValue) {
  const container = document.querySelector('.appliances-items-body');
  const pElement = document.createElement('p');
  container.innerHTML = '';
  const appliancesData = filterRecipesByAppliances(targetValue);
  appliancesData.forEach((appliance) => {
    const dom = `
      <p class="appliance-element" data-appliance="${appliance}">${appliance}</p>
    `;
    pElement.append(appliance);
    container.innerHTML += dom;
  });
}

export function getDataForUstensilsFilter(targetValue) {
  const container = document.querySelector('.ustensils-items-body');
  const pElement = document.createElement('p');
  container.innerHTML = '';
  const ustensilsData = filterRecipesByUstensils(targetValue);
  ustensilsData.forEach((ustensil) => {
    const dom = `
      <p class="appliance-element" data-appliance="${ustensil}">${ustensil}</p>
    `;
    pElement.append(ustensil);
    container.innerHTML += dom;
  });
}

export function handleClickOnFilterElement() {
  const ingredientElements = document.querySelectorAll('.ingredient-element');
  const applianceElements = document.querySelectorAll('.appliance-element');
  const ustensilElements = document.querySelectorAll('.ustensils-element');

  handleClickUtilityFunction('ingredient', ingredientElements);
  handleClickUtilityFunction('appliance', applianceElements);
  handleClickUtilityFunction('ustensils', ustensilElements);
}

function handleClickUtilityFunction(element, target) {
  target.forEach((e) =>
    e.addEventListener('click', (e) => {
      const classlistOfElement = e.target.parentElement.parentElement.parentElement.classList;
      const classOfElement = classlistOfElement[classlistOfElement.length - 1];
      addDomElementOnFilterSelected(e.target.dataset[`${element}`], classOfElement);
    })
  );
}

function addDomElementOnFilterSelected(element, classOfElement) {
  const filterItemsContainer = document.querySelector('#badges-filter-items-container');
  const elementWithComas = element.toLowerCase().split(' ').join('-');
  const filterItems = document.querySelectorAll('.badge');

  const dom = `
  <span data-item='${elementWithComas}' class='badge py-2 d-inline-flex align-items-center justify-content-evenly text-${classOfElement}'>
    ${element}
    <span class='ps-2 closefilter close-${elementWithComas}'>
      <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='close-${elementWithComas}' viewBox='0 0 16 16'>
        <path class='close-${elementWithComas}' d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
        <path class='close-${elementWithComas}' d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' />
      </svg>
    </span>
  </span>`;

  if (filterItems.length > 0) {
    const arrayOfDatasets = Array.from(filterItems).map((e) => e.dataset.item);
    if (arrayOfDatasets.includes(elementWithComas)) {
      return;
    }
    filterItemsContainer.innerHTML += dom;
  } else {
    filterItemsContainer.innerHTML = dom;
  }
  handleDeleteFilterElement();
}

export function sortFilterElementsOnSearchInput() {
  const filterInputElements = document.querySelectorAll('#search-accordion1, #search-accordion2, #search-accordion3');
  filterInputElements.forEach((e) => {
    e.addEventListener('keyup', function (e) {
      const valueLength = e.target.value.length;

      if (valueLength === 0) {
        if (this.id === 'search-accordion1') {
          getDataForIngredientsFilter();
          handleClickOnFilterElement();
          handleDeleteFilterElement();
        }
        if (this.id === 'search-accordion2') {
          getDataForAppliancesFilter();
          handleClickOnFilterElement();
          handleDeleteFilterElement();
        }
        if (this.id === 'search-accordion3') {
          getDataForUstensilsFilter();
          handleClickOnFilterElement();
          handleDeleteFilterElement();
        }
      } else if (valueLength && valueLength >= 3) {
        if (this.id === 'search-accordion1') {
          getDataForIngredientsFilter(e.target.value);
          handleClickOnFilterElement();
          handleDeleteFilterElement();
        }
        if (this.id === 'search-accordion2') {
          getDataForAppliancesFilter(e.target.value);
          handleClickOnFilterElement();
          handleDeleteFilterElement();
        }
        if (this.id === 'search-accordion3') {
          getDataForUstensilsFilter(e.target.value);
          handleClickOnFilterElement();
          handleDeleteFilterElement();
        }
      }
    });
  });
}

function handleDeleteFilterElement() {
  const filterItems = document.querySelectorAll('.badge');

  filterItems &&
    filterItems.forEach((e) =>
      e.addEventListener('click', (e) => {
        const elementClasslistString = e.target.classList.toString();
        if (elementClasslistString.includes('close-')) {
          const dataElement = elementClasslistString.split('close-')[1];
          const itemToDelete = document.querySelector(`[data-item="${dataElement}"]`);
          itemToDelete && itemToDelete.remove();
        }
      })
    );
}
