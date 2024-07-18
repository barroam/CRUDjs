
let selectionCarte = null;
var compteurValidation = 0;

// Fonction pour montrer l'alerte
function montrerAlert(message, className) {
  const div = document.createElement("div");
  div.className = `alert alert-${className}`;
  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".mss");
  container.insertBefore(div, container.firstChild);
  setTimeout(() => div.remove(), 5000);
}

// Effacer les données
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

// Charger les idées depuis le localStorage
function chargerIdees() {
  const listIdees = document.querySelector("#allIdee");
  listIdees.innerHTML = '';  // Clear existing ideas
  const idees = getIdeesFromLocalStorage();
  idees.forEach((idee, index) => ajouterIdee(idee.libelle, idee.categorie, idee.description, idee.status, index));
}

function mettreAjourIdee(libelle, categorie, description) {
    // Vérifier si les données sont différentes de l'idée existante
    const existingLibelle = selectionCarte.querySelector(".card-header p").textContent;
    const existingCategorie = selectionCarte.querySelector(".card-body p:nth-child(2)").textContent;
    const existingDescription = selectionCarte.querySelector(".card-body p:nth-child(4)").textContent;
  
    if (libelle !== existingLibelle || categorie !== existingCategorie || description !== existingDescription) {
      compteurValidation = 0; // Réinitialiser le compteur d'approbation
    }
  
    selectionCarte.querySelector(".card-header p").textContent = libelle;
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
  

// Ajouter une idée
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

// Événement pour le formulaire d'ajout d'idée
document.querySelector('#idee-formulaire').addEventListener("submit", (e) => {
  e.preventDefault();
  const libelle = document.querySelector("#libelle").value;
  const description = document.querySelector("#description").value;
  const categorie = document.querySelector("#categorie").value;
  // validation description 
  if (description.length > 255 || description.length <= 5) {
    montrerAlert('La description ne doit pas être supérieure à 255 lettres', 'danger');
  } else {
    compteurValidation++;
  }
  // validation categorie
  if (categorie === "") {
    montrerAlert('La catégorie ne doit pas être vide', 'danger');
  } else {
    compteurValidation++;
  }
  var nomRegex = /^[a-zA-Z ]+$/;
  // validation titre
  if (libelle.length <= 7 || !nomRegex.test(libelle)) {
    montrerAlert('Le titre doit être plus de 7 lettres et composé uniquement de lettres', 'danger');
  } else {
    compteurValidation++;
  }
  if (compteurValidation < 3) {
    montrerAlert('Remplisser correctement', 'dark');
    compteurValidation = 0;
  } else {
    if (selectionCarte === null) {
      ajouterIdee(libelle, categorie, description);
      montrerAlert("L'ajout d'idée a réussi", 'success');
      compteurValidation = 0;
    } else {
      mettreAjourIdee(libelle, categorie, description);
      selectionCarte = null;
    }
    effacerDonnees();
  }
});

// Gestionnaire d'événements pour les boutons Edit, Delete
document.querySelector("#allIdee").addEventListener("click", (e) => {
  const target = e.target;

  if (target.closest(".edit")) {
    selectionCarte = target.closest('.col-4');
    document.querySelector("#libelle").value = selectionCarte.querySelector(".card-header p").textContent;
    document.querySelector("#categorie").value = selectionCarte.querySelector(".card-body p:nth-child(2)").textContent;
    document.querySelector("#description").value = selectionCarte.querySelector(".card-body p:nth-child(4)").textContent;
  } else if (target.closest(".delete")) {
    const index = target.closest('.col-4').dataset.index;
    target.closest('.col-4').remove();
    montrerAlert("L'idée a été supprimée", "danger");

    const idees = getIdeesFromLocalStorage();
    idees.splice(index, 1);
    saveIdeesToLocalStorage(idees);

    // Recharger les idées pour mettre à jour les index
    document.querySelector("#allIdee").innerHTML = '';
    chargerIdees();
  }
});
// Charger les idées depuis le localStorage
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
      const couleurTitre =cardContainer.querySelector('.card-header');
      // Met à jour le badge de statut et les boutons en fonction de l'état de l'idée
      switch (idee.status) {
        case 'Approuvée':
          statusBadge.textContent = "Approuvée";
          statusBadge.classList.remove("bg-secondary");
          statusBadge.classList.add('bg-success');
          cardContainer.style.borderColor = 'green';
          statusapprove.style.display = 'none'; // Cache le bouton Approuver
          statusdisapprove.style.display = 'none'; // Cache le bouton Désapprouver
          couleurTitre.classList.remove('bg-dark');
          couleurTitre.classList.add('bg-success');
          break;
        case 'Désapprouvée':
          statusBadge.textContent = "Désapprouvée";
          statusBadge.classList.remove("bg-secondary");
          statusBadge.classList.add('bg-danger');
          cardContainer.style.borderColor = 'red';
          statusapprove.style.display = 'none'; // Cache le bouton Approuver
          statusdisapprove.style.display = 'none'; // Cache le bouton Désapprouver
          couleurTitre.classList.remove('bg-dark');
          couleurTitre.classList.add('bg-danger');
          break;
        default:
          break;
      }
    });
  }
  
  // Gestionnaire d'événements pour les boutons Edit, Delete, Approuver et Désapprouver
