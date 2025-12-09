$(function () {

    $(".btn-primary.hero-btn").on("click", function () {
        window.location.href = "html/engineers.html";
    });

    $(".cta-create-account").on("click", function () {
        window.location.href = "html/login-signup.html";
    });

    $(".btn-secondary").on("click", function () {
        window.location.href = "html/projects.html";
    });

    let categoryContainer = $(".category-grid");

    $.getJSON("data/engineers.json", function (data) {
        let engineers = data.engineers || [];
        let titles = new Set();

        engineers.forEach(e => {
            if (e.title) titles.add(e.title.trim());
        });

        categoryContainer.empty();

        titles.forEach(title => {
            categoryContainer.append(`
                <div class="cat" data-title="${title}">
                    ${title}
                </div>
            `);
        });
    });

    $(document).on("click", ".cat", function () {
        let title = $(this).data("title");
        let encoded = encodeURIComponent(title);
        window.location.href = `html/engineers.html?title=${encoded}`;
    });

    $(window).on("scroll", function () {
        let scrollPos = $(window).scrollTop();
        if (scrollPos > 50) $(".main-header").addClass("scrolled");
        else $(".main-header").removeClass("scrolled");
    });

    function fadeInOnScroll() {
        $(".fade-section").each(function () {
            let elementTop = $(this).offset().top;
            let windowBottom = $(window).scrollTop() + $(window).height();
            if (windowBottom > elementTop + 50) $(this).addClass("visible");
        });
    }

    $(window).on("scroll", fadeInOnScroll);
    fadeInOnScroll();

    $("body").append(`<div id="backToTop">↑</div>`);

    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 200) $("#backToTop").fadeIn();
        else $("#backToTop").fadeOut();
    });

    $("#backToTop").on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });

    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if (user) {
        $("#authButtons").hide();
        $("#userDisplay").text(user.name).show();
        $("#ctaSection").hide();
    }

    function initAuthUI() {
        let user = JSON.parse(localStorage.getItem("loggedUser"));
        if (user) {
            $("#authButtons").hide();
            $("#userDisplay")
                .text(user.name)
                .show()
                .css("cursor", "pointer")
                .off("click")
                .on("click", function () {
                    window.location.href = "html/profile.html";
                });
        } else {
            $("#authButtons").show();
            $("#userDisplay").hide();
        }
    }

    initAuthUI();
});
