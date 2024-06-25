// Load video details from localStorage
function loadVideoDetails() {
    const savedVideos = JSON.parse(localStorage.getItem('videos')) || [];
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';
    savedVideos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.textContent = video.name;
        videoItem.addEventListener('click', () => loadVideo(video));
        videoList.appendChild(videoItem);
    });
}

// Save video details to localStorage
function saveVideoDetails(video) {
    let savedVideos = JSON.parse(localStorage.getItem('videos')) || [];
    const existingIndex = savedVideos.findIndex(v => v.name === video.name);
    if (existingIndex > -1) {
        savedVideos[existingIndex] = video;
    } else {
        savedVideos.push(video);
    }
    localStorage.setItem('videos', JSON.stringify(savedVideos));
    loadVideoDetails();
}

// Load a video from saved details
function loadVideo(video) {
    const videoPlayer = document.getElementById('videoPlayer');
    const vidTitle = document.getElementById('vidTitle');
    const vidDuration = document.getElementById('vidDuration');

    videoPlayer.src = video.url;
    vidTitle.textContent = video.name;
    videoPlayer.currentTime = video.currentTime;
    videoPlayer.load();

    if (video.subtitleURL) {
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.src = video.subtitleURL;
        track.srclang = 'en';
        track.label = 'English';
        track.default = true;
        videoPlayer.appendChild(track);
        videoPlayer.textTracks[0].mode = 'showing';
    }

    videoPlayer.onloadedmetadata = function() {
        const duration = videoPlayer.duration;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        vidDuration.textContent = `Duration: ${hours}h ${minutes}m ${seconds}s`;
        document.getElementById('seekBar').max = duration;
    };

    videoPlayer.play();
}

// Event listener for video input
document.getElementById('videoInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const videoPlayer = document.getElementById('videoPlayer');
    const vidTitle = document.getElementById('vidTitle');
    const vidDuration = document.getElementById('vidDuration');

    if (file) {
        const videoURL = URL.createObjectURL(file);
        const videoName = file.name.split('.').slice(0, -1).join('.');

        videoPlayer.src = videoURL;
        videoPlayer.load();

        vidTitle.textContent = videoName;
        videoPlayer.onloadedmetadata = function() {
            const duration = videoPlayer.duration;
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const seconds = Math.floor(duration % 60);
            vidDuration.textContent = `Duration: ${hours}h ${minutes}m ${seconds}s`;
            document.getElementById('seekBar').max = duration;
        };

        const videoDetails = {
            name: videoName,
            url: videoURL,
            currentTime: 0,
            subtitleURL: null
        };
        saveVideoDetails(videoDetails);
    }
});

// Event listener for subtitle input
document.getElementById('subtitleInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const videoPlayer = document.getElementById('videoPlayer');
    const vidTitle = document.getElementById('vidTitle').textContent;
    const existingTrack = videoPlayer.querySelector('track');

    if (existingTrack) {
        videoPlayer.removeChild(existingTrack);
    }

    if (file) {
        const subtitleURL = URL.createObjectURL(file);
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.src = subtitleURL;
        track.srclang = 'en';
        track.label = 'English';
        track.default = true;
        videoPlayer.appendChild(track);
        videoPlayer.textTracks[0].mode = 'showing';

        let savedVideos = JSON.parse(localStorage.getItem('videos')) || [];
        const videoIndex = savedVideos.findIndex(video => video.name === vidTitle);
        if (videoIndex > -1) {
            savedVideos[videoIndex].subtitleURL = subtitleURL;
            localStorage.setItem('videos', JSON.stringify(savedVideos));
        }
    }
});

const videoPlayer = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const rewindBtn = document.getElementById('rewindBtn');
const forwardBtn = document.getElementById('forwardBtn');
const seekBar = document.getElementById('seekBar');
const muteBtn = document.getElementById('muteBtn');
const volumeBar = document.getElementById('volumeBar');
const fullScreenBtn = document.getElementById('fullScreenBtn');

// Play/pause button functionality
playPauseBtn.addEventListener('click', function() {
    if (videoPlayer.paused || videoPlayer.ended) {
        videoPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Rewind button functionality
rewindBtn.addEventListener('click', function() {
    videoPlayer.currentTime -= 10;
});

// Forward button functionality
forwardBtn.addEventListener('click', function() {
    videoPlayer.currentTime += 10;
});

// Update seek bar as the video plays
videoPlayer.addEventListener('timeupdate', function() {
    const vidTitle = document.getElementById('vidTitle').textContent;
    let savedVideos = JSON.parse(localStorage.getItem('videos')) || [];
    const videoIndex = savedVideos.findIndex(video => video.name === vidTitle);
    if (videoIndex > -1) {
        savedVideos[videoIndex].currentTime = videoPlayer.currentTime;
        localStorage.setItem('videos', JSON.stringify(savedVideos));
    }
});


// Seek bar functionality
seekBar.addEventListener('input', function() {
    videoPlayer.currentTime = seekBar.value;
});

// Mute/unmute button functionality
muteBtn.addEventListener('click', function() {
    videoPlayer.muted = !videoPlayer.muted;
    muteBtn.innerHTML = videoPlayer.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

// Volume bar functionality
volumeBar.addEventListener('input', function() {
    videoPlayer.volume = volumeBar.value;
    muteBtn.innerHTML = videoPlayer.volume === 0 ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

// Fullscreen button functionality
fullScreenBtn.addEventListener('click', function() {
    if (!document.fullscreenElement) {
        videoPlayer.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// Update play/pause button when video starts playing
videoPlayer.addEventListener('play', function() {
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

// Update play/pause button when video is paused
videoPlayer.addEventListener('pause', function() {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

// Load saved video details on page load
window.addEventListener('load', loadVideoDetails);

// Hide video details after a period of time
let hideTimeout;
function hideElement() {
    document.getElementById('details').style.opacity = '0';
}
function showElement() {
    clearTimeout(hideTimeout);
    document.getElementById('details').style.opacity = '1';
}
document.getElementById('hover').addEventListener('mouseover', showElement);
document.getElementById('hover').addEventListener('mouseout', () => {
    hideTimeout = setTimeout(hideElement, 1000);
});
hideTimeout = setTimeout(hideElement, 1000);
