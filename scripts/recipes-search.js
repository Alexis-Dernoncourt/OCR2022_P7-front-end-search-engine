import { recipes } from '../data/recipes.js';
import { sanitizeIngredientsMap, findRecipesForTagSearch, getDataForIngredientsFilter, getDataForAppliancesFilter, getDataForUstensilsFilter, handleClickOnFilterElement, handleDeleteFilterElement } from './filters.js';
import { capitalizeText } from './utils.js';

function makeNamesMap() {
  const mapOfNames = new Map();
  for (let i = 0; i < recipes.length; i++) {
    mapOfNames.set({ id: recipes[i].id }, { name: recipes[i].name });
  }
  return mapOfNames;
}

function makeDescriptionsMap() {
  const mapOfDescriptions = new Map();
  for (let i = 0; i < recipes.length; i++) {
    mapOfDescriptions.set({ id: recipes[i].id }, { desc: recipes[i].description });
  };
  return mapOfDescriptions;
}

function sortArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

function filteringDatas(stringValue, datas, context) {
  const arrayFromDatas = Array.from(datas);
  const filteredDatas = new Map();
  if (stringValue && stringValue.length >= 3) {
    for (let i = 0; i < arrayFromDatas.length; i++) {
      if (arrayFromDatas[i][1][context].toLowerCase().includes(stringValue.toLowerCase())) {
        filteredDatas.set(i, arrayFromDatas[i][0].id);
      }
    }
    return sortArray(Array.from(filteredDatas.values()));
  } else {
    return sortArray(arrayFromDatas);
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
  const mainContainer = document.querySelector('#recipes-container');
  const mainSearchInput = document.getElementById('searchFormControlInput');
  const selectedFilterElements = document.querySelectorAll('#badges-filter-items-container .badge');
  const tagFiltersArray = findRecipesForTagSearch();
  let byNames, byDesc, byIngr;
  let baseArray = [];
  let testArr = [];

  // Filter the recipes if there's no value into the main search input and the user selected some tag
  if(!mainSearchInput?.value && !e.target?.value) {
    if (tagFiltersArray.length > 0) {
      let filteredRecipesIds = [];
      for (let i = 0; i < tagFiltersArray.length; i++) {
        for (let r = 0; r < recipes.length; r++) {
          if (recipes[r].id === tagFiltersArray[i].recipeId) {
            filteredRecipesIds.push(recipes[r].id)
          }
        }
      }
      window.mainSearchArr = filteredRecipesIds;
    }
  }
  
  if (
    e.target?.value?.length >= 3 ||
    e.target.type === 'search' ||
    (e.type === 'click' && (e.target.closest('#searchFormControlInput') || e.target.closest('.accordion') || e.target.closest('#badges-filter-items-container'))) ||
    !e.target.value
    ) {
      
    // Always display all the recipes to the user if there's no tag selected and no search value
    if (tagFiltersArray.length <= 0 && (!byNames && !byDesc && !byIngr)) {
      let recipesArray = [];
      for (let r = 0; r < recipes.length; r++) {
        recipesArray.push(recipes[r].id);
      }
      window.mainSearchArr = recipesArray;
    }

    if (e.target?.value) {
      byNames = mainFilterRecipesByNames(e.target?.value);
      byDesc = mainFilterRecipesByDescriptions(e.target?.value);
      byIngr = mainFilterRecipesByIngredients(e.target?.value);
    } else if (mainSearchInput?.value && mainSearchInput?.value.length >= 3) {
      byNames = mainFilterRecipesByNames(mainSearchInput?.value);
      byDesc = mainFilterRecipesByDescriptions(mainSearchInput?.value);
      byIngr = mainFilterRecipesByIngredients(mainSearchInput?.value);
    }
    
    // No teg selected but value entered into main serach input
    if (tagFiltersArray.length <= 0 && byNames && byDesc && byIngr) {
      baseArray = new Set(sortArray([...byNames, ...byDesc, ...byIngr]));
      window.mainSearchArr = Array.from(baseArray.values());
    }

    // If there is one or more tag selected by user
    if (tagFiltersArray.length > 0) {
      if (byNames || byDesc || byIngr) {
        baseArray = new Set(sortArray([...byNames, ...byDesc, ...byIngr]));
      }

      if (baseArray.size === 0) { // pas de recherche entrée dans la barre principale
        for (let i = 0; i < tagFiltersArray.length; i++) {
          const el = tagFiltersArray[i];
          for (let r = 0; r < recipes.length; r++) {
            if (recipes[r].id === el.recipeId) {
              testArr.push(recipes[r].id);
            }
          }
        }
        window.mainSearchArr = sortArray(testArr);
      }

      // If there is only one tag selected
      if (selectedFilterElements.length === 1) {
        if (baseArray.size > 0) {
          for (let i = 0; i < Array.from(baseArray.values()).length; i++) {
            const item = Array.from(baseArray.values())[i];
            for (let j = 0; j < tagFiltersArray.length; j++) {
              const el = tagFiltersArray[j];
              if (el.recipeId === item) {
                testArr.push(item);
              }
            }
          }
          window.mainSearchArr = testArr;

          for (let i = 0; i < window.mainSearchArr.length; i++) {
            const element = window.mainSearchArr[i];
            let recipeDetails;
            for (let i = 0; i < recipes.length; i++) {
              if (recipes[i].id === element) {
                recipeDetails = recipes[i];
                break;
              }
            }
            const ingredientValues = [];
            const ustensilsValues = [];
            const applianceValues = [recipeDetails.appliance.toLowerCase()];
            for (let i = 0; i < recipeDetails.ingredients.length; i++) {
              const el = recipeDetails.ingredients[i];
              ingredientValues.push(el.ingredient.toLowerCase());
            }
            for (let i = 0; i < recipeDetails.ustensils.length; i++) {
              ustensilsValues.push(recipeDetails.ustensils[i].toLowerCase());
            }
            getDataForIngredientsFilter(sortArray(ingredientValues));
            getDataForAppliancesFilter(sortArray(applianceValues));
            getDataForUstensilsFilter(sortArray(ustensilsValues));
            handleClickOnFilterElement();
            handleDeleteFilterElement();
          }
        }
      } else {
        // There is two or more tag selected
        if (baseArray.size > 0) {
          const arrayToCompare = Array.from(baseArray.values());
          const filteredRecipes = [];

          // Main loop
          for (let i = 0; i < arrayToCompare.length; i++) {
            const el = arrayToCompare[i];

            // Get the recipes details
            let recipeDetails;
            for (let i = 0; i < recipes.length; i++) {
              const recipe = recipes[i];
              if (recipe.id === el) {
                recipeDetails = recipe;
                break;
              }
            }

            // Get the required tags selected by user
            const requiredTags = new Set();
            for (let i = 0; i < tagFiltersArray.length; i++) {
              const tag = tagFiltersArray[i];
              requiredTags.add(tag.value);
            }


            // Get the scope of the tag (ingredient, appliance or ustensil)
            let scopeOfTag = new Set();
            for (let i = 0; i < tagFiltersArray.length; i++) {
              const tag = tagFiltersArray[i];
              scopeOfTag.add(tag.scope);
            }


            // Get all ingredients/appliance/ustensils values for the current recipe
            let ingredientValues = [];
            let ustensilsValues = [];
            const applianceValues = [recipeDetails.appliance.toLowerCase()];
            for (let i = 0; i < recipeDetails.ingredients.length; i++) {
              const el = recipeDetails.ingredients[i];
              ingredientValues.push(el.ingredient.toLowerCase());
            }
            for (let i = 0; i < recipeDetails.ustensils.length; i++) {
              const el = recipeDetails.ustensils[i];
              ustensilsValues.push(el.toLowerCase());
            }
            
            // Get an array of all tag scope-identifier
            const selectedFilterElementsArray = Array.from(selectedFilterElements);
            let filterElementsArray = [];
            for (let i = 0; i < selectedFilterElementsArray.length; i++) {
              const tagDomElement = selectedFilterElementsArray[i];
              const identifier = tagDomElement.dataset.identifier;
              const splitIdentifier = identifier.split('-');
              const tag = splitIdentifier[0];
              filterElementsArray.push(tag);
            }

            // Main loop utility variable to capture the recipe that should be added
            let shouldAddRecipe = true;

            // If scope = ingredients
            if (Array.from(scopeOfTag.values()).includes('ingredients')) {
              getDataForIngredientsFilter(ingredientValues);
              handleClickOnFilterElement();
              handleDeleteFilterElement();

              // Get an array of the selected tags with the 'ingredient' scope
              let filteredElementsTagArray = [];
              // Get an array of the selected tags values with the 'ingredient' scope
              let ingredientFilterArray = [];

              // Get all the selected tags with the scope of 'ingredient'
              for (let i = 0; i < filterElementsArray.length; i++) {
                const ingredientTag = filterElementsArray[i];
                if (ingredientTag === 'ingredient') {
                  filteredElementsTagArray.push(ingredientTag);
                }
              }
              
              // Get the value of all selected tags with the scope of 'ingredient'
              for (let i = 0; i < selectedFilterElementsArray.length; i++) {
                const tagDomElement = selectedFilterElementsArray[i];
                
                if (tagDomElement.dataset.identifier.split('-')[0] === 'ingredient') {
                  if (tagDomElement !== undefined) {
                    ingredientFilterArray.push(tagDomElement.dataset.item.split('-').join(' '));
                  }
                }
              }

              // If more of one 'ingredient' tag selected
              if (filteredElementsTagArray.length > 1) {
                const totalFilterElementsMatch = [];
                for (let i = 0; i < ingredientValues.length; i++) {
                  const tag = ingredientValues[i];
                  for (let j = 0; j < ingredientFilterArray.length; j++) {
                    const tag2 = ingredientFilterArray[j];
                    if (tag === tag2) {
                      totalFilterElementsMatch.push(tag);
                      break;
                    }
                  }
                }
                if (totalFilterElementsMatch.length !== ingredientFilterArray.length) {
                  shouldAddRecipe = false;
                }
              } else { // If there is only one 'ingredient' tag selected             
                const requiredTagsArr = Array.from(requiredTags.values());
                let hasTag = [];
                for (let i = 0; i < requiredTagsArr.length; i++) {
                  const tag = requiredTagsArr[i];                  
                  if (ingredientValues.includes(tag)) {
                    hasTag.push(tag);
                  }
                }

                if (!hasTag.length) {
                  shouldAddRecipe = false;
                }
              }
            }

            // If scope = appliance
            if (Array.from(scopeOfTag.values()).includes('appliance')) {
              // Get an array of the selected tags with the 'appliance' scope
              let filteredApplianceTagArray = [];
              // Get an array of the selected tags values with the 'appliance' scope
              let applianceFilterArray = [];
              const selectedFilterElementsArray = Array.from(selectedFilterElements);

              // Get all the selected tags with the scope of 'appliance'
              for (let i = 0; i < filterElementsArray.length; i++) {
                const applianceTag = filterElementsArray[i];
                if (applianceTag === 'appliance') {
                  filteredApplianceTagArray.push(applianceTag);
                }
              }

              // Get the value of all selected tags with the scope of 'appliance'
              for (let i = 0; i < selectedFilterElementsArray.length; i++) {
                const tagDomElement = selectedFilterElementsArray[i];                
                if (tagDomElement.dataset.identifier.split('-')[0] === 'appliance') {
                  const item = tagDomElement.dataset.item.split('-').join(' ');
                  if (item !== undefined) {
                    applianceFilterArray.push(item);
                  }
                }
              }

              // If more of one 'appliance' tag selected
              if (filteredApplianceTagArray.length > 1) {
                if (applianceFilterArray.length > 1) {
                  console.error('Too much appliance tags');
                }
                shouldAddRecipe = false;
              } else { // If there is only one 'appliance' tag selected
                const requiredTagsArr = Array.from(requiredTags.values());
                let hasTag = [];
                for (let i = 0; i < requiredTagsArr.length; i++) {
                  const tag = requiredTagsArr[i];
                  if (applianceValues.includes(tag)) {
                    hasTag.push(tag);
                  }
                }

                if (!hasTag.length) {
                  shouldAddRecipe = false;
                }
              }
            }

            // If scope = ustensils
            if (Array.from(scopeOfTag.values()).includes('ustensils')) {
              getDataForUstensilsFilter(ustensilsValues);
              handleClickOnFilterElement();
              handleDeleteFilterElement();

              // Get an array of the selected tags with the 'ustensils' scope
              let filteredUstensilsTagArray = [];
              // Get an array of the selected tags values with the 'ustensils' scope
              let ustensilsFilterArray = [];
              const selectedFilterElementsArray = Array.from(selectedFilterElements);

              // Get all the selected tags with the scope of 'ustensils'
              for (let i = 0; i < filterElementsArray.length; i++) {
                const ustensilsTag = filterElementsArray[i];
                if (ustensilsTag === 'ustensils') {
                  filteredUstensilsTagArray.push(ustensilsTag);
                }
              }

              // Get the value of all selected tags with the scope of 'ustensils'
              for (let i = 0; i < selectedFilterElementsArray.length; i++) {
                const tagDomElement = selectedFilterElementsArray[i];
                if (tagDomElement.dataset.identifier.split('-')[0] === 'ustensils') {
                  const item = tagDomElement.dataset.item.split('-').join(' ');
                  if (item !== undefined) {
                    ustensilsFilterArray.push(item);
                  }
                }
              }

              // If more of one 'ustensils' tag selected
              if (filteredUstensilsTagArray.length > 1) {
                const totalFilterElementsMatch = [];
                for (let i = 0; i < ustensilsValues.length; i++) {
                  const tag = ustensilsValues[i];
                  for (let j = 0; j < ustensilsFilterArray.length; j++) {
                    const tag2 = ustensilsFilterArray[j];
                    if (tag === tag2) {
                      totalFilterElementsMatch.push(tag);
                      break;
                    }
                  }
                }
                if (totalFilterElementsMatch.length !== ustensilsFilterArray.length) {
                  shouldAddRecipe = false;
                }
              } else { // If there is only one 'ustensils' tag selected
                const requiredTagsArr = Array.from(requiredTags.values());
                let hasTag = [];
                for (let i = 0; i < requiredTagsArr.length; i++) {
                  const tag = requiredTagsArr[i];                  
                  if (ustensilsValues.includes(tag)) {
                    hasTag.push(tag);
                  }
                }

                if (!hasTag.length) {
                  shouldAddRecipe = false;
                }
              }
            }

            // If a recipe match, push it into the array
            if (shouldAddRecipe) {
              filteredRecipes.push(el);
            }
          }

          // Get all the recipes found into the main search array to display them
          window.mainSearchArr = filteredRecipes;
        }
      }
    };

    // Display the total of recipes found
    const totalRecipesInfoExist = document.querySelector('#total-recipes-info');
    if (window.mainSearchArr?.length <= 50 || (e.target.type === 'search' && e.target?.value?.length >= 3)) {
      mainContainer.innerHTML = '';
    }
    
    // Display error message
    if (window.mainSearchArr?.length === 0 || (e.target.type === 'search' && e.target?.value?.length < 3 && !tagFiltersArray)) {
      totalRecipesInfoExist?.remove();
      if (window.mainSearchArr?.length === 0) {
        const searchValue = document.querySelector('#searchFormControlInput');
        getNotFoundDom(`Aucune recette ne contient "${searchValue.value}". Vous pouvez chercher "tarte aux pommes", "poisson", etc...`);
      }
      return;
    }

    // Display recipes found
    for (let i = 0; i < window.mainSearchArr.length; i++) {
      for (let x = 0; x < recipes.length; x++) {
        if (recipes[x].id === window.mainSearchArr[i]) {
          getDomRecipes(recipes[x]);
        }
      }
    }

    // Display/hide the total of recipes found
    if (window.mainSearchArr.length <= 50) {
      totalRecipesInfoExist?.remove();
      const totalRecipes = document.createElement('p');
      totalRecipes.setAttribute('id', 'total-recipes-info');
      totalRecipes.textContent = `Total de recettes trouvées : ${window.mainSearchArr.length}`;
      totalRecipes.style.color = '#545454';
      mainContainer.before(totalRecipes);
    } else {
      totalRecipesInfoExist?.remove();
    }
  }
}

// Utility function to create the dom of the card recipes
function getDomRecipes(element) {
  function getRecipeDetails() {
    let string = '';
    for (let i = 0; i < element.ingredients.length; i++) {
      const item = (element.ingredients[i]);
      string += `<div class="card-text"><span class="fw-semibold">${capitalizeText(item.ingredient)} :</span> 
        ${item.quantity ? item.quantity : ''}
        ${item.unit ? (item.unit.length > 2 ? item.unit : ` ${item.unit}`) : ''}
      </div>`
    }
    return string;
  }

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
            ${getRecipeDetails()}
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

function getNotFoundDom(message = 'Votre recherche ne donne rien ?') {
  const dom = `
  <div class="container col-md card-item-flex notfound">
    <p>${message}</p>
    <p>Aide: entrez 3 caractères minimum ou essayez d'utiliser les filtres !</p>
  </div>
  `;
  const mainContainer = document.querySelector('#recipes-container');
  mainContainer.innerHTML += dom;
}

export function getModalDomOfRecipeDetails(recipeId) {
  const detailsOfRecipe = getRecipeDetails(recipeId);
  getRecipeModalDom(detailsOfRecipe);
}

// Show the recipe details into modal
function getRecipeDetails(recipeId) {
  let recipeToShow = [];
  for (let i = 0; i < recipes.length; i++) {
    const res = recipes[i];
    if (res.id === parseInt(recipeId)) {
      recipeToShow.push(res);
    }
  }
  return recipeToShow[0];
}

// Utility function to create the dom for the recipe details modal
function getRecipeModalDom(recipe) {
  const desc = recipe.description.split('. ');
  function getDescDetails() {
    let string = '';
    for (let i = 0; i < desc.length; i++) {
      const el = (desc[i]);
      string += `<li>${el}.</li>`
    }
    return string;
  }

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
          ${getDescDetails()}
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
