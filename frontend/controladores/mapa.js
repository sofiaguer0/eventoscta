// Token de Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic29maWFndWVyMCIsImEiOiJjbTFva3g3YmwxNjl1MnFxMGZybGVnbHN6In0.Isg3ucnh4_mkaFChX3e49w';

// Configuración del mapa centrado en Catamarca
const map = new mapboxgl.Map({
    container: 'map', // ID del contenedor
    style: 'mapbox://styles/mapbox/streets-v11', // Estilo de Mapbox
    center: [-65.779544, -28.469581], // Coordenadas de San Fernando del Valle de Catamarca
    zoom: 13 // Nivel de zoom inicial
});

// Agrega controles de zoom y rotación
map.addControl(new mapboxgl.NavigationControl());

// Puedes agregar eventos o marcadores personalizados aquí
// Ejemplo de marcador:
const marker = new mapboxgl.Marker()
    .setLngLat([-65.779544, -28.469581]) // Coordenadas del evento
    .addTo(map);


    