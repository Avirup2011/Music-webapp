const tracks = [
    { name: "Believer", genre: "english", img: "https://i.scdn.co/image/ab67616d0000b2735675e83f707f1d7271e5cf8a", url: "https://res.cloudinary.com/ddxsesq2l/video/upload/v1774419689/Imagine_Dragons_-_Believer_8D_AUDIO_n9ewll.mp3" },
    { name: "I wanna be your slave", genre: "english", img: "https://i.scdn.co/image/ab67616d0000b2735aa05015cfa7bd2943c29b21", url: "https://res.cloudinary.com/ddxsesq2l/video/upload/v1774419697/Ma%CC%8Aneskin_-_I_WANNA_BE_YOUR_SLAVE_Lyrics_8D_Audio_dkjkns.mp3" },
    { name: "Perfect", genre: "english", img: "https://c.saavncdn.com/286/WMG_190295851286-English-2017-500x500.jpg", url: "https://res.cloudinary.com/ddxsesq2l/video/upload/v1774419670/Ed_Sheeran_-_Perfect_8D_AUDIO_kq49dk.mp3" },
    { name: "Shape of you", genre: "english", img: "https://i1.sndcdn.com/artworks-000205276174-rkz33n-t500x500.jpg", url: "https://res.cloudinary.com/ddxsesq2l/video/upload/v1774419677/Ed_Sheeran_-_Shape_Of_You_8D_AUDIO_ti1hq6.mp3" },
    { name: "Pal pal", genre: "hindi", img: "https://lyricstranslatezone.com/wp-content/uploads/2025/09/pal-pal-lyrics-translation-afusic.jpg", url: "https://res.cloudinary.com/ddxsesq2l/video/upload/v1774419669/Afusic_-_Pal_Pal_with_Talwiinder_16D_Audio__Not_8D_audio_pal_pal_8d_slowed_reverb_punjabi_song_9UaiA9c9Two_zzq581.mp3" },
    { name: "Akhiyaan Gulaab", genre: "hindi", img: "https://i.scdn.co/image/ab67616d0000b27352e3a807b72281cb40c08092", url: "https://res.cloudinary.com/ddxsesq2l/video/upload/v1774419651/Akhiyaan_Gulaab_8D_AUDIO___Shahid_Kapoor_Kriti_Sanon_Mitraz_Teri_Baaton_Mein_Aisa_Uljha_Jiya_jjukav.mp3" },
    { name: "Gehra Hua", genre: "hindi", img: "https://c.saavncdn.com/450/Gehra-Hua-From-Dhurandhar-Hindi-2025-20251205154217-500x500.jpg", url: "https://res.cloudinary.com/ddxsesq2l/video/upload/v1774419690/Gehra_Hua_8D_AUDIO_Dhurandhar_Ranveer_Singh_Sara_Shashwat_Sachdev_Arijit_Singh_Lyrics_cyoxc5.mp3" },
    { name: "Saiyaara", genre: "hindi", img: "https://c.saavncdn.com/598/Saiyaara-Hindi-2025-20250703061754-500x500.jpg", url: "https://res.cloudinary.com/ddxsesq2l/video/upload/v1774419668/8D_Audio_-_Saiyaara_Title_Song_Saiyaara_Hindi_Sad_Song_2025_Use_Headphones_g15ffy.mp3" }
];

let currentTrackIndex = 0;
let audioCtx, analyser, source, dataArray, canvasCtx;
const audio = document.getElementById('main-audio');
const playPauseIcon = document.getElementById('play-pause-icon');
const progressBar = document.getElementById('progress-bar');

const IMG_PLAY = "play.png";
const IMG_PAUSE = "pause-icon-13.png"; 

function startExperience() {
    document.getElementById('airpods').classList.add('go-up');
    document.getElementById('ui-elements').classList.add('fade-out');
    renderSongs('all');
    setTimeout(() => {
        document.getElementById('intro-screen').classList.add('hidden');
        document.getElementById('experience-content').classList.remove('hidden');
        window.scrollTo(0,0);
        setTimeout(() => document.getElementById('experience-content').style.opacity = "1", 50);
    }, 1100);
}

// --- FILTER & SETTINGS LOGIC ---
function toggleFilterMenu() {
    document.getElementById('filter-menu').classList.toggle('filter-menu-hidden');
}

function filterTracks(genre, el) {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderSongs(genre);
    toggleFilterMenu();
}

function openSettings() {
    toggleFilterMenu(); // Close dropdown
    document.getElementById('settings-modal').classList.remove('modal-hidden');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('modal-hidden');
}

function renderSongs(genre) {
    const grid = document.getElementById('song-grid');
    const filtered = genre === 'all' ? tracks : tracks.filter(t => t.genre === genre);
    grid.innerHTML = filtered.map((t) => {
        const masterIndex = tracks.findIndex(track => track.url === t.url);
        return `<div class="song-box" onclick="openPlayer(${masterIndex})">
            <img src="${t.img}"><p>${t.name}</p></div>`;
    }).join('');
}

// --- PLAYER LOGIC ---
function openPlayer(index) {
    currentTrackIndex = index;
    document.getElementById('player-overlay').classList.remove('player-hidden');
    document.getElementById('player-img').src = tracks[index].img;
    document.getElementById('player-song-name').innerText = tracks[index].name;
    audio.src = tracks[index].url;
    audio.play();
    playPauseIcon.src = IMG_PAUSE;
    if (!audioCtx) initVisualizer();
}

function togglePlay() {
    if (audio.paused) { audio.play(); playPauseIcon.src = IMG_PAUSE; }
    else { audio.pause(); playPauseIcon.src = IMG_PLAY; }
}

function changeSong(dir) {
    currentTrackIndex = (currentTrackIndex + dir + tracks.length) % tracks.length;
    openPlayer(currentTrackIndex);
}

function closePlayer() {
    document.getElementById('player-overlay').classList.add('player-hidden');
    audio.pause();
}

audio.ontimeupdate = () => {
    if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('current-time').innerText = formatTime(audio.currentTime);
        document.getElementById('duration-time').innerText = formatTime(audio.duration);
    }
};

progressBar.oninput = () => audio.currentTime = (progressBar.value / 100) * audio.duration;

function formatTime(s) {
    let m = Math.floor(s / 60);
    let sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' + sec : sec}`;
}

// --- 4D VISUALIZER ---
function initVisualizer() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser); analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    canvasCtx = document.getElementById('visualizer').getContext('2d');
    draw();
}

function draw() {
    requestAnimationFrame(draw);
    const canvas = canvasCtx.canvas;
    canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'black'; canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.strokeStyle = 'white'; canvasCtx.lineWidth = 3; canvasCtx.lineCap = 'round';
    canvasCtx.beginPath();
    let sliceWidth = canvas.width / dataArray.length;
    let x = 0;
    const centerY = canvas.height / 2;
    for (let i = 0; i < dataArray.length; i++) {
        let v = (dataArray[i] / 128.0) - 1.0;
        let mult = Math.sin((i / (dataArray.length - 1)) * Math.PI);
        let y = centerY + (v * centerY * mult * 0.8);
        if (i === 0) canvasCtx.moveTo(x, y); else canvasCtx.lineTo(x, y);
        x += sliceWidth;
    }
    canvasCtx.stroke();
}
