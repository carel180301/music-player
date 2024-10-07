const songs = [
    {
        title: "QWER - My Name is Malguem",
        file: "Music/QWER - My Name is Malguem.mp3",
        image: "Image/qwer_for_my name is.jpg"
    },
    {
        title: "Day6 - Happy",
        file: "Music/DAY6 - HAPPY.mp3",
        image: "Image/day6_for_happy.jpg"
    },
    {
        title: "NMIXX - Break The Wall",
        file: "Music/NMIXX - Break The Wall.mp3",
        image: "Image/nmixx_for_break the wall.jpg"
    },
    {
        title: "NMIXX - Moving On",
        file: "Music/NMIXX - Moving On.mp3",
        image: "Image/nmixx_for_moving on.jpg"
    }
];

let currentSongIndex = 0;
let isShuffle = false;  // Shuffle mode flag
let shuffleQueue = [];  // To store shuffled songs order
let songHistory = [];   // To track played songs for shuffle mode

const audioPlayer = document.getElementById('audio_player');
const playPauseBtn = document.getElementById('playPauseBtn');
const coverImage = document.getElementById('cover');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const seekBar = document.getElementById('seekbar');

// Load the song and play it
function loadSong(songIndex) {
    const song = songs[songIndex];
    audioPlayer.src = song.file;
    coverImage.src = song.image;
    document.getElementById('song_title').innerText = song.title;
}

// Shuffle the songs and generate a shuffle queue
function generateShuffleQueue() {
    shuffleQueue = [...Array(songs.length).keys()];  // Create an array [0, 1, 2, ...]
    shuffleQueue.sort(() => Math.random() - 0.5);    // Shuffle the array
}

// Get the next song index for shuffle mode
function getNextShuffleSong() {
    if (shuffleQueue.length === 0) {
        return -1;  // Return -1 when no more songs are left in the shuffle queue
    }
    currentSongIndex = shuffleQueue.shift();  // Get the next song index and remove it from queue
    return currentSongIndex;
}

// Update seek bar as the audio plays
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekBar.value = progress || 0;
});

// Seek the song when scrubbing
seekBar.addEventListener('input', () => {
    const seekTo = (seekBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTo;
});

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Play the next song
nextBtn.addEventListener('click', () => {
    if (isShuffle) {
        let nextSongIndex = getNextShuffleSong();
        if (nextSongIndex === -1) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            return;  // Stop playing when all songs are played in shuffle
        }
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(currentSongIndex);
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

// Play the previous song
prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

// Autoplay next song when current one ends
audioPlayer.addEventListener('ended', () => {
    if (isShuffle) {
        let nextSongIndex = getNextShuffleSong();
        if (nextSongIndex === -1) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            return;  // Stop playing when all songs are played in shuffle
        }
    } else if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;  // Move to the next song
    } else {
        // If it's the last song, stop the playback and reset the UI
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        return;
    }
    loadSong(currentSongIndex);
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

// Toggle shuffle mode
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);  // Toggle visual indication
    if (isShuffle) {
        generateShuffleQueue();  // Generate shuffle queue when shuffle is activated
    }
    console.log('Shuffle mode:', isShuffle ? 'ON' : 'OFF');
});

// Initialize the first song
loadSong(currentSongIndex);
