import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './JS/fetchCountries';

const DEBOUNCE_DELAY = 300;
const entryCountry = document.querySelector('#search-box');
const countryList = document.querySelector('ul.country-list');
const countryContainer = document.querySelector('div.country-info');

function showCountryFlagName(data) {
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

  createIcon(newListElement);
}

function showCountryData(obj, targetPlace) {
  //create an array from keys for detailed country data
  const keys = Object.keys(obj).filter(
    key => key === 'capital' || key === 'population' || key === 'languages'
  );

  //create details of country for every key -> obj keys
  for (const key of keys) {
    const insertHeaderData = document.createElement('p');
    insertHeaderData.classList.add('country-info__heading');

    const insertHeaderDetails = document.createElement('span');
    insertHeaderDetails.classList.add('country-info__details');

    targetPlace.appendChild(insertHeaderData);

    insertHeaderData.textContent = `${key}:`;
    insertHeaderData.appendChild(insertHeaderDetails);
    //insert values to country data details -> for each object
    insertHeaderDetails.textContent = Object.values(obj[key]).join(', ');

    //insert value to country data details if value is not an object
    if (!isNaN(obj[key])) {
      insertHeaderDetails.textContent = obj[key].toLocaleString();
    }
  }
}

//function which checks the number of hits and then creates data or shows notification
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
    //destructurisation of array ob objects (could be also data[0])
    showCountryFlagName(...data);
    showCountryData(...data, countryContainer);

    document.querySelector('i').removeAttribute('class');

    if ((countryList.childElementCount = 1)) {
      countryList.firstElementChild.style.cursor = 'auto';
    }
  }
}

//if number of hist is >1 and <11 then create country data details -> invoked by click'ing an country description or arrow
function showUnfold(el) {
  //el as HTML created element
  el.classList.add('country-list__description--unfold');
  const detailsElements = Array.from(el.children);
}

//creates an icon to unfold/fold tree with country details
function createIcon(el) {
  const textIcon = document.createElement('i');
  textIcon.classList.add('fa-solid', 'fa-angle-down');
  el.appendChild(textIcon);
}

entryCountry.addEventListener(
  'input',
  debounce(() => {
    countryList.replaceChildren();

    if (countryContainer.hasChildNodes()) {
      countryContainer.replaceChildren();
    }

    let countryName = entryCountry.value.trim();

    fetchCountries(countryName)
      .then(data => {
        checkMatches(data);
      })
      .catch(err => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        // console.log(err);
      });
  }, DEBOUNCE_DELAY)
);

document.body.addEventListener('click', e => {
  const ListChildrenArr = Array.from(e.target.children);
  const iconElementIndex = ListChildrenArr.findIndex(e => e.tagName === 'I');
  const childrenToRemove = ListChildrenArr.filter(e => e.tagName === 'P');

  if (!e.target.classList.contains('country-list__item')) {
    return;
  }

  if (
    !e.target.classList.contains('country-list__description--unfold') &&
    countryList.childElementCount > 1
  ) {
    fetchCountries(e.target.textContent) //getting data from promise
      .then(data => {
        showCountryData(data[0], e.target);
        showUnfold(e.target);
      });

    ListChildrenArr[iconElementIndex].classList.add('fa-angle-up');
    ListChildrenArr[iconElementIndex].classList.remove('fa-angle-down');
  }

  if (e.target.classList.contains('country-list__description--unfold')) {
    e.target.classList.toggle('country-list__description--unfold');

    ListChildrenArr[iconElementIndex].classList.add('fa-angle-down');
    ListChildrenArr[iconElementIndex].classList.remove('fa-angle-up');

    childrenToRemove.forEach(el => {
      el.remove();
    });
  }
});
