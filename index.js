const songs = [
    {
        title: "Kiss Of Life - R.E.M",
        file: "Music/KISS OF LIFE - REM.mp3",
        image: "Image/kof_for rem.jpg"
    },
    {
        title: "BTS - Magic Shop",
        file: "Music/BTS - Magic Shop.mp3",
        image: "Image/bts_for_magic shop.jpg"
    }
];


let currentSongIndex = 0;
let isShuffle = false;  // Shuffle mode flag
let shuffleQueue = [];  // To store shuffled songs order
let songHistory = [];   // To track played songs for shuffle mode
let isReplay = false;   // Flag to track whether replay mode is active

const audioPlayer = document.getElementById('audio_player');
const replayBtn = document.getElementById('replayBtn');
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
    
    // Remove the current song index from the shuffle queue
    shuffleQueue = shuffleQueue.filter(index => index !== currentSongIndex);

    shuffleQueue.sort(() => Math.random() - 0.5);    // Shuffle the array
}


// Get the next song index for shuffle mode
function getNextShuffleSong() {
    if (shuffleQueue.length === 0) {
        return -1;  // Return -1 when no more songs are left in the shuffle queue
    }
    currentSongIndex = shuffleQueue.shift();  // Get the next song index and remove it from queue
    songHistory.push(currentSongIndex);       // Track played song in history
    return currentSongIndex;
}

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
    if (isReplay) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        return;
    }

    if (isShuffle) {
        if (shuffleQueue.length === 0) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            return;  // Stop playing when shuffleQueue is empty
        }
        
        // Get the next song from shuffleQueue
        currentSongIndex = shuffleQueue.shift();  // Move to the next song in the shuffle queue
        songHistory.push(currentSongIndex);       // Track played song in history
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;  // Normal next song
    }
    loadSong(currentSongIndex);
    audioPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});


// Play the previous song or restart the current one depending on the time played
prevBtn.addEventListener('click', () => {
    if (isReplay) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        return;
    }

    // Check if more than 3 seconds have passed in the current song
    if (audioPlayer.currentTime > 3) {
        // If more than 3 seconds have passed, just reset the current song
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        // If less than 3 seconds, go to the previous song
        if (isShuffle) {
            // If there's only one song in history, don't allow going back
            if (songHistory.length > 1) {
                songHistory.pop();  // Remove the current song from history
                currentSongIndex = songHistory[songHistory.length - 1];  // Set current to the last played
                loadSong(currentSongIndex);
                audioPlayer.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        } else {
            // Regular (non-shuffle) mode: go to the previous song
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            loadSong(currentSongIndex);
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }
});




// Autoplay next song when current one ends
audioPlayer.addEventListener('ended', () => {
    if (isReplay) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else if (isShuffle) {
        let nextSongIndex = getNextShuffleSong();
        if (nextSongIndex === -1) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            return;
        }
        loadSong(nextSongIndex);
        audioPlayer.play();
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        audioPlayer.play();
    }
});

// Toggle shuffle mode
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
    if (isShuffle) {
        generateShuffleQueue();
        songHistory = [currentSongIndex];  // Start shuffle history with current song
    }
    console.log('Shuffle mode:', isShuffle ? 'ON' : 'OFF');
});

// Initialize the first song
loadSong(currentSongIndex);

// Toggle replay mode
replayBtn.addEventListener('click', () => {
    isReplay = !isReplay;
    replayBtn.classList.toggle('active', isReplay);
    console.log('Replay mode:', isReplay ? 'ON' : 'OFF');
});

// Update the seekbar as the song plays
audioPlayer.addEventListener('timeupdate', () => {
    // Check if the song is loaded and has a duration
    if (audioPlayer.duration) {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        seekBar.value = (currentTime / duration) * 100;  // Update the seekbar
    }
});

// Allow the user to seek the song by clicking on the seekbar
seekBar.addEventListener('input', () => {
    const seekTime = (seekBar.value / 100) * audioPlayer.duration;  // Calculate the new time
    audioPlayer.currentTime = seekTime;  // Update the audio's current time
});


const currentTimeEl = document.getElementById('currentTime');
const totalDurationEl = document.getElementById('totalDuration');

// Function to format seconds into MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update total duration when metadata is loaded
audioPlayer.addEventListener('loadedmetadata', () => {
    totalDurationEl.innerText = formatTime(audioPlayer.duration);
});

// Update current time as the song plays
audioPlayer.addEventListener('timeupdate', () => {
    currentTimeEl.innerText = formatTime(audioPlayer.currentTime);
    
    // Update seekbar based on current time
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        seekBar.value = progress;
    }
});

// Allow the user to seek the song by clicking on the seekbar
seekBar.addEventListener('input', () => {
    const seekTime = (seekBar.value / 100) * audioPlayer.duration;  // Calculate the new time
    audioPlayer.currentTime = seekTime;  // Update the audio's current time
});


