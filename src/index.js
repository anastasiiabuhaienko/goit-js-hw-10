import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';


const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const minNumberOfCountries = 2;
const maxNumberOfCountries = 10;

const refs = {
  searchBox: document.querySelector('#search-box'),
  infoCountry: document.querySelector('.country-info'),
  listCountry: document.querySelector('.country-list'),  
};

refs.searchBox.addEventListener('input', debounce(onSearchBoxInput, DEBOUNCE_DELAY));

function onSearchBoxInput(e) {
  e.preventDefault();
  
  const normalizedSearchInput = refs.searchBox.value.trim();

  if (normalizedSearchInput === '') {
    clearMarkupCountryList();
    clearMarkupCountryInfo();    
    
    Notiflix.Notify.info('Please enter country name.');
    return;
  } else {
    fetchCountries(normalizedSearchInput)
      .then(data => {
        if (data.length === 1) {
          Notiflix.Notify.success('One country found.');
        
          clearMarkupCountryList();
          createMarkupForCountryInfo(data);
          return;
        };

        if (data.length >= minNumberOfCountries && data.length <= maxNumberOfCountries) {
          Notiflix.Notify.success(`${data.length} countries found.`);
        
          clearMarkupCountryInfo();
          createMarkupForCountryList(data);
          return;
        };
      
        if (data.length > maxNumberOfCountries) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');

          clearMarkupCountryList();
          clearMarkupCountryInfo();
        };
      })
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      
        clearMarkupCountryList();
        clearMarkupCountryInfo();
      });
  }
}

function createMarkupForCountryList(countries) {
  const markup = countries.map(country => `
    <li class="country-list_item">
      <img class="country-list__item-img" src="${country.flags.svg}" alt="${country.name.official} flag" width='40' height='30'>
      <h2 class="country-list__item-name">${country.name.official}</h2>
    </li>
  `).join('');

  refs.listCountry.innerHTML = ('beforeend', markup);
};

function createMarkupForCountryInfo(countries) {
  
  const markup = countries.map(country => `      
      <div class="country-info__box">
        <div class="country-info__title">
          <img class="country-info__img" src="${country.flags.svg}" alt="${country.name.official} flag" width='60' height="40">
          <h2 class="country-info__name">
            ${country.name.official}
          </h2>
        </div>
        <div class="country-info__description">        
          <p class="country-info__capital">
            <span>Capital:</span> ${country.capital.join(', ')}
          </p>
          <p class="country-info__population">
            <span>Population:</span> ${country.population}
          </p>
          <p class="country-info__languages">
            <span>Languages:</span> ${Object.values(country.languages).join(', ')}
          </p>
        </div>
      </div>  
    `).join('');  
  
  refs.infoCountry.innerHTML = ('beforeend', markup);
};

function clearMarkupCountryList() {
  refs.listCountry.innerHTML = '';
}

function clearMarkupCountryInfo() {
  refs.infoCountry.innerHTML = '';  
}