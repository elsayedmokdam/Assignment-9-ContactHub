var rowData = document.getElementById("rowData");
var contactName = document.getElementById("contactName");
var contactEmail = document.getElementById("contactEmail");
var contactPhone = document.getElementById("contactPhone");
var contactAddress = document.getElementById("adress");
var contactGroup = document.getElementById("group");
var contactDescription = document.getElementById("description");
var contactFavourateCheck = document.getElementById("favourateCheck");
var contactEmergencyCheck = document.getElementById("emergencyCheck");
var close = document.getElementById("close");
var totalContacts = document.getElementById("totalContacts");
var totalFavourates = document.getElementById("favouriteContacts");
var totalEmergencies = document.getElementById("emergencyContacts");
var favourateContactCards = document.getElementById("favourate-contact-cards");
var emergencyContactCards = document.getElementById("emergency-contact-cards");
var numberOfContactsSearch = document.getElementById("NCS");
var saveContact = document.getElementById("saveContact");
var updateContact = document.getElementById("updateContact");

// Get the contacts array from local storage with check if it's empty or not to avoid undefined error:
var allContacts = JSON.parse(localStorage.getItem("contacts")) || [];
function updateUI() {
    displayContacts(); // Display Contacts: When the page is loaded:
    displayTotalContacts(); // Display Total Contacts, Favourates, Emergencies Numbers:
    displayFavorates(); // Display Favourates Contacts:
    displayEmergencies(); // Display Emergencies Contacts:
}
updateUI();

// Display Total Contacts, Favourates, Emergencies:
function displayTotalContacts() {
    totalContacts.innerHTML = allContacts.length;
    totalFavourates.innerHTML = countFavourates();
    totalEmergencies.innerHTML = countEmergencies();
    numberOfContactsSearch.innerHTML = allContacts.length;
};

// Count Favourates :
function countFavourates() {
    var favourates = 0;
    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].favourate) {
            favourates++;
        }
    }
    return favourates;
}

// Count Emergencies :
function countEmergencies() {
    var emergencies = 0;
    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].emergency) {
            emergencies++;
        }
    }
    return emergencies;
}

function generatePhoneNumberQR() {
    const phoneNumberInput = document.getElementById("phoneNumber"); // Get the phone number from the input field
    const phoneNumber = phoneNumberInput.value.trim(); // Remove leading/trailing spaces

    if (validateAllInputs(phoneNumberInput)) {
        const qrcodeContainer = document.getElementById("qrcode-container");
        qrcodeContainer.innerHTML = "";

        const qrCodeData = `tel:${phoneNumber}`;

        new QRCode(qrcodeContainer, {
            text: qrCodeData,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } else {
        const qrcodeContainer = document.getElementById("qrcode-container");
        qrcodeContainer.innerHTML = "";
        Swal.fire({
            title: "Please enter a valid phone number",
            icon: "warning",
            draggable: true,
        });
    }
}

// Call Phone Number:
function callPhoneNumber() {
    const phoneNumberInput = document.getElementById("phoneNumber");
    const phoneNumber = phoneNumberInput.value.trim(); // Remove leading/trailing spaces
    if (validateAllInputs(phoneNumberInput)) {
        window.location.href = `tel:${phoneNumber}`; // Redirect to the phone number
    } else {
        Swal.fire({
            title: "Please enter a valid phone number",
            icon: "warning",
            draggable: true,
        });
    }
}

// Add New Contact:
function addNewContact() {
    var newContact = {
        name: contactName.value, // Required
        phone: contactPhone.value, // Required
        email: contactEmail.value, // Not Required
        address: contactAddress.value, // Not Required
        group: contactGroup.value, // Not Required
        description: contactDescription.value, // Not Required
        favourate: contactFavourateCheck.checked, // Not Required
        emergency: contactEmergencyCheck.checked, // Not Required
    };
    var validName = validateAllInputs(contactName);
    var validPhone = validateAllInputs(contactPhone);
    var validEmail = validateAllInputs(contactEmail);

    if ( // Check if all inputs are valid:
        validName &&
        validPhone &&
        (contactEmail.value == "" || validEmail)
    ) {
        // Check if the contact already exists:
        if (checkRepeatedContact(newContact.phone)) {
            Swal.fire({
                title: "Contact already exists",
                icon: "warning",
                draggable: true,
            });
        } else {
            // Add the new contact to the contacts array:
            allContacts.push(newContact);
            // Save the contacts array to local storage:
            localStorage.setItem("contacts", JSON.stringify(allContacts));
            clearAllInputFields();
            Swal.fire({
                title: "Saved Successfully",
                icon: "success",
                draggable: true,
            });
            var exampleModalScrollable = document.getElementById("exampleModalScrollable");
            var modal = bootstrap.Modal.getInstance(exampleModalScrollable);
            modal.hide();
            updateUI();
        }
        // Check required fields:
    } else if (contactName.value == "" || contactPhone.value == "") {
        Swal.fire({
            title: "Please Fill All Required Fields",
            icon: "warning",
            draggable: true,
        });
        // Check if all inputs are valid:
    } else if (
        !validName ||
        !validPhone ||
        !validEmail
    ) {
        Swal.fire({
            title:
                "Please enter a valid data in all required fields",
            icon: "warning",
            draggable: true,
        });
    }
}

// Check Repeated Contact:
function checkRepeatedContact(phone) {
    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].phone == phone) {
            return true;
        }
    }
    return false;
}

