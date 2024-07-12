


let selectedRow = null;

// Fonction pour montrer l'alerte
function montrerAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const main = document.querySelector(".main");
    container.insertBefore(div, main);
    setTimeout(() => div.remove(), 5000);
}

// Effacer les données
function effacerDonnees() {
    document.querySelector("#libelle").value = "";
    document.querySelector("#categorie").value = "";
    document.querySelector("#description").value = "";
}

// Fonction pour mettre à jour une idée
function mettreAJourIdee(libelle, categorie, description) {
    selectedRow.children[0].textContent = libelle;
    selectedRow.children[1].textContent = categorie;
    selectedRow.children[2].textContent = description;
    montrerAlert("L'idée a été mise à jour", "success");
}

// Fonction pour ajouter une idée
function ajouterIdee(libelle, categorie, description) {
    const list = document.querySelector("#listeIdee");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${libelle}</td>
        <td>${categorie}</td>
        <td>${description}</td>
        <td>
            <span class="badge bg-secondary">En attente</span>
        </td>
        <td>
            <a href="#" class="btn btn-warning btn-sm edit">Edit</a>
            <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
            <a href="#" class="btn btn-success btn-sm approve">Approuver</a>
             <a href="#" class="btn btn-danger btn-sm disapprove">Desapprouve</a>
        </td>
    `;
    list.appendChild(row);
}

function approuverIdee(target) {
    const statusBadge = target.closest('tr').querySelector('.badge');
    statusBadge.textContent = "Approuvé";
    statusBadge.classList.remove("bg-danger");
    statusBadge.classList.add("bg-success");
    const statusapprove = target.closest('tr').querySelector('.approve')
    statusapprove.innerHTML="";
    statusapprove.classList.remove("btn");
    const statusdisapprove = target.closest('tr').querySelector('.disapprove')
    statusdisapprove.textContent="";
    statusdisapprove.classList.remove("btn")
    montrerAlert("L'idée a été approuvée", "success");
}

// Fonction pour désapprouver une idée
function desapprouverIdee(target) {
    const statusBadge = target.closest('tr').querySelector('.badge');
    statusBadge.textContent = "Desapprouve";
    statusBadge.classList.remove("bg-success");
    statusBadge.classList.add("bg-danger");
    const statusapprove = target.closest('tr').querySelector('.approve')
    statusapprove.innerHTML="";
    statusapprove.classList.remove("btn");
    const statusdisapprove = target.closest('tr').querySelector('.disapprove')
    statusdisapprove.innerHTML="";
    statusdisapprove.classList.remove("btn")
    const changerchamps = target.closest('tbody').querySelector('#badge');
    changerchamps.classList.add("bg-danger");
    montrerAlert("L'idée a été désapprouvée", "danger");
}


// Événement pour le formulaire d'ajout d'idée
document.querySelector('#idee-formulaire').addEventListener("submit", (e) => {
    e.preventDefault();

    const libelle = document.querySelector("#libelle").value;
    const description = document.querySelector("#description").value;
    const categorie = document.querySelector("#categorie").value;

    if (libelle.length <= 7 || description.length > 256 || categorie === "") {
        montrerAlert('Le titre doit etre superieur a 7 lettre et la descriptions ne doit pas dépasser 255 lettres', 'danger');
    }
     else {
        if (selectedRow === null) {
            ajouterIdee(libelle, categorie, description);
            montrerAlert("L'ajout d'idée a réussi", 'success');
        } else {
            mettreAJourIdee(libelle, categorie, description);
            selectedRow = null;
        }
        effacerDonnees();
    }
});


// Gestionnaire d'événements pour les boutons Edit, Delete,
document.querySelector("#listeIdee").addEventListener("click", (e) => {
    const target = e.target;
  if (target.classList.contains("edit")) {
        selectedRow = target.closest('tr');
        document.querySelector("#libelle").value = selectedRow.children[0].textContent;
        document.querySelector("#categorie").value = selectedRow.children[1].textContent;
        document.querySelector("#description").value = selectedRow.children[2].textContent;
    }
     else if (target.classList.contains("delete")) {
        target.closest('tr').remove();
        montrerAlert("L'idée a été supprimée", "danger");
    }
});

//gestionnaire d'evenement pour le bouton approuver et des approuver
document.querySelector('#listeIdee').addEventListener("click",(e) => {
    const target = e.target;
   if (target.classList.contains("approve")) {
        approuverIdee(target);
    } else if (target.classList.contains("disapprove")) {
        desapprouverIdee(target);
    }
})