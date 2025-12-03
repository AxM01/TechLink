$(function () {

    const categoryToTitle = {
        "electrical": "Electrical Engineer",
        "mechanical": "Mechanical Engineer",
        "civil": "Civil & Architecture Engineer",
        "software": "Software & Web Developer",
        "robotics": "Robotics Engineer",
        "ai": "AI & Machine Learning Engineer"
    };

    let allEngineers = [];
    let favouriteList = JSON.parse(localStorage.getItem("favourites")) || [];
    let initiallyFiltered = false;

    $.getJSON("../data/engineers.json", function (data) {

        allEngineers = data.engineers || [];

        const params = new URLSearchParams(window.location.search);
        const selectedCategory = params.get("category");

        if (selectedCategory && categoryToTitle[selectedCategory]) {
            let title = categoryToTitle[selectedCategory];
            let filtered = allEngineers.filter(e =>
                e.title.toLowerCase().includes(title.toLowerCase())
            );
            initiallyFiltered = true;
            renderEngineers(filtered);
            history.replaceState({}, "", "./engineers.html");
        } else {
            renderEngineers(allEngineers);
        }
    });

    function renderEngineers(list) {
        let container = $("#engineerCards");
        container.empty();
        list.forEach(function (eng) {
            let card = $("#engineerCardTemplate").contents().clone();
            card.find(".engineer-img").attr("src", eng.image);
            card.find(".eng-name").text(eng.name);
            card.find(".eng-title").text(eng.title);
            card.find(".eng-exp").text("Experience: " + eng.experience);
            card.find(".eng-skills").text("Skills: " + eng.skills.join(", "));
            card.find(".rating-value").text(eng.rating);
            card.find(".view-btn").attr("data-id", eng.id);

            let favBtn = card.find(".fav-btn");
            favBtn.attr("data-id", eng.id);

            if (favouriteList.includes(eng.id)) {
                favBtn.addClass("active").text("★");
            } else {
                favBtn.text("☆");
            }

            container.append(card);
        });
    }

    $(document).on("click", ".fav-btn", function () {
        let engId = $(this).data("id");
        let btn = $(this);
        if (favouriteList.includes(engId)) {
            favouriteList = favouriteList.filter(id => id !== engId);
            btn.removeClass("active").text("☆");
        } else {
            favouriteList.push(engId);
            btn.addClass("active").text("★");
        }
        localStorage.setItem("favourites", JSON.stringify(favouriteList));
    });

    function applySearch() {

        let keyword = ($("#searchText").val() || $("#engineerSearchInput").val() || "")
            .toLowerCase()
            .trim();

        let selectedTitle = $("#searchField").val();

        if (selectedTitle === "all" && keyword === "") {
            initiallyFiltered = false;
            renderEngineers(allEngineers);
            return;
        }

        let filtered = allEngineers.filter(eng => {
            let skillsText = eng.skills.join(" ").toLowerCase();
            let expText = String(eng.experience).toLowerCase();

            let matchKeyword =
                keyword === "" ||
                eng.name.toLowerCase().includes(keyword) ||
                eng.title.toLowerCase().includes(keyword) ||
                skillsText.includes(keyword) ||
                expText.includes(keyword);

            let matchField =
                selectedTitle === "all" ||
                eng.title === selectedTitle;

            return matchKeyword && matchField;
        });

        renderEngineers(filtered);
    }

    $(document).on("input", "#searchText, #engineerSearchInput", function () {
        applySearch();
    });

    $(document).on("change", "#searchField", function () {
        applySearch();
    });

    $(document).on("click", ".view-btn", function () {
        let engineerId = $(this).data("id");
        let eng = allEngineers.find(e => e.id === engineerId);
        if (eng) {
            $("#modalImg").attr("src", eng.image);
            $("#modalName").text(eng.name);
            $("#modalTitle").text(eng.title);
            $("#modalRating").text("⭐ " + eng.rating);
            $("#modalExperience").text("Experience: " + eng.experience);
            $("#modalSkills").text("Skills: " + eng.skills.join(", "));
            $("#modalBio").text(eng.bio);
            $("#modalEmail").text("Email: " + eng.contact.email);

            let portfolioHTML = "";
            eng.portfolio.forEach(item => {
                portfolioHTML += `
        <div class="portfolio-item">
            <img src="${item.image}" class="portfolio-img" alt="${item.title}">
            <p class="portfolio-title">${item.title}</p>
        </div>`;
            });


            $("#modalPortfolio").html(portfolioHTML);
            $("#profileModal").fadeIn(200);
        }
    });

    $(".close-modal").on("click", function () {
        $("#profileModal").fadeOut(200);
    });

    $(window).on("click", function (e) {
        if ($(e.target).is("#profileModal")) $("#profileModal").fadeOut(200);
    });

    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if (user) {
        $("#authButtons").hide();
        $("#userDisplay").text("Welcome, " + user.name).show();
    }


$(document).on("click", "#contactBtn", function () {
    window.location.href = "contact.html";
});

$(document).on("click", "#hireBtn", function () {
    alert("Your hire request has been sent! The engineer will contact you soon.");
});


});
