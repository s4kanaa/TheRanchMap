// ==========================================================
// 1. CONFIGURAÇÃO BASE DO MAPA (Versão Estável e Funcional)
// ==========================================================

// O Leaflet aceita arrays simples [lat, lng]
const southWestCoords = [-160, -120];
const northEastCoords = [25, 250];

// Cria o objeto bounds
const bounds = L.latLngBounds(southWestCoords, northEastCoords);

// Coordenadas iniciais: Centro do mapa visual do Ropke
const viewportX = -70;
const viewportY = 111.75;
const viewportZoom = 3;

// Inicializa o mapa Leaflet
const map = L.map('map', {
    preferCanvas: true,
    attributionControl: false,
    minZoom: 2,       // Zoom mínimo
    maxZoom: 7,       // Zoom máximo
    zoomControl: true,
    crs: L.CRS.Simple // Sistema de coordenadas simples
}).setView([viewportX, viewportY], viewportZoom); // Ponto inicial e zoom


// ==========================================================
// 2. ADICIONAR CAMADA DE TILES (Map Tiles)
// ==========================================================

const tileUrl = 'https://map-tiles.b-cdn.net/assets/rdr3/webp/detailed/{z}/{x}_{y}.webp';

// Criar a camada de tiles
L.tileLayer(tileUrl, {
    noWrap: true,
    bounds: bounds,
    attribution: '<a href="https://rdr2map.com/" target="_blank">RDR2Map</a>',
    tms: true
}).addTo(map);

// Define os limites máximos de navegação
map.setMaxBounds(bounds);


// ==========================================================
// 3. FUNÇÃO DE CARREGAMENTO DOS SEUS DADOS
// ==========================================================

function loadTheRanchData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('Dados do The Ranch carregados:', data);
            
            data.forEach(item => {
                // Aqui é onde faremos a TRADUÇÃO das suas coordenadas
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
