/* eslint-disable no-nested-ternary */
const stateSelect = document.querySelector('#state-filter');
let industry = 'Total';

let employmentMapdata = { features: [] };
var initialCenter = [39.3, -97.8];  // <-- Latitude, Longitude
var initialZoom = 4;
var employmentMap = L.map('employmentMap', {
  zoomSnap: 0,
  zoomDelta: 0.25
}).setView(initialCenter, initialZoom);

L.TileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(employmentMap);

let layerGroup = L.layerGroup().addTo(employmentMap);

function getColor(d) {
  return d > 3 ? "#760000"
    : d > 1 ? "#a62300"
      : d > 0.3  ? "#f2761a"
        : d > 0.1  ? "#F29727"
          : d > 0   ? "#F2CA52"
            : d > 0.1  ? "#F7DBB3"
              : d > -1  ? "#c5eddf"
                : "#8abccf";
}

const overviewLegend = L.control({ position: 'bottomright' });
overviewLegend.onAdd = function (map) {
  const container = L.DomUtil.create('div', 'info legend');
  container.innerHTML = `
        <ol>
        <li><span class="key-color" style="background: #760000;"></span><span class="key-label">High</span></li>
        <li><span class="key-color" style="background: #a62300;"></span></li>
        <li><span class="key-color" style="background: #f2761a;"></span></li>
        <li><span class="key-color" style="background: #F29727;"></span></li>
        <li><span class="key-color" style="background: #F2CA52;"></span></li>
        <li><span class="key-color" style="background: #F7DBB3;"></span></li>
        <li><span class="key-color" style="background: #c5eddf;"></span></li>
        <li><span class="key-color" style="background: #8abccf;"></span><span class="key-label">Low</span></li>
        </ol>
        `;
  return container;
};


function getStyle(feature) {
  var scaledValue = feature.properties[industry];
  var featureColor = getColor(scaledValue);

  return {
    color: featureColor,
    weight: 2,
    opacity: 1,
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function getTooltip(layer) {
  let employmentChange = layer.feature.properties[industry];
  return employmentChange;
}

function Load_Initialize() {
  fetch('https://raw.githubusercontent.com/keeea/Knowledge-Oriented-Service-Jobs-Dashboard/main/data/BLS_data/employment_change.json')
    .then(resp => resp.json())
    .then(d => {
      employmentMapdata = d.features;
      console.log(employmentMapdata);
      L.geoJSON(employmentMapdata, {
        style: getStyle
      }).addTo(layerGroup);
    });
}


Load_Initialize();

let handleSelectChange = () => {
  let indsty = stateSelect.value;

  function getStyle2(feature) {
    var scaledValue = feature.properties[indsty];
    var featureColor = getColor(scaledValue);

    return {
      color: featureColor,
      weight: 2,
      opacity: 1,
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  function getTooltip2(layer) {
    var employmentChange = layer.feature.properties[indsty];
    return employmentChange;
  }

  layerGroup.clearLayers();
  L.geoJSON(employmentMapdata, {
    style: getStyle2
  }).bindTooltip(getTooltip2).addTo(layerGroup);
};

overviewLegend.addTo(employmentMap);
stateSelect.addEventListener('change', handleSelectChange);
