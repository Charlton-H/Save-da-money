// create varaible to hold DB connection
let db;
// establish a connection to IndexedDB database called 'save_money' adn set to version 1
const request = indexedDB.open('save_money',1)

// this event will emit if the database version changes (nonexistant to v1, v1 to v2, etc.)
request.onupgradeneeded = fucntion(event){
    // save a reference to the database
  const db = event.target.result
    // create an object store(table) called 'new_transaction', set it to have an auto incrementing primary key
    db.createObjectStore('new_transaction', { autoIncrement: true });
}