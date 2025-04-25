const API = "https://api-crud-yrvv.onrender.com/api/tutorials";
let body = document.getElementById('tbody');
let inputTitle = document.getElementById('title');
let inputDescription = document.getElementById('content');
let inputPublished = document.getElementById('published');
let btnCreate = document.querySelector('.bCreate');
let isEdit = null;
let valid = document.querySelector('.invalid-feedback')




const rowItem = (listName) => {
  listName.forEach(item => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <p class="fw-bold mb-1">${item.id}</p>
      </td>
      <td>
        <p class="fw-bold mb-1" id="title-row">${item.title}</p>
      </td>
      <td>
        <p class="fw-normal mb-1">${item.description}</p>
      </td>
      <td>
        <span class="badge rounded-pill d-inline">${item.published}</span>
      </td>
      <td>
        <button type="button" class="btn btn-warning btn-rounded btn-sm fw-bold"
          data-mdb-ripple-color="dark" onclick="editData(this)">Edit</button>
        <button type="button" class="btn btn-danger btn-rounded btn-sm fw-bold"
          data-mdb-ripple-color="dark" onclick="deleteData(this)">Delete</button>
      </td>
    `;
    body.appendChild(row);


    let status = row.querySelector("span.badge");
    if (item.published === 1) {
      status.innerText = "Published";
      status.classList.add("badge-success");
    } else {
      status.innerText = "Awaiting";
      status.classList.add("badge-danger");
    }
  });
}

fetch(API)
  .then((response) => response.json())
  .then((listName) => {
    body.innerHTML = "";
    rowItem(listName);

  });


function mainBtn() {
  if (isEdit) {
    let valueStore = inputTitle.value;
    let descriptionStore = inputDescription.value;
    let publishedStore = inputPublished.checked ? 1 : 0;

    fetch(`${API}/${isEdit}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: isEdit,
        title: valueStore,
        description: descriptionStore,
        published: publishedStore
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        location.reload();
      });
    isEdit = null;

  } else {
    createBtn();
  }

  inputTitle.value = "";
  inputDescription.value = "";
  inputPublished.checked = false;
}

// check input value
let isValidate = true;
function checkInput() {
  let valueStore = inputTitle.value;
  let descriptionStore = inputDescription.value;

  if (valueStore === "") {
    inputTitle.classList.add("is-invalid");
    isValidate = false;
  } else {
    inputTitle.classList.remove("is-invalid");
    isValidate = true;
  }
  if(descriptionStore === "") {
    inputDescription.classList.add("is-invalid");
    isValidate = false;
  }else{
    inputDescription.classList.remove("is-invalid");
    isValidate = true;
  }
  return isValidate;

}


function createBtn() {
  event.preventDefault();
  if (checkInput()) {
    let valueStore = inputTitle.value;
    let descriptionStore = inputDescription.value;
    let publishedStore = inputPublished.checked ? 1 : 0;


    fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: valueStore,
        description: descriptionStore,
        published: publishedStore,
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        location.reload();

      })
  }
  return createBtn;
};

function deleteData(btn) {
  let row = btn.parentNode.parentNode;
  let id = row.querySelector("p.fw-bold").innerText;
  // console.log(event)

  fetch(`${API}/${id}`, {
    method: 'DELETE'
  })
    .then((response) => response.json())
    .then(() => {
      location.reload();
    })

  inputTitle.value = "";
  inputDescription.value = "";
  inputPublished.checked = false;

};

function editData(btn) {
  let row = btn.parentNode.parentNode;
  let id = row.querySelector("p.fw-bold").innerText;
  let title = row.querySelector("#title-row").innerText;
  let description = row.querySelector("p.fw-normal").innerText;
  let published = row.querySelector("span.badge").innerText;
  let modalOpen = document.querySelector('.modal');

  let modal = new mdb.Modal(modalOpen);
  modal.show();
  btnCreate.innerText = "Update";

  inputTitle.value = title;
  inputDescription.value = description;
  inputPublished.checked = published;

  fetch(API, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id,
      title: title,
      description: description,
      published: published
    })
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      location.reload();
    })

  isEdit = id;

}

// checked publish data 
function checkPublish() {
  let checkbox = document.getElementById("publishData");
  let showOnlyPublished = checkbox.checked;

  fetch(API)
    .then((response) => response.json())
    .then((listName) => {
      body.innerHTML = "";

      rowItem(listName.filter(item => {
        if (showOnlyPublished && item.published !== 1) return false;
        return true;
      }));

    });
};

function clearData(){
  inputTitle.value = "";
  inputDescription.value = "";
  inputPublished.checked = false;
  btnCreate.innerText = "Create";
  isEdit = null;
  let modalOpen = document.querySelector('.modal');
  let modal = new mdb.Modal(modalOpen);
  modal.hide();
}



