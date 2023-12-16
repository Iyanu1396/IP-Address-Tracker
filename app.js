"use strict";

const ipContainer = document.querySelector(".ip-data");
const inputEl = document.querySelector(".input");

const renderIPData = (ip, timeZone) => {
  ipContainer.innerHTML = "";
  inputEl.value = ip.ip;
  const html = ` 
    
      <small> IP ADDRESS </small>
      <h3>${ip.ip}</h3>
      <small> LOCATION </small>
      <h3>${ip.location.region}, ${ip.location.country} ${ip.location.postalCode}</h3>
      <small> TIMEEZONE </small>
      <h3>${timeZone} ${ip.location.timezone}</h3>
      <small> ISP </small>
      <h3>${ip.isp}</h3>
 
`;

  ipContainer.innerHTML = html;
};

var customIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [50, 60],
  iconAnchor: [19, 10],
  popupAnchor: [0, -38],
});

const renderMap = () => {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      var map = L.map("map", {
        zoomControl: false,
      }).setView([latitude, longitude], 15);

      L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      var marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(
        map
      );
    },
    function () {
      alert("Could not get your position");
    }
  );
};

const getIPData = async () => {
  try {
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

    renderIPData(ipData, timeZone);
    renderMap();
  } catch (err) {
    console.log(err.message);
  }
};

getIPData();
