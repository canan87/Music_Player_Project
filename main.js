/* elementlere ulasma - obje olusturma */
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");

// indis
let index;

// tekrari
let loop;

//decode veya parse
const songsList = [
  {
    name: "Hercai",
    link: "assets/mp3indirdur-Celik-Hercai.mp3",
    artist: "Çelik",
    image: "assets/mqdefault.jpg",
  },
  {
    name: "Sonuna Kadar",
    link: "assets/mp3indirdur-Ferda-Anil-Yarkin-Sonuna-Kadar.mp3",
    artist: "Ferda Anıl Yarkın",
    image: "assets/1326883.jpg",
  },
  {
    name: "Köylü Güzeli",
    link: "assets/mp3indirdur-Hakan-Peker-Koylu-Guzeli.mp3",
    artist: "Hakan Peker",
    image: "assets/2.jpg",
  },
  {
    name: "Son Mektup",
    link: "assets/mp3indirdur-Zerrin-Ozer-Son-Mektup.mp3",
    artist: "Zerrin Özer",
    image: "assets/3.jpg",
  },
  {
    name: "Seni Yerler",
    link: "assets/mp3indirdur-Sezen-Aksu-Seni-Yerler.mp3",
    artist: "Sezen Aksu",
    image: "assets/6.jpg",
  },
];

// olaylar objesi
let events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (error) {
    deviceType = "mouse";
    return false;
  }
};

// zaman formatlama
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

// set song

const setSong = (arrayIndex) => {
  // tum ozellikler
  console.log(arrayIndex);
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  // sureyi goster
  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration); //320
  };
  playListContainer.classList.add("hide");
  playAudio();
};

// sarkiyi oynat
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); //gorund
  playButton.classList.add("hide"); //kaybol
};

// sarkiyi tekrar
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
    console.log("tekrar kapatildi");
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
    console.log("tekrar acik");
  }
});

//s onraki sarkiya git
const nextSong = () => {
  // eger dongu acik caliyorsa
  if (loop) {
    if (index == songsList.length - 1) {
      // sondaysa basa sar
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    console.log(randIndex);
    setSong(randIndex);
  }
  playAudio();
};

// sarkiyi durdur
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

// onceki sarki
const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};

// siradakine gec
audio.onended = () => {
  nextSong();
};

// shuffle songs
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
    console.log("karistirma kapali");
  } else {
    shuffleButton.classList.add("active");
    loop = false;
    console.log("karistirma acik");
  }
});

// play button
playButton.addEventListener("click", playAudio);

// next button
nextButton.addEventListener("click", nextSong);

// pause button
pauseButton.addEventListener("click", pauseAudio);

// prev button
prevButton.addEventListener("click", previousSong);

isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
  // progress bari baslat
  let coordStart = progressBar.getBoundingClientRect().left;

  // fare ile dokunma
  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  // genisligi ata
  currentProgress.style.width = progress * 100 + "%";

  // zamani ata
  audio.currentTime = progress * audio.duration;

  // oynat
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

// zaman aktikca guncelle
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

// zaman guncellenmesi
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

window.onload = () => {
  index = 0;
  setSong(index);
  initPlayList();
};

const initPlayList = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                ${songsList[i].name}
            </span>
            <span id="playlist-song-album">
            ${songsList[i].artist}
            </span>
        </div>
        </li>
        `;
  }
};

// sarki listesini goster
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

// sarki listesini kapat
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});
