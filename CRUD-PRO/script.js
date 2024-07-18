let selectionCarte = null;
let compteurValidation = 0;

// Fonction pour afficher une alerte
function montrerAlert(message, className) {
  const div = document.createElement("div");
  div.className = `alert alert-${className}`;
  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".mss");
  container.insertBefore(div, container.firstChild);
  setTimeout(() => div.remove(), 5000);
}

// Effacer les données du formulaire
function effacerDonnees() {
  document.querySelector("#libelle").value = "";
  document.querySelector("#categorie").value = "";
  document.querySelector("#description").value = "";
}

// Récupérer les idées depuis le localStorage
function getIdeesFromLocalStorage() {
  return JSON.parse(localStorage.getItem('idees')) || [];
}

// Sauvegarder les idées dans le localStorage
function saveIdeesToLocalStorage(idees) {
  localStorage.setItem('idees', JSON.stringify(idees));
}

// Charger les idées depuis le localStorage et les afficher sur la page
function chargerIdees() {
  const listIdees = document.querySelector("#allIdee");
  listIdees.innerHTML = '';  // Efface les idées existantes
  const idees = getIdeesFromLocalStorage();
  idees.forEach((idee, index) => {
    ajouterIdee(idee.libelle, idee.categorie, idee.description, idee.status, index);
    const cardContainer = listIdees.querySelector(`[data-index="${index}"]`);
    const statusBadge = cardContainer.querySelector('.badge');
    const statusapprove = cardContainer.querySelector('.approve');
    const statusdisapprove = cardContainer.querySelector('.disapprove');
    const couleurTitre = cardContainer.querySelector('.card-header');
    // Mettre à jour le badge de statut et les boutons en fonction de l'état de l'idée
    switch (idee.status) {
      case 'Approuvée':
        statusBadge.textContent = "Approuvée";
        statusBadge.classList.remove("bg-secondary");
        statusBadge.classList.add('bg-success');
        cardContainer.style.borderColor = 'green';
        statusapprove.style.display = 'none'; // Cacher le bouton Approuver
        statusdisapprove.style.display = 'none'; // Cacher le bouton Désapprouver
        couleurTitre.classList.remove('bg-dark');
        couleurTitre.classList.add('bg-success');
        break;
      case 'Désapprouvée':
        statusBadge.textContent = "Désapprouvée";
        statusBadge.classList.remove("bg-secondary");
        statusBadge.classList.add('bg-danger');
        cardContainer.style.borderColor = 'red';
        statusapprove.style.display = 'none'; // Cacher le bouton Approuver
        statusdisapprove.style.display = 'none'; // Cacher le bouton Désapprouver
        couleurTitre.classList.remove('bg-dark');
        couleurTitre.classList.add('bg-danger');
        break;
      default:
        break;
    }
  });
}

// Fonction pour mettre à jour une idée
function mettreAjourIdee(libelle, categorie, description) {
  // Vérifier si les données sont différentes de l'idée existante
  const existingLibelle = selectionCarte.querySelector(".card-header h4").textContent;
  const existingCategorie = selectionCarte.querySelector(".card-body p:nth-child(2)").textContent;
  const existingDescription = selectionCarte.querySelector(".card-body p:nth-child(4)").textContent;

  if (libelle !== existingLibelle || categorie !== existingCategorie || description !== existingDescription) {
    compteurValidation = 0; // Réinitialiser le compteur de validation
  }

  selectionCarte.querySelector(".card-header h4").textContent = libelle;
  selectionCarte.querySelector(".card-body p:nth-child(2)").textContent = categorie;
  selectionCarte.querySelector(".card-body p:nth-child(4)").textContent = description;
  montrerAlert("L'idée est mise à jour", "success");

  const idees = getIdeesFromLocalStorage();
  const index = selectionCarte.dataset.index;
  idees[index] = { libelle, categorie, description, status: selectionCarte.querySelector('.badge').textContent };
  saveIdeesToLocalStorage(idees);

  // Actualiser la liste des idées sur la page
  chargerIdees();
}

// Fonction pour ajouter une idée
function ajouterIdee(libelle, categorie, description, status = 'en attente', index = null) {
  const listIdees = document.querySelector("#allIdee");
  const ideeIndex = index !== null ? index : getIdeesFromLocalStorage().length;
  const ideeHTML = `
    <div class="col-4 rounded-2" style="border: 0.15rem solid; width: 30%;" data-index="${ideeIndex}">
      <div class="card">
        <div class="card-header d-flex flex-wrap bg-dark text-light">
          <h3>Titre:</h3>
          <h4>${libelle}</h4>
        </div>
        <div class="card-body">
          <h5>Catégories:</h5>
          <p>${categorie}</p>
          <h5>Description:</h5>
          <p>${description}</p>
          <div class="badge bg-secondary">${status}</div>
        </div>
      </div>
      <div class="d-flex justify-content-between bg-light p-2 forget ">
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <a href="#" class="btn btn-success btn-sm approve">Approuver</a>
          <a href="#" class="btn btn-danger btn-sm disapprove">Désapprouver</a>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <a href="#" class="edit"><i class="fa-solid fa-pen-to-square" style="font-size: 1.8rem; color: rgb(212, 212, 14);"></i></a>
          <a href="#" class="delete"><i class="fa-solid fa-trash-can" style="font-size: 1.8rem; color: rgb(212, 50, 14);"></i></a>
        </div>
      </div>
    </div>
  `;
  listIdees.insertAdjacentHTML('beforeend', ideeHTML);

  if (index === null) {
    const idees = getIdeesFromLocalStorage();
    idees.push({ libelle, categorie, description, status });
    saveIdeesToLocalStorage(idees);
  }
}

