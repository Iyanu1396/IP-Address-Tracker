"use strict";

const ipContainer = document.querySelector(".ip-data");
const inputEl = document.querySelector(".input");
const searchBtn = document.querySelector(".icon-arrow");
const form = document.querySelector(".form");
const mapOne = document.querySelector("#map1");
const mapTwo = document.querySelector("#map2");


// Render Error
const renderError = function () {
  ipContainer.innerHTML = "";
  const html = `<h3>Couldn't display IP info kindly check your internet connection or try again later 😔</h3> `;
  ipContainer.innerHTML = html;
};

// Render Ip data on UI on page load
const renderIPData = (ip, timeZone) => {
  ipContainer.innerHTML = "";
  const html = ` 
  <div>
  <small> IP ADDRESS </small>
  <h3>${ip.ip}</h3>
</div>
<div class="divider">
<small> LOCATION </small>
<h3>${ip.location.region}, ${ip.location.country} ${ip.location.postalCode}</h3>
</div>
<div class="divider">
<small> TIMEZONE </small>
<h3>${timeZone} ${ip.location.timezone}</h3>
</div>
<div class="divider">
<small> ISP </small>
<h3>${ip.isp}</h3>
</div>
`;

  ipContainer.innerHTML = html;
};

// Render Ip data on UI on search
const renderIPDataSearch = (ip, timeZone) => {
  ipContainer.insertAdjacentHTML = "";
  inputEl.value = ''
  const html = ` 
  <div>
  <small> IP ADDRESS </small>
  <h3>${ip.ip}</h3>
</div>
<div class="divider">
<small> LOCATION </small>
<h3>${ip.location.region}, ${ip.location.country} ${ip.location.postalCode}</h3>
</div>
<div class="divider">
<small> ISP </small>
<h3>${ip.isp}</h3>
</div>
`;

  ipContainer.innerHTML = html;
};

// Display Map on page load
let map1;
const renderMap = () => {
  mapTwo.style.display = "none";
  var customIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [50, 60],
    iconAnchor: [19, 5],
    popupAnchor: [0, -38],
  });
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      map1 = L.map("map1", {
        zoomControl: false,
      }).setView([latitude, longitude], 15);

      L.tileLayer(
        "https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        {}
      ).addTo(map1);

      var marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(
        map1
      );
    },
    function () {
      alert("Could not get your position");
    }
  );
};

// Display Map on search

let map2;
const renderMapSearch = (lat, lng) => {
  mapOne.style.display = "none";
  mapTwo.style.display = "block";
  if (map2) {
    map2.remove();
  }

  var customIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [50, 60],
    iconAnchor: [19, 5],
    popupAnchor: [0, -38],
  });

  map2 = L.map("map2", {
    zoomControl: false,
  }).setView([lat, lng], 15);

  L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {}).addTo(
    map2
  );

  var marker = L.marker([lat, lng], { icon: customIcon }).addTo(map2);


};

// Get IP data on page load
const getIPData = async () => {
  try {
    const res1 = fetch(
      "https://geo.ipify.org/api/v2/country,city?apiKey=at_CCdKhbjkOlcSEUlc8gAfZLbnA07gQ"
    ).then((res) => res.json());

    const res2 = fetch(
      "https://timezoneapi.io/api/ip/?token=amfhcIRUCzfROLcHjmAM"
    ).then((res) => res.json());

    const [ipData, timeZoneDate] = await Promise.all([res1, res2]);

    let timeZone = String(timeZoneDate.data.datetime.offset_tzfull)
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");

    renderMap();
    renderIPData(ipData, timeZone);
    return timeZone;
  } catch (err) {
    renderError();
  }
};
getIPData();

// Search for IP address
const searchIP = async function (ip) {
  try {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_CCdKhbjkOlcSEUlc8gAfZLbnA07gQ&ipAddress=${ip}`
    );
    const ipData = await res.json();
    const timeZone = await getIPData();
    renderIPDataSearch(ipData, timeZone);
    renderMapSearch(ipData.location.lat, ipData.location.lng);
  } catch (err) {
    renderError();
  }
};

// Search button event listener
searchBtn.addEventListener("click", function () {
  searchIP(inputEl.value);
});

// Prevent Default on input
form.addEventListener("submit", function (e) {
  e.preventDefault();
  searchIP(inputEl.value);
});
