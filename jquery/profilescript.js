$(function () {

    let user = JSON.parse(localStorage.getItem("loggedUser"));
    let saved = JSON.parse(localStorage.getItem("loggedUserProfile"));
    let isEditing = false;
    let currentJsonImage = "../img/illustrations/default-user.png";

    if (!user) {
        $(".profile-section").html("<h2>You must be logged in to view your profile.</h2>");
        return;
    }

    $.getJSON("../data/engineers.json", function (data) {

        let list = data.engineers;
        let engineer = null;

        for (let i = 0; i < list.length; i++) {

            let e = list[i];

            let jsonName = (e.name || "").toLowerCase().trim();
            let jsonEmail = (e.contact && e.contact.email)
                ? e.contact.email.toLowerCase().trim()
                : "";

            let userName = (user.name || "").toLowerCase().trim();
            let userEmail = (user.email || "").toLowerCase().trim();

            if (jsonName === userName || jsonEmail === userEmail) {
                engineer = e;
                break;
            }
        }

        if (engineer && engineer.image) {
            currentJsonImage = engineer.image;
        }

        if (saved) {
            loadProfile(convertSaved(saved, currentJsonImage));
        } else if (engineer) {
            loadProfile(engineer);
        } else {
            showEditForm();
        }
    });

    function loadProfile(info) {

        let imgSrc = info.image ? info.image : currentJsonImage;
        $("#profileImg").attr("src", imgSrc);

        $("#profileName").text(info.name || user.name);
        $("#profileTitle").text(info.title || "No Title");
        $("#profileRating").text("⭐ " + (info.rating || "0.0"));
        $("#profileExperience").text(info.experience || "No experience added.");

        if (info.skills && info.skills.join) {
            $("#profileSkills").text(info.skills.join(", "));
        } else {
            $("#profileSkills").text(info.skills || "No skills added.");
        }

        $("#profileBio").text(info.bio || "No biography available.");

        if (info.contact && info.contact.email) {
            $("#profileEmail").text(info.contact.email);
        } else {
            $("#profileEmail").text(user.email || "No email available");
        }

        if (info.portfolio && info.portfolio.length > 0) {
            let html = "";
            for (let i = 0; i < info.portfolio.length; i++) {
                html += `<img class="portfolio-img" src="${info.portfolio[i].image}">`;
            }
            $("#profilePortfolio").html(html);
        } else {
            $("#profilePortfolio").html("<p>No portfolio items yet.</p>");
        }

        $("#editBox").hide();
    }


    function showEditForm() {

        $("#editBox").show();
        $("#profileImg").attr("src", currentJsonImage);

        $("#editTitle").val(saved ? saved.title : "");
        $("#editExperience").val(saved ? saved.experience : "");
        $("#editSkills").val(saved ? saved.skills : "");
        $("#editBio").val(saved ? saved.bio : "");
        $("#editEmail").val(saved ? saved.contactEmail : (user.email || ""));

        $("#profileName").text(user.name);
        $("#profileTitle").text("Editing...");
    }


    $("#editProfileBtn").on("click", function () {

        if (!isEditing) {
            showEditForm();
            $("#editProfileBtn").text("Close Edit");
            isEditing = true;
        } else {
            $("#editBox").hide();
            $("#editProfileBtn").text("Edit Profile");
            isEditing = false;

            if (saved) {
                loadProfile(convertSaved(saved, currentJsonImage));
            }
        }
    });


    $("#saveBtn").on("click", function () {

        let newProfile = {
            name: user.name,
            title: $("#editTitle").val(),
            experience: $("#editExperience").val(),
            skills: $("#editSkills").val(),
            bio: $("#editBio").val(),
            contactEmail: $("#editEmail").val(),
            rating: "0.0",
            portfolio: []
        };

        localStorage.setItem("loggedUserProfile", JSON.stringify(newProfile));
        saved = newProfile;

        loadProfile(convertSaved(newProfile, currentJsonImage));

        $("#editBox").hide();
        $("#editProfileBtn").text("Edit Profile");
        isEditing = false;
    });


    $("#cancelBtn").on("click", function () {
        $("#editBox").hide();
        $("#editProfileBtn").text("Edit Profile");
        isEditing = false;

        if (saved) {
            loadProfile(convertSaved(saved, currentJsonImage));
        }
    });


    function convertSaved(p, img) {
        return {
            name: p.name,
            title: p.title,
            experience: p.experience,
            skills: p.skills ? p.skills.split(",") : [],
            bio: p.bio,
            rating: p.rating,
            image: img,
            contact: { email: p.contactEmail },
            portfolio: []
        };
    }

});
