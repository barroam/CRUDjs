// Configuration de Firebase
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "boite-idee-js.firebaseapp.com",
  databaseURL: "https://boite-idee-js-default-rtdb.firebaseio.com",
  projectId: "boite-idee-js",
  storageBucket: "boite-idee-js.appspot.com",
  messagingSenderId: "575198887508",
  appId: "1:575198887508:web:a720bb543741f40ceb77c1",
  measurementId: "G-JTM50C3B0B"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let currentIndex = "";

function montrerAlert(message, className, inputElement) {
  const div = document.createElement("div");
  div.className = `alert alert-${className}`;
  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".mss");
  container.insertBefore(div, container.firstChild);
  setTimeout(() => div.remove(), 5000);

  if (inputElement) {
    // Mettre le focus sur le champ en erreur
    inputElement.focus();
  }
}

// Effacer les données
function effacerDonnees() {
  document.querySelector("#libelle").value = "";
  document.querySelector("#categorie").value = "";
  document.querySelector("#description").value = "";
  currentIndex = "";
}

// la fonction pour ajouter ou modifier une idée
document.querySelector('#idee-formulaire').addEventListener("submit", (e) => {
  e.preventDefault();

  const libelle = document.querySelector("#libelle").value;
  const description = document.querySelector("#description").value;
  const categorie = document.querySelector("#categorie").value;
  const status = "en attente";
  let compteurValidation = 0;

  // Validation de la description
  if (description.length > 255 || description.length <= 5) {
    montrerAlert('La description doit contenir entre 5 et 255 caractères', 'danger', document.querySelector("#description"));
  } else {
    compteurValidation++;
  }
  // Validation de la catégorie
  if (categorie.trim() === "") {
    montrerAlert('La catégorie ne doit pas être vide', 'danger', document.querySelector("#categorie"));
  } else {
    compteurValidation++;
  }
  // Validation du libellé
  if (libelle.length <= 7 || !/^[a-zA-Z ]+$/.test(libelle)) {
    montrerAlert('Le titre doit contenir plus de 7 lettres et être composé uniquement de lettres', 'danger', document.querySelector("#libelle"));
  } else {
    compteurValidation++;
  }

  if (compteurValidation < 3) {
    montrerAlert('Veuillez remplir correctement tous les champs', 'dark');
  } else {
    if (currentIndex === "") {
      // Ajout des données dans Firebase
      const nouvelleIdeeRef = db.ref('idees').push();
      nouvelleIdeeRef.set({
        libelle: libelle,
        categorie: categorie,
        description: description,
        status: status
      })
      .then(() => {
        montrerAlert("L'ajout d'idée a réussi", 'success');
        afficheridees();
        document.getElementById("idee-formulaire").reset();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout:", error);
      });
      effacerDonnees();
    } else {
      // Modification des données dans Firebase
      const changerIdee = db.ref('idees').child(currentIndex);
      changerIdee.update({
        libelle: libelle,
        categorie: categorie,
        description: description,
        status: status
      }).then(() => {
        montrerAlert("Modification d'idée a réussi", 'success');
        afficheridees();
        document.getElementById("idee-formulaire").reset();
      }).catch((error) => {
        console.error("Erreur lors de la modification:", error);
      });
      effacerDonnees();
    }
  }
});



// Fonction pour changer les détails d'une idée
function changementIdee(index) {
  db.ref('idees').child(index).once('value')
    .then((snapshot) => {
      const voirIdee = snapshot.val();
      document.querySelector("#libelle").value = voirIdee.libelle;
      document.querySelector("#description").value = voirIdee.description;
      document.querySelector("#categorie").value = voirIdee.categorie;
      currentIndex = index;
    });
}

