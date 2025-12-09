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

    $.getJSON("data/engineers.json", function (data) {
        let engineers = data.engineers || [];
        let titles = [];
        engineers.forEach(function (eng) {
            if (eng.title && !titles.includes(eng.title)) titles.push(eng.title);
        });

        let grid = $(".category-grid");
        grid.empty();
        titles.forEach(function (title) {
            let item = $("<div>").addClass("cat").text(title);
            grid.append(item);
        });
    });

    $(document).on("click", ".cat", function () {
        let title = $(this).text().trim();
        window.location.href = "html/engineers.html?title=" + encodeURIComponent(title);
    });

    $(window).on("scroll", function () {
        let scrollPos = $(window).scrollTop();
        if (scrollPos > 50) {
            $(".main-header").addClass("scrolled");
        } else {
            $(".main-header").removeClass("scrolled");
        }
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
        if ($(this).scrollTop() > 200) {
            $("#backToTop").fadeIn();
        } else {
            $("#backToTop").fadeOut();
        }
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
