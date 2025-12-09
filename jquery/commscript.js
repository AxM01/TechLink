$(function () {

    let user = JSON.parse(localStorage.getItem("loggedUser"));

    function initAuthUI() {

        if (user) {
            $("#authButtons").hide();
            $("#userDisplay")
                .text(user.name)
                .show()
                .css("cursor", "pointer")
                .off("click")
                .on("click", function () {
                    window.location.href = "profile.html";
                });
        } else {
            $("#authButtons").show();
            $("#userDisplay").hide();
        }
    }

    function initBurgerMenu() {
        $("#burger").on("click", function () {
            $("#navLinks").toggleClass("open");
        });
    }

    initAuthUI();
    initBurgerMenu();

    if (user) {
        $("#ctaSection").hide();
    } else {
        $("#ctaSection").show();
    }

});
