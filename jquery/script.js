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



    const categoryMap = {
        "Electrical Engineering": "electrical",
        "Mechanical Engineering": "mechanical",
        "Civil & Architecture": "civil",
        "Software & Web": "software",
        "Robotics": "robotics",
        "AI & Machine Learning": "ai"
    };

    $(".cat").on("click", function () {

        let label = $(this).text().trim();
        let code = categoryMap[label];

        if (code) {
            window.location.href = `html/engineers.html?category=${code}`;
        }
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

            if (windowBottom > elementTop + 50) {
                $(this).addClass("visible");
            }
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
        $("#userDisplay").text("Welcome, " + user.name).show();

        $("#ctaSection").hide();
    }

});
