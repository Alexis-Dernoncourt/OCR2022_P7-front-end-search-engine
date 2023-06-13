import { recipes } from '../data/recipes.js';
import { capitalizeText } from './utils.js';

export function addInputIntoFilterOnOpen(e) {
  // toggle the display of filter form on click
  const splitedTargetId = e.target.id.split('-')[1];
  const inputForm = document.getElementById(`search-${splitedTargetId}`);
  const dropdownBtn = document.getElementById(`btn-${splitedTargetId}`);
  const dropdownInputContainer = document.getElementById(`${splitedTargetId}-input-container`);

  if (e.target !== inputForm) {
    if (e.target.parentNode.id === `${splitedTargetId}-input-container` || e.target.parentNode.id === `heading-${splitedTargetId}`) {
      inputForm.value = '';
    }
    getDataForIngredientsFilter();
    getDataForAppliancesFilter();
    getDataForUstensilsFilter();
    handleClickOnFilterElement();
    handleDeleteFilterElement();
    dropdownBtn?.classList.toggle('d-none');
    dropdownInputContainer?.classList.toggle('d-none');
  }
}

export function sanitizeIngredientsMap(param) {
  const ingredientsMap = new Map();
  param?.forEach((tab) => {
    tab.forEach(element => {
      const elementLength = element.length;
      const lastChar = element.charAt(elementLength - 1);
      const elementWithoutPlurality = element.substring(0, elementLength - 1);
      if (lastChar === 's' && tab.includes(elementWithoutPlurality)) {
        return;
      } else {
        ingredientsMap.set({ id: element }, { ingredient: capitalizeText(element) });
      }
    })
  });
  return ingredientsMap;
}

function filterRecipesByIngredients(searchFilter) {
  const filteredValues = recipes.filter(element => {
    if (window.mainSearchArr.includes(element.id)) {
      return true;
    }
  });
  const allFilteredValues = filteredValues.map(el => {
    return el.ingredients.map(ingredients => ingredients.ingredient)
  });
  const mapOfIngredientsSanitized = sanitizeIngredientsMap(allFilteredValues);
  const arrayOfIngredients = Array.from(mapOfIngredientsSanitized.values()).map((e) => e.ingredient);
  const filterIngredients = new Map();
  const searchIngredient = new Map();
  if (searchFilter && searchFilter.length >= 3) {
    if (window.mainSearchArr.length === 0) {
      return []
    }
    arrayOfIngredients.forEach((e) => {
      const existingFilters = checkExistingFilterElements().map(el => el.split('_')[1].split('-').join(' '));

      if (!existingFilters.includes(e.toLowerCase())) {
        searchIngredient.set(e, e);
      }
    });

    return Array.from(searchIngredient.values()).sort(Intl.Collator().compare);
  } else {
    arrayOfIngredients.forEach((el) => {
      filterIngredients.set(el, el);
    });
    return Array.from(filterIngredients.values()).sort(Intl.Collator().compare);
  }
}

function filterRecipesByAppliances(searchFilter) {
  const filteredValues = recipes.filter(element => {
    if (window.mainSearchArr.includes(element.id)) {
      return true;
    }
  });
  const allFilteredValues = filteredValues.map(el => el.appliance);
  const filterAppliance = new Map();
  const searchAppliance = new Map();
  if (searchFilter) {
    if (window.mainSearchArr.length === 0) {
      return []
    }

    allFilteredValues.forEach((e) => {
      const existingFilters = checkExistingFilterElements().map(el => el.split('_')[1].split('-').join(' '));
      if (!existingFilters.includes(e.toLowerCase())) {
        searchAppliance.set(e, e);
      }
    });

    return Array.from(searchAppliance.values()).sort(Intl.Collator().compare);
  } else {
    allFilteredValues.forEach((el) => {
      filterAppliance.set(el, el);
    });
    return Array.from(filterAppliance.values()).sort(Intl.Collator().compare);
  }
}

