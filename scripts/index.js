import {
  addInputIntoFilterOnOpen,
  getDataForIngredientsFilter,
  getDataForAppliancesFilter,
  getDataForUstensilsFilter,
  handleClickOnFilterElement,
  sortFilterElementsOnSearchInput,
  findRecipesForTagSearch,
} from './filters.js';
import { getIdOfRecipesSearchUtils, getModalDomOfRecipeDetails } from './recipes-search.js';

getDataForIngredientsFilter();
getDataForAppliancesFilter();
getDataForUstensilsFilter();
getIdOfRecipesSearch();

function getIdOfRecipesSearch() {
  const mainSearchInput = document.getElementById('searchFormControlInput');
  const mainDiv = document.querySelector('body');
  mainSearchInput?.addEventListener('keyup', (e) => {
    getIdOfRecipesSearchUtils(e);
  });

  mainDiv.addEventListener('click', (e) => {
    const targetModalDiv = e.target.closest('div.modal');
    const targetCardDiv = e.target.closest('.card');
    const targetCloseFilter = e.target.closest('.closefilter');
    const targetMain = e.target.closest('main');
    const targetAccordionDiv = e.target.closest('.accordion');

    if (targetCardDiv) {
      // show modal of recipe details
      if (targetCardDiv && targetCardDiv.dataset?.show?.split('#')[0] === 'recipe') {
        getModalDomOfRecipeDetails(targetCardDiv.dataset.show.split('#')[1]);
      }
    } else if (targetModalDiv) {
      // close modal of recipe details
      if (e.target.type === 'button' && e.target.dataset.close === 'recipe-modal') {
        const mainElement = document.querySelector('main');
        const myModal = document.querySelector('.modal');
        const bodyElement = document.querySelector('body');
        myModal.classList.toggle('d-none');
        myModal.classList.toggle('d-grid');
        myModal.setAttribute('aria-hidden', 'true');
        mainElement.setAttribute('aria-hidden', 'false');
        bodyElement.removeAttribute('style');
        window.history.replaceState('', 'home', 'index.html');
      }
    } else {
      if (targetAccordionDiv || targetMain || targetCloseFilter) {
        addInputIntoFilterOnOpen(e);
        handleClickOnFilterElement();
        sortFilterElementsOnSearchInput();
        findRecipesForTagSearch();
        getIdOfRecipesSearchUtils(e);

        if (!targetAccordionDiv) {
          const accordionElement = document.querySelectorAll('.accordion-collapse.collapse.show');
          if (accordionElement) {
            accordionElement.forEach((el) => {
              // Close accordion(s) if is open on click outside.
              const splitedTargetId = el.id.split('-')[1];
              const dropdownBtn = document.getElementById(`btn-${splitedTargetId}`);
              const dropdownInputContainer = document.getElementById(`${splitedTargetId}-input-container`);
              el.classList.remove('show');
              dropdownBtn?.classList.toggle('d-none');
              dropdownInputContainer?.classList.toggle('d-none');
              document.querySelectorAll(`#btn-${splitedTargetId}`).forEach((e) => {
                e.setAttribute('aria-expanded', 'false');
                e.classList.toggle('collapsed');
              });
            });
          }
        }
      }
    }
  });
}
