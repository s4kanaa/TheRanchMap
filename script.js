// ==========================================================
// 0. FERRAMENTAS DE TRADUÇÃO DE COORDENADAS (Essencial)
// ==========================================================

// Constantes de calibração do RDR2 para conversão entre o sistema de jogo e o sistema do mapa.
const MIN_GAME_X = -7168;
const MAX_GAME_Y = 4096;
const GAME_WIDTH = 12288;
const GAME_HEIGHT = 9728;

// Função para converter Coordenadas de Jogo (X, Y) para Coordenadas do Mapa (Lat, Lng)
function gameToMap(coords) {
    let x = coords[0];
    let y = coords[1];
    
    let lat = (x - MIN_GAME_X) / GAME_WIDTH;
    let lng = (y - MAX_GAME_Y) / GAME_HEIGHT;

    // Retorna um array [Lat, Lng] para evitar o erro L.latLng
    return [lat * -160, lng * 250]; 
}

// Função para converter Coordenadas do Mapa (Lat, Lng) para Coordenadas de Jogo (X, Y)
function mapToGame(latlng) {
    let lat = latlng.lat;
    let lng = latlng.lng;
    
    let x = (lat / -160) * GAME_WIDTH + MIN_GAME_X;
    let y = (lng / 250) * GAME_HEIGHT + MAX_GAME_Y;

    return [x.toFixed(2), y.toFixed(2)]; // Retorna X, Y do Jogo arredondado
}

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

// ==========================================================
// 4. FERRAMENTA DE COORDENADAS (Adicionar a funcionalidade de clique)
// ==========================================================

// Função baseada na lógica do Jean Ropke para converter Coordenadas de Jogo (X, Y)
// para as coordenadas do Leaflet (Latitude, Longitude) que o mapa espera.
function gameToMap(coords) {
    let x = coords[0];
    let y = coords[1];
    
    // Estas constantes são as de calibração do RDR2
    let min_X = -7168;
    let max_Y = 4096;
    let width = 12288;
    let height = 9728;
    
    let lat = (x - min_X) / width;
    let lng = (y - max_Y) / height;

    return L.latLng(lat * -160, lng * 250); 
}

// Nova Função: Converter as coordenadas do Ropke (do Leaflet) de volta para o Jogo
function mapToGame(latlng) {
    let lat = latlng.lat;
    let lng = latlng.lng;
    
    let min_X = -7168;
    let max_Y = 4096;
    let width = 12288;
    let height = 9728;

    let x = (lat / -160) * width + min_X;
    let y = (lng / 250) * height + max_Y;

    return [x.toFixed(2), y.toFixed(2)]; // Retorna X, Y do Jogo
}


// Adiciona um Event Listener de clique ao mapa
map.on('click', function(e) {
    const mapCoords = [e.latlng.lat.toFixed(4), e.latlng.lng.toFixed(4)];
    const gameCoords = mapToGame(e.latlng);
    
    // Adiciona um Event Listener de clique ao mapa
map.on('click', function(e) {
    // 1. Converte a coordenada do mapa (do Ropke) para a coordenada do Jogo (X, Y)
    const gameCoords = mapToGame(e.latlng);
    
    // 2. Cria a mensagem final
    const message = `
        Coordenada de Jogo (X, Y):
        [${gameCoords[0]}, ${gameCoords[1]}]

        * Use este par de números no seu data.json. *
        (O mapa não será marcado)
    `;
    
    // 3. Exibe as coordenadas num alerta do navegador
    alert(message);
    
    // OPCIONAL: Pode também copiar para a Consola (F12)
    console.log(`Coordenada de Jogo: [${gameCoords[0]}, ${gameCoords[1]}]`);
});