// Clear All Input Fields:
function clearAllInputFields() {
    contactName.value = "";
    contactPhone.value = "";
    contactEmail.value = "";
    contactAddress.value = "";
    contactGroup.value = "";
    contactDescription.value = "";
    contactFavourateCheck.checked = false;
    contactEmergencyCheck.checked = false;
    contactName.classList.remove("is-invalid");
    contactPhone.classList.remove("is-invalid");
    contactEmail.classList.remove("is-invalid");
    contactName.classList.remove("is-valid");
    contactPhone.classList.remove("is-valid");
    contactEmail.classList.remove("is-valid");
}

// Check Email:
function checkEmail(email) {
    if (email) {
        return `<div class="icon-email">
                    <p class="mb-0 fs-7 my-text-gray-500 d-flex gap-2 align-items-center">
                        <span class="my-text-indigo-600 my-bg-indigo-200 icon-size d-flex align-items-center justify-content-center p-1 rounded">
                            <i class="fa-solid fa-envelope fa-sm"></i>
                        </span>
                        <span>${email}</span>
                    </p>
                </div>`;
    } else {
        return "";
    }
}

// Check Address:
function checkAddress(address) {
    if (address) {
        return `<div class="icon-address">
                    <p class="mb-0 fs-7 my-text-gray-500 d-flex gap-2 align-items-center">
                        <span class="my-text-green-700 my-bg-green-200 icon-size d-flex align-items-center justify-content-center p-1 rounded">
                            <i class="fa-solid fa-location-dot fa-sm"></i>
                        </span>
                        <span>${address}</span>
                    </p>
                </div>`;
    } else {
        return "";
    }
}

function checkStar(star) {
    if (star) {
        return `<span id="star" class="my-text-white my-bg-amber-400 rounded-circle icon-size-2 position-absolute top-right d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-star fa-2xs"></i>
                </span>`;
    } else {
        return "";
    }
}

function checkHeart(emergency) {
    if (emergency) {
        return `<span id="heart" class="my-text-white my-bg-red-500 rounded-circle icon-size-2 position-absolute bottom-right d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-heart-pulse fa-2xs"></i>
                </span>`;
    } else {
        return "";
    }
}

// Check Group:
function checkGroup(group) {
    if (group && group != "Select Group") {
        return `
        <span class="my-text-indigo-600 my-bg-indigo-200 d-flex align-items-center justify-content-center p-1 rounded fs-7">${group}</span>
        `;
    } else {
        return "";
    }
}

function checkEmergency(emergency) {
    if (emergency) {
        return `
        <span class="my-text-red-500 my-bg-red-200 d-flex align-items-center justify-content-center p-1 rounded fs-7">
            <span>
                <i class="fa-solid fa-heart-pulse fa-sm"></i>
            </span>
            Emergency
        </span>
        `;
    } else {
        return "";
    }
}

// Check Contacts:
(function checkContacts() {
    var contactsBox = "";
    if (allContacts.length == 0) {
        contactsBox = `
            <div class="no-contacts p-4">
                <p class="mb-0 fs-7 my-text-gray-500 text-center">No Contacts Yet</p>
            </div>`;
        rowData.innerHTML = contactsBox;
        return;
    }
    displayContacts();
})();

