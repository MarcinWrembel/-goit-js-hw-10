import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './JS/fetchCountries';

const DEBOUNCE_DELAY = 300;
const entryCountry = document.querySelector('#search-box');
const countryList = document.querySelector('ul.country-list');
const countryContainer = document.querySelector('div.country-info');

function showCountryFlagName(data) {
  // console.log(data);
  const newListElement = document.createElement('li');
  newListElement.classList.add('country-list__item');

  const countryDescription = document.createElement('span');
  countryDescription.classList.add('country-list__description');
  countryDescription.textContent = data.name.official;

  const countryFlag = document.createElement('img');
  countryFlag.classList.add('country-list__flag');
  countryFlag.setAttribute('src', data.flags.svg);

  countryList.appendChild(newListElement);
  newListElement.append(countryFlag, countryDescription);
}

function showCountryData(obj) {
  const keys = Object.keys(obj).filter(
    key => key === 'capital' || key === 'population' || key === 'languages'
  );

  for (const key of keys) {
    const insertHeaderData = document.createElement('p');
    insertHeaderData.classList.add('country-info__heading');

    const insertHeaderDetails = document.createElement('span');
    insertHeaderDetails.classList.add('country-info__details');

    countryContainer.appendChild(insertHeaderData);
    insertHeaderData.textContent = `${key}:`;
    insertHeaderData.appendChild(insertHeaderDetails);
    insertHeaderDetails.textContent = Object.values(obj[key]);

    if (!isNaN(obj[key])) {
      insertHeaderDetails.textContent = obj[key].toLocaleString();
    }
  }
}

function checkMatches(data) {
  if (data.length > 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length > 1 && data.length < 11) {
    data.forEach(element => {
      showCountryFlagName(element);
    });
  } else {
    showCountryFlagName(...data);
    showCountryData(...data);
  }
}

entryCountry.addEventListener('input', debounce(() => {
  countryList.replaceChildren();
  countryContainer.replaceChildren();

  let countryName = entryCountry.value;

  fetchCountries(countryName)
    .then(data => {
      checkMatches(data);
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      console.log(err);
    });
},300));
