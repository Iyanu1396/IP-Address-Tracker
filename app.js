"use strict";

const ipContainer = document.querySelector(".ip-data");
const inputEl = document.querySelector(".input");
const searchBtn = document.querySelector(".icon-arrow");
const form = document.querySelector(".form");

// Render Ip data on UI
const renderIPData = (ip, timeZone) => {
  ipContainer.insertAdjacentHTML = "";
  // inputEl.value = ip.ip;
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

// Display Map
var customIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [50, 60],
  iconAnchor: [19, 5],
  popupAnchor: [0, -38],
});

const renderMap = () => {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      var map = L.map("map", {
        zoomControl: false,
        // scrollWheelZoom: "center",
        // dragging: false,
      }).setView([latitude, longitude], 15);

      L.tileLayer(
        "https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        {}
      ).addTo(map);

      var marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(
        map
      );
    },
    function () {
      alert("Could not get your position");
    }
  );
};

// Get IP data on page load
const getIPData = async () => {
  try {
    const res1 = fetch(
      "https://geo.ipify.org/api/v2/country,city?apiKey=at_4HJeO7HnHJvDPvyC2W5SMVFqqgEMU"
    ).then((res) => res.json());

    const res2 = fetch(
      "https://timezoneapi.io/api/ip/?token=amfhcIRUCzfROLcHjmAM"
    ).then((res) => res.json());

    const [ipData, timeZoneDate] = await Promise.all([res1, res2]);

    let timeZone = String(timeZoneDate.data.datetime.offset_tzfull)
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");

    renderIPData(ipData, timeZone);
    renderMap();

    return timeZone;
  } catch (err) {
    console.log(err.message);
  }
};
getIPData();

// Search for IP address
const fetchIP = async function (ip) {
  try {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_4HJeO7HnHJvDPvyC2W5SMVFqqgEMU&ipAddress=${ip}`
    );
    const ipData = await res.json();
    const timeZone = await getIPData();
    renderIPData(ipData, timeZone);
  } catch (err) {
    console.log(err.message);
  }
};

searchBtn.addEventListener("click", function () {
  fetchIP(inputEl.value);
});

// Prevent Default on input
form.addEventListener("submit", function (e) {
  e.preventDefault();
  fetchIP(inputEl.value);
});
