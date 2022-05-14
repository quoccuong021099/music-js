const listSong = [
  {
    name: "Em của ngày hôm qua",
    singer: "Sơn Tùng M-TP",
    path: "./audio/ecnhq.mp3",
    image:
      "https://imgt.taimienphi.vn/cf/Images/td/2018/3/30/loi-bai-hat-em-cua-ngay-hom-qua.jpg",
  },
  {
    name: "There's no one at all",
    singer: "ST M_TP",
    path: "./audio/TNOAA.mp3",
    image: "https://i.ytimg.com/vi/iQWzusXhD7Q/maxresdefault.jpg",
  },
  {
    name: "Running now",
    singer: "Sơn Tùng",
    path: "./audio/runnow.mp3",
    image: "https://i1.sndcdn.com/artworks-000347253627-q007hh-t500x500.jpg",
  },
  {
    name: "Mantoiyat",
    singer: "Raftaar x Nawazuddin Siddiqui",
    path: "./audio/ecnhq.mp3",
    image:
      "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
  },
  {
    name: "Aage Chal",
    singer: "Raftaar",
    path: "./audio/runnow.mp3",
    image:
      "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
  },
  {
    name: "Damn",
    singer: "Raftaar x kr$na",
    path: "./audio/TNOAA.mp3",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Badshah_snapped_on_the_sets_of_Dance_India_Dance.jpg",
  },
  {
    name: "Feeling You",
    singer: "Raftaar x Harjas",
    path: "./audio/ecnhq.mp3",
    image:
      "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
  },
];
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const time = $(".time");

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const app = {
  listSong,
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.listSong[this.currentIndex];
      },
    });
  },
  render: function () {
    const htmls = this.listSong.map((item, index) => {
      return `
        <div class="song ${
          this.currentIndex === index ? "active" : ""
        }" data-index="${index}">
          <div
            class="thumb"
            style="
              background-image: url('${item.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${item.name}</h3>
            <p class="author">${item.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
          `;
    });
    playlist.innerHTML = htmls.join("");
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    if (audio.duration) {
      const htmls = `${Math.floor(0)} / ${Math.floor(audio.duration)}`;
      time.textContent = htmls;
    }
  },
  handleEvent: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // xử lý phóng to thu nhỏ
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // xử lý khi video chạy thì ảnh xe quay
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xử lý click vào nút play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // xử lý khi bài hát đang chạy
    audio.onplaying = function () {
      cdThumbAnimate.play();
      _this.isPlaying = true;
      player.classList.add("playing");
    };

    // xử lý khi bài hát dừng
    audio.onpause = function () {
      _this.isPlaying = false;
      cdThumbAnimate.pause();
      player.classList.remove("playing");
    };

    // xử lý khi tua nhạc
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
      const htmls = `${Math.floor(seekTime)} / ${Math.floor(audio.duration)}`;
      time.textContent = htmls;
      audio.play();
    };

    // Thay đổi thanh thời gian khi nhạc chạy
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    function prevSong() {
      _this.currentIndex--;
      if (_this.currentIndex < 0) {
        _this.currentIndex = _this.listSong.length - 1;
      }
    }
    function nextSong() {
      _this.currentIndex++;
      if (_this.currentIndex >= _this.listSong.length) {
        _this.currentIndex = 0;
      }
    }
    function randomSong() {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * _this.listSong.length);
      } while (newIndex === _this.currentIndex);
      _this.currentIndex = newIndex;
    }

    // Xử lý khi bấm prev/next
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        randomSong();
      } else {
        prevSong();
      }
      _this.loadCurrentSong();
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        randomSong();
      } else {
        nextSong();
      }
      _this.loadCurrentSong();
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // khi click vào nút random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý nút lặp lại 1 bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý khi hết bài hát sẽ tự động chuyển bài
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vào song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: `${[0, 1, 2].includes(this.currentIndex) ? "end" : "start"}`,
      });
    }, 300);
  },
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom || this.isRandom;
    this.isRepeat = this.config.isRepeat || this.isRepeat;
  },
  start: function () {
    this.scrollToActiveSong();
    // gắn cấu hình vào ứng dụng
    this.loadConfig();

    // khai báo properties
    this.defineProperties();

    // xử lý sự kiện
    this.handleEvent();

    // hiển thị bài hát hiện tại
    this.loadCurrentSong();

    // render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
