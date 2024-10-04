const songs = [
    {
        title: "NMIXX - Break The Walls",
        file: "Music/NMIXX - Break The Wall.mp3",
        image: "Image/nmixx_for_break the wall.jpg"
    },
    {
        title: "NMIXX - Moving On",
        file: "Music/NMIXX - Moving On.mp3",
        image: "Image/nmixx_for_moving on.jpg"
    },
    {
        title: "BTS - Spring Day",
        file: "Music/BTS-Spring Day.mp3",
        image: "Image/bts_for_spring day.jpg"
    },
    {
        title: "BTS - Magic Shop",
        file: "Music/BTS - Magic Shop.mp3",
        image: "Image/bts_for_magic shop.jpg"
    },
    {
        title: "Day6 - Happy",
        file: "Music/DAY6 - HAPPY.mp3",
        image: "Image/day6_for_happy.jpg"
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
    seekBar.value = progress || 0;  // Prevent NaN at the beginning
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
audioPlayer.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

// Initialize the first song
loadSong(currentSongIndex);
