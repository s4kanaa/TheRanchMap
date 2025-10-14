
// ==========================================================
// 1. CONFIGURAÇÃO BASE DO MAPA (Baseada no Jean Ropke)
// ==========================================================

// Define os limites que cobrem a área visível do mapa RDR2,
// usando as coordenadas exatas do ficheiro map.js.
const southWest = L.latLng(-160, -120);
const northEast = L.latLng(25, 250);

// Cria o objeto bounds com base nos arrays.
const bounds = L.latLngBounds(southWestCoords, northEastCoords);

// Coordenadas iniciais (centro do mapa ou local que preferir)
const viewportX = -70;
const viewportY = 111.75;
const viewportZoom = 3;

// Inicializa o mapa Leaflet
const map = L.map('map', {
    preferCanvas: true,
    attributionControl: false,
    minZoom: 2,       // Zoom mínimo para ver o mapa inteiro
    maxZoom: 7,       // Zoom máximo (limite do Ropke)
    zoomControl: true,
    crs: L.CRS.Simple // Crucial para mapas de jogos
}).setView([viewportX, viewportY], viewportZoom); // Ponto inicial e zoom


// ==========================================================
// 2. ADICIONAR CAMADA DE TILES (Map Tiles)
// ==========================================================

// Usamos o template de tiles de alta performance que o Jean Ropke usa
const tileUrl = 'https://map-tiles.b-cdn.net/assets/rdr3/webp/detailed/{z}/{x}_{y}.webp';

// Criar a camada de tiles
L.tileLayer(tileUrl, {
    noWrap: true,
    bounds: bounds,
    attribution: '<a href="https://rdr2map.com/" target="_blank">RDR2Map</a>',
    tms: true
}).addTo(map);

// Define os limites do mapa para impedir a navegação excessiva
map.setMaxBounds(bounds);


// ==========================================================
// 3. FUNÇÃO DE CARREGAMENTO DOS SEUS DADOS
// ==========================================================

function loadTheRanchData() {
    // 1. Busca os dados do ficheiro data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('Dados do The Ranch carregados:', data);
            
            // 2. Cria marcadores para cada item no ficheiro JSON
            data.forEach(item => {
                // A função L.marker([latitude, longitude]) espera as coordenadas
                L.marker([item.coordenadas[0], item.coordenadas[1]])
                    .addTo(map)
                    .bindPopup(`<h1>${item.nome}</h1><p>Categoria: ${item.categoria}<br>${item.descricao}</p>`);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados do The Ranch:', error);
        });
}

// Chamar a função para carregar os dados
loadTheRanchData();
