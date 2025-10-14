// ==========================================================
// 1. CONFIGURAÇÃO BASE DO MAPA (Corrigida para Coordenadas Nativas do Jogo)
// ==========================================================

// DEFINE O SISTEMA DE COORDENADAS (CRS)
// Este código estende o CRS.Simple para incluir a transformação necessária
// para que as coordenadas do jogo (X, Y) se alinhem com os tiles do mapa.
const crs = L.extend(L.CRS.Simple, {
    projection: L.Projection.LonLat,
    // Os números de transformação escalam e invertem os eixos para o Leaflet
    transformation: new L.Transformation(1 / 0.0118, 0, -1 / 0.0118, 0) 
});


// As coordenadas que está a obter do seu servidor devem funcionar AGORA.
// Mantemos o centro e o zoom do Ropke para centrar o mapa visualmente.
const viewportX = -70; 
const viewportY = 111.75;
const viewportZoom = 3;

// Inicializa o mapa Leaflet (USANDO O NOVO CRS)
const map = L.map('map', {
    preferCanvas: true,
    attributionControl: false,
    minZoom: 2,       // Zoom mínimo
    maxZoom: 7,       // Zoom máximo
    zoomControl: true,
    crs: crs // CRUCIAL: USAMOS O NOVO CRS TRANSFORMADO
}).setView([viewportX, viewportY], viewportZoom); // Ponto inicial e zoom


// ==========================================================
// 2. ADICIONAR CAMADA DE TILES (Map Tiles)
// ==========================================================

// Os limites do Ropke são necessários apenas para impedir que o utilizador saia do mapa
const southWestCoords = [-160, -120];
const northEastCoords = [25, 250];
const bounds = L.latLngBounds(southWestCoords, northEastCoords);

// Usamos o template de tiles de alta performance que o Jean Ropke usa
const tileUrl = 'https://map-tiles.b-cdn.net/assets/rdr3/webp/detailed/{z}/{x}_{y}.webp';

// Criar a camada de tiles
L.tileLayer(tileUrl, {
    noWrap: true,
    // O bounds não é necessário aqui, pois o CRS trata da projeção
    attribution: '<a href="https://rdr2map.com/" target="_blank">RDR2Map</a>',
    tms: true
}).addTo(map);

// Define os limites MÁXIMOS de navegação
map.setMaxBounds(bounds);


// ==========================================================
// 3. FUNÇÃO DE CARREGAMENTO DOS SEUS DADOS
// ==========================================================

function loadTheRanchData() {
    // A função de fetch continua a funcionar como antes.
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('Dados do The Ranch carregados:', data);
            
            data.forEach(item => {
                // A função L.marker([latitude, longitude]) agora interpreta
                // as suas coordenadas nativas X, Y corretamente.
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