// Événement pour le formulaire d'ajout ou d'édition d'idée
document.querySelector('#idee-formulaire').addEventListener("submit", (e) => {
  e.preventDefault();

  const libelle = document.querySelector("#libelle").value;
  const description = document.querySelector("#description").value;
  const categorie = document.querySelector("#categorie").value;

  // Validation de la description
  if (description.length > 255 || description.length <= 5) {
    montrerAlert('La description doit être entre 5 et 255 caractères', 'danger');
  } else {
    compteurValidation++;
  }

  // Validation de la catégorie
  if (categorie === "") {
    montrerAlert('La catégorie ne peut pas être vide', 'danger');
  } else {
    compteurValidation++;
  }

  // Validation du libellé
  const nomRegex = /^[a-zA-Z ]+$/;
  if (libelle.length <= 7 || !nomRegex.test(libelle)) {
    montrerAlert('Le titre doit être composé uniquement de lettres et avoir plus de 7 caractères', 'danger');
  } else {
    compteurValidation++;
  }

  // Si la validation est réussie, ajouter ou mettre à jour l'idée
  if (compteurValidation < 3) {
    montrerAlert('Remplissez correctement tous les champs', 'dark');
    compteurValidation = 0;
  } else {
    if (selectionCarte === null) {
      ajouterIdee(libelle, categorie, description);
      montrerAlert("L'ajout d'idée a réussi", 'success');
    } else {
      mettreAjourIdee(libelle, categorie, description);
      selectionCarte = null; // Réinitialiser la sélection
    }
    effacerDonnees(); // Effacer le formulaire après ajout ou mise à jour
    compteurValidation = 0; // Réinitialiser le compteur de validation
  }
});

// Gestionnaire d'événements pour les boutons Edit, Delete, Approuver et Désapprouver
document.querySelector("#allIdee").addEventListener("click", (e) => {
  const target = e.target;

  if (target.closest(".edit")) {
    // Sélectionner le conteneur parent .col-4 pour l'édition
    selectionCarte = target.closest('.col-4');

    // Remplir le formulaire avec les données de l'idée sélectionnée
    document.querySelector("#libelle").value = selectionCarte.querySelector(".card-header h4").textContent;
    document.querySelector("#categorie").value = selectionCarte.querySelector(".card-body p:nth-child(2)").textContent;
    document.querySelector("#description").value = selectionCarte.querySelector(".card-body p:nth-child(4)").textContent;
  } else if (target.closest(".delete")) {
    // Supprimer l'idée et la retirer du localStorage
    const index = target.closest('.col-4').dataset.index;
    target.closest('.col-4').remove();
    montrerAlert("L'idée a été supprimée", "danger");

    const idees = getIdeesFromLocalStorage();
    idees.splice(index, 1);
    saveIdeesToLocalStorage(idees);

    // Recharger les idées pour mettre à jour les index
    chargerIdees();
  } else if (target.closest(".approve")) {
    // Approuver l'idée
    const cardContainer = target.closest('.col-4');
    cardContainer.querySelector('.badge').textContent = 'Approuvée';
    cardContainer.querySelector('.badge').classList.remove("bg-secondary");
    cardContainer.querySelector('.badge').classList.add('bg-success');
    cardContainer.style.borderColor = 'green';
    cardContainer.querySelector('.edit').style.display = 'none'; // Cacher le bouton Edit
    cardContainer.querySelector('.delete').style.display = 'none'; // Cacher le bouton Delete
    montrerAlert("L'idée a été approuvée", "success");

    const idees = getIdeesFromLocalStorage();
    const index = cardContainer.dataset.index;
    idees[index].status = 'Approuvée';
    saveIdeesToLocalStorage(idees);

    // Recharger les idées pour mettre à jour les statuts
    chargerIdees();
  } else if (target.closest(".disapprove")) {
    // Désapprouver l'idée
    const cardContainer = target.closest('.col-4');
    cardContainer.querySelector('.badge').textContent = 'Désapprouvée';
    cardContainer.querySelector('.badge').classList.remove("bg-secondary");
    cardContainer.querySelector('.badge').classList.add('bg-danger');
    cardContainer.style.borderColor = 'red';
    cardContainer.querySelector('.edit').style.display = 'none'; // Cacher le bouton Edit
    cardContainer.querySelector('.delete').style.display = 'none'; // Cacher le bouton Delete
    montrerAlert("L'idée a été désapprouvée", "success");

    const idees = getIdeesFromLocalStorage();
    const index = cardContainer.dataset.index;
    idees[index].status = 'Désapprouvée';
    saveIdeesToLocalStorage(idees);

    // Recharger les idées pour mettre à jour les statuts
    chargerIdees();
  }
});

// Charger les idées au chargement initial de la page
document.addEventListener('DOMContentLoaded', chargerIdees);
