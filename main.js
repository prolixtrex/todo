let form = document.getElementById("form");
let title = document.getElementById("title");
let dateInput = document.getElementById("dateInput");
let textArea = document.getElementById("textArea");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let update = document.getElementById("update");
let sort = document.getElementById("sort");
let taskCount = document.getElementById("taskCount")
let data = [];

//modal for confirm delete
let modal = document.getElementById("modal")
let closeModalBtn = document.getElementById("closeModalBtn");
let deleteBtn = document.getElementById("deleteBtn")


//Prevent entering date that has passed
// let today = new Date().toISOString().split("T")[0];
let today = new Date().toLocaleString().split(",")[0].replace(/["/"]/g, "-");
dateInput.setAttribute("min", today);

//adding event listener to the submit button
form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
});

const formValidation = () => {
    acceptData();
    add.setAttribute("data-bs-toggle", "collapse");
    add.setAttribute("data-bs-target", "#collapseExample")
    add.click();

    (() => {
        add.setAttribute("data-bs-toggle", "");
    })();
};

const acceptData = (id) => {
    if (data.find(task => task.id === id)) {
        data.filter(task => task.id === id).map(task => {
            task.text = title.value,
                task.date = dateInput.value,
                task.description = textArea.value
        })

        add.style.display = "block"
        update.style.display = "none"
    } else {
        data = [...data, {
            id: genId(),
            text: title.value,
            date: dateInput.value,
            description: textArea.value
        }]
        resetForm();
    }

    addBadge();
};

const genId = () => {
    const num = Math.floor(Math.random() * 1000)
    const id = data.find(task => task.id === num) ? genId() : parseInt(num)

    return id
}

//add validity badge on the tasks
const addBadge = () => {
    data.map(task => { task.badge = "" })
    data.map(task => {
        task.badge = task.date < today ? "expired" : task.date == today ? "today" : "upcoming"
    })

    console.log(today)

    sortTask();
}

//sort tasks by validity on badge
const sortTask = (badge) => {
    const sorted = (!badge || badge == "all") ? data : data.filter(task => task.badge == badge)
    taskCount.innerHTML = `${sorted.length} task(s)`
    tasks.innerHTML = "";

    //badge bg-color and text color
    const today = `bg-success`
    const upcoming = `bg-info text-dark`
    const expired = `bg-warning text-dark`

    !sorted.length > 0 ? tasks.innerHTML = "No task to display" :
        sorted.map((task) => {
            return (tasks.innerHTML += `
                <div class="card tasks" id="${task.name}">
                    <div class="card-header">
                        <div>
                            <span class="fw-bold">${task.text}</span>
                        </div>
                        <div>
                            <span 
                                class="badge ${task.badge == "today" ? today : task.badge == "upcoming" ? upcoming : expired}"
                            >
                                ${task.badge}
                            </span>
                            <span class="options">
                                <i onClick="editTask(${task.id})" data-bs-toggle="collapse" data-bs-target="#collapseExample" class="fas fa-edit"></i>
                                <i onClick="openModal(${task.id})" class="fas fa-trash-alt"></i>
                            </span>
                        </div>
                    </div>
                    <div class="card-body text-start" onClick="openFull(this)">
                        <span class="small text-secondary">${task.date}</span>
                        <p>${task.description}</p>
                    </div>
                </div>
            `);
        })

    localStorage.setItem("data", JSON.stringify(data));
}


//display tasks by validity
sort.addEventListener("change", () => {
    sortTask(sort.value)
})

const openFull = (e) => {
    e.classList.toggle("open");
}

const deleteTask = (id) => {
    data = data.filter(task => task.id !== id)
    sortTask()
};

const editTask = (id) => {
    add.style.display = "none"
    update.style.display = "block"
    update.setAttribute("data-bs-toggle", "collapse");
    update.setAttribute("data-bs-target", "#collapseExample")

    update.addEventListener("click", (e) => {
        e.preventDefault();
        acceptData(id);
        update.setAttribute("data-bs-toggle", "");
    })
    console.log(id)

    const filtered = data.filter(task => task.id === id)
    title.value = filtered.map(task => task.text)
    dateInput.value = filtered.map(task => task.date)
    textArea.value = filtered.map(task => task.description)
};

const resetForm = () => {
    title.value = "";
    dateInput.value = "";
    textArea.value = "";
}

//modal controls
//open modal
const openModal = (id) => {
    modal.style.display = "block"
    deleteBtn.addEventListener("click", () => {
        deleteTask(id)
        modal.style.display = "none"
    })
}

//close modal
closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none"
});

//close modal when clicked outside 
window.addEventListener("click", (e) => {
    if (e.target == modal) {
        modal.style.display = "none"
    }
});


(() => {
    data = JSON.parse(localStorage.getItem("data")) || [];
    addBadge();
})();
