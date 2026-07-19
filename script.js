// Assuming GSAP and ScrollTrigger are loaded globally, e.g., via CDN
// If using a module bundler (like in Next.js), you would use:
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

/* =================================================================== */
/*  SAFETY HELPERS & UTILITIES                                         */
/* =================================================================== */
function $id(id) {
  return document.getElementById(id);
}

function $(sel, base = document) {
  return base ? base.querySelector(sel) : null;
}

function $all(sel, base = document) {
  return base ? Array.from(base.querySelectorAll(sel)) : [];
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "var(--deep-green, #0f3d2e)"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.4;
    `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

/* =================================================================== */
/*  SEARCH DATA                                                        */
/* =================================================================== */
const searchData = [
  {
    category: "Lectures",
    items: [
      {
        title: "The Beauty of Patience in Islam",
        description: "A comprehensive lecture on the virtue of patience (Sabr) and its importance in a Muslim's life.",
        type: "Video",
      },
      {
        title: "Understanding Tawheed",
        description: "Deep dive into the concept of monotheism and its fundamental role in Islamic belief.",
        type: "Video",
      },
      {
        title: "The Night Prayer (Tahajjud)",
        description: "Learn about the blessed night prayer and its spiritual benefits for the believer.",
        type: "Video",
      },
      {
        title: "Purification of the Soul",
        description: "Guidance on spiritual purification and cleansing the heart from sins.",
        type: "Video",
      },
    ],
  },
  {
    category: "Quotes",
    items: [
      {
        title: "On Gratitude",
        description: '"And whoever is grateful, his gratitude is only for himself." - Quran 31:12',
        type: "Quote",
      },
      {
        title: "On Prayer",
        description: '"Prayer is the key to Paradise" - Prophet Muhammad (PBUH)',
        type: "Quote",
      },
      {
        title: "On Knowledge",
        description: '"Seek knowledge from the cradle to the grave" - Prophet Muhammad (PBUH)',
        type: "Quote",
      },
    ],
  },
  {
    category: "Topics",
    items: [
      {
        title: "Islamic Finance",
        description: "Learn about halal investment and Islamic banking principles.",
        type: "Topic",
      },
      {
        title: "Family in Islam",
        description: "Understanding the importance of family bonds and relationships in Islam.",
        type: "Topic",
      },
      {
        title: "Ramadan Preparation",
        description: "How to prepare spiritually and physically for the holy month of Ramadan.",
        type: "Topic",
      },
    ],
  },
];

/* =================================================================== */
/*  GSAP INITIALIZATION & ANIMATIONS                                   */
/* =================================================================== */
let gsapLoaded = false;

function initializeGSAP() {
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded - animations will be disabled");
    return false;
  }
  try {
    if (ScrollTrigger && !gsap.isTweening(ScrollTrigger)) {
      gsap.registerPlugin(ScrollTrigger);
    }
    gsap.defaults({ duration: 0.8, ease: "power2.out" });
    gsapLoaded = true;
    return true;
  } catch (error) {
    console.error("GSAP initialization failed:", error);
    return false;
  }
}

function safeGsap(callback) {
  if (gsapLoaded && typeof gsap !== "undefined") {
    try {
      callback();
    } catch (error) {
      console.error("GSAP animation error:", error);
    }
  }
}

function initLoadingAnimation() {
  const loadingOverlay = $id("loadingOverlay");
  const loadingText = $id("loadingText");
  if (!loadingOverlay || !loadingText) {
    initMainAnimations();
    return;
  }
  safeGsap(() => {
    const tl = gsap.timeline();
    tl.to(loadingText, { opacity: 1, duration: 1 })
      .to(loadingText, { scale: 1.1, duration: 0.5, yoyo: true, repeat: 1, ease: "power2.inOut" })
      .to(loadingOverlay, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          loadingOverlay.style.display = "none";
          initMainAnimations();
        },
      });
  });
  // Fallback if GSAP fails
  if (!gsapLoaded) {
    setTimeout(() => {
      loadingOverlay.style.display = "none";
      initMainAnimations();
    }, 2000);
  }
}

function initMainAnimations() {
  const heroText = $(".hero-text");
  const heroImage = $(".hero-image");
  const ctaButton = $(".cta-button");
  safeGsap(() => {
    if (heroText) {
      gsap.to(heroText, { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power3.out" });
    }
    if (heroImage) {
      gsap.to(heroImage, { opacity: 1, x: 0, duration: 1.2, delay: 0.6, ease: "power3.out" });
    }
  });
  // CTA Button hover effects
  if (ctaButton) {
    ctaButton.addEventListener("mouseenter", () => {
      safeGsap(() => gsap.to(ctaButton, { scale: 1.05, duration: 0.3 }));
    });
    ctaButton.addEventListener("mouseleave", () => {
      safeGsap(() => gsap.to(ctaButton, { scale: 1, duration: 0.3 }));
    });
  }
  // Parallax effect for hero image
  window.addEventListener(
    "scroll",
    debounce(() => {
      const scrolled = window.pageYOffset;
      if (heroImage) {
        safeGsap(() => {
          gsap.to(heroImage, {
            y: scrolled * 0.1,
            duration: 0.3,
            ease: "none",
          });
        });
      }
    }, 16),
  );
}

/* =================================================================== */
/*  CONTENT OBSERVER & SCROLL ANIMATIONS                               */
/* =================================================================== */
function initContentObserver() {
  const contentSection = $id("content");
  if (!contentSection) return;
  const contentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          safeGsap(() => {
            const statCards = $all(".stat-card");
            const minbarContent = $(".minbar-content");
            const videoContainer = $(".video-container");
            const instagramPosts = $all(".instagram-post");
            const quoteSection = $(".quote-section");
            const blogHighlights = $(".blog-highlights");
            if (statCards.length > 0) {
              gsap.from(statCards, { y: 50, duration: 0.8, stagger: 0.1, ease: "power3.out" });
            }
            if (minbarContent) {
              gsap.from(minbarContent, { opacity: 0, x: -50, duration: 1, delay: 0.3 });
            }
            if (videoContainer) {
              gsap.from(videoContainer, { opacity: 0, x: 50, duration: 1, delay: 0.5 });
            }
            if (instagramPosts.length > 0) {
              gsap.from(instagramPosts, { opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.1, delay: 1 });
            }
            if (quoteSection) {
              gsap.from(quoteSection, { opacity: 0, y: 30, duration: 0.8, delay: 1.2 });
            }
            if (blogHighlights) {
              gsap.from(blogHighlights, { opacity: 0, y: 30, duration: 0.8, delay: 1.4 });
            }
          });
        }
      });
    },
    { threshold: 0.1 },
  );
  contentObserver.observe(contentSection);
}

/* =================================================================== */
/*  VIDEO MODAL (Commented out in original, so keeping it commented)   */
/* =================================================================== */
// function initVideoModal() {
//   const modal = $id("videoModal");
//   if (!modal) {
//     console.warn("[videoModal] not found – skipping");
//     return;
//   }
//   const video = $(".ziyarat-video", modal);
//   modal.addEventListener("click", (e) => {
//     if (e.target === modal) closeVideo();
//   });
//   document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape" && modal.classList.contains("ziyarat-show")) {
//       closeVideo();
//     }
//   });
//   function closeVideo() {
//     modal.classList.remove("ziyarat-show");
//     if (video) {
//       video.pause();
//       video.currentTime = 0;
//       video.src = "";
//     }
//   }
//   // Global functions
//   window.playVideo = (videoId) => {
//     console.log(`Playing video: ${videoId || "default"}`);
//     modal.classList.add("ziyarat-show");
//     if (video) {
//       video.src = "/placeholder-video.mp4";
//       video.play().catch((error) => {
//         console.error("Video play failed:", error);
//         showNotification("Unable to play video", "error");
//       });
//     }
//   };
//   window.closeVideo = closeVideo;
// }

/* =================================================================== */
/*  SEARCH FUNCTIONALITY                                               */
/* =================================================================== */
function initSearchFunctionality() {
  const searchBtn = $id("searchBtn");
  const searchOverlay = $id("searchOverlay");
  const closeSearch = $id("closeSearch");
  const searchInput = $id("searchInput");
  const searchResults = $id("searchResults");
  if (!searchBtn || !searchOverlay || !closeSearch || !searchInput || !searchResults) {
    console.warn("[search] elements not found – skipping");
    return;
  }
  function openSearch() {
    searchOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    safeGsap(() => {
      gsap.fromTo(searchOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        ".search-container",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power3.out" },
      );
    });
    setTimeout(() => searchInput.focus(), 300);
  }
  function closeSearchOverlay() {
    safeGsap(() => {
      gsap.to(searchOverlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: resetSearch,
      });
    });
    if (!gsapLoaded) {
      resetSearch();
    }
  }
  function resetSearch() {
    searchOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchResults.classList.remove("show");
  }
  function performSearch(query) {
    if (!query.trim()) {
      searchResults.innerHTML = "";
      searchResults.classList.remove("show");
      return;
    }
    const filteredResults = searchData
      .map((category) => {
        const filteredItems = category.items.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()),
        );
        return filteredItems.length > 0
          ? {
              ...category,
              items: filteredItems,
            }
          : null;
      })
      .filter(Boolean);
    displaySearchResults(filteredResults, query);
  }
  function displaySearchResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `
                <div class="no-results">
                    <h3>No results found for "${query}"</h3>
                    <p>Try searching with different keywords</p>
                </div>
            `;
    } else {
      let html = "";
      results.forEach((category) => {
        html += `
                    <div class="search-category">
                        <h3 class="category-title">${category.category}</h3>
                        ${category.items
                          .map(
                            (item) => `
                        <div class="search-item" onclick="selectSearchItem('${item.title.replace(/'/g, "\\'")}')">
                            <div class="item-title">${highlightText(item.title, query)}</div>
                            <div class="item-description">${highlightText(item.description, query)}</div>
                            <span class="item-type">${item.type}</span>
                        </div>
                        `,
                          )
                          .join("")}
                    </div>
                `;
      });
      searchResults.innerHTML = html;
    }
    searchResults.classList.add("show");
    safeGsap(() => {
      gsap.from(".search-item", {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out",
      });
    });
  }
  function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      '<mark style="background: var(--gold, #d4af37); color: var(--deep-green, #0f3d2e); padding: 0 2px; border-radius: 2px;">$1</mark>',
    );
  }
  window.selectSearchItem = (title) => {
    console.log(`Selected: ${title}`);
    closeSearchOverlay();
    showNotification(`Selected: ${title}`, "success");
  };
  // Event listeners
  searchBtn.addEventListener("click", openSearch);
  closeSearch.addEventListener("click", closeSearchOverlay);
  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  });
  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      openSearch();
    }
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      closeSearchOverlay();
    }
  });
}

/* =================================================================== */
/*  FILTER FUNCTIONALITY                                               */
/* =================================================================== */
function initFilterFunctionality() {
  // Filter buttons
  $all(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $all(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      safeGsap(() => {
        gsap.to(btn, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        });
      });
    });
  });
  // Filter dropdowns
  const filterDropdowns = $all(".filter-dropdown");
  filterDropdowns.forEach((dropdown) => {
    const button = $(".filter-button", dropdown);
    const options = $all(".filter-option", dropdown);
    if (!button) return;
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close other dropdowns
      filterDropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.classList.remove("active");
        }
      });
      dropdown.classList.toggle("active");
    });
    options.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.value;
        const text = option.textContent;
        const buttonSpan = button.querySelector("span");
        if (buttonSpan) {
          buttonSpan.textContent = text;
        }
        dropdown.classList.remove("active");
        console.log("Selected filter:", value);
        filterLectures(dropdown.id, value);
      });
    });
  });
  // Topic tags
  const topicTags = $all(".topic-tag");
  topicTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      topicTags.forEach((t) => t.classList.remove("active"));
      tag.classList.add("active");
      const topic = tag.dataset.topic;
      console.log("Selected topic:", topic);
      filterByTopic(topic);
    });
  });
  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    filterDropdowns.forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  });
}

function filterLectures(filterType, value) {
  console.log(`Filtering ${filterType} by ${value}`);
  const lectureCards = $all(".lecture-card");
  lectureCards.forEach((card) => {
    const cardValue = card.dataset[filterType.replace("Filter", "")];
    if (value === "" || cardValue === value) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function filterByTopic(topic) {
  console.log(`Filtering by topic: ${topic}`);
  const lectureCards = $all(".lecture-card");
  lectureCards.forEach((card) => {
    const cardTopic = card.dataset.topic;
    if (topic === "all" || cardTopic === topic) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

/* =================================================================== */
/*  QUOTE FUNCTIONALITY                                                */
/* =================================================================== */
function initQuoteFunctionality() {
  // Quote sharing functions
  window.shareQuote = (platform, element) => {
    let quote = "The heart will not find complete happiness, until it is connected with Allah. - Ibn al-Qayyim";
    // If element is provided, get quote from the card
    if (element) {
      const quoteCard = element.closest(".quote-card");
      if (quoteCard) {
        const quoteText = quoteCard.querySelector(".quote-text")?.textContent || "";
        const author = quoteCard.querySelector(".author")?.textContent || "";
        quote = `"${quoteText}" ${author}`;
      }
    }
    switch (platform) {
      case "copy":
        navigator.clipboard
          .writeText(quote)
          .then(() => {
            showNotification("Quote copied to clipboard!", "success");
          })
          .catch(() => {
            showNotification("Failed to copy quote", "error");
          });
        break;
      case "instagram":
        showNotification("Quote copied! You can now paste it on Instagram.", "info");
        navigator.clipboard.writeText(quote).catch(() => {});
        break;
      case "twitter":
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}`;
        window.open(twitterUrl, "_blank", "width=600,height=400");
        break;
      case "facebook":
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href,
        )}&quote=${encodeURIComponent(quote)}`;
        window.open(facebookUrl, "_blank", "width=600,height=400");
        break;
      case "share":
        if (navigator.share) {
          navigator
            .share({
              title: "Quote of the Day",
              text: quote,
              url: window.location.href,
            })
            .catch(() => {
              window.shareQuote("copy");
            });
        } else {
          window.shareQuote("copy");
        }
        break;
    }
  };
  // Convenience functions
  window.copyQuote = () => window.shareQuote("copy");
  window.shareToInstagram = () => window.shareQuote("instagram");
  window.shareGeneral = () => window.shareQuote("share");
  window.mainShare = () => window.shareQuote("share");
  // Quote filtering
  const scholarFilter = $id("scholarFilter");
  const categoryFilter = $id("categoryFilter");
  function applyFilters() {
    const scholarValue = scholarFilter ? scholarFilter.value : "";
    const categoryValue = categoryFilter ? categoryFilter.value : "";
    const quoteCards = $all(".quote-card");
    quoteCards.forEach((card) => {
      const cardScholar = card.getAttribute("data-scholar");
      const cardCategory = card.getAttribute("data-category");
      let showCard = true;
      if (scholarValue && cardScholar !== scholarValue) {
        showCard = false;
      }
      if (categoryValue && cardCategory !== categoryValue) {
        showCard = false;
      }
      if (showCard) {
        card.classList.remove("hidden");
        card.style.display = "block";
      } else {
        card.classList.add("hidden");
        card.style.display = "none";
      }
    });
  }
  window.resetFilters = () => {
    if (scholarFilter) scholarFilter.value = "";
    if (categoryFilter) categoryFilter.value = "";
    applyFilters();
  };
  if (scholarFilter) scholarFilter.addEventListener("change", applyFilters);
  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
  // Quote card animations on scroll
  const quoteCards = $all(".quote-card");
  if (quoteCards.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 },
    );
    quoteCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(card);
    });
  }
}

/* =================================================================== */
/*  DONATION FUNCTIONALITY                                             */
/* =================================================================== */
function initDonationFunctionality() {
  window.handleDonation = () => {
    const donationOptions = `🇵🇸 PALESTINE EMERGENCY AID:
