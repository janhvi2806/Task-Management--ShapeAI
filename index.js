const taskContainer = document.querySelector(".task-container");
const searchBar = document.getElementById("searchBar");
const taskModal = document.querySelector(".task-modal-body");
let globalTaskData = [];
const generateHTML = (taskData) =>
  `<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
  <div class="card">
    <div class="card-header d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-outline-info" onclick="editCard.apply(this, arguments)">
        <i class="fal fa-pencil"></i>
      </button>
      <button type="button" class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this, arguments)">
        <i class="far fa-trash" name=${taskData.id}></i>
      </button>
    </div>
    <div class="card-body">
      <img
        src="${taskData.imageurl}"
        alt="image"
        class="card-img"
      />
      <h5 class="card-title mt-3">${taskData.title}</h5>
      <p class="card-text">
        ${taskData.description}
      </p>
      <span class="badge bg-primary mb-3">${taskData.type}</span>
    </div>
    <div class="card-footer">
        <button type="button" class="btn btn-outline-primary" name=${taskData.id} data-bs-toggle ="modal" data-bs-target="#showTask" onclick="openTask.apply(this , arguments)">
          Open Task
        </button>
      </div>
  </div>
</div>`;

const generateModalHTML = (taskData) => {
  const date = new Date(parseInt(`${taskData.id}`));
  return `<div id=${taskData.id}>
  <img src=${taskData.imageurl} alt="Task Image" class="card-img mb-3" />
  <strong class="text-sm text-muted ">Created on ${date.toDateString()}</strong>
  <h2 class="card-title mt-3">${taskData.title}</h2>
  <p class="leadgit ">${taskData.description}</p>
  </div>`;
};

const saveToLocalStorage = function () {
  localStorage.setItem("tasky", JSON.stringify({ card: globalTaskData }));
};

const insertToDOM = function (content) {
  taskContainer.insertAdjacentHTML("beforeend", content);
};

const addNewCard = () => {
  //get Task Data

  const taskData = {
    id: `${Date.now()}`,
    title: document.getElementById("taskTitle").value,
    imageurl: document.getElementById("imageURL").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value,
  };

  globalTaskData.push(taskData);

  console.log(globalTaskData);

  //update the local Storage
  saveToLocalStorage();

  //generate HTML code
  const newCard = generateHTML(taskData);

  //Inject it to DOM
  insertToDOM(newCard);

  //clear the form
  document.getElementById("taskTitle").value = "";
  document.getElementById("imageURL").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("taskDescription").value = "";
};

document.getElementById("sav-changes").addEventListener("click", addNewCard);

const loadExistingCards = function () {
  //check Localstorage
  const getData = localStorage.getItem("tasky");

  //Parse data if Exist
  if (!getData) return;

  const taskCards = JSON.parse(getData);

  globalTaskData = taskCards.card;

  globalTaskData.map(function (taskData) {
    //generate HTML code for those data
    const newCard = generateHTML(taskData);

    //inject to the DOM
    insertToDOM(newCard);
  });

  return;
};

const deleteCard = function (event) {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  const removeTask = globalTaskData.filter(function (taskData) {
    return taskData.id !== targetID;
  });
  globalTaskData = removeTask;
  //update the local Storage
  saveToLocalStorage();

  if (elementType === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  } else {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

const editCard = function (event) {
  // const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  let taskTitle;
  let taskDescription;
  let taskType;
  let parentElement;
  let submitButton;

  if (elementType === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentElement.childNodes[3].childNodes[3];
  taskDescription = parentElement.childNodes[3].childNodes[5];
  taskType = parentElement.childNodes[3].childNodes[7];
  submitButton = parentElement.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.innerHTML = "Save Changes";

  // console.log(parentElement.childNodes[5].childNodes);
  // console.log(taskTitle, taskDescription, taskType);
};

const saveEdit = function (event) {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;
  let taskTitle;
  let taskDescription;
  let taskType;
  let parentElement;

  if (elementType === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentElement.childNodes[3].childNodes[3];
  taskDescription = parentElement.childNodes[3].childNodes[5];
  taskType = parentElement.childNodes[3].childNodes[7];
  submitButton = parentElement.childNodes[5].childNodes[1];

  const updatedData = {
    title: taskTitle.innerHTML,
    type: taskType.innerHTML,
    description: taskDescription.innerHTML,
  };

  const updateGlobalTasks = globalTaskData.map(function (task) {
    if (task.id === targetID) {
      return { ...task, ...updatedData };
    } else {
      return task;
    }
  });

  globalTaskData = updateGlobalTasks;

  saveToLocalStorage();
  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.innerHTML = "Open Task";
};

searchBar.addEventListener("keyup", function (e) {
  if (!e) e = window.event;
  while (taskContainer.firstChild) {
    taskContainer.removeChild(taskContainer.firstChild);
  }
  const searchString = e.target.value;
  // console.log(searchString);
  const filteredCharacters = globalTaskData.filter(function (character) {
    return (
      character.title.toLowerCase().includes(searchString) ||
      character.description.toLowerCase().includes(searchString) ||
      character.type.toLowerCase().includes(searchString)
    );
  });
  filteredCharacters.map(function (cardData) {
    taskContainer.insertAdjacentHTML("beforeend", generateHTML(cardData));
  });
});

const openTask = function (e) {
  const searchId = e.target.getAttribute("name");
  console.log(searchId);

  const getTask = globalTaskData.filter(function (taskData) {
    return taskData.id === searchId;
  });
  // console.log(getTask);
  taskModal.innerHTML = generateModalHTML(getTask[0]);
};
