// Connection Variable
let db;

/********************** Section IndexDB **********************/
// Variables
const INDEXDB_CACHE = "transaction_cache"
const INDEXDB_NAME = "budget_tracker_offline"

// We request a database instance.
const request = indexedDB.open(INDEXDB_NAME, 1);


// This returns a result that we can then manipulate.
request.onsuccess = (evt) => {
    // If the DB is created correctly will create an object
    db = evt.target.result;
    // If is online execute the function to upload the information on Index DB
    if (navigator.onLine) {
        uploadCacheInfo();
    }
};

// Check for errores 
request.onerror = (evt) => {
    console.log(evt.target.errorCode);
};

// Check if the IndexDB is been updated
request.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore(INDEXDB_CACHE, { autoIncrement: true });
};


const  uploadCacheInfo= () => {
    // Open the DB and the object to check if there are data there 
    const transaction = db.transaction([INDEXDB_CACHE], 'readwrite');
    const budgetObjectStore = transaction.objectStore(INDEXDB_CACHE);
  
    // Get the Data from IndexDB
    const getAll = budgetObjectStore.getAll();
  
    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
    // Start to send the data to the api if exists
    if (getAll.result.length > 0) {
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // Open the DB and the object
          const transaction = db.transaction([INDEXDB_CACHE], 'readwrite');
          const budgetObjectStore = transaction.objectStore(INDEXDB_CACHE);
          // Clear the store
          budgetObjectStore.clear();

          alert('All Transactions made offline has been submitted !');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}

// This function will save the info on IndexDB
const saveRecord = (record) => {
    // Open IndexDB with the name that we given and open with read -write access
    const transaction = db.transaction([INDEXDB_CACHE], 'readwrite');
  
    //Get the objet
    const budgetObjectStore = transaction.objectStore(INDEXDB_CACHE);
  
    //Save the information into the Object inside the IndexDB on a DB created by ourselves 
    budgetObjectStore.add(record);
};


// Create an event listener to check if is online
window.addEventListener('online', uploadCacheInfo);