• $25 - Emergency food package
• $50 - Medical supplies for families
• $100 - Shelter materials
• $250 - Monthly family support
🕌 MOSQUE SUPPORT:
• $30 - Daily maintenance
• $75 - Community programs
• $150 - Facility improvements
• $500 - Major renovations
Choose any amount - every donation matters!
        `;
    showNotification(donationOptions, "info");
  };
  window.handleLearnMore = () => {
    const moreInfo = `OUR IMPACT:
🇵🇸 PALESTINE RELIEF:
• Emergency food & water distribution
• Medical aid and supplies
• Temporary shelter assistance
• Educational support for children
🕌 MOSQUE INITIATIVES:
• Building & renovation projects
• Community center development
• Religious education programs
• Youth and family services
100% of donations go directly to those in need.
All projects are Zakat eligible.
        `;
    showNotification(moreInfo, "info");
  };
}

/* =================================================================== */
/*  ZIYARAT PAGE FUNCTIONALITY                                         */
/* =================================================================== */
function initZiyaratFunctionality() {
  // Navigation buttons
  const navButtons = $all(".ziyarat-nav-btn");
  const cards = $all(".ziyarat-card");
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      // Update active button
      navButtons.forEach((btn) => btn.classList.remove("ziyarat-active"));
      button.classList.add("ziyarat-active");
      // Add click animation
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "";
      }, 150);
      // Filter cards
      filterZiyaratCards(category);
      console.log(`Filtered by category: ${category}`);
    });
    // Add keyboard support
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        button.click();
      }
    });
  });
  // Card interactions
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector(".ziyarat-card-title")?.textContent || "Unknown";
      const category = card.dataset.category;
      // Add click animation
      card.style.transform = "scale(0.98)";
      setTimeout(() => {
        card.style.transform = "";
      }, 150);
      console.log(`Clicked card: ${title} (${category})`);
      showCardDetails(card);
    });
    // Hover effects
    card.addEventListener("mouseenter", () => {
      const overlay = card.querySelector(".ziyarat-card-overlay");
      if (overlay) {
        overlay.style.transform = "scale(1.1)";
      }
    });
    card.addEventListener("mouseleave", () => {
      const overlay = card.querySelector(".ziyarat-card-overlay");
      if (overlay) {
        overlay.style.transform = "";
      }
    });
    // Add tabindex for keyboard navigation
    card.setAttribute("tabindex", "0");
    // Keyboard support
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });
  // Map markers
  const markers = $all(".ziyarat-map-marker");
  markers.forEach((marker) => {
    marker.addEventListener("click", () => {
      const location = marker.dataset.location;
      // Add click animation
      marker.style.transform = "scale(1.3)";
      setTimeout(() => {
        marker.style.transform = "";
      }, 300);
      showLocationInfo(location);
      console.log(`Clicked location: ${location}`);
    });
    // Add tabindex for keyboard navigation
    marker.setAttribute("tabindex", "0");
    marker.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        marker.click();
      }
    });
  });
  // Scroll animations for Ziyarat elements
  const ziyaratObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ziyarat-animate-in");
          if (entry.target.classList.contains("ziyarat-card")) {
            entry.target.style.transform = "translateY(0)";
            entry.target.style.opacity = "1";
          }
        }
      });
    },
    { threshold: 0.1 },
  );
  const elementsToObserve = $all(".ziyarat-featured, .ziyarat-card, .ziyarat-map");
  elementsToObserve.forEach((element) => ziyaratObserver.observe(element));
}

function filterZiyaratCards(category) {
  const cards = $all(".ziyarat-card");
  cards.forEach((card, index) => {
    const cardCategory = card.dataset.category;
    if (category === "all" || cardCategory === category) {
      card.classList.remove("ziyarat-hidden", "ziyarat-filtered");
      // Stagger animation for showing cards
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    } else {
      card.classList.add("ziyarat-filtered");
      card.style.opacity = "0.5";
      card.style.transform = "translateY(20px)";
      // Hide after animation
      setTimeout(() => {
        card.classList.add("ziyarat-hidden");
      }, 300);
    }
  });
}

function showCardDetails(card) {
  const title = card.querySelector(".ziyarat-card-title")?.textContent || "Unknown";
  const description = card.querySelector(".ziyarat-card-description")?.textContent || "No description available";
  showNotification(`${title}: ${description}`, "info");
}

function showLocationInfo(location) {
  const locationData = {
    makkah: {
      name: "Makkah",
      description: "The holiest city in Islam, home to the Kaaba and Masjid al-Haram.",
      significance: "Direction of prayer for Muslims worldwide",
    },
    medina: {
      name: "Medina",
      description: "The second holiest city in Islam, home to the Prophet's Mosque.",
      significance: "The city where Prophet Muhammad (pbuh) is buried",
    },
  };
  const info = locationData[location];
  if (info) {
    showNotification(`${info.name}: ${info.description} - ${info.significance}`, "info");
  }
}

/* =================================================================== */
/*  ABOUT PAGE (ZUHD) FUNCTIONALITY                                    */
/* =================================================================== */
function initZuhdAboutFunctionality() {
  safeGsap(() => {
    // Create main timeline
    const zuhdMainTimeline = gsap.timeline();
    // Header Animation
    const headerSection = $(".zuhd-header-section");
    if (headerSection) {
      zuhdMainTimeline.to(headerSection, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });
    }
    // Vision Section Animation
    const visionTitle = $(".zuhd-vision-section .zuhd-section-title");
    const visionText = $(".zuhd-vision-text");
    if (visionTitle) {
      zuhdMainTimeline.to(
        visionTitle,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3",
      );
    }
    if (visionText) {
      zuhdMainTimeline.to(
        visionText,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4",
      );
    }
    // Founders Section Animation
    const foundersTitle = $(".zuhd-founders-section .zuhd-section-title");
    const founderCard = $(".zuhd-founder-card");
    if (foundersTitle) {
      zuhdMainTimeline.to(
        foundersTitle,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.2",
      );
    }
    if (founderCard) {
      zuhdMainTimeline.to(
        founderCard,
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.4",
      );
    }
    // Timeline Section Animation
    const timelineTitle = $(".zuhd-timeline-section .zuhd-section-title");
    const timelineLine = $(".zuhd-timeline-line");
    if (timelineTitle) {
      zuhdMainTimeline.to(
        timelineTitle,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3",
      );
    }
    if (timelineLine) {
      zuhdMainTimeline.to(
        timelineLine,
        {
          opacity: 1,
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "-=0.2",
      );
    }
    // Timeline Items Animation
    const timelineItems = $all(".zuhd-timeline-item");
    timelineItems.forEach((item, index) => {
      const timelineDot = item.querySelector(".zuhd-timeline-dot");
      zuhdMainTimeline
        .to(
          item,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          `-=${1.2 - index * 0.2}`,
        )
        .to(
          timelineDot,
          {
            scale: 1,
            duration: 0.4,
            ease: "back.out(2)",
          },
          "-=0.3",
        );
    });
    // Completion callback
    zuhdMainTimeline.eventCallback("onComplete", () => {
      console.log("Zuhd About Us page animations completed!");
      // Add breathing animation to main title
      const mainTitle = $(".zuhd-main-title");
      if (mainTitle) {
        gsap.to(mainTitle, {
          scale: 1.02,
          duration: 2,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    });
  });
  // Founder image hover animation
  const founderImage = $(".zuhd-founder-image-container");
  if (founderImage) {
    founderImage.addEventListener("mouseenter", () => {
      safeGsap(() => {
        gsap.to(founderImage, {
          scale: 1.05,
          rotation: 2,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
    founderImage.addEventListener("mouseleave", () => {
      safeGsap(() => {
        gsap.to(founderImage, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  }
  // Timeline dots pulse animation
  const timelineDots = $all(".zuhd-timeline-dot");
  timelineDots.forEach((dot, index) => {
    safeGsap(() => {
      gsap.to(dot, {
        scale: 1.2,
        duration: 0.8,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.2,
      });
    });
  });
  // Text reveal animation on scroll
  const textElements = $all(".zuhd-vision-text, .zuhd-founder-description");
  textElements.forEach((text) => {
    const words = text.textContent.split(" ");
    text.innerHTML = words.map((word) => `<span class="zuhd-word">${word}</span>`).join(" ");
    safeGsap(() => {
      gsap.fromTo(
        text.querySelectorAll(".zuhd-word"),
        {
          opacity: 0.3,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          scrollTrigger: {
            trigger: text,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  });
  // Parallax effect for sections
  const sections = $all(".zuhd-vision-section, .zuhd-founders-section, .zuhd-timeline-section");
  sections.forEach((section) => {
    safeGsap(() => {
      gsap.to(section, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  });
}

/* =================================================================== */
/*  GLOBAL FUNCTIONS                                                   */
/* =================================================================== */
// Video functions
window.playVideo =
  window.playVideo ||
  ((videoId) => {
    console.log(`Playing video: ${videoId || "default"}`);
  });
// Social functions
window.openInstagramPost = (postId) => {
  console.log(`Opening Instagram post ${postId}`);
};
window.openYouTube = () => {
  console.log("Opening YouTube channel");
  window.open("https://youtube.com", "_blank");
};
window.openInstagram = () => {
  console.log("Opening Instagram profile");
  window.open("https://instagram.com", "_blank");
};
window.openCommunity = () => {
  console.log("Opening community page");
};
// Blog functions
window.openBlog = (type) => {
  console.log(`Opening ${type || "general"} blog`);
};
window.openMore = () => {
  console.log("More options coming soon...");
  showNotification("More options coming soon!", "info");
};

/* =================================================================== */
/*  ACCESSIBILITY ENHANCEMENTS                                         */
/* =================================================================== */
function initAccessibility() {
  // Add ARIA labels
  const playBtn = $(".ziyarat-play-btn");
  if (playBtn) {
    playBtn.setAttribute("aria-label", "Play Makkah experience video");
  }
  const navButtons = $all(".ziyarat-nav-btn");
  navButtons.forEach((btn) => {
    btn.setAttribute("aria-label", `Filter by ${btn.textContent}`);
  });
  const cards = $all(".ziyarat-card");
  cards.forEach((card) => {
    const title = card.querySelector(".ziyarat-card-title")?.textContent;
    if (title) {
      card.setAttribute("aria-label", `Learn more about ${title}`);
    }
  });
  // Keyboard navigation improvements
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }
  });
  document.addEventListener("mousedown", () => {
    document.body.classList.remove("keyboard-navigation");
  });
  // Skip to main content link
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "skip-link";
  skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--deep-green, #0f3d2e);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10001;
        transition: top 0.3s;
    `;
  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "6px";
  });
  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px";
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/* =================================================================== */
/*  PERFORMANCE MONITORING                                             */
/* =================================================================== */
function initPerformanceMonitoring() {
  if ("PerformanceObserver" in window) {
    const performanceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "measure") {
          console.log(`${entry.name}: ${entry.duration}ms`);
        }
      }
    });
    performanceObserver.observe({ entryTypes: ["measure"] });
  }
  // Monitor long tasks
  //   if ("PerformanceObserver" in window) {
  //     const longTaskObserver = new PerformanceObserver((list) => {
  //       for (const entry of list.getEntries()) {
  //         console.warn(`Long task detected: ${entry.duration}ms`);
  //       }
  //     });
  //     try {
  //       longTaskObserver.observe({ entryTypes: ["longtask"] });
  //     } catch (e) {
  //       // longtask not supported in all browsers
  //     }
  //   }
}

