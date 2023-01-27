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
