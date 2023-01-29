export function capitalizeText(element) {
  const capitalizedElement = element?.charAt(0).toUpperCase() + element?.slice(1);
  return capitalizedElement;
}