function filterRecipesByUstensils(searchFilter) {
  const filteredValues = recipes.filter(element => {
    if (window.mainSearchArr.includes(element.id)) {
      return true;
    }
  });
  const allFilteredValues = filteredValues.map(el => {
    return el.ustensils.map(ustensil => ustensil)
  });
  const mapOfUstensilsSanitized = sanitizeIngredientsMap(allFilteredValues);
  const arrayOfUstensilsToSet = Array.from(mapOfUstensilsSanitized.values()).map((e) => e.ingredient);
  const arrayOfUstensils = Array.from(new Set(arrayOfUstensilsToSet).values())

  const filterUstensils = new Map();
  const searchUstensils = new Map();
  if (searchFilter) {
    if (window.mainSearchArr.length === 0) {
      return []
    }
    arrayOfUstensils.forEach((e) => {
      const existingFilters = checkExistingFilterElements().map(el => el.split('_')[1].split('-').join(' '));
      if (!existingFilters.includes(e.toLowerCase())) {
        searchUstensils.set(e, e);
      }
    });
    
    return Array.from(searchUstensils.values()).sort(Intl.Collator().compare);
  } else {
    arrayOfUstensils.forEach((el) => {
      filterUstensils.set(el, el);
    });
    return Array.from(filterUstensils.values()).sort(Intl.Collator().compare);
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
  if (window.mainSearchArr.length === 1) {
    const dom = `<small>Plus de filtre disponible...</small>`;
    container.innerHTML = '';
    container.innerHTML = dom;
  }
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
  if (window.mainSearchArr.length === 1) {
    const dom = `<small>Plus de filtre disponible...</small>`;
    container.innerHTML = '';
    container.innerHTML = dom;
  }
}

export function getDataForUstensilsFilter(targetValue) {
  const container = document.querySelector('.ustensils-items-body');
  const pElement = document.createElement('p');
  container.innerHTML = '';
  const ustensilsData = filterRecipesByUstensils(targetValue);
  ustensilsData.forEach((ustensil) => {
    const dom = `
      <p class="ustensils-element" data-ustensils="${ustensil}">${ustensil}</p>
    `;
    pElement.append(ustensil);
    container.innerHTML += dom;
  });
  if (window.mainSearchArr.length === 1) {
    const dom = `<small>Plus de filtre disponible...</small>`;
    container.innerHTML = '';
    container.innerHTML = dom;
  }
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
  target.forEach((el) => {
  el.addEventListener('click', (e) => {
      const classlistOfElement = e.target?.parentElement?.parentElement?.parentElement?.classList || e.target.classList;
      const classOfElement = classlistOfElement[classlistOfElement.length - 1];
      addDomElementOnFilterSelected(e.target.dataset[`${element}`], classOfElement, e.target.classList[0]);
    })
  });
}

function addDomElementOnFilterSelected(element, classOfElement, elementIdentifier) {
  const filterItemsContainer = document.querySelector('#badges-filter-items-container');
  const elementWithComas = element.toLowerCase().split(' ').join('-');
  const filterItems = document.querySelectorAll('.badge');
  const domFilterBtn1 = document.querySelector('#btn-accordion1');
  const domFilterBtn2 = document.querySelector('#btn-accordion2');
  const domFilterBtn3 = document.querySelector('#btn-accordion3');

  const dom = `
  <span data-item="${elementWithComas}" data-identifier="${elementIdentifier}" class="badge py-2 d-inline-flex align-items-center justify-content-evenly text-${classOfElement}">
    ${element}
    <span class="ps-2 closefilter close-${elementWithComas}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="close-${elementWithComas}" viewBox="0 0 16 16">
        <path class="close-${elementWithComas}" d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path class="close-${elementWithComas}" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
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

  if (domFilterBtn1.getAttribute('aria-expanded') === "true") {
    document.querySelector('#btn-accordion1').click()
  } else if (domFilterBtn2.getAttribute('aria-expanded') === "true") {
    document.querySelector('#btn-accordion2').click()
  } else if (domFilterBtn3.getAttribute('aria-expanded') === "true") {
    document.querySelector('#btn-accordion3').click()
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

export function handleDeleteFilterElement() {
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

function checkExistingFilterElements() {
  const stringsToMatchWith = ['appliance-element', 'ingredient-element', 'ustensils-element'];
  const filterMap = new Map();
  const selectedFilterElements = document.querySelectorAll('#badges-filter-items-container .badge');
  selectedFilterElements.forEach((element) => {
    if (stringsToMatchWith.includes(element.dataset.identifier)) {
      filterMap.set(`${element.dataset.item}_${element.dataset.identifier}`, `${element.dataset.identifier.split('-')[0]}_${element.dataset.item}`);
    }
  });
  return Array.from(filterMap.values());
}

export function findRecipesForTagSearch() {
  const arrayOfRecipesFromTags = new Map();
  const arrayOfTags = checkExistingFilterElements();

  arrayOfTags.forEach((tag) => {
    const splitedTag = tag.split('_');
    const tagValue = splitedTag[1].split('-').join(' ');
    recipes.forEach((recipe) => {
      if (splitedTag[0] === 'appliance') {
        if (recipe[splitedTag[0]].toLowerCase() === tagValue) {
          arrayOfRecipesFromTags.set(
            recipe.id, 
            {
              recipeId: recipe.id,
              scope: 'appliance',
              value: tagValue
            }
          );
        }
      } else if (splitedTag[0] === 'ingredient') {
        if (recipe[splitedTag[0] + 's']?.find((el) => el.ingredient.toLowerCase() === tagValue)) {
          arrayOfRecipesFromTags.set(
            recipe.id,
            {
              recipeId: recipe.id,
              scope: 'ingredients',
              value: tagValue
            }
          );
        }
      } else if (splitedTag[0] === 'ustensils') {
        if (recipe[splitedTag[0]]?.find((el) => el === tagValue)) {
          arrayOfRecipesFromTags.set(
            recipe.id,
            {
              recipeId: recipe.id,
              scope: 'ustensils',
              value: tagValue
            }
          );
        }
      }
    });
  });
  return Array.from(arrayOfRecipesFromTags.values());
}