/* =================================================================== */
/*  ERROR HANDLING                                                     */
/* =================================================================== */
function initErrorHandling() {
  window.addEventListener("error", (e) => {
    console.error("JavaScript error:", e.error);
    console.error("Error details:", {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    });
  });
  window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled promise rejection:", e.reason);
  });
}

/* =================================================================== */
/*  MAKTAB FUNCTIONALITY                                               */
/* =================================================================== */
function initMaktabFunctionality() {
  // Add scroll effect to banner
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const banner = document.querySelector(".banner-wrapper");
    const rate = scrolled * -0.3;
    if (banner) {
      banner.style.transform = `translateY(${rate}px)`;
    }
  });
  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe service boxes for animation
  const serviceBoxes = document.querySelectorAll(".service-box");
  serviceBoxes.forEach((box, index) => {
    box.style.opacity = "0";
    box.style.transform = "translateY(30px)";
    box.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    box.style.transitionDelay = `${index * 0.2}s`;
    observer.observe(box);
  });
  // Animate section content
  const contentTitle = document.querySelector(".content-title");
  const contentDescription = document.querySelector(".content-description");
  [contentTitle, contentDescription].forEach((element, index) => {
    if (element) {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      element.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(element);
    }
  });

  // Add loading state
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });
  // Program registration functionality
  window.registerForProgram = (programName) => {
    const message = `Thank you for your interest in "${programName}"!\n\nTo complete your enrollment, please:\n\n1. Call us at (555) 123-4567\n2. Email us at enroll@zuhdmaktab.com\n3. Visit our center at 123 Islamic Center Way\n\nOur admissions team will contact you within 24 hours to discuss:\n• Class schedule and availability\n• Tuition fees and payment plans\n• Required materials and books\n• Assessment (if applicable)\n\nJazakAllahu Khair!`;
    alert(message);
    // Optional: Track enrollment interest
    trackRegistrationInterest(programName);
  };
  // Track which programs are most popular
  function trackRegistrationInterest(programName) {
    console.log(`Registration interest tracked for: ${programName}`);
    const interests = JSON.parse(localStorage.getItem("programInterests") || "{}");
    interests[programName] = (interests[programName] || 0) + 1;
    localStorage.setItem("programInterests", JSON.stringify(interests));
  }
  // Add animation for program cards
  function animateProgramCards() {
    const programItems = document.querySelectorAll(".program-item");
    const extraItems = document.querySelectorAll(".extra-item");
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
        }
      });
    }, observerOptions);
    [...programItems, ...extraItems].forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      cardObserver.observe(card);
    });
  }
  // Initialize program card animations when DOM is loaded
  setTimeout(animateProgramCards, 100);
  // Utility function for smooth animations
  function animateOnScroll() {
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", animateOnScroll);
  // Initialize animations on page load
  animateOnScroll();
}