// Display Favourates:
function displayFavorates() {
        var favouratesBox = "";
    if (countFavourates() == 0) {
        favouratesBox = `
            <div class="no-favourates p-4">
                <p class="mb-0 fs-7 my-text-gray-500 text-center">No Favourates Contacts Yet</p>
            </div>`;
        favourateContactCards.innerHTML = favouratesBox;
        return;
    }

    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].favourate) {
            document.getElementById("star").classList.remove("d-none");
            favouratesBox += `
                <div class="contact-card mb-3 p-3 my-bg-gray-100 rounded-3 bg-hover-amber-50 d-flex justify-content-between align-items-center cursor-pointer bg-hover-green-700">
                    <div class="d-flex gap-3 align-items-center">
                        <div class="contact-avatar icon-size p-4 d-flex align-items-center justify-content-center rounded-4 from-violet-600-to-indego-600 text-white fw-bold" title="${allContacts[i].description}">
                            ${allContacts[i].name.charAt(0).toUpperCase()}
                        </div>
                        <div class="contact-name">
                            <h4 class="mb-2 h6 fw-bold my-text-black">${allContacts[i].name}</h4>
                            <p class="mb-0 fs-7 my-text-gray-500">${allContacts[i].phone}</p>
                        </div>
                    </div>
                    <div>
                        <a href="tel:${allContacts[i].phone}" class="btn btn-tel my-bg-green-200 my-text-green-700 rounded-3" title="Call ${allContacts[i].name}">
                            <i class="fa-solid fa-phone"></i>
                        </a>
                    </div>
                </div>`;
        }
    }
    favourateContactCards.innerHTML = favouratesBox;
}

// Display Emergencies:
function displayEmergencies() {
    var emergenciesBox = "";
    if (countEmergencies() == 0) {
        emergenciesBox = `
            <div class="no-emergencies p-4">
                <p class="mb-0 fs-7 my-text-gray-500 text-center">No Emergencies Contacts Yet</p>
            </div>`;
        emergencyContactCards.innerHTML = emergenciesBox;
        return;
    }

    for (var i = 0; i < allContacts.length; i++) {
        if (allContacts[i].emergency) {
            emergenciesBox += `
            <div class="contact-card mb-3 p-3 my-bg-gray-100 rounded-3 bg-hover-red-50 d-flex justify-content-between align-items-center cursor-pointer bg-hover-red-600">
                <div class="d-flex gap-3 align-items-center">
                    <div class="contact-avatar icon-size p-4 d-flex align-items-center justify-content-center rounded-4 from-violet-600-to-indego-600 text-white fw-bold" title="${allContacts[i].description}">
                        ${allContacts[i].name.charAt(0).toUpperCase()}
                    </div>
                    <div class="contact-name">
                        <h4 class="mb-2 h6 fw-bold my-text-black">${allContacts[i].name}</h4>
                        <p class="mb-0 fs-7 my-text-gray-500">${allContacts[i].phone}</p>
                    </div>
                </div>
                <div>
                    <a href="tel:${allContacts[i].phone}" class="btn btn-tel my-bg-red-200 my-text-red-600 rounded-3" title="Call ${allContacts[i].name}">
                        <i class="fa-solid fa-phone"></i>
                    </a>
                </div>
            </div>`;
        }
    }
    emergencyContactCards.innerHTML = emergenciesBox;
}

// Change Favourates:
function favourateContact(index) {
    console.log("Favourates :",index);
    if (allContacts[index].favourate) {
        allContacts[index].favourate = false;
    } else {
        allContacts[index].favourate = true;
    }
    localStorage.setItem("contacts", JSON.stringify(allContacts));
    displayContacts();
    displayFavorates();
    displayTotalContacts();
}

// Change Emergencies:
function emergencyContact(index) {
    console.log("Emergency :",index);
    if (allContacts[index].emergency) {
        allContacts[index].emergency = false;
    } else {
        allContacts[index].emergency = true;
    }
    localStorage.setItem("contacts", JSON.stringify(allContacts));
    displayContacts();
    displayEmergencies();
    displayTotalContacts();
}

