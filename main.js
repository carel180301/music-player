const songs = [
    {
        title: "Kiss Of Life - R.E.M",
        file: "Music/KISS OF LIFE - REM.mp3",
        image: "Image/kof_for rem.jpg",
        duration: "4:20"
    },
    {
        title: "BTS - Magic Shop",
        file: "Music/BTS - Magic Shop.mp3",
        image: "Image/bts_for_magic shop.jpg",
        duration: "5:08"
    },
    {
        title: "BTS - Blanket Kick",
        file: "Music/BTS - Blanket Kick.mp3",
        image: "Image/bts_for_blanket kick.jpg"
    }
];

const songListContainer = document.getElementById('songList');

// Create song items and add them to the song list container
songs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.classList.add('song-item');

    const playButton = document.createElement('button');
    playButton.classList.add('play-button');
    playButton.innerHTML = '<i class="fas fa-play"></i>';

    playButton.addEventListener('click', () => {
        // Save the selected song data to localStorage
        localStorage.setItem('currentSong', JSON.stringify(song));

        // Redirect to music.html
        window.location.href = 'music.html';
    });

    const songTitle = document.createElement('span');
    songTitle.classList.add('song-title');
    songTitle.textContent = song.title;

    const songDuration = document.createElement('span');
    songDuration.classList.add('song-duration');
    songDuration.textContent = song.duration;

    songItem.appendChild(playButton);
    songItem.appendChild(songTitle);
    songItem.appendChild(songDuration);
    songListContainer.appendChild(songItem);
});
