const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute(
    "class",
    isOpen ? "ri-close-line" : "ri-menu-3-line"
  );
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});

// ==========================================
// LOGIN STATUS
// ==========================================

let isAdmin =
    sessionStorage.getItem(
        "hotelAdminLoggedIn"
    ) === "true";


// ==========================================
// ELEMENTEN
// ==========================================

const adminButton = document.getElementById ("adminButton");
const logoutButton = document.getElementById ("logoutButton");
const addRoomButton = document.getElementById ("addRoomButton");
const loginModal = document.getElementById ("loginModal");
const closeLogin = document.getElementById ("closeLogin");
const loginForm = document.getElementById ("loginForm");
const loginError = document.getElementById ("loginError");
const roomEditor = document.getElementById ("roomEditor");
const roomForm = document.getElementById ("roomForm");
const editorTitle = document.getElementById ("editorTitle");
const closeEditor = document.getElementById ("closeEditor");
const cancelButton = document.getElementById ("cancelButton");
const roomId = document.getElementById ("roomId");
const roomName = document.getElementById ("roomName");
const roomPrice = document.getElementById ("roomPrice");
const roomGuests = document.getElementById ("roomGuests");
const roomBeds =  document.getElementById ("roomBeds");
const roomDescription = document.getElementById ("roomDescription");
const roomImage = document.getElementById ("roomImage");
const imagePreview = document.getElementById ("imagePreview");
const imagePreviewContainer = document.getElementById ("imagePreviewContainer");
const roomsGrid = document.getElementById ("roomsGrid");
const emptyState = document.getElementById ("emptyState");
const deleteModal = document.getElementById ("deleteModal");
const cancelDelete = document.getElementById ("cancelDelete");
const confirmDelete = document.getElementById ("confirmDelete");
// ==========================================
// BOOKING ELEMENTEN
// ==========================================
const bookingModal = document.getElementById ("bookingModal");
const closeBooking = document.getElementById ("closeBooking");
const bookingForm = document.getElementById ("bookingForm");
const bookingRoomId = document.getElementById ("bookingRoomId");
const bookingRoomName = document.getElementById ("bookingRoomName");
const bookingName = document.getElementById ("bookingName");
const bookingEmail = document.getElementById ("bookingEmail");
const bookingGuests = document.getElementById ("bookingGuests");
const checkIn = document.getElementById ("checkIn");
const checkOut = document.getElementById ("checkOut");
const bookingMessage = document.getElementById ("bookingMessage");
const bookingNightPrice = document.getElementById ("bookingNightPrice");
const bookingNights = document.getElementById ("bookingNights");
const bookingTotal = document.getElementById ("bookingTotal");
// ==========================================
// DATA
// ==========================================
let rooms = JSON.parse(localStorage.getItem("hotelRooms")) || [];
let currentImage = "";
let roomToDelete = null;
// ==========================================
// START
// ==========================================
updateAdminUI();
renderRooms();
// ==========================================
// ADMIN UI
// ==========================================
function updateAdminUI() {
    if (isAdmin) {
        adminButton.classList.add("hidden");
        logoutButton.classList.remove("hidden");
        addRoomButton.classList.remove("hidden");
    } else {
        adminButton.classList.remove("hidden");
        logoutButton.classList.add("hidden");
        addRoomButton.classList.add("hidden");
    }
    renderRooms();
}

// ==========================================
// LOGIN
// ==========================================

adminButton.addEventListener("click",function() {
        loginModal.classList.remove("hidden");
        loginError.textContent = "";
    }
);

closeLogin.addEventListener("click",function() {
        loginModal.classList.add("hidden");
    }
);


loginModal.addEventListener("click",function(event) {
        if (event.target === loginModal) {
            loginModal.classList.add("hidden");
        }
    }
);

// ==========================================
// INLOGGEN
// ==========================================

loginForm.addEventListener("submit",function(event) {
        event.preventDefault();
        const username = document .getElementById("username").value;
        const password = document .getElementById("password").value;

        /*
            Gebruikersnaam:
            admin
            Wachtwoord:
            hotel123
        */

        if (
            username === "admin" &&
            password === "hotel123"
        ) {
            isAdmin = true;

            sessionStorage.setItem("hotelAdminLoggedIn","true");
            loginModal.classList.add("hidden");
            loginForm.reset();
            updateAdminUI();
        } else {
            loginError.textContent ="Gebruikersnaam of wachtwoord is incorrect.";
        }
    }
);

// ==========================================
// UITLOGGEN
// ==========================================

logoutButton.addEventListener("click",function() { isAdmin = false;
        sessionStorage.removeItem("hotelAdminLoggedIn");
        closeEditorFunction();
        updateAdminUI();
    }
);

// ==========================================
// NIEUWE KAMER
// ==========================================

addRoomButton.addEventListener("click",openNewRoom);
function openNewRoom() {
    if (!isAdmin) {
        return;
    }
    roomForm.reset();
    roomId.value = "";
    currentImage = "";
    imagePreviewContainer .classList .add("hidden");
    editorTitle.textContent ="Nieuwe kamer";
    roomEditor .classList .remove("hidden");
    roomEditor.scrollIntoView({behavior: "smooth"});
}

