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
    }
];

let currentSongIndex = 0;
const audioPlayer = document.getElementById('audio_player');
const playPauseBtn = document.getElementById('playPauseBtn');
const coverImage = document.getElementById('cover');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const seekBar = document.getElementById('seekbar');

// Load the song and play it
function loadSong(songIndex) {
    const song = songs[songIndex];
    audioPlayer.src = song.file;
    coverImage.src = song.image;
    document.getElementById('song_title').innerText = song.title;
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
    currentSongIndex = (currentSongIndex + 1) % songs.length;
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
// audioPlayer.addEventListener('ended', () => {
//     currentSongIndex = (currentSongIndex + 1) % songs.length;
//     loadSong(currentSongIndex);
//     audioPlayer.play();
//     playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
// });

// Autoplay next song when current one ends, but stop after the last song
audioPlayer.addEventListener('ended', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;  // Move to the next song
        loadSong(currentSongIndex);
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        // If it's the last song, stop the playback and reset the UI
        audioPlayer.pause();
        audioPlayer.currentTime = 0;  // Reset time to 0
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});


// Initialize the first song
loadSong(currentSongIndex);
