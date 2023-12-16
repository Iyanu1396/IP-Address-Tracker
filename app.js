"use strict";

navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(latitude, longitude);
    var map = L.map("map", {
      zoomControl: false,
    }).setView([longitude, latitude], 13);

    L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {}).addTo(
      map
    );

    L.marker([latitude, longitude]).addTo(map).openPopup();
  },
  function () {
    alert("Could not get your position");
  }
);
