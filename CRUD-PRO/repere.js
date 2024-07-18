let selectionCarte = null;
var compteurValidation = 0 ;
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

// Mettre à jour une idée
function mettreAjourIdee(libelle, categorie, description) {
  selectionCarte.querySelector(".card-header p").textContent = libelle;
  selectionCarte.querySelector(".card-body p:nth-child(2)").textContent = categorie;
  selectionCarte.querySelector(".card-body p:nth-child(4)").textContent = description;
  montrerAlert("L'idée est mise à jour", "success");
}

// Ajouter une idée
function ajouterIdee(libelle, categorie, description) {
  const listIdees = document.querySelector("#allIdee");
  const ideeHTML = `
    <div class="col-4 rounded-2" style="border: 0.15rem solid; width: 30%;">
      <div class="card " >
        <div class="card-header d-flex flex-wrap bg-dark text-light">
          <h5>Titre:</h5>
          <p>${libelle}</p>
        </div>
        <div class="card-body">
          <h5>Catégories:</h5>
          <p>${categorie}</p>
          <h5>Description:</h5>
          <p>${description}</p>
          <div class="badge bg-secondary">en attente</div>
        </div>
      </div>
      <div class="d-flex justify-content-between bg-light p-2">
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
}

// Événement pour le formulaire d'ajout d'idée
document.querySelector('#idee-formulaire').addEventListener("submit", (e) => {
  e.preventDefault();

  const libelle = document.querySelector("#libelle").value;
  const description = document.querySelector("#description").value;
  const categorie = document.querySelector("#categorie").value;
 
  //validation description 
  if (description.length > 255 || description.length <= 4) {
    montrerAlert('la description ne droit pas etre superieur à 255 lettres','danger')
  }else{compteurValidation++};
  //validation categorie
  if (categorie === "" ) {
    montrerAlert('lcaegorie ne doit pas etre vide','danger')
  }else{compteurValidation++};
  var nomRegex = /^[a-zA-Z ]+$/;
  //validation  titre
  if (libelle.length <= 7 || !nomRegex.test(libelle) ) {
    montrerAlert('le titre doit etre plus de 7 lettres et composer que de lettres','danger')
    }else{ compteurValidation++ };

    if (compteurValidation < 3) { alert(compteurValidation)
        montrerAlert('validation yi bakhoul' , 'danger');
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
    target.closest('.col-4').remove();
    montrerAlert("L'idée a été supprimée", "danger");
  }
  Form.reset()
});// Fonction pour approuver une idée
function approuverIdee(target) {
  const cardContainer = target.closest('.col-4'); // Conteneur parent de la carte
  const statusBadge = cardContainer.querySelector('.badge');
  statusBadge.textContent = "Approuvée";
  statusBadge.classList.remove("bg-secondary");
  statusBadge.classList.add('bg-success');

  // Modifier la couleur de la bordure du conteneur parent
  if (statusBadge.classList.contains('bg-success')) {
    cardContainer.style.borderColor = 'green'; // Exemple de couleur de bordure verte pour approbation
  } else if (statusBadge.classList.contains('bg-danger')) {
    cardContainer.style.borderColor = 'red'; // Exemple de couleur de bordure rouge pour désapprobation
  }

  // Modifier le contenu des boutons
  const approveBtn = target.closest('.d-flex').querySelector('.approve');
  approveBtn.innerHTML = "";
  approveBtn.classList.remove("btn");

  const disapproveBtn = target.closest('.d-flex').querySelector('.disapprove');
  disapproveBtn.innerHTML = "";
  disapproveBtn.classList.remove("btn");
}

// Fonction pour désapprouver une idée
function desapprouverIdee(target) {
  const cardContainer = target.closest('.col-4'); // Conteneur parent de la carte
  const statusBadge = cardContainer.querySelector('.badge');
  statusBadge.textContent = "Désapprouvée";
  statusBadge.classList.remove("bg-secondary");
  statusBadge.classList.add('bg-danger');

  // Modifier la couleur de la bordure du conteneur parent
  if (statusBadge.classList.contains('bg-success')) {
    cardContainer.style.borderColor = 'green'; // Exemple de couleur de bordure verte pour approbation
  } else if (statusBadge.classList.contains('bg-danger')) {
    cardContainer.style.borderColor = 'red'; // Exemple de couleur de bordure rouge pour désapprobation
  }

  // Modifier le contenu des boutons
  const approveBtn = target.closest('.d-flex').querySelector('.approve');
  approveBtn.innerHTML = "";
  approveBtn.classList.remove("btn");

  const disapproveBtn = target.closest('.d-flex').querySelector('.disapprove');
  disapproveBtn.innerHTML = "";
  disapproveBtn.classList.remove("btn");
}

// Gestionnaire d'événements pour les boutons Approuver et Désapprouver
document.querySelector('#allIdee').addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("approve")) {
    approuverIdee(target);
  } else if (target.classList.contains("disapprove")) {
    desapprouverIdee(target);
  }
});
