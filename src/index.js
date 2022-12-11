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

  // createSvg(newListElement);
  createIcon(countryDescription);
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
  }
}

//if number of hist is >1 and <11 then create country data details -> invoked by click'ing an country description or arrow
function showUnfold(el) {
  //el as HTML created element
  el.classList.add('country-list__description--unfold');
  const detailsElements = Array.from(el.children);

  detailsElements.forEach(e => {
    e.classList.add('country-info__heading--unfold');
  });
}

//creates an icon to unfold/fold tree with country details
function createIcon(el) {
  const textIcon = document.createElement('i');
  textIcon.classList.add('fa-solid', 'fa-angle-down');
  el.appendChild(textIcon);
}

// function createSvg(el) {
//   const svgElements = ['up2', 'down3'];
//   const xlinks = 'http://www.w3.org/1999/xlink';
//   const nameSpace = 'http://www.w3.org/2000/svg';

//   svgElements.forEach(e => {
//     const newSvg = document.createElementNS(nameSpace, 'svg');
//     const use = document.createElementNS(nameSpace, 'use');

//     newSvg.classList.add('country-list__svg');

//     use.setAttributeNS(xlinks, 'xlink:href', `./img/icons.svg#up2`);
//     use.setAttribute('width', '18');
//     use.setAttribute('height', '18');

//     el.appendChild(newSvg);
//     newSvg.appendChild(use);
//   });
// }

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
  const childrenToRemove = Array.from(e.target.children);
  const iconElement = document.querySelector('i');
  // const dataToAdd = document.getElementsByClassName(
  //   'country-list__description'
  // );
  // console.log(dataToAdd);

  if (
    !e.target.classList.contains('country-list__description') &&
    !e.target.classList.contains('fa-solid')
  ) {
    return;
  }

  if (
    (!e.target.classList.contains('country-list__description--unfold') &&
      countryList.childElementCount > 1) ||
    e.target.classList.contains('fa-solid')
  ) {
    let targetDataCreation = e.target;

    if (targetDataCreation.tagName === 'I') {
      targetDataCreation = e.target.parentNode;
    }

    fetchCountries(e.target.textContent) //getting data from promise
      .then(data => {

        showCountryData(data[0], targetDataCreation);
        showUnfold(targetDataCreation);
      });

    iconElement.classList.add('fa-rotate-180');
  }

  if (e.target.classList.contains('country-list__description--unfold')) {
    e.target.classList.toggle('country-list__description--unfold');

    iconElement.classList.remove('fa-rotate-180');
    //clear node
    childrenToRemove.forEach(el => {
      if (el.tagName !== 'I') {
        el.remove();
      }
    });
  }
});
