const stateSelect = document.querySelector('#state-filter');
let industry = 'Total';

let densitymapdata = { features: [] };
var initialCenter = [39.3, -97.8];  // <-- Latitude, Longitude
var initialZoom = 4;
var densitymap = L.map('densitymap', {
    zoomSnap: 0,
    zoomDelta: 0.25
}).setView(initialCenter, initialZoom);

var baseLayer = new L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});
baseLayer.addTo(densitymap);

let layerGroup = L.layerGroup().addTo(densitymap);

function getColor(d) {
return d > 3 ? '#800026' :
        d > 1 ? '#BD0026' :
        d > 0.3  ? '#E31A1C' :
        d > 0.1  ? '#FC4E2A' :
        d > 0   ? '#FD8D3C' :
        d > 0.1  ? '#FEB24C' :
        d > -1  ? '#FED976' :
                    '#FFEDA0' ;
}

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
    var density = layer.feature.properties[industry];
    return density;
}

function loadPhamData() {
    fetch('BLS_data/employment_change.json')
      .then(resp => resp.json())
      .then(d => {
        densitymapdata = d.features;
        console.log(densitymapdata);
        let dataLayer = L.geoJSON(densitymapdata, {
            style: getStyle
        });
        dataLayer.bindTooltip(getTooltip)
        dataLayer.addTo(layerGroup);
      });
  }


loadPhamData();
//////



var overviewLegend = L.control({position: 'bottomright'});
overviewLegend.onAdd = function (map) {
    var container = L.DomUtil.create('div', 'info legend');
    container.innerHTML = `
        <ol>
        <li><span class="key-color" style="background: #FFEDA0;"></span><span class="key-label">Low</span></li>
        <li><span class="key-color" style="background: #FED976;"></span></li>
        <li><span class="key-color" style="background: #FEB24C;"></span></li>
        <li><span class="key-color" style="background: #FD8D3C;"></span></li>
        <li><span class="key-color" style="background: #FC4E2A;"></span></li>
        <li><span class="key-color" style="background: #E31A1C;"></span></li>
        <li><span class="key-color" style="background: #BD0026;"></span></li>
        <li><span class="key-color" style="background: ##800026;"></span><span class="key-label">High</span></li>
        </ol>
        `;
    return container;
};

let handleSelectChange = () => {
    let industry = stateSelect.value

    function getStyle2(feature) {
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
    
    function getTooltip2(layer) {
        var density = layer.feature.properties[industry];
        return density;
    }

    layerGroup.clearLayers();
    let dataLayer = L.geoJSON(densitymapdata, {
        style: getStyle2
    });
    dataLayer.bindTooltip(getTooltip2)
    dataLayer.addTo(layerGroup);
  };

overviewLegend.addTo(densitymap);
stateSelect.addEventListener('change', handleSelectChange);
