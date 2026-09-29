/**
 * OUR LITTLE STORY - Main Application Script
 * Pure Vanilla JavaScript (No frameworks, no libraries)
 */

// =====================================
// EDIT YOUR INFORMATION HERE
// =====================================

// 1. Your relationship start date (Format: "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS")
const relationshipStart = "2025-11-01";

// 2. Names of the couple
const partnerNames = {
  partnerOne: "I'am",
  partnerTwo: "Viaa"
};

// =====================================
// END OF BASIC CONFIGURATION
// =====================================


function safeRun(moduleName, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[OurLittleStory] Error in ${moduleName}:`, err);
  }
}

function startApplication() {
  safeRun("Relationship Counter", initRelationshipCounter);
  safeRun("Navigation", initNavigation);
  safeRun("Gallery", initGallery);
  safeRun("Special Dates", initSpecialDates);
  safeRun("Birthdays", initBirthdays);
  safeRun("Music Player", initMusicPlayer);
  safeRun("Timeline", initTimeline);
  safeRun("Letter", initLetter);
  safeRun("Saved Messages", initSavedMessages);
  safeRun("Scroll Animations", initScrollAnimations);
  safeRun("Footer Year", initFooterYear);
}

// =====================================
// GLOBAL TOAST NOTIFICATION
// =====================================
function showMainToast(message) {
  let toast = document.getElementById("main-site-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "main-site-toast";
    toast.className = "main-site-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  
  if (window.mainToastTimer) clearTimeout(window.mainToastTimer);
  window.mainToastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 4000);
}
window.showMainToast = showMainToast;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApplication);
} else {
  // DOM is already parsed (interactive or complete), run immediately
  startApplication();
}

/**
 * 1. LIVE RELATIONSHIP COUNTER
 * Accurately calculates elapsed Years, Months, Days, Hours, Minutes, Seconds.
 */
function initRelationshipCounter() {
  const startDate = new Date(relationshipStart);
  
  // Format readable date (e.g., "February 14, 2024")
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = startDate.toLocaleDateString("en-US", options);
  
  const heroDateEl = document.getElementById("together-since-date");
  const annivDateEl = document.getElementById("anniversary-since-date");
  if (heroDateEl) heroDateEl.textContent = formattedDate;
  if (annivDateEl) annivDateEl.textContent = formattedDate;

  function updateCounter() {
    const now = new Date();
    let diffMs = now.getTime() - startDate.getTime();

    if (diffMs < 0) {
      // If start date is in the future
      diffMs = 0;
    }

    // Precise date calendar breakdown
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();

    if (seconds < 0) {
      minutes -= 1;
      seconds += 60;
    }
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    if (hours < 0) {
      days -= 1;
      hours += 24;
    }
    if (days < 0) {
      months -= 1;
      // Days in previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(Math.max(0, val)).padStart(2, "0");
    };

    setVal("counter-years", years);
    setVal("counter-months", months);
    setVal("counter-days", days);
    setVal("counter-hours", hours);
    setVal("counter-minutes", minutes);
    setVal("counter-seconds", seconds);

    // Summary badge text
    const summaryEl = document.getElementById("relationship-duration-summary");
    if (summaryEl) {
      summaryEl.textContent = `${years} Years, ${months} Months, and ${days} Days of Loving You`;
    }
  }

  updateCounter();
  setInterval(updateCounter, 1000);
}

/**
 * 2. NAVIGATION & MOBILE HAMBURGER MENU
 */
function initNavigation() {
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("site-navigation");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky header shadow on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }, { passive: true });

  // Toggle mobile menu
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      navMenu.classList.toggle("nav-open");
      menuToggle.classList.toggle("is-active");
      document.body.classList.toggle("no-scroll", !isExpanded);
    });

    // Close when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.classList.remove("is-active");
        document.body.classList.remove("no-scroll");
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("nav-open")) {
        navMenu.classList.remove("nav-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.classList.remove("is-active");
        document.body.classList.remove("no-scroll");
      }
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let currentId = "";
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
}

/**
 * 3. GALLERY & FULLSCREEN LIGHTBOX & VIDEO PLAYER
 */
function initGallery() {
  const galleryGrid = document.getElementById("gallery-grid");
  const filterButtons = document.querySelectorAll(".gallery-filter-btn");
  if (!galleryGrid || typeof memories === "undefined") return;

  let currentFilter = "all";
  let activeLightboxIndex = -1;

  // Filter gallery items
  function renderGallery(filter = "all") {
    galleryGrid.innerHTML = "";
    
    const filtered = memories.filter(item => {
      if (filter === "all") return true;
      if (filter === "video") return item.type === "video" || item.category === "jj";
      if (filter === "ai") return item.category === "ai" || (item.tag && item.tag.toLowerCase().includes("ai")) || (item.title && item.title.toLowerCase().includes("ai"));
      if (filter === "random") return item.category === "random" || (item.tag && item.tag.toLowerCase().includes("random")) || (item.title && item.title.toLowerCase().includes("random"));
      if (filter === "photo") return item.type === "photo";
      return true;
    });

    if (filtered.length === 0) {
      galleryGrid.innerHTML = `
        <div class="empty-gallery-msg">
          <div class="empty-gallery-icon">📸</div>
          <h3>Belum ada koleksi di kategori ini</h3>
          <p>Koleksi memori akan tampil di sini saat ditambahkan ke <code>js/gallery.js</code>.</p>
          <button type="button" class="btn-reset-filter" id="btn-show-all-memories">Lihat Semua Koleksi (${memories.length})</button>
        </div>
      `;
      const btnReset = document.getElementById("btn-show-all-memories");
      if (btnReset) {
        btnReset.addEventListener("click", () => {
          filterButtons.forEach(b => {
            if (b.getAttribute("data-filter") === "all") b.classList.add("active");
            else b.classList.remove("active");
          });
          renderGallery("all");
        });
      }
      return;
    }

    filtered.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "gallery-item";
      card.setAttribute("data-type", item.type);
      
      const isVideo = item.type === "video";
      const imgSrc = isVideo ? (item.thumbnail || item.image || "assets/images/hero.jpg") : (item.image || "assets/images/hero.jpg");
      const tagText = item.tag || (isVideo ? "JJ / Video" : "Foto");
      const categoryClass = item.category || (isVideo ? "jj" : "photo");

      card.innerHTML = `
        <div class="gallery-card-inner">
          <div class="gallery-image-wrap">
            <img src="${imgSrc}" alt="${item.title}" loading="lazy" class="gallery-img" onerror="this.onerror=null; this.src='assets/images/hero.jpg';" />
            ${isVideo ? `
              <div class="gallery-play-center-btn" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            ` : ""}
            <div class="gallery-overlay">
              <span class="gallery-type-badge">${isVideo ? "▶ Tonton Video / JJ" : "⤢ Lihat Foto HD"}</span>
            </div>
            <div class="gallery-floating-badge badge-${categoryClass}">${tagText}</div>
          </div>
          <div class="gallery-meta">
            <div class="gallery-meta-top">
              <span class="gallery-pill-tag badge-${categoryClass}">${tagText}</span>
              <span class="gallery-date">${item.date}</span>
            </div>
            <h3 class="gallery-title">${item.title}</h3>
            <p class="gallery-desc">${item.description}</p>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        if (isVideo) {
          openVideoModal(item);
        } else {
          // Open photo lightbox
          const currentPhotoItems = memories.filter(m => m.type === "photo");
          const photoIndex = currentPhotoItems.findIndex(p => p.image === item.image);
          openLightbox(photoIndex >= 0 ? photoIndex : 0);
        }
      });

      galleryGrid.appendChild(card);
    });
  }

  // Filter click handlers
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      renderGallery(currentFilter);
    });
  });

  const photoItems = memories.filter(m => m.type === "photo");

  // Initial render
  renderGallery("all");

  // Lightbox Modal Setup
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDate = document.getElementById("lightbox-date");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const btnClose = document.getElementById("lightbox-close");
  const btnPrev = document.getElementById("lightbox-prev");
  const btnNext = document.getElementById("lightbox-next");

  function openLightbox(index) {
    if (!lightbox || photoItems.length === 0) return;
    activeLightboxIndex = (index + photoItems.length) % photoItems.length;
    const item = photoItems[activeLightboxIndex];

    lightboxImg.src = item.image;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDate.textContent = item.date;
    lightboxCaption.textContent = item.description;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  if (btnClose) btnClose.addEventListener("click", closeLightbox);
  if (btnPrev) btnPrev.addEventListener("click", () => openLightbox(activeLightboxIndex - 1));
  if (btnNext) btnNext.addEventListener("click", () => openLightbox(activeLightboxIndex + 1));

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-backdrop")) {
        closeLightbox();
      }
    });
  }

  // Video Modal Setup
  const videoModal = document.getElementById("video-modal");
  const videoPlayer = document.getElementById("modal-video-element");
  const videoTitle = document.getElementById("video-modal-title");
  const videoDate = document.getElementById("video-modal-date");
  const videoDesc = document.getElementById("video-modal-desc");
  const btnCloseVideo = document.getElementById("video-modal-close");

  function openVideoModal(videoItem) {
    if (!videoModal || !videoPlayer) return;

    // Pause romantic background music if playing so audio does not overlap
    if (window.bgAudioPlayer && !window.bgAudioPlayer.paused) {
      window.bgAudioPlayer.pause();
    }

    videoPlayer.src = encodeURI(videoItem.video);
    videoPlayer.load();
    videoTitle.textContent = videoItem.title;
    videoDate.textContent = videoItem.date;
    videoDesc.textContent = videoItem.description;

    videoModal.classList.add("active");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    const playPromise = videoPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay with sound might be restricted by browser policy; user can tap play button
      });
    }
  }

  function closeVideoModal() {
    if (!videoModal || !videoPlayer) return;
    videoPlayer.pause();
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
    videoModal.classList.remove("active");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  if (btnCloseVideo) btnCloseVideo.addEventListener("click", closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal || e.target.classList.contains("modal-backdrop")) {
        closeVideoModal();
      }
    });
  }

  // Keyboard navigation for modals
  document.addEventListener("keydown", (e) => {
    if (lightbox && lightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openLightbox(activeLightboxIndex - 1);
      if (e.key === "ArrowRight") openLightbox(activeLightboxIndex + 1);
    }
    if (videoModal && videoModal.classList.contains("active")) {
      if (e.key === "Escape") closeVideoModal();
    }
  });
}

