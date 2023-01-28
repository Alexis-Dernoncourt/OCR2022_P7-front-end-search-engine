import { recipes } from '../data/recipes.js';

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
          dropdownBtn.classList.toggle('d-none');
          dropdownInputContainer.classList.toggle('d-none');
        }
      }
    });
  });
}

function makeIngredientArray() {
  let arrayOfRecipes = [];
  recipes.forEach((e) => {
    for (const item of e.ingredients) {
      arrayOfRecipes.push(item.ingredient.toLowerCase());
    }
  });
  return arrayOfRecipes;
}

function capitalizeText(element) {
  const capitalizedElement = element?.charAt(0).toUpperCase() + element?.slice(1);
  return capitalizedElement;
}

function filterRecipesByIngredients() {
  let ingredientsMap = new Map();
  const arrayOfRecipes = makeIngredientArray();
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
  return ingredientsMap;
}

export function getDataForIngredientsFilter() {
  const container = document.querySelector('.ingredients-items-body');
  const ingredientsData = filterRecipesByIngredients();
  const ingredientsArray = Array.from(ingredientsData.values());
  const pElement = document.createElement('p');
  const sortedIngredients = ingredientsArray.sort(Intl.Collator().compare);
  sortedIngredients.forEach((ingredient) => {
    const dom = `
      <p class="ingredient-element" data-ingredient="${ingredient}">${ingredient}</p>
    `;
    pElement.append(ingredient);
    container.innerHTML += dom;
  });
}
