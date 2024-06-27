

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
  };
}

document.getElementById('videoInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const videoPlayer = document.getElementById('videoPlayer');
  const vidTitle = document.getElementById('vidTitle');
  const vidDuration = document.getElementById('vidDuration');

  if (file) {
      const videoURL = URL.createObjectURL(file);
      const videoName = file.name.split('.').slice(0, -1).join('.');
      document.title = videoName;

      videoPlayer.src = videoURL;
      videoPlayer.load();

      vidTitle.textContent = videoName;
      videoPlayer.onloadedmetadata = function() {
          const duration = videoPlayer.duration;
          const hours = Math.floor(duration / 3600);
          const minutes = Math.floor((duration % 3600) / 60);
          const seconds = Math.floor(duration % 60);
          vidDuration.textContent = `Duration: ${hours}h ${minutes}m ${seconds}s`;
      };
  }
});

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
  }
});


window.onkeydown = vidCtrl;

function vidCtrl(e) {
const vid = document.getElementById('videoPlayer');
const key = e.code;

if (key === 'ArrowLeft') {
  vid.currentTime -= 5;
  if (vid.currentTime < 0) {
    vid.pause();
    vid.currentTime = 0;
  }
} else if (key === 'ArrowRight') {
  vid.currentTime += 5;
  if (vid.currentTime > vid.duration) {
    vid.pause();
    vid.currentTime = 0;
  }
} else if (key === 'Space') {
  if (vid.paused || vid.ended) {
    vid.play();
  } else {
    vid.pause();
  }
}
}


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


var video = document.getElementById("videoPlayer");
var canvas = document.getElementById("js-canvas");
var ctx = canvas.getContext("2d");

canvas.style.width = video.clientWidth + "px";
canvas.style.height = video.clientHeight + "px";

function getCurrentImage() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}

setInterval(getCurrentImage, 100);


window.onload = function() {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];

  setTimeout(function() {
    modal.style.display = "block";
  }, 0);

  setTimeout(function() {
      modal.classList.add("show");
  }, 300);

  span.onclick = function() {
      modal.classList.remove("show");
      setTimeout(function() {
          modal.style.display = "none";
      }, 1000);
  }

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.classList.remove("show");
          setTimeout(function() {
              modal.style.display = "none";
          }, 1000);
      }
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'm' || event.key === 'M') {
      setTimeout(function() {
        modal.style.display = "block";
      }, 0);
    
      setTimeout(function() {
          modal.classList.add("show");
      }, 300);
    }
  });
}



function vid(){
  var videoUrl = document.getElementById("vidUrl").value;
  setVideoSource(videoUrl);
  console.log("Video: "+videoUrl);
}

function subt(){
  var subtitleUrl = document.getElementById("subUrl").value;
  setSubtitleSource(subtitleUrl);
  console.log("Subtitle: "+subtitleUrl);
  document.getElementById('vidTitle') = "";
  document.getElementById('vidDuration') = "";
  document.title = "Video Player";
}

function setVideoSource(url) {
  var videoPlayer = document.getElementById("videoPlayer");
  videoPlayer.src = url;
  videoPlayer.load();
}

function setSubtitleSource(url) {
  var videoPlayer = document.getElementById("videoPlayer");
  var track = videoPlayer.querySelector("track");

  if (track) {
    videoPlayer.removeChild(existingTrack);
  }
  track = document.createElement("track");
  track.kind = 'subtitles';
  track.srclang = 'en';
  track.label = 'English';
  track.default = true;
  videoPlayer.appendChild(track);
  videoPlayer.textTracks[0].mode = 'showing';
  track.src = url;
}