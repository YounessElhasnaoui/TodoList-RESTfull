
// declarations
const newTask = document.getElementById("newTask");
const submitBtn = document.getElementById("submit");
const tasks = document.getElementById("tasks");
const error = document.getElementById("error-message");
const api = "http://localhost:3000/tasks/";
submitBtn.disabled = true;
error.style.display = "none";

// submit

submitBtn.addEventListener("click", (e) => {
    let task = newTask.value;
    let state = "pending";
    let data = {
        task,
        state
    }
    dataToSend = JSON.stringify(data);
    const ajax = new XMLHttpRequest();
    ajax.open("POST", api, true);
    ajax.setRequestHeader("Content-type", "application/json");
    ajax.addEventListener("load", () => {
        let response = JSON.parse(ajax.response);
        if (response.status == "success") {
            console.log(response.task);
            addTask(response.task);
            newTask.value = "";

        }
        else {
            showError(response.msg);
        }
    }
    );
    ajax.addEventListener("error", () => {
        showError("Something went wrong");

    }
    );
    ajax.send(dataToSend);


});

// error fun

const showError = (msg) => {
    error.style.display = "block";
    error.innerText = msg;
    setTimeout(() => {
        error.innerText = "";
        error.style.display = "none";
    }, 3000);
}


//input listen

newTask.addEventListener("input", (e) => {
    if (newTask.value.length <= 4) {
        error.style.display = "block";
        error.innerText = "task must contains at least 4 caracters";
        return submitBtn.disabled = true;
    }
    else {
        error.style.display = "none";
        error.innerText = "";
        return submitBtn.disabled = false;
    }

}
);


// load fun

const getTasks = () => {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", api, true);
    ajax.addEventListener("load", () => {

        if (ajax.status != 200) return alert("error" + ajax.response);
        let response = JSON.parse(ajax.response);
        for (let task of response) {
            addTask(task);
        }
    }
    );
    ajax.addEventListener("error", () => {
        showError("Something went wrong");
    }
    );
    ajax.send();
}

//load data

getTasks();

// add fun

const addTask = (task) => {
    // creations
    const li = document.createElement("li");
    li.className = "task-item";

    const checkBtn = document.createElement("button");
    checkBtn.className = "check-task-btn";
    checkBtn.innerHTML = "✔";

    const span = document.createElement("span");
    span.classList.add("task-text");
    span.classList.add(task.state);
    span.innerText = task.task;

    const editInput = document.createElement("input");
    editInput.className = "edit-input";
    editInput.type = "text";
    editInput.value = task.task;
    editInput.style.display = "none";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-task-btn";
    editBtn.innerText = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-task-btn";
    deleteBtn.innerText = "Delete";

    const editDiv = document.createElement("div");
    editDiv.className = "edit-actions";
    editDiv.style.display = "none";

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "confirm-edit-btn";
    confirmBtn.innerText = "Confirm";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-edit-btn";
    cancelBtn.innerText = "Cancel";

    editDiv.appendChild(confirmBtn);
    editDiv.appendChild(cancelBtn);

    li.appendChild(checkBtn);
    li.appendChild(span);
    li.appendChild(editInput);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    li.appendChild(editDiv);

    if (task.state == "completed") {
        checkBtn.style.display = "none";
        editBtn.style.display = "none";
    }

    tasks.appendChild(li);


    // check btn

    checkBtn.addEventListener("click", (e) => {

        let data = {
            task: task.task,
            state: "completed"
        }

        const ajax = new XMLHttpRequest();
        ajax.open("PUT", api + task.id, true);
        ajax.setRequestHeader("Content-type", "application/json");
        ajax.addEventListener("load", () => {

            let response = JSON.parse(ajax.response);
            if (response.status == "success") {
                span.classList.remove("pending");
                span.classList.add("completed");
                checkBtn.style.display = "none";
                editBtn.style.display = "none";

            }
            else {
                showError(response.msg);
            }
        }
        );
        ajax.addEventListener("error", () => {
            showError("Something went wrong");
        }
        );
        ajax.send(JSON.stringify(data));
    }
    );

    // edit btn

    editBtn.addEventListener("click", (e) => {
        checkBtn.style.display = "none";
        span.style.display = "none";
        editInput.style.display = "block";

        deleteBtn.style.display = "none";
        editDiv.style.display = "block";
        editBtn.style.display = "none";



    });

    // delete btn

    deleteBtn.addEventListener("click", (e) => {
        const ajax = new XMLHttpRequest();
        ajax.open("DELETE", api + task.id, true);
        ajax.addEventListener("load", () => {
            let response = JSON.parse(ajax.response);
            if (response.status == "success") {
                li.remove();
            }
            else {
                ShowError(response.msg);
            }
        }
        );
        ajax.addEventListener("error", () => {
            ShowError("Something went wrong");
        }
        );
        ajax.send();
    });

    // confirm btn

    confirmBtn.addEventListener("click", (e) => {
        let data = {
            task: editInput.value,
            state: task.state
        }
        const ajax = new XMLHttpRequest();
        ajax.open("PUT", api + task.id, true);
        ajax.setRequestHeader("Content-type", "application/json");
        ajax.addEventListener("load", () => {
            let response = JSON.parse(ajax.response);
            if (response.status == "success") {
                checkBtn.style.display = "inline-block";
                span.innerText = editInput.value;
                span.style.display = "block";
                editInput.style.display = "none";
                editBtn.style.display = "inline-block";
                deleteBtn.style.display = "inline-block";
                editDiv.style.display = "none";
            }
            else {
                showError(response.msg);
            }
        }
        );
        ajax.addEventListener("error", () => {
            showError("Something went wrong");
        }
        );
        ajax.send(JSON.stringify(data));
    });

    // cancel btn

    cancelBtn.addEventListener("click", (e) => {
        checkBtn.style.display = "inline-block";
        span.style.display = "block";
        editInput.style.display = "none";
        editInput.value = task.task;
        editBtn.style.display = "inline-block";
        deleteBtn.style.display = "inline-block";
        editDiv.style.display = "none";
    });
}







