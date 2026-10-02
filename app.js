// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDocs, getDoc, updateDoc, deleteDoc }
from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBABmYZSR0Z5zXlpzqOofwWurlZ4ugcVcY",
  authDomain: "todo-list-3ab61.firebaseapp.com",
  projectId: "todo-list-3ab61",
  storageBucket: "todo-list-3ab61.firebasestorage.app",
  messagingSenderId: "1075555551739",
  appId: "1:1075555551739:web:252cbb362f81ec71fae35e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const todosCollectionRef = collection(db, "todos");

const form = document.getElementById("todo-form");
const todoInp = document.getElementById("todo-inp");
const outputDiv = document.getElementById("output");
const btn = document.getElementById("btn");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const obj = {
        title: todoInp.value,
        createdAt: Date.now(),
    };

    addDoc(todosCollectionRef, obj)
        .then((res) => {
            console.log("res", res);
            alert("Added todo");
            todoInp.value = "";
            getTodos();
        })
        .catch((err) => {
            console.log(err);
        });
});

const getTodos = () => {

    outputDiv.innerHTML = "";

    getDocs(todosCollectionRef).then((result) => {

        console.log("all todo data", result);

        result.forEach((item, index) => {

            const todo = item.data();

            console.log("todo", todo);

            const div = document.createElement("div");
            const h4 = document.createElement("h4");
            const editBtn = document.createElement("button");
            const deleteBtn = document.createElement("button");

            h4.innerText = todo.title;

            editBtn.innerText = "Edit";

            editBtn.onclick = () => {
                editFunction(item.id);
            };

            deleteBtn.innerText = "Delete";

            deleteBtn.onclick = () => {
                deleteFunction(item.id);
            };

            div.appendChild(h4);
            div.appendChild(editBtn);
            div.appendChild(deleteBtn);

            outputDiv.appendChild(div);
        });

    }).catch((err) => {
        console.log(err);
    });
};

getTodos();

const editFunction = (id) => {

    console.log("Edit", id);

    const docRef = doc(todosCollectionRef, id);

    getDoc(docRef).then((res) => {

        const singleTodo = res.data();

        console.log("todo to be edited:", singleTodo);

        todoInp.value = singleTodo.title;

        btn.innerText = "Update todo";

        form.onsubmit = (e) => {

            e.preventDefault();

            const obj = {
                title: todoInp.value,
                createdAt: singleTodo.createdAt
            };

            updateDoc(docRef, obj)
                .then((res) => {

                    console.log("res", res);

                    alert("Todo updated");

                    todoInp.value = "";

                    btn.innerText = "Add";

                    form.onsubmit = null;

                    getTodos();

                })
                .catch((err) => {
                    console.log(err);
                });
        };
    });
};

const deleteFunction = (id) => {

    console.log("Delete", id);

    const docRef = doc(todosCollectionRef, id);

    deleteDoc(docRef).then(() => {

        alert("Todo deleted");

        getTodos();

    }).catch((err) => {
        console.log(err);
    });
};