// ==========================================
// EDITOR SLUITEN
// ==========================================

closeEditor.addEventListener("click",closeEditorFunction);
cancelButton.addEventListener("click",closeEditorFunction);

function closeEditorFunction() {
    roomEditor .classList .add("hidden");
    roomForm.reset();
    roomId.value = "";
    currentImage = "";
    imagePreviewContainer .classList .add("hidden");
}

// ==========================================
// FOTO
// ==========================================

roomImage.addEventListener("change", function() {
        const file = this.files[0];
        if (!file) {
            return;
        }
        if (!file.type.startsWith("image/")) 
            {
            alert("Selecteer een afbeelding.");
            this.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
                currentImage = event.target.result;
                imagePreview.src = currentImage;
                imagePreviewContainer .classList .remove("hidden");
            };
        reader.readAsDataURL(file);
    }
);

// ==========================================
// KAMER OPSLAAN
// ==========================================

roomForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (!isAdmin) {
            return;
        }
        const name = roomName.value.trim();
        const price = parseFloat(roomPrice.value);
        const guests = parseInt(roomGuests.value);
        const beds = roomBeds.value.trim();
        const description = roomDescription.value.trim();
        if (
            !name ||
            isNaN(price) ||
            isNaN(guests) ||
            !beds ||
            !description
        ) {
            alert("Vul alle velden in.");
            return;
        }
        // Kamer bewerken
        if (roomId.value) {
            const index = rooms.findIndex(room => room.id === roomId.value);
            if (index !== -1) {
                rooms[index] = {
                    ...rooms[index],name,price,guests,beds,description,image:currentImage ||rooms[index] .image
                };
            }
        }

        // Nieuwe kamer
        else {
            rooms.push({
                id:Date.now().toString(),name,price,guests,beds,description,image:currentImage
            });
        }
        saveRooms();
        renderRooms();
        closeEditorFunction();
    }
);

// ==========================================
// OPSLAAN
// ==========================================

function saveRooms() {
    localStorage.setItem("hotelRooms",JSON.stringify(rooms)
    );
}
// ==========================================
// KAMERS WEERGEVEN
// ==========================================
function renderRooms() {
    roomsGrid.innerHTML = "";
    if (rooms.length === 0) {
        emptyState
            .classList
            .remove("hidden");
        return;
    }

    emptyState
        .classList
        .add("hidden");

    rooms.forEach(
        function(room) {
            const card = document.createElement("article");
            card.className = "room-card";
            // Foto
            let imageHTML = "";
            if (room.image) {
                imageHTML = `
                    <img
                        class="room-image"
                        src="${room.image}"
                        alt="${escapeHTML(
                            room.name
                        )}"
                    >

                `;

            } else {
                imageHTML = `
                    <div class="room-image-placeholder">🛏️</div>
                `;
            }
            // Admin knoppen
            let adminButtons = "";
            if (isAdmin) {
                adminButtons = `
                    <div class="room-actions">
                        <button class="edit-button" data-id="${room.id}"> Bewerken </button>
                        <button class="card-delete-button"data-id="${room.id}"> Verwijderen </button>
                    </div>
                `;
            }
            // Kamerkaart
            card.innerHTML = `
                ${imageHTML}
                <div class="room-content">
                    <h3> ${escapeHTML(room.name)} </h3>
                    <p class="room-description"> ${escapeHTML(room.description)} </p>
                    <div class="room-info">
                        <span>👤 ${room.guests} ${room.guests === 1 ? "gast" : "gasten"} </span>
                        <span>🛏️ ${escapeHTML(room.beds)} </span>
                    </div>
                    <div class="room-price">
                        €${Number( room.price).toFixed(2)}
                        <span> / nacht </span>
                    </div>
                    <!-- BOEKEN -->
                    <button class="book-button" data-id="${room.id}"> Boeken </button>
                    ${adminButtons}
                </div>
            `;
            roomsGrid.appendChild(card);
        }
    );
    // Edit knoppen
    document .querySelectorAll(".edit-button")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        editRoom(
                            this.dataset.id
                        );

                    }
                );

            }
        );


    // Delete knoppen

    document
        .querySelectorAll(
            ".card-delete-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        openDeleteModal(
                            this.dataset.id
                        );

                    }
                );

            }
        );


    // Boek knoppen

    document
        .querySelectorAll(
            ".book-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        openBooking(
                            this.dataset.id
                        );

                    }
                );

            }
        );

}

// ==========================================
// KAMER BEWERKEN
// ==========================================

function editRoom(id) {

    if (!isAdmin) {
        return;
    }


    const room =
        rooms.find(
            room =>
                room.id === id
        );

    if (!room) {
        return;
    }

    roomId.value = room.id;
    roomName.value = room.name;
    roomPrice.value = room.price;
    roomGuests.value = room.guests;
    roomBeds.value = room.beds;
    roomDescription.value = room.description;
    currentImage = room.image || "";

    if (room.image) {

        imagePreview.src = room.image;
        imagePreviewContainer
            .classList
            .remove("hidden");

    } else {
        imagePreviewContainer
            .classList
            .add("hidden");
    }

    editorTitle.textContent = "Kamer bewerken";
    roomEditor
        .classList
        .remove("hidden");

    roomEditor.scrollIntoView({
        behavior: "smooth"
    });

}