document.querySelector("#allIdee").addEventListener("click", (e) => {
    const target = e.target;
  if (target.closest(".delete")) {
      // Votre code pour supprimer une idée
    } else  if (target.closest(".approve")) {
      approuverIdee(target);
      // Appeler la fonction d'approbation avec le bouton cliqué comme argument
    } else if (target.closest(".disapprove")) {
      desapprouverIdee(target); 
      // Appeler la fonction de désapprobation avec le bouton cliqué comme argument
    }
   
  });
  
  function approuverIdee(target) {
    const cardContainer = target.closest('.col-4'); 
    // Conteneur parent de la carte
    const statusBadge = cardContainer.querySelector('.badge');
    statusBadge.textContent = "Approuvée";
    statusBadge.classList.remove("bg-secondary");
    statusBadge.classList.add('bg-success');
    // Cacher les boutons Approuver et Désapprouver
    cacherBoutons(cardContainer);
    // Modifier la couleur de la bordure du conteneur parent
    cardContainer.style.borderColor = 'green'; 
    // Exemple de couleur de bordure verte pour approbation
    const idees = getIdeesFromLocalStorage();
    const index = cardContainer.dataset.index;
    idees[index].status = 'Approuvée';
    saveIdeesToLocalStorage(idees);
  }
  
  function desapprouverIdee(target) {
    const cardContainer = target.closest('.col-4'); 
    // Conteneur parent de la carte
    const statusBadge = cardContainer.querySelector('.badge');
    statusBadge.textContent = "Désapprouvée";
    statusBadge.classList.remove("bg-secondary");
    statusBadge.classList.add('bg-danger');
    // Cacher les boutons Approuver et Désapprouver
    cacherBoutons(cardContainer);
    // Modifier la couleur de la bordure du conteneur parent
    cardContainer.style.borderColor = 'red';
     // Exemple de couleur de bordure rouge pour désapprobation
    const idees = getIdeesFromLocalStorage();
    const index = cardContainer.dataset.index;
    idees[index].status = 'Désapprouvée';
    saveIdeesToLocalStorage(idees);
  }
  
  
  // Fonction pour cacher les boutons Approuver et Désapprouver après une action
  function cacherBoutons(cardContainer) {
    cardContainer.querySelector(".approve").style.display = 'none';
    cardContainer.querySelector(".disapprove").style.display = 'none';
  }
  
  // Charger les idées lorsque la page est chargée
  document.addEventListener("DOMContentLoaded", () => {
    chargerIdees(); 
  });
  
