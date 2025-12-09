$(function () {

    let allProjects = [];
    let savedApplications = JSON.parse(localStorage.getItem("projectApplications")) || {};

    $.getJSON("../data/projects.json", function (data) {

        allProjects = data.projects;

        let uniqueFields = new Set();
        allProjects.forEach(p => {
            if (p.category) uniqueFields.add(p.category.trim());
        });

        uniqueFields.forEach(field => {
            $("#filterField").append(`<option value="${field.toLowerCase()}">${field}</option>`);
        });

        allProjects.forEach(p => {
            if (!p.applications) p.applications = [];
            if (savedApplications[p.id]) {
                p.applications = savedApplications[p.id];
            }
        });

        renderProjects(allProjects);
    });

    function saveApplications() {
        let appData = {};
        allProjects.forEach(p => {
            appData[p.id] = p.applications;
        });
        localStorage.setItem("projectApplications", JSON.stringify(appData));
    }

    function renderProjects(list) {
        $("#projectCards").empty();
        list.forEach(project => {
            let card = $("#projectCardTemplate").contents().clone();
            card.find(".project-title").text(project.title);
            card.find(".project-company").text(project.posted_by.company);
            card.find(".view-project-btn").attr("data-id", project.id);
            $("#projectCards").append(card);
        });
    }

    function updateProjectUI(projectID) {
        let project = allProjects.find(p => p.id === projectID);
        if (!project) return;
        let card = $(".view-project-btn[data-id='" + projectID + "']").closest(".project-card");
        card.find(".project-title").text(project.title);
        card.find(".project-company").text(project.posted_by.company);
    }

    $("#searchInput, #filterField").on("input", function () {

        let search = $("#searchInput").val().toLowerCase();
        let field = $("#filterField").val().toLowerCase();

        let filtered = allProjects.filter(p => {

            let matchesSearch =
                p.title.toLowerCase().includes(search) ||
                p.posted_by.company.toLowerCase().includes(search);

            let matchesField =
                field === "all" ||
                p.category.toLowerCase().includes(field);

            return matchesSearch && matchesField;
        });

        renderProjects(filtered);
    });

    $(document).on("click", ".view-project-btn", function () {

        let id = $(this).data("id");
        let project = allProjects.find(p => p.id === id);

        if (project) {

            $("#modalProjectTitle").text(project.title);
            $("#modalProjectCompany").text("Company: " + project.posted_by.company);
            $("#modalProjectField").text("Category: " + project.category);
            $("#modalProjectDescription").text(project.description);

            let bidsHTML = "";

            if (!project.applications || project.applications.length === 0) {
                bidsHTML = "<p>No bids yet. Be the first to apply!</p>";
            } else {
                project.applications.forEach(app => {
                    bidsHTML += `
                        <div class="bid-item">
                            <p><strong>${app.name}</strong></p>
                            <p>Bid: $${app.bid}</p>
                            <p>Message: ${app.message}</p>
                        </div>
                    `;
                });
            }

            $("#modalBids").html(bidsHTML);
            $("#applyBtn").attr("data-id", project.id);
            $("#projectModal").fadeIn(200);
        }
    });

    $("#applyBtn").on("click", function () {

        let projectID = $(this).data("id");
        let project = allProjects.find(p => p.id === projectID);
        if (!project) return;

        let name = prompt("Enter your full name:");
        if (!name) return;

        let bid = prompt("Enter your bid amount (USD):");
        if (!bid) return;

        let message = prompt("Add a short message:");
        if (!message) message = "No message provided.";

        project.applications.push({
            name: name,
            bid: bid,
            message: message
        });

        saveApplications();
        updateProjectUI(projectID);
        alert("Your application was submitted!");

        $(".view-project-btn[data-id='" + projectID + "']").click();
    });

    $(".close-modal").on("click", function () {
        $("#projectModal").fadeOut(200);
    });

    $(window).on("click", function (e) {
        if ($(e.target).is("#projectModal")) {
            $("#projectModal").fadeOut(200);
        }
    });

    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if (user) {
        $("#authButtons").hide();
        $("#userDisplay").text("Welcome, " + user.name).show();
    }

});
