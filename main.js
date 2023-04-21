let form = document.getElementById("form");
let title = document.getElementById("title");
let dateInput = document.getElementById("dateInput");
let textArea = document.getElementById("textArea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let sort = document.getElementById("sort");
let data = [];


//Prevent entering date that has passed
let today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

// for (let i = 0; i < taskCard.length; i++) {
//     const element = taskCard[i].children[1].children[0].innerHTML;
//     console.log(element);
// }

//adding event listener to the submit button
form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
});

const formValidation = () => {
    if (title.value === "") {
        msg.innerHTML = "Task cannot be blank";
    } else {
        msg.innerHTML = "";
        acceptData();
        add.setAttribute("data-bs-toggle", "collapse");
        add.setAttribute("data-bs-target", "#collapseExample")
        add.click();

        (() => {
            add.setAttribute("data-bs-toggle", "");
        })();
    }
};

const acceptData = () => {
    data.push({
        text: title.value,
        date: dateInput.value,
        description: textArea.value
    });

    localStorage.setItem("data", JSON.stringify(data));

    createTasks();
};

const createTasks = () => {
    tasks.innerHTML = "";
    let taskCard = document.getElementsByClassName("tasks");
    let badge = "";
    data.map((x, y) => {
        return (tasks.innerHTML += `
        <div class="card tasks" id="${y}">
            <div class="card-header">
                <div>
                    <span class="fw-bold">${x.text}
                </div>
                <div>
                    </span><span class="badge"></span>
                    <span class="options">
                        <i onClick="editTask(this)" data-bs-toggle="collapse" data-bs-target="#collapseExample" class="fas fa-edit"></i>
                        <i onClick="deleteTask(this)" class="fas fa-trash-alt"></i>
                    </span>
                </div>
            </div>
            <div class="card-body" onClick="openFull(this)">
                <span class="small text-secondary">${x.date}</span>
                <p class="text">${x.description}</p>
            </div>
        </div>
        `);
    });

    //display badges on validity of tasks
    for (let i = 0; i < taskCard.length; i++) {
        const element = taskCard[i].children[1].children[0];
        if (element.innerHTML < today) {
            element.parentElement.previousElementSibling.children[1].children[0].innerHTML = "expired";
            element.parentElement.previousElementSibling.children[1].children[0].classList.add("bg-warning", "text-dark");
        } else if (element.innerHTML == today) {
            element.parentElement.previousElementSibling.children[1].children[0].innerHTML = "today";
            element.parentElement.previousElementSibling.children[1].children[0].classList.add("bg-success");
        } else {
            element.parentElement.previousElementSibling.children[1].children[0].innerHTML = "upcoming";
            element.parentElement.previousElementSibling.children[1].children[0].classList.add("bg-info", "text-dark");
        }
    }

    sort.addEventListener("change", () => {
        let taskBadge = document.getElementsByClassName("badge");
        switch (sort.value) {
            case "all":
                for (let i = 0; i < taskBadge.length; i++) {
                    taskBadge[i].parentElement.parentElement.parentElement.style.display = "block";
                }
                break;
            case "expired":
                for (let i = 0; i < taskBadge.length; i++) {
                    taskBadge[i].parentElement.parentElement.parentElement.style.display = "none";
                    if (taskBadge[i].innerHTML == "expired") {
                        taskBadge[i].parentElement.parentElement.parentElement.style.display = "block";
                    }
                }
                break;

            case "today":
                for (let i = 0; i < taskBadge.length; i++) {
                    taskBadge[i].parentElement.parentElement.parentElement.style.display = "none";
                    if (taskBadge[i].innerHTML == "today") {
                        taskBadge[i].parentElement.parentElement.parentElement.style.display = "block";
                    }
                }
                break;
            case "upcoming":
                for (let i = 0; i < taskBadge.length; i++) {
                    taskBadge[i].parentElement.parentElement.parentElement.style.display = "none";
                    if (taskBadge[i].innerHTML == "upcoming") {
                        taskBadge[i].parentElement.parentElement.parentElement.style.display = "block";
                    }
                }
                break;
            default:
                break;
        }
    });

    resetForm();
};



const openFull = (e) => {
    e.classList.toggle("open");
}

const resetForm = () => {
    title.value = "";
    dateInput.value = "";
    textArea.value = "";
}

const deleteTask = (e) => {
    e.parentElement.parentElement.parentElement.parentElement.remove();

    data.splice(e.parentElement.parentElement.parentElement.parentElement.id, 1);

    localStorage.setItem("data", JSON.stringify(data));
};

const editTask = (e) => {
    let selectedTask = e.parentElement.parentElement.parentElement.parentElement;
    title.value = selectedTask.children[0].children[0].children[0].innerHTML;
    dateInput.value = selectedTask.children[1].children[0].innerHTML;
    textArea.value = selectedTask.children[1].children[1].innerHTML;

    deleteTask(e);
};



(() => {
    data = JSON.parse(localStorage.getItem("data")) || [];
    createTasks();
})();