// ==========================================
// BOEKING OPENEN
// ==========================================

function openBooking(id) {

    const room = rooms.find(room => room.id === id);
    if (!room) {
        return;
    }

    bookingRoomId.value = room.id;
    bookingRoomName.textContent = room.name;
    bookingNightPrice.textContent = formatPrice(room.price);
    bookingGuests.value = 1;
    bookingNights.textContent = "0";
    bookingTotal.textContent = formatPrice(0);
    bookingModal
        .classList
        .remove("hidden");
    bookingName.focus();
}

// ==========================================
// BOEKING SLUITEN
// ==========================================

closeBooking.addEventListener(
    "click",
    function() {

        bookingModal
            .classList
            .add("hidden");

    }
);


bookingModal.addEventListener(
    "click",
    function(event) {
        if (
            event.target ===
            bookingModal
        ) {

            bookingModal
                .classList
                .add("hidden");
        }
    }
);

// ==========================================
// DATUMS WIJZIGEN
// ==========================================

checkIn.addEventListener("change", calculateBooking);
checkOut.addEventListener("change", calculateBooking);
bookingGuests.addEventListener("change", calculateBooking);

function calculateBooking() {
    const room = rooms.find(room => room.id === bookingRoomId.value);
    if (!room) {
        return;
    }
    const start = new Date(checkIn.value);
    const end = new Date(checkOut.value);

    if (
        !checkIn.value ||
        !checkOut.value
    ) {
        bookingNights.textContent = "0";
        bookingTotal.textContent = formatPrice(0);
        return;
    }

    const difference = end.getTime() - start.getTime();
    const nights = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
        bookingNights.textContent = "0";
        bookingTotal.textContent = formatPrice(0);
        return;
    }
    const total = nights * Number(room.price);
    bookingNights.textContent = nights;
    bookingTotal.textContent = formatPrice(total);
}

// ==========================================
// BOEKING VERSTUREN
// ==========================================

bookingForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const room =
            rooms.find(
                room =>
                    room.id ===
                    bookingRoomId.value
            );


        if (!room) {
            return;
        }

        const name =
            bookingName.value.trim();

        const email =
            bookingEmail.value.trim();

        const guests =
            bookingGuests.value;

        const start =
            new Date(
                checkIn.value
            );

        const end =
            new Date(
                checkOut.value
            );


        const difference =
            end.getTime() -
            start.getTime();


        const nights =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

        if (
            !name ||
            !email ||
            !checkIn.value ||
            !checkOut.value ||
            nights <= 0
        ) {

            alert(
                "Controleer je gegevens en datums."
            );

            return;
        }

        const total =
            nights *
            Number(room.price);


        const note =
            bookingMessage.value.trim();


        // ==================================
        // EMAIL OPBOUWEN
        // ==================================

        const subject =
            `Boekingsaanvraag - ${room.name}`;


        const body = `

Nieuwe boekingsaanvraag

------------------------------

Kamer:
${room.name}

Prijs per nacht:
${formatPrice(room.price)}

------------------------------

Naam:
${name}

E-mailadres:
${email}

Aantal gasten:
${guests}

Aankomst:
${formatDate(checkIn.value)}

Vertrek:
${formatDate(checkOut.value)}

Aantal nachten:
${nights}

Totaalprijs:
${formatPrice(total)}

------------------------------

Opmerking:
${note || "Geen opmerking"}

        `.trim();

        const hotelEmail =
            "nielsvlap03@gmail.com";

        const mailto =
            `mailto:${hotelEmail}` +
            `?subject=${encodeURIComponent(
                subject
            )}` +
            `&body=${encodeURIComponent(
                body
            )}`;

        // Open e-mailprogramma

        window.location.href =
            mailto;

    }
);

// ==========================================
// PRIJS OPMAAK
// ==========================================
function formatPrice(price) {

    return new Intl.NumberFormat(
        "nl-NL",
        {
            style: "currency",
            currency: "EUR"
        }
    ).format(price);

}
// ==========================================
// DATUM OPMAAK
// ==========================================
function formatDate(date) {
    const parts =
        date.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// ==========================================
// DELETE MODAL
// ==========================================

function openDeleteModal(id) {

    if (!isAdmin) {
        return;
    }

    roomToDelete = id;

    deleteModal.classList.remove("hidden");
}


// Annuleren
cancelDelete.addEventListener("click", function () {

    roomToDelete = null;

    deleteModal.classList.add("hidden");

});


// Verwijderen bevestigen
confirmDelete.addEventListener("click", function () {

    if (!isAdmin || roomToDelete === null) {
        return;
    }

    rooms = rooms.filter(function (room) {
        return room.id !== roomToDelete;
    });

    saveRooms();
    renderRooms();

    roomToDelete = null;

    deleteModal.classList.add("hidden");

});

// ==========================================
// HTML VEILIG MAKEN
// ==========================================

function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