/* =================================================================== */
/*  MAIN INITIALIZATION                                                */
/* =================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Islamic website script loading...");

  // Initialize error handling first
  initErrorHandling();

  // Initialize GSAP
  initializeGSAP();

  // Initialize all functionality
  try {
    initLoadingAnimation();
    // initVideoModal(); // Commented out as the function definition was commented out
    initSearchFunctionality();
    initFilterFunctionality();
    initQuoteFunctionality();
    initDonationFunctionality();
    initZiyaratFunctionality();
    initZuhdAboutFunctionality();
    initContentObserver();
    initAccessibility();
    initPerformanceMonitoring();
    initMaktabFunctionality();
    console.log("All modules initialized successfully");
  } catch (error) {
    console.error("Initialization error:", error);
  }

  // Add loading completion
  setTimeout(() => {
    document.body.classList.add("loaded");
    console.log("Islamic website fully loaded and ready");
  }, 100);

  // Handle window load
  window.addEventListener("load", () => {
    console.log("Islamic website page fully loaded");
    // Add subtle animations after load
    setTimeout(() => {
      const mapMarkers = $all(".ziyarat-map-marker");
      mapMarkers.forEach((marker, index) => {
        setTimeout(
          () => {
            marker.style.animation = `ziyaratFloat 3s ease-in-out infinite`;
            marker.style.animationDelay = `${index * 0.5}s`;
          },
          2000 + index * 500,
        );
      });
    }, 1000);
  });

  // Handle window resize
  const handleResize = debounce(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const cards = $all(".ziyarat-card");
      cards.forEach((card) => {
        card.style.animationDuration = "0.6s";
      });
    }
  }, 250);
  window.addEventListener("resize", handleResize);
  handleResize(); // Initialize resize check

  console.log("Islamic website main script initialized successfully");
});

// Existing functions (these were already outside DOMContentLoaded and are fine)
function linkClick(item) {
  console.log('Link clicked:', item);
  // Add your analytics or tracking code here
}

function socialClick(platform) {
  console.log('Social link clicked:', platform);
  // Add your analytics or tracking code here
}

function submitNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  console.log('Newsletter submitted with email:', email);

  // Add your newsletter submission logic here
  // Example:
  // fetch('/api/newsletter', {
  //    method: 'POST',
  //    headers: { 'Content-Type': 'application/json' },
  //    body: JSON.stringify({ email: email })
  // });

  // Show success message
  alert('Thank you for subscribing!');
  event.target.reset();
}


// qoute js 
class IslamicQuoteApp {
  constructor() {
    this.quotes = []
    this.currentQuote = null
    this.dailyQuoteInterval = null // To store the interval ID for automatic updates
    this.init()
  }

  async init() {
    await this.loadQuotes()
    this.displayDailyQuote()
    this.setupEventListeners()

    // Set up automatic daily quote change every 24 hours
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000
    this.dailyQuoteInterval = setInterval(() => {
      this.displayDailyQuote()
      this.showToast("Quote refreshed automatically!") // Optional: notify user
    }, ONE_DAY_IN_MS)
  }

  async loadQuotes() {
    try {
      const response = await fetch("quotes.json")
      this.quotes = await response.json()
      console.log("Quotes loaded successfully:", this.quotes.length, "quotes found.")
    } catch (error) {
      console.error("Error loading quotes:", error)
      this.quotes = [
        {
          text: "Indeed, Allah does not burden a soul beyond what it can bear.",
          source: "Qur'an 2:286",
        },
      ]
      console.log("Using fallback quote due to error.")
    }
  }

  getDailyQuoteIndex() {
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    return dayOfYear % this.quotes.length
  }

  displayDailyQuote() {
    if (this.quotes.length === 0) {
      console.warn("No quotes available to display.")
      return
    }
    const quoteIndex = this.getDailyQuoteIndex()
    this.currentQuote = this.quotes[quoteIndex]
    const quoteTextElement = document.getElementById("iq-quote-text")
    const quoteSourceElement = document.getElementById("iq-quote-source")
    const authorElement = document.getElementById("iq-author")

    // Quote widget only exists on some pages
    if (!quoteTextElement && !quoteSourceElement && !authorElement) return

    if (quoteTextElement) quoteTextElement.textContent = this.currentQuote.text
    if (quoteSourceElement) quoteSourceElement.textContent = this.currentQuote.source
    const author = this.extractAuthor(this.currentQuote.source)
    if (authorElement) authorElement.textContent = author
  }

  extractAuthor(source) {
    if (source.includes("Qur'an")) {
      return "Al-Qur'an"
    } else if (source.includes("Hadith")) {
      return "Prophet Muhammad (PBUH)"
    } else {
      return "Islamic Wisdom"
    }
  }

  setupEventListeners() {
    // Share buttons
    document.getElementById("iq-copy-btn")?.addEventListener("click", () => {
      this.copyQuoteToClipboard()
    })
    document.getElementById("iq-link-btn")?.addEventListener("click", () => {
      this.shareMain() // This button also triggers the main share functionality
    })

    // Blog Highlights buttons (currently decorative as per original code, no specific JS functionality)
    document.querySelectorAll(".iq-highlight-btn").forEach((button) => {
      button.addEventListener("click", () => {
        this.showToast("Blog highlight button clicked (decorative)!") // Example feedback
      })
    })

    // Social Share buttons
    document.getElementById("iq-instagram-btn")?.addEventListener("click", () => {
      this.shareToInstagram()
    })
    document.getElementById("iq-share-more-btn")?.addEventListener("click", () => {
      this.shareMain() // This button also triggers the main share functionality
    })
    document.getElementById("iq-share-main-btn")?.addEventListener("click", () => {
      this.shareMain()
    })
  }

  async copyQuoteToClipboard() {
    if (!this.currentQuote) return
    const quoteText = `"${this.currentQuote.text}"\n\n— ${this.currentQuote.source}`
    try {
      await navigator.clipboard.writeText(quoteText)
      this.showToast("Quote copied to clipboard!")
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = quoteText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      this.showToast("Quote copied to clipboard!")
    }
  }

  shareToWhatsApp() {
    if (!this.currentQuote) return
    const quoteText = `"${this.currentQuote.text}"\n— ${this.currentQuote.source}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(quoteText + "\n\nCheck out more Islamic quotes: " + window.location.href)}`
    window.open(whatsappUrl, "_blank")
  }

  shareToTwitter() {
    if (!this.currentQuote) return
    const quoteText = `"${this.currentQuote.text}"`
    const source = this.currentQuote.source
    const hashtags = "IslamicQuotes,Islam,Quran,Hadith,DailyWisdom"
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}&url=${encodeURIComponent(window.location.href)}&hashtags=${hashtags}&via=${encodeURIComponent(source)}`
    window.open(twitterUrl, "_blank")
  }

  shareToInstagram() {
    if (!this.currentQuote) return
    // For Instagram, we'll copy the text and show instructions as direct web sharing is limited.
    this.copyQuoteToClipboard()
    this.showToast("Quote copied! Open Instagram and paste in your story or post.")
  }

  shareMain() {
    if (!this.currentQuote) return
    const quoteText = `"${this.currentQuote.text}"\n\n— ${this.currentQuote.source}`
    const url = window.location.href
    const hashtags = "#IslamicQuotes #Islam #Quran #Hadith #DailyWisdom"
    if (navigator.share) {
      navigator.share({
        title: "Islamic Quote of the Day",
        text: `${quoteText}\n\n${hashtags}`,
        url: url,
      })
    } else {
      // Fallback to Facebook share if Web Share API is not available
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quoteText + "\n\n" + hashtags)}`
      window.open(shareUrl, "_blank", "width=600,height=400")
    }
  }

  showToast(message) {
    const toast = document.getElementById("iq-toast")
    const toastMessage = document.getElementById("iq-toast-message")
    if (toast && toastMessage) {
      toastMessage.textContent = message
      toast.classList.add("iq-show")
      setTimeout(() => {
        toast.classList.remove("iq-show")
      }, 3000)
    } else {
      console.error("Toast elements not found.")
    }
  }

  // Cleanup method if the app instance were ever to be removed
  destroy() {
    if (this.dailyQuoteInterval) {
      clearInterval(this.dailyQuoteInterval)
    }
  }
}

// Global instance to allow refreshQuote to access it
let islamicQuoteAppInstance
document.addEventListener("DOMContentLoaded", () => {
  islamicQuoteAppInstance = new IslamicQuoteApp()
})

// Add some additional utility functions for enhanced functionality
function refreshQuote() {
  if (islamicQuoteAppInstance) {
    islamicQuoteAppInstance.displayDailyQuote()
    islamicQuoteAppInstance.showToast("Quote refreshed!")
  } else {
    console.error("IslamicQuoteApp not initialized.")
  }
}

// Service Worker registration for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}


class ZiayaratVideoSlider {
            constructor() {
                this.currentSlideIndex = 0;
                this.slidesPerView = this.calculateSlidesPerView();
                this.videoTrack = document.getElementById('ziayaratVideoTrack');
                this.slides = document.querySelectorAll('.ziayarat-video-slide');
                this.totalSlides = this.slides.length;
                this.maxSlideIndex = Math.max(0, this.totalSlides - this.slidesPerView);
                if (!this.videoTrack) return;
                
                this.initializeSlider();
                this.setupEventListeners();
                this.createProgressDots();
                this.updateSliderPosition();
            }

            calculateSlidesPerView() {
                const windowWidth = window.innerWidth;
                if (windowWidth <= 768) return 1;
                if (windowWidth <= 1024) return 2;
                return 3;
            }

            initializeSlider() {
                this.prevButton = document.getElementById('ziayaratPrevBtn');
                this.nextButton = document.getElementById('ziayaratNextBtn');
                this.progressContainer = document.getElementById('ziayaratProgressDots');
            }

            setupEventListeners() {
                if (!this.prevButton || !this.nextButton) return;
                this.prevButton.addEventListener('click', () => this.navigateSlide('prev'));
                this.nextButton.addEventListener('click', () => this.navigateSlide('next'));
                
                window.addEventListener('resize', () => {
                    this.slidesPerView = this.calculateSlidesPerView();
                    this.maxSlideIndex = Math.max(0, this.totalSlides - this.slidesPerView);
                    this.currentSlideIndex = Math.min(this.currentSlideIndex, this.maxSlideIndex);
                    this.updateSliderPosition();
                    this.updateProgressDots();
                });
            }

            createProgressDots() {
                this.progressContainer.innerHTML = '';
                const numberOfDots = this.maxSlideIndex + 1;
                
                for (let i = 0; i < numberOfDots; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'ziayarat-progress-dot';
                    if (i === 0) dot.classList.add('zv-active');
                    
                    dot.addEventListener('click', () => {
                        this.currentSlideIndex = i;
                        this.updateSliderPosition();
                        this.updateProgressDots();
                    });
                    
                    this.progressContainer.appendChild(dot);
                }
            }

            navigateSlide(direction) {
                if (direction === 'next' && this.currentSlideIndex < this.maxSlideIndex) {
                    this.currentSlideIndex++;
                } else if (direction === 'prev' && this.currentSlideIndex > 0) {
                    this.currentSlideIndex--;
                }
                
                this.updateSliderPosition();
                this.updateProgressDots();
            }

            updateSliderPosition() {
                const slideWidth = 100 / this.slidesPerView;
                const translateX = -(this.currentSlideIndex * slideWidth);
                this.videoTrack.style.transform = `translateX(${translateX}%)`;
                
                this.updateNavigationButtons();
            }

            updateNavigationButtons() {
                this.prevButton.style.opacity = this.currentSlideIndex === 0 ? '0.5' : '1';
                this.nextButton.style.opacity = this.currentSlideIndex === this.maxSlideIndex ? '0.5' : '1';
            }

            updateProgressDots() {
                const dots = document.querySelectorAll('.ziayarat-progress-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('zv-active', index === this.currentSlideIndex);
                });
            }
        }

        // Initialize the slider when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new ZiayaratVideoSlider();
        });

        // Add smooth scroll behavior for better UX
        document.documentElement.style.scrollBehavior = 'smooth';