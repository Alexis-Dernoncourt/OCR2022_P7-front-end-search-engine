import { recipes } from '../data/recipes.js';
import { sanitizeIngredientsMap, findRecipesForTagSearch } from './filters.js';

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

export function getIdOfRecipesSearchUtils(e) {
  const filteredValues = new Map();
  if (
    e.target?.value?.length >= 3 ||
    e.target.type === 'search' ||
    (e.type === 'click' && (e.target.closest('#searchFormControlInput') || e.target.closest('.accordion') || e.target.closest('#badges-filter-items-container'))) ||
    !e.target.value
  ) {
    const mainContainer = document.querySelector('#recipes-container');
    const mainSearchInput = document.getElementById('searchFormControlInput');
    let mixedArray = [];
    let byNames, byDesc, byIngr;
    let tagFiltersArray = findRecipesForTagSearch();

    if (e.target?.value) {
      byNames = mainFilterRecipesByNames(e.target?.value);
      byDesc = mainFilterRecipesByDescriptions(e.target?.value);
      byIngr = mainFilterRecipesByIngredients(e.target?.value);
    }
    if (mainSearchInput?.value && mainSearchInput?.value.length >= 3) {
      byNames = mainFilterRecipesByNames(mainSearchInput?.value);
      byDesc = mainFilterRecipesByDescriptions(mainSearchInput?.value);
      byIngr = mainFilterRecipesByIngredients(mainSearchInput?.value);
    }

    // TODO: check if there is some filters here to update mixedArray
    if (tagFiltersArray && byNames && byDesc && byIngr) {
      mixedArray = [...byNames, ...byDesc, ...byIngr, ...tagFiltersArray];
    } else if (byNames && byDesc && byIngr) {
      mixedArray = [...byNames, ...byDesc, ...byIngr];
    } else if (tagFiltersArray) {
      mixedArray = [...tagFiltersArray];
    }
    mixedArray?.sort((a, b) => a > b).forEach((el) => filteredValues.set(el, el));

    const arrayOfRecipesId = Array.from(filteredValues.values());

    const totalRecipesInfoExist = document.querySelector('#total-recipes-info');
    mainContainer.innerHTML = '';
    if (mixedArray.length === 0 || (e.target.type === 'search' && e.target?.value?.length < 3 && !tagFiltersArray)) {
      totalRecipesInfoExist?.remove();
      getNotFoundDom();
      return;
    }

    arrayOfRecipesId.forEach((el) => {
      recipes.forEach((e) => {
        if (e.id === el) {
          getDomRecipes(e);
        }
      });
    });

    // Display/hide the total of recipes found
    if (arrayOfRecipesId.length <= 250) {
      totalRecipesInfoExist?.remove();
      const totalRecipes = document.createElement('p');
      totalRecipes.setAttribute('id', 'total-recipes-info');
      totalRecipes.textContent = `Total de recettes trouvées : ${arrayOfRecipesId.length}`;
      totalRecipes.style.color = '#545454';
      mainContainer.before(totalRecipes);
    } else {
      totalRecipesInfoExist?.remove();
    }
  }
}

function getDomRecipes(element) {
  const dom = `
  <div class="col-md card-item-flex">
    <div class="card" data-show="recipe#${element.id}">
      <img src="assets/images/food-img.jpg" class="card-img-top" alt="..."/>
      <div class="card-body card-item-container">
        <h5 class="card-title d-flex align-items-start justify-content-between fs-5 mb-1">
          ${element.name}
          <span class="fw-bold d-flex align-items-center recipe-time">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="clock-icon" viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
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
  </div>
  `;
  const mainContainer = document.querySelector('#recipes-container');
  mainContainer.innerHTML += dom;
}

function getNotFoundDom() {
  const dom = `
  <div class="container col-md card-item-flex">
    <p>Recherchez une recette pour les voir s'afficher içi..</p>
  </div>
  `;
  const mainContainer = document.querySelector('#recipes-container');
  mainContainer.innerHTML += dom;
}

export function getModalDomOfRecipeDetails(recipeId) {
  const detailsOfRecipe = getRecipeDetails(recipeId);
  if (detailsOfRecipe === 'error') {
    console.error('ouuupssss not found !!');
  } else {
    getRecipeModalDom(detailsOfRecipe);
  }
}

function getRecipeDetails(recipeId) {
  try {
    return recipes.find((el) => el.id === parseInt(recipeId));
  } catch (error) {
    // Return: not found error
    return 'error';
  }
}

function getRecipeModalDom(recipe) {
  const desc = recipe.description.split('. ');
  const dom = `
    <div class="modal-dialog modal-xl w-100-md">
      <div class="modal-content h-100">
        <div class="modal-header">
          <div class="modal-image-head-container">
            <img src="assets/images/food-img.jpg" alt="" class="modal-head-img" />
            <h5 class="modal-title" id="staticBackdropLabel">${recipe.name}</h5>
          </div>
          <button type="button" class="btn-close" data-bs-dismiss="staticBackdrop" aria-label="Fermer" data-close="recipe-modal"></button>
        </div>
        <div class="modal-body">
        <div class="d-flex jusctify-content-end mb-2">
          <span class="fw-bold d-flex align-items-center recipe-time ms-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="clock-icon" viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
            </svg>
            Durée: ${recipe.time} min
          </span>
        </div>
        <ol>
          ${desc.map((el) => `<li>${el}.</li>`).join('')}
        </ol>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="staticBackdrop" data-close="recipe-modal">Fermer</button>
        </div>
      </div>
    </div>
  `;
  const mainElement = document.querySelector('main');
  const modalContainer = document.querySelector('.modal');
  const bodyElement = document.querySelector('body');
  modalContainer.innerHTML = '';
  modalContainer.innerHTML += dom;
  modalContainer.classList.toggle('d-none');
  modalContainer.classList.toggle('d-grid');
  modalContainer.setAttribute('aria-hidden', 'false');
  mainElement.setAttribute('aria-hidden', 'true');
  bodyElement.style.overflowY = 'hidden';
  window.history.replaceState({ id: recipe.id }, `Page recette ${recipe.name}`, `#recipe=${recipe.id}`);
}