// Display Contacts and Search as the display is a search with filter:
function displayContacts(element) {
    if (allContacts.length != 0) {
        var box = "";
        // Check if the input field (search) is empty to avoid undefined error: return empty string and display the contacts array:
        var inputText = element?.value || "";
        for (var i = 0; i < allContacts.length; i++) {
            // Search (realtime search) Using the input field: (name, email, phone)
            if (
                allContacts[i].name.toLowerCase().includes(inputText.toLowerCase()) ||
                allContacts[i].email.toLowerCase().includes(inputText.toLowerCase()) ||
                allContacts[i].phone.toLowerCase().includes(inputText.toLowerCase())
            ) {
                box += `
                    <div class="col-md-6">
                            <div class="item my-bg-white rounded-4 w-100 general-box-shadow general-hover-shadow">
                                <div class="item-top p-3 d-flex gap-3 flex-column p-4">
                                    <div class="icon-name-phone d-flex gap-3 align-items-center">
                                        <div class="icon icon-size p-4 d-flex align-items-center justify-content-center rounded-4 from-violet-600-to-indego-600 text-white fw-bold position-relative cursor-pointer" title="${allContacts[i].description}">
                                            ${allContacts[i].name.charAt(0).toUpperCase()}
                                            ${checkStar(allContacts[i].favourate)}
                                            ${checkHeart(allContacts[i].emergency)}
                                        </div>
                                        <div class="name-phone">
                                            <h3 class="mb-0 fw-bold my-text-black h6">${allContacts[i].name}</h3>
                                            <p class="mb-0 fs-7 my-text-gray-500 d-flex gap-2 align-items-center">
                                                <span class="my-text-blue-500 my-bg-blue-100 icon-size d-flex align-items-center justify-content-center p-1 rounded">
                                                    <i class="fa-solid fa-phone fa-sm"></i>
                                                </span>
                                                <span>${allContacts[i].phone}</span>
                                            </p>
                                        </div>
                                    </div>
                                    ${checkEmail(allContacts[i].email)}
                                    ${checkAddress(allContacts[i].address)}
                                    <div class="group-emergency d-flex gap-3">
                                        ${checkGroup(allContacts[i].group)}
                                        ${checkEmergency(allContacts[i].emergency)}
                                    </div>
                                </div>
                                <div class="item-footer p-3 d-flex align-items-center justify-content-between">
                                    <div class="phone-email d-flex gap-3">
                                        <div class="bg-hover-green-200 rounded-3">
                                            <a href="tel:${allContacts[i].phone}" class="btn btn-tel my-bg-green-200 my-text-green-700 rounded-3" title="Call ${allContacts[i].name}">
                                                <i class="fa-solid fa-phone"></i>
                                            </a>
                                        </div>
                                        ${allContacts[i].email ? `<div class="bg-hover-indigo-200 rounded-3">
                                            <a href="mailto:${allContacts[i].email}" class="btn btn-email my-bg-indigo-200 my-text-indigo-500 rounded-3" title="Email ${allContacts[i].name}">
                                                <i class="fa-solid fa-envelope"></i>
                                            </a>
                                        </div>` : ""}
                                    </div>
                                    <div class="edit-contact d-flex align-items-center">
                                        <button class="btn btn-fav my-text-gray-400 cursor-pointer border-0" title="Favorite" onclick="favourateContact(${i})">
                                            <i class="fa-solid fa-star"></i>
                                        </button>
                                        <button class="btn btn-heart my-text-gray-400 cursor-pointer border-0" title="Emergency" onclick="emergencyContact(${i})">
                                            <i class="fa-solid fa-heart-pulse"></i>
                                        </button>
                                        <a class="btn btn-edit my-text-gray-500 bg-hover-indigo-200 rounded-3 border-0" onclick="editContact(${i})" id="editBtn" title="Edit">
                                            <i class="fa-solid fa-pen"></i>
                                        </a>
                                        <a class="btn btn-remove my-text-gray-500 bg-hover-red-200 rounded-3 border-0" onclick="deleteContact(${i})" title="Remove">
                                            <i class="fa-solid fa-trash"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                    </div>`;
            }
            if (box) {
                rowData.innerHTML = box;
            } else {
                rowData.innerHTML = '<h3 class="text-center text-danger fw-bold">No Contacts Found!</h3>';
            }
        }
    } else {
        rowData.innerHTML = '<h3 class="text-center text-danger fw-bold">No Contacts Yet!</h3>';
    }
}

// Delete Contact:
function deleteContact(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
            });
            allContacts.splice(index, 1); // Remove the contact from the array using its index.
            localStorage.setItem("contacts", JSON.stringify(allContacts)); // Save the updated contacts array to local storage.
            updateUI();
        }
    });
}

