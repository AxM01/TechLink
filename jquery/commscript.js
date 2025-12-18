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

    if (!document.querySelector(".floating-help-btn")) {

        const helpBtn = document.createElement("button");
        helpBtn.className = "floating-help-btn";
        helpBtn.innerText = "Need Help?";
        document.body.appendChild(helpBtn);

        const modalOverlay = document.createElement("div");
        modalOverlay.className = "support-modal-overlay";

        modalOverlay.innerHTML = `
            <div class="support-modal">
                <span class="support-modal-close">&times;</span>
                <h2>Need Help?</h2>
                <p>If you're facing an issue, message TechLink support below.</p>
                <textarea id="supportMessage" placeholder="Describe your issue..."></textarea>
                <button id="sendSupportMessage">Send to Support</button>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        helpBtn.onclick = () => {
            modalOverlay.classList.add("open");
        };

        modalOverlay.addEventListener("click", (e) => {
            if (
                e.target.classList.contains("support-modal-overlay") ||
                e.target.classList.contains("support-modal-close")
            ) {
                modalOverlay.classList.remove("open");
            }
        });

        document.getElementById("sendSupportMessage").onclick = () => {
            const message = document.getElementById("supportMessage").value.trim();

            if (!message) {
                alert("Please describe your issue before sending.");
                return;
            }

            console.log({
                from: user ? user.name : "Guest",
                message: message,
                date: new Date().toISOString()
            });

            document.getElementById("supportMessage").value = "";
            modalOverlay.classList.remove("open");
            alert("Your message has been sent to TechLink support.");
        };
    }

});
