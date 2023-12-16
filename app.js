"use strict";

const headerEl = document.querySelector("header");

const renderIPData = (ip, timeZone) => {

  const html = ` 
    <div class="ip-data container">
      <small> IP ADDRESS </small>
      <h3>${ip.ip}</h3>
      <small> LOCATION </small>
      <h3>${ip.location.region}, ${ip.location.country} ${ip.location.postalCode}</h3>
      <small> TIMEEZONE </small>
      <h3>${timeZone} ${ip.location.timezone}</h3>
      <small> ISP </small>
      <h3>${ip.isp}</h3>
  </div>
`;

  headerEl.innerHTML += html;
};


var customIcon = L.icon({
  iconUrl: 'images/icon-location.svg',
  iconSize: [50, 50], // Set the size of your icon
  iconAnchor: [19, 10], // Set the anchor point of your icon
  popupAnchor: [0, -38] // Set the popup's anchor point
});





const renderMap = () => {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      var map = L.map("map", {
        zoomControl: false,
      }).setView([latitude, longitude], 13);

      L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      var marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    },
    function () {
      alert("Could not get your position");
    }
  );
};

const getIPData = async () => {
  const res1 = fetch(
    "https://geo.ipify.org/api/v2/country,city?apiKey=at_jgwwq3DRDt1jZmGajaAzxoYOKUFtc"
  ).then((res) => res.json());

  const res2 = fetch(
    "https://timezoneapi.io/api/ip/?token=amfhcIRUCzfROLcHjmAM"
  ).then((res) => res.json());

  const [ipData, timeZoneDate] = await Promise.all([res1, res2]);

  const timeZone = String(timeZoneDate.data.datetime.offset_tzfull)
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");

  renderIPData(ipData, timeZone);;
  renderMap();
};

getIPData()
