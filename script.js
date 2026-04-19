const API_URL = 'https://apis.davidcyril.name.ng/endpoints/xxx'; // METS TON ENDPOINT ICI
const videoGrid = document.getElementById('video-grid');
const loader = document.getElementById('loader');

async function fetchVideos() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // L'API de David Cyril renvoie souvent les données dans 'data' ou 'result'
        const videoData = data.data || data.result || data;
        
        // Si c'est un objet unique (une seule vidéo), on le met dans un tableau
        const videos = Array.isArray(videoData) ? videoData : [videoData];
        
        renderVideos(videos);
    } catch (error) {
        console.error("Erreur API:", error);
        videoGrid.innerHTML = `<p class="text-red-500 col-span-full text-center">Erreur de connexion à l'API.</p>`;
    } finally {
        loader.style.display = 'none';
    }
}

function renderVideos(videos) {
    if (!videos || videos.length === 0 || !videos[0]) {
        videoGrid.innerHTML = `<p class="text-center col-span-full">Aucune vidéo trouvée.</p>`;
        return;
    }

    videoGrid.innerHTML = videos.map(v => {
        // Mapping intelligent des noms de champs utilisés par David Cyril
        const title = v.title || v.name || "Vidéo sans titre";
        const videoUrl = v.url || v.video_url || v.download_url || v.link;
        const thumbnail = v.thumbnail || v.thumb || v.image || "https://via.placeholder.com/400x225?text=No+Preview";

        if (!videoUrl) return ''; // On ignore si il n'y a pas de lien

        return `
            <div class="video-card bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 transition duration-300">
                <div class="relative group cursor-pointer" onclick="openPlayer('${videoUrl}', '${title.replace(/'/g, "\\'")}')">
                    <img src="${thumbnail}" class="w-full h-48 object-cover">
                    <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <span class="text-4xl">▶️</span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-sm mb-4 line-clamp-2 h-10">${title}</h3>
                    <div class="flex gap-2">
                        <button onclick="openPlayer('${videoUrl}', '${title.replace(/'/g, "\\'")}')" 
                                class="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded uppercase">
                            Regarder
                        </button>
                        <a href="${videoUrl}" target="_blank" download
                           class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded">
                            ⬇️
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Fonctions du lecteur (identiques à la version précédente)
function openPlayer(url, title) {
    const modal = document.getElementById('videoModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDownload').href = url;
    document.getElementById('playerContainer').innerHTML = `
        <video controls autoplay class="w-full h-full shadow-2xl">
            <source src="${url}" type="video/mp4">
        </video>`;
    modal.classList.remove('hidden');
}

function closePlayer() {
    document.getElementById('videoModal').classList.add('hidden');
    document.getElementById('playerContainer').innerHTML = '';
}

fetchVideos();