window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;
window.IDBTransaction =
  window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction;
window.IDBKeyRange =
  window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
  alert("your browser not support indexedDB");
} else {
  alert("your browser support indexedDB");
}

var db;
var request = window.indexedDB.open("DBNew", 1);

request.onerror = function (e) {
  alert(e);
};

request.onsuccess = function () {
  db = request.result;
};

request.onupgradeneeded = function (e) {
  db = e.target.result;
  var objectStore = db.createObjectStore("employee", { keyPath: "id" });
};

function Save() {
  var request = db
    .transaction(["employee"], "readwrite")
    .objectStore("employee")
    .add({
      id: document.getElementById("id").value,
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      email: document.getElementById("email").value,
    });
  request.onerror = function (e) {
    alert(
      `unabled to add data ${
        document.getElementById("name").value
      } is already exist`
    );
  };

  request.onsuccess = function () {
    alert(`${document.getElementById("name").value} is successfully added`);
    ReadAll();
  };
}

function Read() {
  var request = db
    .transaction(["employee"])
    .objectStore("employee")
    .get(document.getElementById("id").value);
  request.onerror = function (e) {
    alert(e);
  };
  request.onsuccess = function () {
    if (request.result) {
      alert(`Name : ${request.result.name} , Age : ${request.result.age}`);
    } else {
      alert(`${document.getElementById("id").value} not found`);
    }
  };
}

var tableContent = document.getElementById("tableContent");
var table = document.getElementById("table");

function addStudent(cursor) {
  var idInput = cursor.key;
  var nameInput = cursor.value.name;
  var ageInput = cursor.value.age;
  var emailInput = cursor.value.email;

  var newRow = table.insertRow(-1);
  var idCell = newRow.insertCell(0);
  var nameCell = newRow.insertCell(1);
  var ageCell = newRow.insertCell(2);
  var emailCell = newRow.insertCell(3);

  // idCell.innerHTML = studentId++;
  idCell.innerHTML = idInput;
  nameCell.innerHTML = nameInput;
  ageCell.innerHTML = ageInput;
  emailCell.innerHTML = emailInput;
}

function ReadAll() {
  var tableHeaderRowCount = 1;
  var rowCount = table.rows.length;
  for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount);
  }

  var request = db
    .transaction(["employee"])
    .objectStore("employee")
    .openCursor();
  request.onsuccess = function (e) {
    var cursor = e.target.result;
    if (cursor) {
      addStudent(cursor);
      cursor.continue();
    } else {
    }
  };
}

function Edit() {
  var request = db
    .transaction(["employee"], "readwrite")
    .objectStore("employee")
    .put({
      id: document.getElementById("id").value,
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      email: document.getElementById("email").value,
    });
  request.onerror = function (e) {
    alert(e);
  };

  request.onsuccess = function () {
    alert(`${document.getElementById("name").value} is successfully updated`);
    ReadAll();
  };
}

function DeleteUser() {
  var request = db
    .transaction(["employee"], "readwrite")
    .objectStore("employee")
    .delete(document.getElementById("id").value);

  request.onerror = function (e) {
    alert(e);
  };
  request.onsuccess = function () {
    alert("employee successfully deleted");
    ReadAll();
  };
}