// Delete All Contacts:
function deleteAllContacts() {
    if (allContacts.length == 0) return;
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "All contacts have been deleted.",
                icon: "success",
            });
            allContacts = []; // Clear the contacts array.
            localStorage.setItem("contacts", JSON.stringify(allContacts)); // Save the updated contacts array to local storage.
            updateUI();
        }
    });
}

function editContact(index) {
    // To Show The Modal:
    var myModal = new bootstrap.Modal(document.getElementById("exampleModalScrollable"));
    myModal.show();

    contactName.value = allContacts[index].name;
    contactPhone.value = allContacts[index].phone;
    contactEmail.value = allContacts[index].email;
    contactAddress.value = allContacts[index].address;
    contactGroup.value = allContacts[index].group;
    contactDescription.value = allContacts[index].description;
    contactEmergencyCheck.checked = allContacts[index].emergency;
    contactFavourateCheck.checked = allContacts[index].favourate;
    saveContact.classList.add("d-none");
    updateContact.classList.remove("d-none");
    updateContact.onclick = function () {
        var nameValid = validateAllInputs(contactName);
        var phoneValid = validateAllInputs(contactPhone);
        var emailValid = (contactEmail.value == "" || validateAllInputs(contactEmail));

        // Check Required fields
        if (contactName.value == "" || contactPhone.value == "") {
            Swal.fire({
                title: "Please fill all required fields",
                icon: "warning",
            });
            return;
        }

        // Check Input validation
        if (!nameValid || !phoneValid || !emailValid) {
            Swal.fire({
                title: "Please enter valid data",
                icon: "warning",
            });
            return;
        }

        // Check repeated phone 
        if (checkRepeatedContact(contactPhone.value) && contactPhone.value != allContacts[index].phone) {
            Swal.fire({
                title: "Contact already exists",
                icon: "warning",
            });
            return;
        }

        // Update contact
        allContacts[index].name = contactName.value;
        allContacts[index].phone = contactPhone.value;
        allContacts[index].email = contactEmail.value;
        allContacts[index].address = contactAddress.value;
        allContacts[index].group = contactGroup.value;
        allContacts[index].description = contactDescription.value;
        allContacts[index].emergency = contactEmergencyCheck.checked;
        allContacts[index].favourate = contactFavourateCheck.checked;

        localStorage.setItem("contacts", JSON.stringify(allContacts));
        updateUI();
        clearAllInputFields();
        updateContact.classList.add("d-none");
        saveContact.classList.remove("d-none");

        Swal.fire({
            title: "Updated Successfully",
            icon: "success",
        });
        // To Hide The Modal:
        var exampleModalScrollable = document.getElementById("exampleModalScrollable");
        var modal = bootstrap.Modal.getInstance(exampleModalScrollable);
        modal.hide();
    };
}

// Validation function: Validate all inputs.
function validateAllInputs(element) {
    var text = element.value;
    var regex = {
        contactName: /^[\p{L}\p{M}\s\-.']+$/u, // regex support all languages and spaces
        contactPhone: /^(002\s?)?(\+2[0]?\s?)?0?1[0125]\s?[0-9]{8}$/, 
        phoneNumber: /^(002\s?)?(\+2[0]?\s?)?0?1[0125]\s?[0-9]{8}$/,
        contactEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    };
    
    var errors = {
        contactName: document.getElementById("errorName"),
        contactPhone: document.getElementById("errorPhone"),
        phoneNumber: document.getElementById("errorPhoneQR"),
        contactEmail: document.getElementById("errorEmail"),
    };

    if (text == "") {
        element.classList.remove("is-invalid");
        element.classList.remove("is-valid");
        errors[element.id].classList.add("d-none");
        return false;
    }

    if (regex[element.id].test(text)) {
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
        errors[element.id].classList.add("d-none");
        return true;
    } else {
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
        errors[element.id].classList.remove("d-none");
        return false;
    }
}

var navImage = document.getElementById("navImage");
var lightContainer = document.getElementById("lightContainer");
var closeImage = document.getElementById("closeImage");

navImage.addEventListener("click", function () {
    lightContainer.classList.toggle("d-none");
    console.log("clicked");
});

closeImage.addEventListener("click", function () {
    lightContainer.classList.add("d-none");
});