// Create an array that holds the todo items
let todoItems = [];

// Function to create new todo items and add to the webpage
function renderTodo(todo) {
  // Store todo items into browser storage
  localStorage.setItem("todoItems", JSON.stringify(todoItems));

  // Get reference of required elements
  const list = document.querySelector(".js-todo-list");
  const item = document.querySelector(`[data-key='${todo.id}']`);

  // Runs a check for deleted todo items and updates the DOM
  if (todo.deleted) {
    item.remove();
    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }

  // Evaluate the done state of the todo item
  const isChecked = todo.checked ? "done" : "";
  // Create a list item that would hold each todo entry
  const listItemElement = document.createElement("li");
  // Set class and data-key attribute to the todo entry
  listItemElement.setAttribute("class", `todo-item ${isChecked}`);
  listItemElement.setAttribute("data-key", todo.id);
  //Populate the todo entry with required values
  listItemElement.innerHTML = `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    &times;
    </button>
  `;

  // Runs the condition to append the created item to the page
  if (item) {
    list.replaceChild(listItemElement, item);
  } else {
    list.append(listItemElement);
  }
}

// Define function to create a new todo entry
function addTodo(text) {
  // Define todo entry object structure
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };

  // Add new todo entry to the array collection
  todoItems.push(todo);
  // Trigger page update by invoking the renderTodo function
  renderTodo(todo);
}

// Get reference of todo entry form
const form = document.querySelector(".js-form");
// Bind an event listener on form submit
form.addEventListener("submit", (event) => {
  // Prevent default behaviour of form submission
  event.preventDefault();
  // Get reference on the input element
  const input = document.querySelector(".js-todo-input");
  // Remove whitespace on both ends of a todo entry string
  const text = input.value.trim();
  // Check for empty value and create todo item
  if (text !== "") {
    // Invoke addTodo function to commit change
    addTodo(text);
    // Reset the value of the input element
    input.value = "";
    // Set focus to the input element
    input.focus();
  }
});

// Define function to toggle the done state of a todo entry
function toggleDone(key) {
  // Retrieve the index of the todo entry in the collection
  const index = todoItems.findIndex((item) => item.id === Number(key));
  // Toggle the checked attribute value of the todo entry
  todoItems[index].checked = !todoItems[index].checked;
  // Trigger page update by invoking the renderTodo function
  renderTodo(todoItems[index]);
}

// Define function to delete a todo entry
function deleteTodo(key) {
  // Retrieve the index of the todo entry in the collection
  const index = todoItems.findIndex((item) => item.id === Number(key));
  // Set delete attribute to true for the todo entry
  const todo = {
    deleted: true,
    ...todoItems[index],
  };
  todoItems = todoItems.filter((item) => item.id !== Number(key));
  // Trigger page update by invoking the renderTodo function
  renderTodo(todo);
}

// Get reference to ul Element
const list = document.querySelector(".js-todo-list");
// Bind click event listener to ul Element
list.addEventListener("click", (event) => {
  // Traverse the DOM to check for class Name "js-tick" and invoke the toggled done function if check returns true
  if (event.target.classList.contains("js-tick")) {
    // Retrieve the data-key attribute value
    const itemKey = event.target.parentElement.dataset.key;
    // Invoke toggleDone function to update todo entry state
    toggleDone(itemKey);
  }

  // Traverse the DOM to check for class Name "js-delete-todo" and invoke the deleteTodo function if check returns true
  if (event.target.classList.contains("js-delete-todo")) {
    // Retrieve the data-key attribute value
    const itemKey = event.target.parentElement.dataset.key;
    // Invoke deleteTodo function to delete a todo entry
    deleteTodo(itemKey);
  }
});

// Bind event listener of DOMContentLoaded to document object
document.addEventListener("DOMContentLoaded", () => {
  // Get stored todo entries from browser local storage
  const ref = localStorage.getItem("todoItems");
  // Check that we have entries in the local storage
  if (ref) {
    // Convert todo entries to an array collection
    todoItems = JSON.parse(ref);
    // Iterate through the collection and update the webpage
    todoItems.forEach((t) => {
      renderTodo(t);
    });
  }
});
