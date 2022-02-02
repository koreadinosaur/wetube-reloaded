const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const playBtnIcon = playBtn.querySelector("i");
const muteBtnIcon = muteBtn.querySelector("i");
const fullScreenIcon = fullScreenBtn.querySelector("i");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
  // else play the video
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
  if (+volumeValue === 0) {
    volumeRange.value = 0.5;
    video.volume = 0.5;
  }
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  volumeValue = value;
  video.volume = value;
  if (+volumeValue === 0) {
    video.muted = true;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
};
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
  console.log(timeline.max);
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};
let videoPlay = false;
let B = false;
const handleTimlineSet = (event) => {
  const {
    target: { value },
  } = event;
  if (!B) {
    videoPlay = video.paused ? false : true;
    B = true;
  }
  console.log("videoplay :" + videoPlay);
  console.log("B :" + B);
  video.pause();
  video.currentTime = value;
};
const handleTimelineChange = () => {
  videoPlay ? video.play() : video.pause();
  B = false;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};
const fullscreenkey_F = (event) => {
  if (event.code == "KeyF") {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  } else if (event.code == "Escape") {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else if (event.code == "Space") {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
  }
};
document.onfullscreenchange = () => {
  const fullscreen = document.fullscreenElement;
  if (!fullscreen) {
    fullScreenIcon.classList = "fas fa-expand";
  }
};
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

video.addEventListener("click", handlePlayClick);
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimlineSet);
timeline.addEventListener("change", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
window.addEventListener("keydown", fullscreenkey_F);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