// Fonction pour afficher les idées
function afficheridees() {
  const listIdees = document.querySelector("#allIdee");
  listIdees.innerHTML = '';  // Efface les idées existantes
  db.ref('idees').once("value")
    .then((snapshot) => {
      const voirIdee = snapshot.val();

      if (voirIdee) {
        Object.keys(voirIdee).forEach((key) => {
          const idee = voirIdee[key];
          const { libelle, categorie, description, status } = idee;
          // Création de la structure HTML pour chaque idée
          const ideeHTML = `
            <div class="col-4 rounded-2" style="border: 0.15rem solid rgb(51, 64, 138); width: 30%;" data-index="${key}">
              <div class="card">
                <div class="card-header d-flex flex-wrap text-light" style="background: rgb(51, 64, 138)">
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
              <div class="d-flex justify-content-between bg-light p-2 forget">
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <a href="#" class="btn btn-success btn-sm approve" onclick="approuverIdee(this)">Approuver</a>
                  <a href="#" class="btn btn-danger btn-sm disapprove" onclick="desapprouverIdee(this)">Désapprouver</a>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <a href="#" class="edit" onclick="changementIdee('${key}')"><i class="fa-solid fa-pen-to-square" style="font-size: 1.8rem; color: rgb(212, 212, 14);"></i></a>
                  <a href="#" class="delete" onclick="supprimerIdee('${key}')"><i class="fa-solid fa-trash-can" style="font-size: 1.8rem; color: rgb(212, 50, 14);"></i></a>
                </div>
              </div>
            </div>
          `;
          // Ajout de l'idée à la liste
          listIdees.innerHTML += ideeHTML;
          // Sélection des éléments récemment ajoutés
          const cardContainer = listIdees.querySelector(`[data-index="${key}"]`);
          const statusBadge = cardContainer.querySelector('.badge');
          const statusapprove = cardContainer.querySelector('.approve');
          const statusdisapprove = cardContainer.querySelector('.disapprove');
          const couleurTitre = cardContainer.querySelector('.card-header');
          // Met à jour le badge de statut et les boutons en fonction de l'état de l'idée
          switch (status) {
            case 'Approuvée':
              statusBadge.textContent = "Approuvée";
              statusBadge.classList.remove("bg-secondary");
              statusBadge.classList.add('bg-success');
              cardContainer.style.borderColor = 'green';
              statusapprove.style.display = 'none'; // Cache le bouton Approuver
              statusdisapprove.style.display = 'none'; // Cache le bouton Désapprouver
              couleurTitre.classList.add('bg-success');
              break;
            case 'Désapprouvée':
              statusBadge.textContent = "Désapprouvée";
              statusBadge.classList.remove("bg-secondary");
              statusBadge.classList.add('bg-danger');
              cardContainer.style.borderColor = 'red';
              statusapprove.style.display = 'none'; // Cache le bouton Approuver
              statusdisapprove.style.display = 'none'; // Cache le bouton Désapprouver
              couleurTitre.classList.add('bg-danger');
              break;
            default:
              break;
          }
        });
      } else {
        console.log("Aucune idée trouvée dans la base de données.");
      }
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des idées depuis Firebase:", error);
    });
}

// Fonction pour supprimer une idée
function supprimerIdee(index) {
  db.ref('idees').child(index).remove()
    .then(() => {
      montrerAlert("L'idée a été supprimée", 'success');
      afficheridees();
      document.getElementById("idee-formulaire").reset();
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de l'idée:", error);
    });
}

// Fonction pour approuver une idée
function approuverIdee(element) {
  const cardContainer = element.closest('[data-index]');
  const index = cardContainer.dataset.index;
  const changerIdee = db.ref('idees').child(index);
  changerIdee.update({
    status: "Approuvée"
  }).then(() => {
    montrerAlert("L'idée a été approuvée", 'success');
    afficheridees();
    document.getElementById("idee-formulaire").reset();
  }).catch((error) => {
    console.error("Erreur lors de l'approbation de l'idée:", error);
  });
}

// Fonction pour désapprouver une idée
function desapprouverIdee(element) {
  const cardContainer = element.closest('[data-index]');
  const index = cardContainer.dataset.index;
  const changerIdee = db.ref('idees').child(index);
  changerIdee.update({
    status: "Désapprouvée"
  }).then(() => {
    montrerAlert("L'idée a été désapprouvée", 'success');
    afficheridees();
    document.getElementById("idee-formulaire").reset();
  }).catch((error) => {
    console.error("Erreur lors de la désapprobation de l'idée:", error);
  });
}

// Appel de la fonction afficheridees au chargement de la page
afficheridees();