/**
 * 4. SPECIAL DATES & ANNIVERSARY
 */
function initSpecialDates() {
  const container = document.getElementById("special-dates-grid");
  if (!container || typeof specialDates === "undefined") return;

  container.innerHTML = "";

  specialDates.forEach((item) => {
    const card = document.createElement("div");
    card.className = "special-date-card reveal-on-scroll";

    const dateObj = new Date(item.date);
    const dateFormatted = !isNaN(dateObj) 
      ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : item.date;

    const hasImg = item.image && item.image.trim() !== "";

    card.innerHTML = `
      ${hasImg ? `
        <div class="special-date-img-wrap">
          <img src="${item.image}" alt="${item.title}" loading="lazy" class="special-date-img" />
        </div>
      ` : `
        <div class="special-date-icon-wrap">
          <span class="special-date-calendar-icon">📅</span>
        </div>
      `}
      <div class="special-date-content">
        <span class="special-date-tag">${dateFormatted}</span>
        <h4 class="special-date-title">${item.title}</h4>
        <p class="special-date-desc">${item.description}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * 4B. OUR SPECIAL BIRTHDAYS & LIVE COUNTDOWN
 * I'am: 22 Januari (Aquarius)
 * Via: 30 Oktober (Scorpio)
 */
function initBirthdays() {
  function getNextBirthday(targetMonth, targetDay) {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Check if today matches the birthday date
    const isToday = (now.getMonth() === targetMonth && now.getDate() === targetDay);

    // Target midnight of the birthday date
    let targetDate = new Date(currentYear, targetMonth, targetDay, 0, 0, 0, 0);

    // If target date is in the past and today is not the birthday, set to next year
    if (now.getTime() > targetDate.getTime() && !isToday) {
      targetDate = new Date(currentYear + 1, targetMonth, targetDay, 0, 0, 0, 0);
    }

    const diffMs = targetDate.getTime() - now.getTime();
    return { diffMs, isToday, targetDate };
  }

  function renderPerson(prefix, targetMonth, targetDay, personName, emoji) {
    const elDays = document.getElementById(`${prefix}-days`);
    const elHours = document.getElementById(`${prefix}-hours`);
    const elMins = document.getElementById(`${prefix}-minutes`);
    const elSecs = document.getElementById(`${prefix}-seconds`);
    const elStatus = document.getElementById(`${prefix}-status`);

    const data = getNextBirthday(targetMonth, targetDay);

    if (data.isToday) {
      if (elDays) elDays.textContent = "00";
      if (elHours) elHours.textContent = "00";
      if (elMins) elMins.textContent = "00";
      if (elSecs) elSecs.textContent = "00";
      if (elStatus) {
        elStatus.innerHTML = `🎉 <strong>HARI INI ULANG TAHUN!</strong> Selamat hari lahir ${personName}! 🎂💖`;
        elStatus.classList.add("is-birthday-today");
      }
      return;
    }

    const remaining = Math.max(0, data.diffMs);
    const totalSecs = Math.floor(remaining / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(minutes);
    if (elSecs) elSecs.textContent = pad(seconds);

    if (elStatus) {
      elStatus.classList.remove("is-birthday-today");
      if (days === 0) {
        elStatus.innerHTML = `⏳ <strong>Kurang dari 24 jam lagi!</strong> Menghitung jam dan menit menuju ultah ${personName}... 🎁✨`;
      } else {
        elStatus.innerHTML = `✨ <strong>${days} hari lagi</strong> menuju hari istimewa ${personName} ${emoji}`;
      }
    }
  }

  function update() {
    var cfg = window.coupleBirthdays || {
      iam: { month: 0, day: 22, name: "Pangeran I'am", emoji: "👑" },
      via: { month: 9, day: 30, name: "Tuan Putri Via", emoji: "🌸" }
    };
    renderPerson("iam", cfg.iam.month, cfg.iam.day, cfg.iam.name, cfg.iam.emoji);
    renderPerson("via", cfg.via.month, cfg.via.day, cfg.via.name, cfg.via.emoji);
  }

  // Run immediately once
  update();

  if (window.birthdayIntervalId) {
    clearInterval(window.birthdayIntervalId);
  }
  window.birthdayIntervalId = setInterval(update, 1000);

  // Interactive buttons
  const btnWishIam = document.getElementById("btn-wish-iam");
  const btnWishVia = document.getElementById("btn-wish-via");

  if (btnWishIam) {
    btnWishIam.addEventListener("click", () => {
      triggerHeartBurst(btnWishIam, ["⭐", "💙", "👑", "✨", "🎂"]);
      showMainToast("Doa tulus untuk I'am (Yas): Semoga sehat selalu, berkah usianya, dan kita bahagia bersama selamanya! 🤲💙✨");
    });
  }

  if (btnWishVia) {
    btnWishVia.addEventListener("click", () => {
      triggerHeartBurst(btnWishVia, ["🌸", "💖", "🌷", "✨", "🥰"]);
      showMainToast("Peluk erat & cium hangat untuk Via: Terima kasih sudah hadir menjadi bidadari tercantik dan teristimewa di hidupku! 🌸💖");
    });
  }

  // Floating burst effect
  function triggerHeartBurst(targetEl, symbols) {
    const rect = targetEl.getBoundingClientRect();
    const burstCount = 18;

    for (let i = 0; i < burstCount; i++) {
      const p = document.createElement("div");
      p.className = "floating-bday-particle";
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      
      const startX = rect.left + rect.width / 2 + (Math.random() - 0.5) * 40;
      const startY = rect.top + window.scrollY;
      
      p.style.left = `${startX}px`;
      p.style.top = `${startY}px`;
      p.style.fontSize = `${16 + Math.random() * 16}px`;

      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.5;
      const velocity = 60 + Math.random() * 80;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity - 70; // bias upward

      document.body.appendChild(p);

      p.animate([
        { transform: "translate(0, 0) scale(0.5) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(1.3) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx * 1.3}px, ${dy + 80}px) scale(0.8) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: 1200 + Math.random() * 600,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)"
      }).onfinish = () => p.remove();
    }
  }
}
window.initBirthdays = initBirthdays;

/**
 * 5. OUR SONGS - CUSTOM VANILLA JS MUSIC PLAYER
 */
function initMusicPlayer() {
  if (typeof songs === "undefined" || songs.length === 0) return;

  const audio = new Audio();
  window.bgAudioPlayer = audio;
  let currentSongIndex = 0;
  let isPlaying = false;

  // DOM Elements
  const playPauseBtn = document.getElementById("player-play-btn");
  const prevBtn = document.getElementById("player-prev-btn");
  const nextBtn = document.getElementById("player-next-btn");
  const progressBar = document.getElementById("player-progress");
  const progressFilled = document.getElementById("player-progress-filled");
  const currentTimeEl = document.getElementById("player-current-time");
  const durationTimeEl = document.getElementById("player-duration");
  const volumeSlider = document.getElementById("player-volume");
  const muteBtn = document.getElementById("player-mute-btn");
  const songTitleEl = document.getElementById("player-song-title");
  const songArtistEl = document.getElementById("player-song-artist");
  const songCoverEl = document.getElementById("player-song-cover");
  const songDescEl = document.getElementById("player-song-desc");
  const visualizerEl = document.getElementById("player-visualizer");
  const playlistContainer = document.getElementById("player-playlist-container");

  // Load Song
  function loadSong(index) {
    currentSongIndex = (index + songs.length) % songs.length;
    const song = songs[currentSongIndex];

    audio.src = song.audio;
    if (songTitleEl) songTitleEl.textContent = song.title;
    if (songArtistEl) songArtistEl.textContent = song.artist;
    if (songDescEl) songDescEl.textContent = song.description;
    if (songCoverEl) {
      songCoverEl.src = song.cover;
      songCoverEl.alt = `${song.title} by ${song.artist}`;
    }

    if (progressBar) progressBar.value = 0;
    if (progressFilled) progressFilled.style.width = "0%";
    if (currentTimeEl) currentTimeEl.textContent = "00:00";
    if (durationTimeEl) durationTimeEl.textContent = "00:00";

    updatePlaylistHighlight();
  }

  // Format Seconds to MM:SS
  function formatTime(sec) {
    if (isNaN(sec) || sec <= 0) return "00:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // Toggle Play / Pause
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().then(() => {
        isPlaying = true;
        updatePlayState();
      }).catch(err => {
        console.log("Audio playback notice:", err);
      });
    }
  }

  function updatePlayState() {
    if (isPlaying) {
      playPauseBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
        </svg>
      `;
      playPauseBtn.setAttribute("aria-label", "Pause");
      if (visualizerEl) visualizerEl.classList.add("is-playing");
      if (songCoverEl) songCoverEl.classList.add("spinning");
    } else {
      playPauseBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M8 5v14l11-7z"></path>
        </svg>
      `;
      playPauseBtn.setAttribute("aria-label", "Play");
      if (visualizerEl) visualizerEl.classList.remove("is-playing");
      if (songCoverEl) songCoverEl.classList.remove("spinning");
    }
  }

  audio.addEventListener("play", () => {
    isPlaying = true;
    updatePlayState();
  });

  audio.addEventListener("pause", () => {
    isPlaying = false;
    updatePlayState();
  });

  // Track Time & Progress
  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      if (progressFilled) progressFilled.style.width = `${progressPercent}%`;
      if (progressBar) progressBar.value = progressPercent;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    if (durationTimeEl && !isNaN(audio.duration)) {
      durationTimeEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("ended", () => {
    loadSong(currentSongIndex + 1);
    audio.play();
  });

  // Scrubbing / Seek
  if (progressBar) {
    progressBar.addEventListener("input", (e) => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        const seekTime = (e.target.value / 100) * audio.duration;
        audio.currentTime = seekTime;
      }
    });
  }

  // Volume
  if (volumeSlider) {
    audio.volume = parseFloat(volumeSlider.value);
    volumeSlider.addEventListener("input", (e) => {
      audio.volume = parseFloat(e.target.value);
      if (audio.volume === 0) {
        muteBtn.setAttribute("data-muted", "true");
      } else {
        muteBtn.setAttribute("data-muted", "false");
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      if (audio.muted) {
        audio.muted = false;
        muteBtn.setAttribute("data-muted", "false");
        volumeSlider.value = audio.volume;
      } else {
        audio.muted = true;
        muteBtn.setAttribute("data-muted", "true");
        volumeSlider.value = 0;
      }
    });
  }

  // Buttons
  if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlay);
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      loadSong(currentSongIndex - 1);
      if (isPlaying) audio.play();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      loadSong(currentSongIndex + 1);
      if (isPlaying) audio.play();
    });
  }

  // Render Playlist
  if (playlistContainer) {
    playlistContainer.innerHTML = "";
    songs.forEach((song, idx) => {
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.setAttribute("data-index", idx);
      item.innerHTML = `
        <div class="playlist-item-left">
          <span class="playlist-number">${String(idx + 1).padStart(2, "0")}</span>
          <img src="${song.cover}" alt="${song.title}" class="playlist-thumb" />
          <div class="playlist-info">
            <h5 class="playlist-song-title">${song.title}</h5>
            <span class="playlist-song-artist">${song.artist}</span>
          </div>
        </div>
        <div class="playlist-item-right">
          <span class="playlist-play-icon">▶</span>
        </div>
      `;

      item.addEventListener("click", () => {
        loadSong(idx);
        audio.play().then(() => {
          isPlaying = true;
          updatePlayState();
        }).catch(() => {});
      });

      playlistContainer.appendChild(item);
    });
  }

  function updatePlaylistHighlight() {
    if (!playlistContainer) return;
    const items = playlistContainer.querySelectorAll(".playlist-item");
    items.forEach((it, idx) => {
      if (idx === currentSongIndex) {
        it.classList.add("active");
      } else {
        it.classList.remove("active");
      }
    });
  }

  // Initialize first song without autoplay
  loadSong(0);
}

/**
 * 6. TIMELINE RENDERING
 */
function initTimeline() {
  const container = document.getElementById("timeline-container");
  if (!container || typeof timeline === "undefined") return;

  container.innerHTML = "";

  timeline.forEach((item, index) => {
    const itemEl = document.createElement("div");
    const isEven = index % 2 === 0;
    itemEl.className = `timeline-node ${isEven ? "node-left" : "node-right"} reveal-on-scroll`;

    const hasImg = item.image && item.image.trim() !== "";
    const hasVideo = item.video && item.video.trim() !== "";

    itemEl.innerHTML = `
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-card">
        <div class="timeline-date-badge">${item.date}</div>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-desc">${item.description}</p>
        
        ${hasImg ? `
          <div class="timeline-media">
            <img src="${item.image}" alt="${item.title}" loading="lazy" class="timeline-img" />
          </div>
        ` : ""}

        ${hasVideo ? `
          <div class="timeline-video-wrap">
            <video src="${encodeURI(item.video)}" controls preload="metadata" class="timeline-video"></video>
          </div>
        ` : ""}
      </div>
    `;

    container.appendChild(itemEl);
  });
}

/**
 * 7. INTERACTIVE LETTER
 * Envelope flap animation and paper reveal.
 */
function initLetter() {
  const envelopeWrap = document.getElementById("letter-envelope-wrap");
  const btnOpen = document.getElementById("btn-open-letter");
  const btnClose = document.getElementById("btn-fold-letter");
  const letterCard = document.getElementById("letter-paper-content");

  if (!envelopeWrap || !btnOpen || !letterCard) return;

  btnOpen.addEventListener("click", () => {
    envelopeWrap.classList.add("envelope-opened");
    btnOpen.style.display = "none";
    if (btnClose) btnClose.style.display = "inline-flex";

    // Smooth scroll into letter reading view on mobile
    setTimeout(() => {
      letterCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
  });

  if (btnClose) {
    btnClose.addEventListener("click", () => {
      envelopeWrap.classList.remove("envelope-opened");
      btnClose.style.display = "none";
      btnOpen.style.display = "inline-flex";
      envelopeWrap.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
}

/**
 * 7B. SAVED LOVE LETTERS & MESSAGES (PERMANENT STORAGE)
 */
function initSavedMessages() {
  const container = document.getElementById("saved-letters-container");
  const countText = document.getElementById("letters-count-text");

  if (!container) return;

  function formatDate(isoString) {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "Waktu Spesial";
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) + " WIB";
    } catch (e) {
      return "Waktu Spesial";
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function deduplicate(items) {
    if (!Array.isArray(items)) return [];
    const seen = new Set();
    const result = [];
    for (const item of items) {
      if (!item) continue;
      const key = (item.content || "").trim();
      const idKey = item.firestoreId || item.id;
      if (key && seen.has(key)) continue;
      if (idKey && seen.has(idKey)) continue;
      if (key) seen.add(key);
      if (idKey) seen.add(idKey);
      result.push(item);
    }
    return result;
  }

  function renderList(rawList) {
    if (!container) return;

    const list = deduplicate(rawList);

    if (!Array.isArray(list) || list.length === 0) {
      if (countText) countText.textContent = "0 Surat Tersimpan";
      container.innerHTML = `
        <div class="saved-letters-empty">
          <span class="saved-letters-empty-icon">📮</span>
          <h4 class="saved-letters-empty-title">Belum Ada Pesan Tersimpan</h4>
          <p class="saved-letters-empty-desc">Saat kamu menulis dan menekan Selesai di halaman surat cinta, pesanmu otomatis tersimpan aman di sini dan tidak akan pernah hilang.</p>
          <a href="pesan.html" class="btn-write-letter">Tulis Pesan Cinta Pertama 💌</a>
        </div>
      `;
      return;
    }

    if (countText) {
      countText.textContent = `${list.length} Surat Tersimpan`;
    }

    container.innerHTML = "";

    list.forEach((msg) => {
      const card = document.createElement("div");
      card.className = "saved-letter-card";

      const senderName = msg.sender || "Via";
      const isIam = senderName.toLowerCase().includes("i'am") || senderName.toLowerCase().includes("yas");
      const avatarEmoji = isIam ? "👑" : "🌸";
      const avatarClass = isIam ? "saved-letter-avatar avatar-iam" : "saved-letter-avatar";

      card.innerHTML = `
        <div class="saved-letter-header">
          <div class="saved-letter-sender-wrap">
            <div class="${avatarClass}">${avatarEmoji}</div>
            <div class="saved-letter-meta">
              <span class="saved-letter-from">Dari: ${escapeHtml(senderName)}</span>
              <span class="saved-letter-date">${formatDate(msg.createdAt)}</span>
            </div>
          </div>
          <span class="saved-letter-cloud-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
            Tersimpan
          </span>
        </div>

        <div class="saved-letter-content">${escapeHtml(msg.content)}</div>

        <div class="saved-letter-footer">
          <button type="button" class="btn-card-copy" data-id="${msg.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Salin Pesan</span>
          </button>
        </div>
      `;

      // Copy action
      const btnCopy = card.querySelector(".btn-card-copy");
      if (btnCopy) {
        btnCopy.addEventListener("click", () => {
          navigator.clipboard.writeText(msg.content).then(() => {
            btnCopy.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span style="color: #10b981;">Tersalin!</span>
            `;
            showMainToast("Pesan cinta berhasil disalin ke clipboard! ✨💖");
            setTimeout(() => {
              btnCopy.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span>Salin Pesan</span>
              `;
            }, 2500);
          }).catch(() => {
            showMainToast("Gagal menyalin pesan.");
          });
        });
      }

      container.appendChild(card);
    });
  }

  // Hook up Manual Refresh / Sync Button
  const btnRefresh = document.getElementById("btn-refresh-letters");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", async () => {
      btnRefresh.disabled = true;
      btnRefresh.classList.add("is-spinning");
      showMainToast("Menyinkronkan dengan database cloud... ⏳");
      if (window.LoveMessagesStore && typeof window.LoveMessagesStore.forceSyncFromCloud === "function") {
        const fresh = await window.LoveMessagesStore.forceSyncFromCloud();
        renderList(fresh);
      }
      setTimeout(() => {
        btnRefresh.disabled = false;
        btnRefresh.classList.remove("is-spinning");
        showMainToast("Sinkronisasi database selesai! ✨");
      }, 600);
    });
  }

  // Initial immediate cleanup of deleted/test messages
  try {
    const rawLocal = localStorage.getItem("our_little_story_saved_letters_v2");
    if (rawLocal) {
      let parsed = JSON.parse(rawLocal);
      if (Array.isArray(parsed)) {
        parsed = parsed.filter(m => {
          if (!m) return false;
          if (m.id === "5pVTjjS5RZ4cNpq5AHmC" || m.firestoreId === "5pVTjjS5RZ4cNpq5AHmC") return false;
          if (typeof m.content === "string") {
            const lower = m.content.toLowerCase();
            if (lower.includes("selamat datang di arsip surat cinta")) return false;
            // Purge deleted test message from screenshot
            if (lower.includes("\ntes\n") || lower.trim() === "tes" || lower.includes("tes\n\ni love you")) return false;
          }
          return true;
        });
        localStorage.setItem("our_little_story_saved_letters_v2", JSON.stringify(parsed));
        renderList(parsed);
      }
    }
  } catch (e) {}

  // Subscribe to real-time store updates and force sync directly from database
  function connectStore() {
    if (window.LoveMessagesStore && typeof window.LoveMessagesStore.subscribe === "function") {
      window.LoveMessagesStore.subscribe(renderList);
      // Immediately pull fresh state from Cloud Firestore
      window.LoveMessagesStore.getAllMessages().then((cloudList) => {
        renderList(cloudList);
      }).catch(() => {});
    } else {
      setTimeout(connectStore, 100);
    }
  }
  connectStore();

  window.addEventListener("love-messages-updated", (e) => {
    if (e.detail) renderList(e.detail);
  });

  // Cross-tab sync when writing from another tab/window
  window.addEventListener("storage", (e) => {
    if (e.key === "our_little_story_saved_letters_v2" && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) renderList(parsed);
      } catch (err) {}
    }
  });
}

/**
 * 8. SCROLL REVEAL ANIMATIONS
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(el => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -40px 0px",
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 9. FOOTER YEAR
 */
function initFooterYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
