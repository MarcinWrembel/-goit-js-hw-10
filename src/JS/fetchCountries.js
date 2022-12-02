import Notiflix from 'notiflix';

const searchParam = [
  'name', //name.official
  'capital',
  'population',
  'flags', //flags.svg
  'languages',
];


export function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=${searchParam}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return Notiflix.Notify.failure(
          'Oops, there is no country with that name'
        );
      }
      return response.json();
    })
    .catch(error => {
      return Notiflix.Notify.failure(error);
    });
}
