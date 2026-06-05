let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

let links =
JSON.parse(localStorage.getItem("links")) || [];


// CLOCK

function updateClock(){

    const now = new Date();

    document.getElementById("clock")
    .textContent =
    now.toLocaleTimeString();

    document.getElementById("date")
    .textContent =
    now.toDateString();

    let greeting = "";

    const hour = now.getHours();

    if(hour < 12){
        greeting = "Good Morning";
    }
    else if(hour < 17){
        greeting = "Good Afternoon";
    }
    else{
        greeting = "Good Evening";
    }

    const username =
    localStorage.getItem("username")
    || "Guest";

    document.getElementById("greeting")
    .textContent =
    `${greeting}, ${username} 👋`;
}

setInterval(updateClock,1000);
updateClock();


// NAME

function saveName(){

    const name =
    document.getElementById("username")
    .value
    .trim();

    if(!name) return;

    localStorage.setItem(
        "username",
        name
    );

    updateClock();
}


// TIMER

let time = 1500;
let timer = null;

function updateTimer(){

    const minutes =
    Math.floor(time / 60);

    const seconds =
    time % 60;

    document.getElementById("timer")
    .textContent =
    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function startTimer(){

    if(timer) return;

    timer = setInterval(()=>{

        if(time > 0){

            time--;
            updateTimer();

        }

    },1000);
}

function stopTimer(){

    clearInterval(timer);
    timer = null;
}

function resetTimer(){

    stopTimer();

    time = 1500;

    updateTimer();
}

updateTimer();


// TASKS

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function addTask(){

    const input =
    document.getElementById("taskInput");

    const text =
    input.value.trim();

    if(!text) return;

    if(tasks.some(
        task =>
        task.text.toLowerCase()
        === text.toLowerCase()
    )){
        alert("Task already exists!");
        return;
    }

    tasks.push({
        text:text,
        completed:false
    });

    input.value = "";

    saveTasks();

    renderTasks();
}

function renderTasks(){

    const list =
    document.getElementById("taskList");

    list.innerHTML = "";

    tasks.forEach((task,index)=>{

        const li =
        document.createElement("li");

        li.innerHTML = `

        <div class="task-left">

            <input
            type="checkbox"
            ${task.completed ? "checked" : ""}
            onchange="toggleTask(${index})">

            <span class="${
                task.completed
                ? "completed"
                : ""
            }">

            ${task.text}

            </span>

        </div>

        <div class="task-actions">

            <button onclick="editTask(${index})">
                ✏️
            </button>

            <button onclick="deleteTask(${index})">
                🗑️
            </button>

        </div>
        `;

        list.appendChild(li);
    });
}

function toggleTask(index){

    tasks[index].completed =
    !tasks[index].completed;

    saveTasks();

    renderTasks();
}

function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();

    renderTasks();
}

function editTask(index){

    const updated =
    prompt(
        "Edit task",
        tasks[index].text
    );

    if(updated){

        tasks[index].text =
        updated;

        saveTasks();

        renderTasks();
    }
}

function sortTasks(){

    const value =
    document.getElementById("sortSelect")
    .value;

    if(value === "pending"){
        tasks.sort(
            (a,b)=>
            a.completed-b.completed
        );
    }

    if(value === "completed"){
        tasks.sort(
            (a,b)=>
            b.completed-a.completed
        );
    }

    if(value === "az"){
        tasks.sort(
            (a,b)=>
            a.text.localeCompare(b.text)
        );
    }

    if(value === "za"){
        tasks.sort(
            (a,b)=>
            b.text.localeCompare(a.text)
        );
    }

    renderTasks();
}

renderTasks();


// LINKS

function saveLinks(){

    localStorage.setItem(
        "links",
        JSON.stringify(links)
    );
}

function addLink(){

    const name =
    document.getElementById("linkName")
    .value;

    const url =
    document.getElementById("linkUrl")
    .value;

    if(!name || !url) return;

    links.push({
        name,
        url
    });

    saveLinks();

    renderLinks();

    document.getElementById("linkName").value="";
    document.getElementById("linkUrl").value="";
}

function renderLinks(){

    const container =
    document.getElementById("linksContainer");

    container.innerHTML = "";

    links.forEach((link,index)=>{

        container.innerHTML += `

        <div class="link-item">

            <a
            href="${link.url}"
            target="_blank"
            class="link-btn">

            ${link.name}

            </a>

            <button
            onclick="deleteLink(${index})">

            ✕
            </button>

        </div>
        `;
    });
}

function deleteLink(index){

    links.splice(index,1);

    saveLinks();

    renderLinks();
}

renderLinks();


// THEME

const themeToggle =
document.getElementById("themeToggle");

themeToggle.onclick = ()=>{

    document.body
    .classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body
        .classList
        .contains("dark")
    );
};

if(
localStorage.getItem("theme")
=== "true"
){
    document.body.classList.add("dark");
}