
//alert(hello);
//Montrer l'alert
/*
function montrerAlert(message,className){
 const div = document.createElement("div");
 div.className = `alert alert-${className}` ;

 div.appendChild(document.createTextNode(message));
 const container =document.querySelector(".container");
 const main =document.querySelector(".main");
 container.insertBefore(div,main);
 setTimeout(() => document.querySelector(".alert").remove(),3000);

}

// Supprimer les données 
document.querySelector("#listeIdee").addEventListener("click",(e)=>{
 taeget= e.target;
 if(tagert.classList.container("delete")){
    target.parentElement.parentElement.remove();
    montrerAlert("une idee est supprimer")
 }


}) */

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
            <span class="badge bg-secondary" id="badge">En attente</span>
        </td>
        <td>
            <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
            <a href="#" class="btn btn-success btn-sm approve">Approuver</a>
        </td>
    `;
    list.appendChild(row);
}

/*
function approuverIdee(target) {
    const statusBadge = target.closest('tr').querySelector('.badge');
    statusBadge.textContent = "Approuvé";
    statusBadge.classList.remove("bg-secondary");
    statusBadge.classList.add("bg-success");
    montrerAlert("L'idée a été approuvée", "success");
}

// Fonction pour désapprouver une idée
function desapprouverIdee(target) {
    const statusBadge = target.closest('tr').querySelector('.badge');
    statusBadge.textContent = "En attente";
    statusBadge.classList.remove("bg-success");
    statusBadge.classList.add("bg-secondary");

    montrerAlert("L'idée a été désapprouvée", "danger");
}
*/
// Fonction pour approuver une idée
function approuverIdee(target) {
 document.getElementById("badge") = innerHTML = "approuvé";
   
    montrerAlert("L'idée a été approuvée", "success");
}

// Événement pour le formulaire d'ajout d'idée
document.querySelector('#idee-formulaire').addEventListener("submit", (e) => {
    e.preventDefault();

    const libelle = document.querySelector("#libelle").value;
    const description = document.querySelector("#description").value;
    const categorie = document.querySelector("#categorie").value;

    if (libelle === "" || description === "" || categorie === "") {
        montrerAlert('Veuillez remplir tous les champs du formulaire', 'danger');
    } else {
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

// Gestionnaire d'événements pour les boutons Edit, Delete, Approve et Disapprove
document.querySelector("#listeIdee").addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("approve")) {
        approuverIdee(target);
    }  else if (target.classList.contains("delete")) {
        target.closest('tr').remove();
        montrerAlert("L'idée a été supprimée", "danger");
    }
});

