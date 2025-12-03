$(function () {

    let chats = [];
    let activeChat = null;

    let savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || {};
    let savedFlags = JSON.parse(localStorage.getItem("chatFlags")) || {};

    $.getJSON("../data/chats.json", function (data) {

        chats = data.chats;

        chats.forEach(chat => {
            chat.flagged = savedFlags[chat.chat_id] || false;

            if (savedMessages[chat.chat_id]) {
                chat.messages = savedMessages[chat.chat_id];
                chat.last_message =
                    savedMessages[chat.chat_id].length > 0
                        ? savedMessages[chat.chat_id][savedMessages[chat.chat_id].length - 1].text
                        : chat.last_message;
            }
        });

        sortChats();
        renderChatList(chats);
    });

    function saveMessages() {
        let out = {};
        chats.forEach(chat => out[chat.chat_id] = chat.messages);
        localStorage.setItem("chatMessages", JSON.stringify(out));
    }

    function saveFlags() {
        let flags = {};
        chats.forEach(chat => flags[chat.chat_id] = chat.flagged);
        localStorage.setItem("chatFlags", JSON.stringify(flags));
    }

    function sortChats() {
        chats.sort((a, b) => {
            if (a.flagged && !b.flagged) return -1;
            if (!a.flagged && b.flagged) return 1;
            return 0;
        });
    }

    function renderChatList(list) {
        $("#chatItems").empty();
        list.forEach(chat => {
            let item = $("#chatItemTemplate").contents().clone();
            item.attr("data-id", chat.chat_id);
            item.find(".chat-name").text(chat.name);
            item.find(".chat-preview").text(chat.last_message);

            let flagBtn = item.find(".flag-btn");
            if (chat.flagged) {
                flagBtn.addClass("flagged");
                flagBtn.text("⭐");
            } else {
                flagBtn.removeClass("flagged");
                flagBtn.text("☆");
            }

            $("#chatItems").append(item);
        });
    }

    $(document).on("click", ".chat-item", function () {
        let id = $(this).data("id");
        activeChat = chats.find(c => c.chat_id === id);
        $(".chat-item").removeClass("active");
        $(this).addClass("active");
        loadChatMessages(activeChat);
    });

    function loadChatMessages(chat) {
        $("#activeChatName").text(chat.name);
        $("#messagesArea").empty();
        chat.messages.forEach(msg => {
            let bubble = $("<div>").addClass("message");
            bubble.addClass(msg.sender === "you" ? "sent" : "received");
            bubble.text(msg.text);
            $("#messagesArea").append(bubble);
        });
        $("#messagesArea").scrollTop($("#messagesArea")[0].scrollHeight);
    }

    function sendMessage() {
        if (!activeChat) return;
        let text = $("#messageText").val().trim();
        if (text === "") return;

        let msg = {
            sender: "you",
            text: text,
            timestamp: new Date().toISOString()
        };

        activeChat.messages.push(msg);
        activeChat.last_message = text;

        saveMessages();

        $("#messageText").val("");

        loadChatMessages(activeChat);
        sortChats();
        renderChatList(chats);
    }

    $("#sendMessageBtn").on("click", function () {
        sendMessage();
    });

    $("#messageText").on("keypress", function (e) {
        if (e.which === 13) {
            e.preventDefault();
            sendMessage();
        }
    });

    $(document).on("click", ".flag-btn", function (e) {
        e.stopPropagation();
        let chatItem = $(this).closest(".chat-item");
        let id = chatItem.data("id");
        let chat = chats.find(c => c.chat_id === id);

        chat.flagged = !chat.flagged;

        saveFlags();
        sortChats();
        renderChatList(chats);
    });

    $("#chatSearchInput").on("keyup", function () {
        let search = $(this).val().toLowerCase();
        let filtered = chats.filter(chat =>
            chat.name.toLowerCase().includes(search) ||
            chat.last_message.toLowerCase().includes(search)
        );
        renderChatList(filtered);
    });

    $("#sendSupportMessage").on("click", function () {
        let text = $("#supportMessage").val().trim();
        if (text === "") return;
        let supportMessages =
            JSON.parse(localStorage.getItem("supportMessages")) || [];
        supportMessages.push({
            text: text,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem("supportMessages", JSON.stringify(supportMessages));
        $("#supportMessage").val("");
        alert("Your message was sent to TechLink Support.");
    });

    let user = JSON.parse(localStorage.getItem("loggedUser"));
    if (user) {
        $("#authButtons").hide();
        $("#userDisplay").text("Welcome, " + user.name).show();
    }

});
