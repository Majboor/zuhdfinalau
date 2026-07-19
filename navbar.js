// navbar.js
document.addEventListener("DOMContentLoaded", function () {
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;

            // Initialize interactive logic after navbar is loaded
            initNavbarInteractions();
        })
        .catch(error => console.error("Error loading navbar:", error));
});

function initNavbarInteractions() {
    /* --------------------------
       ELEMENT REFERENCES
    ---------------------------*/
    const navbar          = document.getElementById("navbar");
    const navMenu         = document.getElementById("navMenu");
    const overlay         = document.getElementById("overlay");
    const mobileMenuBtn   = document.getElementById("mobileMenuBtn");
    const closeSidebar    = document.getElementById("closeSidebar");
    const aboutDropdown   = document.getElementById("aboutDropdown");
    const supportDropdown = document.getElementById("supportDropdown");
    const aboutToggle     = aboutDropdown ? aboutDropdown.querySelector(".dropdown-toggle") : null;
    const supportToggle   = supportDropdown ? supportDropdown.querySelector(".dropdown-toggle") : null;
    const searchBtns      = document.querySelectorAll(".search-btn");
    const searchOverlay   = document.getElementById("searchOverlay");
    const closeSearch     = document.getElementById("closeSearch");
    const searchInput     = document.getElementById("searchInput");
    const searchResults   = document.getElementById("searchResults");

    /* --------------------------
       SAMPLE SEARCH DATA
    ---------------------------*/
    const searchData = [
        { title: "Introduction to Islamic Philosophy", description: "Basic concepts and principles of Islamic philosophical thought", type: "Lecture", category: "Lectures" },
        { title: "The importance of prayer in daily life", description: "Understanding the spiritual significance of Salah", type: "Lecture", category: "Lectures" },
        { title: "Patience in trials", description: "Be patient, for your patience is with the help of Allah", type: "Quote", category: "Quotes" },
        { title: "Knowledge and wisdom", description: "Seek knowledge from the cradle to the grave", type: "Quote", category: "Quotes" },
        { title: "About ZUHD Academy", description: "Learn about our mission and educational approach", type: "Page", category: "About" },
        { title: "Kaaba in Mecca", description: "Sacred site and center of Islamic pilgrimage", type: "Location", category: "Ziyarat" }
    ];

    /* --------------------------
       MENU HELPERS
    ---------------------------*/
    function openMobileMenu() {
        navMenu.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }
    function closeMobileMenu() {
        navMenu.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    /* --------------------------
       SEARCH HELPERS
    ---------------------------*/
    function openSearch() {
        searchOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        setTimeout(() => searchInput.focus(), 300);
    }
    function closeSearchOverlay() {
        searchOverlay.classList.remove("active");
        document.body.style.overflow = "";
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
        const filtered = searchData.filter(item =>
            [item.title, item.description, item.type].some(text =>
                text.toLowerCase().includes(query.toLowerCase())
            )
        );
        renderSearchResults(filtered);
    }
    function renderSearchResults(results) {
        if (!results.length) {
            searchResults.innerHTML = '<div class="no-results">No results found. Try different keywords.</div>';
            searchResults.classList.add("show");
            return;
        }
        const grouped = results.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {});
        searchResults.innerHTML = Object.entries(grouped).map(([category, items]) => `
            <div class="search-category">
                <h3 class="category-title">${category}</h3>
                ${items.map(item => `
                    <div class="search-item" data-title="${item.title.replace(/"/g, '&quot;')}">
                        <div class="item-title">${item.title}</div>
                        <div class="item-description">${item.description}</div>
                        <span class="item-type">${item.type}</span>
                    </div>
                `).join("")}
            </div>
        `).join("");
        searchResults.classList.add("show");

        // attach click handler to items
        searchResults.querySelectorAll(".search-item").forEach(el => {
            el.addEventListener("click", () => {
                const title = el.dataset.title;
                alert(`You selected: ${title}`);
                closeSearchOverlay();
            });
        });
    }

    /* --------------------------
       EVENT BINDINGS
    ---------------------------*/
    if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileMenu);
    if (closeSidebar) closeSidebar.addEventListener("click", closeMobileMenu);
    if (overlay) overlay.addEventListener("click", closeMobileMenu);

    // Support Dropdown Logic
    if (supportToggle && supportDropdown) {
        supportToggle.addEventListener("click", e => {
            e.preventDefault();
            supportDropdown.classList.toggle("active");
            if (aboutDropdown) aboutDropdown.classList.remove("active");
        });
        document.addEventListener("click", e => {
            if (!supportDropdown.contains(e.target)) {
                supportDropdown.classList.remove("active");
            }
        });
    }

    // About Dropdown Logic (NEW)
    if (aboutToggle && aboutDropdown) {
        aboutToggle.addEventListener("click", e => {
            e.preventDefault();
            aboutDropdown.classList.toggle("active");
            if (supportDropdown) supportDropdown.classList.remove("active");
        });
        document.addEventListener("click", e => {
            if (!aboutDropdown.contains(e.target)) {
                aboutDropdown.classList.remove("active");
            }
        });
    }

    searchBtns.forEach(btn => btn.addEventListener("click", openSearch));
    if (closeSearch) closeSearch.addEventListener("click", closeSearchOverlay);
    if (searchInput) {
        searchInput.addEventListener("input", e => performSearch(e.target.value));
    }

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            if (searchOverlay && searchOverlay.classList.contains("active")) {
                closeSearchOverlay();
            }
            closeMobileMenu();
            if (supportDropdown) supportDropdown.classList.remove("active");
        }
    });

    /* --------------------------
       SCROLL EFFECT (NAVBAR SHADOW)
    ---------------------------*/
    window.addEventListener("scroll", () => {
        if (window.scrollY > 60) navbar.classList.add("scrolled");
        else navbar.classList.remove("scrolled");
    });
}
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});



document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('dropdownAboutZuhd');
    if (!dropdown) return;
    const button = dropdown.querySelector('.dropdown-toggle');

    button.addEventListener('click', function () {
        dropdown.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
});




