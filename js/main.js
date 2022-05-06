/* globals Papa */

var map = L.map('map', { center: [39.95, -75.16], zoom: 11 });

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

const leafletIcon = L.icon({
  iconUrl: 'img/job2.png',
  iconSize: [40, 40]
});

const stateSelect = document.querySelector('#state-filter');
const recencyInput = document.querySelector('#recency-filter');
const positionSelect = document.querySelector('#position-filter');
const filteredCountSpan = document.querySelector('#filtered-count');
const filteredStateSpan = document.querySelector('#filtered-state');
const employmentList = document.querySelector('.employment ul');

let stateList = [];
let positionList = [];
let employmentMarkers = {};
let employmentListItems = {};

const employmentMarkerGroup = L.layerGroup().addTo(map);
const mapboxApiToken = 'pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2wxMTRseWx0MTdibzNrcnR1ZWJ5bm82NCJ9.besymahDw7d4y5NxD38URQ';

const showEmploymentMarker = function (marker) {
  employmentMarkerGroup.clearLayers();
  employmentMarkerGroup.addLayer(marker);
  const latlng = marker.getBounds().southWest;
  map.panTo(latlng);
};

const myStyle = {
  "color": "#ff7800",
  "weight": 5,
  "opacity": 0.65
};

const handleEmploymentListItemClick = function () {
  const employmentListItem = this;
  const [key] = employmentListItem.dataset.key;
  const [addressDetail] = employmentListItem.dataset.addressDetail;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${addressDetail}.json?access_token=${mapboxApiToken}`;

  if (key in employmentMarkers) {
    const marker = employmentMarkers[key];
    showEmploymentMarker(marker);
  } else {
    fetch(url)
      .then(resp => resp.json())
      .then(geocoderData => {
        const feature = geocoderData.features[0];
        const marker = L.geoJSON({ pointToLayer: function(feature, LatLng)
          { return L.marker(LatLng, { icon: leafletIcon }); }
        });
        showEmploymentMarker(marker);
      });
  }
};



function contains(a, obj) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}


const initEmploymentItems = function (data) {
  employmentListItems = {};


  data.forEach(employment => {
    const jobTitle = employment.title;
    const jobPosition = employment.position;
    const companyName = employment.name;
    const companyPosition = employment.state;
    const key = employment.entry;
    const remoteWork = employment.workRemoteAllowed;
    const lastDate = employment.recency;
    const country = 'United states of America';
    if (!contains(stateList, companyPosition)) {
      stateList.push(companyPosition);
    }
    if (!contains(positionList, jobPosition)) {
      positionList.push(jobPosition);
    }

    const addressDetail = `${companyName} ${companyPosition} ${country}`;

    const employmentListItem = htmlToElement(`
      <li class="employment">
        <span class ="companyDetails">${companyName}</span>
        <span class ="jobTitle">${jobTitle}</span>
        <span class ="remoteWork"><span>Remote Allowed:</span>${remoteWork}</time></span>
      </li>
    `);
    employmentListItem.dataset.companyName = companyName;
    employmentListItem.dataset.state = companyPosition;
    employmentListItem.dataset.position = jobPosition;
    employmentListItem.dataset.addressDetail = addressDetail;
    employmentListItem.dataset.key = key;
    employmentList.appendChild(employmentListItem);
    employmentListItem.addEventListener('click', handleEmploymentListItemClick);
    employmentListItems[key] = employmentListItem;
  });
};

const getEmploymentListItem = function (key) {
  return employmentListItems[key];
};

const updateEmploymentList = function (data) {
  employmentList.innerHTML = '';

  data.forEach(employment => {
    const employmentListItem = getEmploymentListItem(employment.entry);
    employmentList.appendChild(employmentListItem);
  });

  filteredCountSpan.innerHTML = data.length;
  filteredStateSpan.innerHTML = stateSelect.value;
};

const filterEmploymentData = function (data) {
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  //  const recency = recencyInput.value;
  const position = positionSelect.value;
  const state = stateSelect.value;

  return data.filter(employment => {
    const employmentPosition = employment.position;
    const employmentState = employment.state;
    return (
      (!position || employmentPosition === position)
      && (!state || employmentState === state)
    );
  });
};

const initPositionOptions = function () {
  for (const position of positionList) {
    const positionOption = htmlToElement(`<option >${position}</option>`);
    positionSelect.appendChild(positionOption);
  }
};

const initStateOptions = function () {
  for (const state of stateList) {
    const stateOption = htmlToElement(`<option >${state}</option>`);
    stateSelect.appendChild(stateOption);
  }
};


const showMap = function () {
  fetch('data/data.json')
    .then(resp => resp.json())
    .then(data => {
      const employmentData = data;
      initEmploymentItems(employmentData);
      initPositionOptions();
      initStateOptions();
    });
};

let employmentData = {};

const handleStateFilterChange = function () {
  const filteredEmployment = filterEmploymentData(employmentData);
  updateEmploymentList(filteredEmployment);
};

const handleRecencyFilterChange = function () {
  const filteredEmployment = filterEmploymentData(employmentData);
  updateEmploymentList(filteredEmployment);
};

const handlePositionFilterChange = function () {
  const filteredEmployment = filterEmploymentData(employmentData);
  updateEmploymentList(filteredEmployment);
};


showMap();
stateSelect.addEventListener('change', handleStateFilterChange);
recencyInput.addEventListener('change', handleRecencyFilterChange);
positionSelect.addEventListener('change', handlePositionFilterChange);






///
