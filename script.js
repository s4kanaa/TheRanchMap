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

    // CORREÇÃO: Retorna um array [Lat, Lng] em vez de L.latLng()
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
// 1. CONFIGURAÇÃO BASE DO MAPA (Estável e Funcional)
// ==========================================================

const southWestCoords = [-160, -120];
const northEastCoords = [25, 250];
const bounds = L.latLngBounds(southWestCoords, northEastCoords);

const viewportX = -70;
const viewportY = 111.75;
const viewportZoom = 3;

const map = L.map('map', {
    preferCanvas: true,
    attributionControl: false,
    minZoom: 2,
    maxZoom: 7,
    zoomControl: true,
    crs: L.CRS.Simple
}).setView([viewportX, viewportY], viewportZoom);


// ==========================================================
// 2. ADICIONAR CAMADA DE TILES (Map Tiles)
// ==========================================================

const tileUrl = 'https://map-tiles.b-cdn.net/assets/rdr3/webp/detailed/{z}/{x}_{y}.webp';

L.tileLayer(tileUrl, {
    noWrap: true,
    bounds: bounds,
    attribution: '<a href="https://rdr2map.com/" target="_blank">RDR2Map</a>',
    tms: true
}).addTo(map);

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
                // CORREÇÃO: Usa a função de tradução para obter as coordenadas corretas
                const markerCoords = gameToMap(item.coordenadas);

                L.marker(markerCoords) 
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
// 4. FERRAMENTA DE COORDENADAS (Clique para Obter Coordenadas)
// ==========================================================

// Adiciona um Event Listener de clique ÚNICO ao mapa
map.on('click', function(e) {
    
    // 1. Converte a coordenada do mapa (do Ropke) para a coordenada do Jogo (X, Y)
    const gameCoords = mapToGame(e.latlng);
    
    // 2. Cria a mensagem final
    const message = `
        Coordenada de Jogo (X, Y) para data.json:
        [${gameCoords[0]}, ${gameCoords[1]}]

        * Use este par de números no seu data.json. *
    `;
    
    // 3. Exibe as coordenadas num alerta do navegador
    alert(message);
    
    // Copia para a Consola (o método preferido para copiar rapidamente)
    console.log(`COORDS PARA JSON: [${gameCoords[0]}, ${gameCoords[1]}]`);
});
