$(function () {

    let mode = "login";

    function switchToSignup() {
        mode = "signup";
        $("#authTitle").text("Join TechLink");
        $("#authSubtitle").text("Create an account");
        $("#nameGroup").show();
        $("#mainBtn").text("Sign Up");
        $("#switchText").html(`Already have an account? <a id="switchLink">Login</a>`);
        $("#message").text("");
    }

    function switchToLogin() {
        mode = "login";
        $("#authTitle").text("Welcome Back");
        $("#authSubtitle").text("Log in to continue");
        $("#nameGroup").hide();
        $("#mainBtn").text("Login");
        $("#switchText").html(`Don't have an account? <a id="switchLink">Create Account</a>`);
        $("#message").text("");
    }

    $(document).on("click", "#switchLink", function () {
        if (mode === "login") switchToSignup();
        else switchToLogin();
    });

    function getLocalUsers() {
        return JSON.parse(localStorage.getItem("users")) || [];
    }

    function saveLocalUser(user) {
        let users = getLocalUsers();
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
    }

    function loginSuccess(name) {
        localStorage.setItem("loggedUser", JSON.stringify({ name: name }));
        window.location.href = "../index.html";
    }

    $("#authForm").on("submit", function (e) {
        e.preventDefault();

        let email = $("#emailInput").val().trim().toLowerCase();
        let password = $("#passwordInput").val().trim();
        let fullName = $("#fullName").val().trim();

        $.getJSON("../data/engineers.json", function (data) {

            let engineers = data.engineers || [];
            let engineerFound = engineers.find(e =>
                e.contact.email.toLowerCase() === email
            );

            let localUsers = getLocalUsers();
            let localFound = localUsers.find(u =>
                u.email.toLowerCase() === email
            );

            if (mode === "login") {
                if (engineerFound) {
                    loginSuccess(engineerFound.name);
                } else if (localFound) {
                    loginSuccess(localFound.name);
                } else {
                    $("#message").text("User not found.");
                }
            }

            if (mode === "signup") {
                if (engineerFound || localFound) {
                    $("#message").text("Account already exists.");
                    return;
                }

                saveLocalUser({
                    name: fullName,
                    email: email,
                    password: password
                });

                loginSuccess(fullName);
            }

        });
    });
    

});
