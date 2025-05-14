const firebaseConfig = {
  apiKey: "AIzaSyAmd8V46CLS11cyu1UnjqBwtcBUXybnyNA",
  authDomain: "map-1-b0eae.firebaseapp.com",
  databaseURL: "https://map-1-b0eae-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "map-1-b0eae",
  storageBucket: "map-1-b0eae.appspot.com",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const map = L.map('map').setView([10.850324, 106.772186], 20);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19
}).addTo(map);

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let currentMarker1 = null;
let currentMarker2 = null;
let currentMarker3 = null;
let n = 0;
let x1 = 0, x2 = 0, x3 = 0;
let y1 = 0, y2 = 0, y3 = 0;

map.on('click', function(e) {
  n = n + 1;
  const lat = e.latlng.lat.toFixed(6);
  const lng = e.latlng.lng.toFixed(6);
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (n % 3 == 1) {
    x1 = lat;
    y1 = lng;
    db.ref("Toa-do").set({ lat: latNum, lng: lngNum });

    if ((n % 3 == 1) && (n > 3)) {
      map.removeLayer(currentMarker1);
    }
    currentMarker1 = L.marker([lat, lng], { icon: redIcon }).addTo(map);
  }

  if (n % 3 == 2) {
    x2 = lat;
    y2 = lng;
    db.ref("Toa-do").set({ lat: latNum, lng: lngNum });

    if ((n % 3 == 2) && (n > 3)) {
      map.removeLayer(currentMarker2);
    }
    currentMarker2 = L.marker([lat, lng], { icon: greenIcon }).addTo(map);
  }

  if (n % 3 == 0) {
    x3 = lat;
    y3 = lng;
    db.ref("Toa-do").set({ lat: latNum, lng: lngNum });

    if ((n % 3 == 0) && (n > 3)) {
      map.removeLayer(currentMarker3);
    }
    currentMarker3 = L.marker([lat, lng], { icon: blueIcon }).addTo(map);
  }
});

const toggleBtn = document.getElementById('toggleBtn');
const confirmBtn = document.getElementById('confirmBtn');
const deleteBtn = document.getElementById('deleteBtn');
const mapDiv = document.getElementById('map');

toggleBtn.addEventListener('click', () => {
  if (mapDiv.style.display === 'none') {
    mapDiv.style.display = 'block';
    toggleBtn.innerText = 'Hide map';
    map.invalidateSize();
  } else {
    mapDiv.style.display = 'none';
    document.getElementById('status1').innerText = '';
    document.getElementById('status2').innerText = '';
    document.getElementById('status3').innerText = '';
    toggleBtn.innerText = 'Show map';
  }
});

confirmBtn.addEventListener('click', () => {
  document.getElementById('status1').innerText = `Vi-do1=${x1}, Kinh-do1=${y1}`;
  document.getElementById('status2').innerText = `Vi-do2=${x2}, Kinh-do2=${y2}`;
  document.getElementById('status3').innerText = `Vi-do3=${x3}, Kinh-do3=${y3}`;
});

deleteBtn.addEventListener('click', () => {
  if (currentMarker1) map.removeLayer(currentMarker1);
  if (currentMarker2) map.removeLayer(currentMarker2);
  if (currentMarker3) map.removeLayer(currentMarker3);
  document.getElementById('status1').innerText = '';
  document.getElementById('status2').innerText = '';
  document.getElementById('status3').innerText = '';
});

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let firebaseMarker = null;

db.ref("Toa-do-hien-tai").on("value", (snapshot) => {
  const data = snapshot.val();
  if (data && data.lat_cur && data.lng_cur) {
    const lat = data.lat_cur;
    const lng = data.lng_cur;

    if (firebaseMarker) {
      map.removeLayer(firebaseMarker);
    }

    firebaseMarker = L.marker([lat, lng], { icon: yellowIcon })
      .addTo(map)
      .bindPopup("Marker từ Firebase")
      .openPopup();
  }
});
