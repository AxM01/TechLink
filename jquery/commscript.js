$(function () {
    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if (user) {
        $("#authButtons").hide();
        $("#userDisplay").text("Welcome, " + user.name).show();
        $("#ctaSection").hide();
    }

    if (user) {
        $("#authButtons").hide();
        $("#userDisplay").text("Welcome, " + user.name).show();
        $("#ctaSection").hide();
    }

});