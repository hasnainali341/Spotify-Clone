let currentAudio = new Audio();
let currentIndex = 0;
let songs;
let volume;

async function getAudio(folder) {
  let data = await fetch(`${folder}`);
  let response = await data.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element);
    }
  }

  // Show all musics in playlist
  let albumlist = document.querySelector(".albums-container");

  songs.forEach((song, index) => {
    let songName = song.innerHTML.split("-2")[0].replaceAll("-", " ");
    let href = song.href;
    // Appending songs in the album
    albumlist.innerHTML += `<div class="cards">
                                <div class="card">
                                    <img src="assets/images/Artist Image.png" alt="">
                                    <p class="name">${songName}</p>
                                    <p class="title">Hasnain</p>
                                </div>
                                <span class="play-svg" onclick="playmusic('${href}', '${songName}', ${index})">
                                    <img src="assets/images/play.svg" alt="">
                                </span>
                            </div>`;
  });
  return songs;
}
// Time formatter function
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const playmusic = (track, name, index, pause = false) => {
  let playbar = document.querySelector(".playbar").classList.add("play");
  songName.innerHTML = name;
  currentAudio.src = track;
  currentIndex = index;
  if (!pause) {
    currentAudio.play();
    play.src = 'assets/images/pause.svg'
  }
};

// Volume change  Function
function changeVolume() {
  volume = document.getElementById('volume').value;
  currentAudio.volume = volume / 100;
  volume_svg.src = 'assets/images/volume.svg'
  
  if (currentAudio.volume == 0) {
    volume_svg.src = 'assets/images/mute.svg';
  } else {
    volume_svg.src = 'assets/images/volume.svg';
  }
}

// Seekto Function when the value of range is change
function Seekto() {
  const seekto = currentAudio.duration * (seekbar.value / 100);
  currentAudio.currentTime = seekto;
}

async function main() {
  await getAudio("audio");

  // Adding Event Listener to Play/Pause, Next, and Previous
  document.getElementById("play").addEventListener("click", () => {
    if (currentAudio.paused) {
      currentAudio.play();
      play.src = "assets/images/pause.svg";
      document.getElementById("play_abbr").innerHTML = "Pause";
    } else {
      currentAudio.pause();
      play.src = "assets/images/play-btn.svg";
      document.getElementById("play_abbr").innerHTML = "Play";
    }
  });
  // Previous
  document.getElementById("previous").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentAudio.pause();
      currentIndex--;
      const previousSong = songs[currentIndex];
      playmusic(
        previousSong.href,
        previousSong.innerHTML.split("-2")[0].replaceAll("-", " "),
        currentIndex
      );
    }
  });
  // Next
  document.getElementById("next").addEventListener("click", () => {
    if (currentIndex < songs.length - 1) {
      currentAudio.pause();
      currentIndex++;
      const nextSong = songs[currentIndex];
      playmusic(
        nextSong.href,
        nextSong.innerHTML.split("-2")[0].replaceAll("-", " "),
        currentIndex
      );
    }
  });
  
  // Time update event to update the seekbar
currentAudio.addEventListener("timeupdate", () => {
  if (!isSeeking) { // Update seekbar only if the user isn't manually seeking
    seekbar.value = (currentAudio.currentTime / currentAudio.duration) * 100;
    document.querySelector(".time").innerHTML = `${secondsToMinutesSeconds(currentAudio.currentTime)} / ${secondsToMinutesSeconds(currentAudio.duration)}`;
  }
});

// Flag to track if the user is seeking
let isSeeking = false;

// Add event listeners to handle seeking
seekbar.addEventListener("mousedown", () => { // Start seeking
  isSeeking = true;
});

seekbar.addEventListener("input", Seekto); // Update seek position while sliding

seekbar.addEventListener("mouseup", () => { // Finish seeking
  isSeeking = false;
  Seekto(); // Ensure final position is set after seeking
});

// Mute and Unmute Functionality function
volume_svg.addEventListener('click', () => {
  if (currentAudio.volume) {
    currentAudio.volume = 0;
    volume_svg.src = 'assets/images/mute.svg';
    document.getElementById('volume').value = 0;
  } else {
    currentAudio.volume = 0.5
    volume_svg.src = 'assets/images/volume.svg';
    document.getElementById('volume').value = 50;
  }
});

// Mobile navbar functionality
document.getElementById('mobile-nav').addEventListener('click', () => {
  let left = document.querySelector('.left').classList;
  left.toggle('show');

  if (left.contains('show')) {
    mobile_nav_svg.src = 'assets/images/close.svg';
  } else {
    mobile_nav_svg.src = 'assets/images/menu-left-svgrepo-com.svg';
  }
});

// Mobile screen search functionality
document.getElementById("search-icon").addEventListener('click', () => {
  document.querySelector(".search").classList.add("show");
});
}

main();
