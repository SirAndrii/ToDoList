let listSelect = document.getElementById('taskList');

/**
 * Create new key (list) in localstorate and call function of creating new option DOM node
 * @param {*} id 
 * @returns 
 */
function newId(id) {
    if (id in localStorage) {
        infoMessage("This list has been added to storage already. Use another name.");
        return;
    }
    localStorage.setItem(id, ""); //create new id in localStorage
    createList(id);

    new InfoMessage('List name was added successfully').alert;
}

/**
 * Saves new task as object in Array to localstorage and calls function showOneTask() to create DOM node
 * @param {*} id - list name
 * @param {*} name - task name
 * @param {Date,false} date - date
 */
function newTask(id, name, date) {

    if (id == "" || !id) {
        id = "default";
        if (localStorage.length == 0 || !localStorage.getItem(id)) newId(id); //if user didn't create any list - make @default list
    }

    let prevData = [],
        index = 0;
    let newData = {
        name: name,
        date: date,
        completed: false
    };


    if (localStorage.getItem(id) && localStorage.getItem(id).length > 0) {
        prevData = JSON.parse(localStorage.getItem(id));
        index = prevData.length; // get number of arr obj to assign it to delete button
    }
    prevData.push(newData);
    localStorage.setItem(id, JSON.stringify(prevData))

    showOneTask(id, name, date, false, index + 1);
}

/**
 * Create DOM node with task data
 * @param {*} id - list name
 * @param {*} name - task name
 * @param {Date} date - deadline
 * @param {Boolean} completed 
 * @param {Number} index - position in array
 */
function showOneTask(id, name, date, completed, index) {
    document.querySelector('.todo_list > div#tasks').insertAdjacentHTML('beforeend', `
        <div class="todo_item glass ${ completed ? "completed":""}" data-list="${id}" data-list-id="${index}">
            <input type="checkbox" ${ completed ? "checked":""}>
            <div>
                <span class="todo_item_time">${date?date:""}</span>
                <span class="todo_item_text">${name}</span>
                <span class="todo_item_name">(${id})</span>
            </div>
            <button data-delete="delete">&times;</button>
        </div>`);
    document.querySelector('.todo_form input[type="date"]').value = "";
    document.querySelector('.todo_form input[type="text"]').value = "";
}

/*
При смене списка обнулится список задач и будет идти подгрузка со списка
*/
//Построение списка строится на получении 

//alert function
function infoMessage(text) {
    let info = document.querySelector('.todo_info');
    info.textContent = text;
    info.style.opacity = 1;
    setTimeout(() => {
        info.style.opacity = 0
    }, 2000)
    setTimeout(() => {
        info.textContent = ''
    }, 3000);
}
class InfoMessage {

    constructor(text) {
        this.text = text;
        this.info = document.querySelector('.todo_info');
    }

    showInfo() {
        this.info.textContent = this.text;
        this.info.style.opacity = 1;
        setTimeout(() => {
            this.info.style.opacity = 0
        }, 2000)
        setTimeout(() => {
            this.info.textContent = ''
        }, 3000);
    }
    get ok() {
        this.showInfo();
        this.info.className = "todo_info ok";
        //this.info.classList.add("ok")
    }
    get alert() {
        this.showInfo();
        this.info.className = "todo_info bad";
        //this.info.classList.add("bad")
    }
}

/**
 * Creates one List DOM node
 * @param {*} id - list name
 */
function createList(id) {
    let option = document.createElement('option');
    option.textContent = id;
    listSelect.prepend(option);
}

/**
 * Creates DOM nodes of the tasks
 * @param {id} id - list name
 * @callback showOneTask
 */
function showTasks(id, iterrate = "some") {
    if (!id) id = "default";
    if (!Number(iterrate)) document.querySelector('.todo_list > div#tasks').innerHTML = '';

    if (localStorage.getItem(id).length == 0) {
        // if (!iterrate) document.querySelector('.todo_sort').hidden = true;//!bug if show all tasks in lists and last list is empty
        return;
    }
    //if (!iterrate) document.querySelector('.todo_sort').hidden = false; //!bug if show all tasks in lists and last list is empty
    /* console.log(localStorage.getItem(id).length) */
    let tasksList = JSON.parse(localStorage.getItem(id));
    //filter array if there are empty elements after delete (removeEl). 
    if (tasksList.includes(null) || tasksList.includes(undefined)) {
        tasksList = tasksList.filter((el) => el);
        localStorage.setItem(id, JSON.stringify(tasksList));
    }

    for (let [index, obj] of tasksList.entries()) {
        showOneTask(id, obj.name, obj.date, obj.completed, index);
    }
//ВСТАВИТЬ последний елмент в div#tasks и при добавлении нового елемента менять его - ненужно, так как длину берем с локалстораджа и фильтр е' не обрезает
 
}

function shawAllTasks() {
    for (let [index, key] of Object.keys(localStorage).entries()) {
        showTasks(key, index);
    }
}

for (let key of Object.keys(localStorage)) {
    createList(key);
}
/**
 * Listen to click on ADD LIST BUTTON
 * hide and show input
 * @callback newId function
 */
document.getElementById('addList').addEventListener('click', (e) => {
    let neighbour = e.target.previousElementSibling
    if (neighbour.style.width == "0px") {
        neighbour.style.opacity = "1";
        neighbour.style.width = neighbour.dataset.width;
    } else if (neighbour.value.trim() == "") {
        neighbour.style.width = "0px";
        neighbour.style.opacity = "0";
    } else {
        newId(neighbour.value);
        document.getElementById('taskList').value = neighbour.value;
        neighbour.value = "";
        document.querySelector('.todo_list > div#tasks').innerHTML = '';
    }
})

/**
 * Listen to click on ADD TASK BUTTON
 * hide and show input
 * @callback newTask function
 */
document.getElementById('addTask').addEventListener('click',
    (e) => {
        let expand1 = document.getElementById('taskName')
        if (expand1.style.width == "0px") {
            expand1.style.opacity = "1";
            expand1.style.paddingLeft = "5px";
            expand1.style.width = expand1.dataset.width;
            calendarImg.style.display = "";
        } else if (expand1.value.trim() == "") {
            expand1.style.width = "0px";
            expand1.style.opacity = "0";
            expand1.style.paddingLeft = "0px";
            calendarImg.style.display = "none";
            calendar.style.width = "0px";
            calendar.style.opacity = "0";
        } else {
            let idName = document.getElementById('taskList').value;
            let date = document.querySelector('.todo_form input[type="date"]').value
            let message = document.querySelector('.todo_form input[type="text"]').value
            if (!date) {
                date = false;
                infoMessage("Your task was marked as endLess") //if date is empty - set the endless date
            }
            newTask(idName, message, date)
        }
    })
/**
 * Listen to click on SHOW CALENDAR Image
 */
calendarImg.addEventListener('click', (e) => {
    let neighbour = e.target.nextElementSibling
    if (neighbour.style.width == "0px") {
        neighbour.style.opacity = "1";
        neighbour.style.width = neighbour.dataset.width;
    } else if (neighbour.value.trim() == "") {
        neighbour.style.width = "0px";
        neighbour.style.opacity = "0";
    }
})

//checked
function handlerUpdate(event) {
    let parentEl = event.target.parentElement; //first parent element 
    let listName = parentEl.dataset.list;
    let index = parentEl.dataset.listId;
    let tasksList = JSON.parse(localStorage.getItem(listName));
    //checkbox
    if (event.target.type == "checkbox") {
        if (event.target.checked) {
            tasksList[index].completed = true;
            parentEl.className = "todo_item glass completed"
        } else {
            tasksList[index].completed = false;
            parentEl.className = "todo_item glass"
        }
    }
    //delete task. Use delete 'couse there is relation between array index and dom elements order
    if (event.target.dataset.delete == "delete") {
        delete tasksList[index]; //array will be filtered on creation stage!!!
        parentEl.style.opacity = 0;
        parentEl.style.padding = "0px";
        setTimeout(() => parentEl.remove(), 500);
    }

    //edit task
    //save new object to localstorage
    tasksList = JSON.stringify(tasksList);
    localStorage.setItem(listName, tasksList);
}
document.querySelector('.todo_list').addEventListener('click', handlerUpdate);

//onchange option - rebuild (create list)


listSelect.addEventListener('change', (event) => {
    if (listSelect.value == "") {
        document.querySelector("button#delList").style.display = "none";
        shawAllTasks()
        return;
    }
    showTasks(listSelect.value)
    document.querySelector("button#delList").style.display = "";
    showNodes.selectedIndex = 0;
    sortNodes.selectedIndex = 0;
});
//showTasks(listSelect.value)

//showall tasks 
if (listSelect.value == "") {
    document.querySelector("button#delList").style.display = "none";
}

for (let [index, key] of Object.keys(localStorage).entries()) {
    showTasks(key, index);
}
// let selected = select.selectedIndex; Якщо зробити так, то завжди отримаєм 0!!!! 

/**
 * Removes current list and tasks after confirmation.
 */
function removeEl() {
    let select = document.getElementById("taskList");
    let selectArr = select.children;
    if (select.selectedIndex != -1) {
        if (confirm("Delete current list with all tasks?") == true) {

            localStorage.removeItem(select.value);
            selectArr[select.selectedIndex].remove();
            document.querySelector('.todo_list > div#tasks').innerHTML = ""
        }
    }
    //show tasks for next children.
    showTasks(select.value)
}

/**
 * Listen to change of sotr order. 
 * list - dom node, childrens of which will be sort
 */
document.getElementById('sortNodes').addEventListener('change', (event) => {
    let list, sortOption, sortedRows;
    sortOption = event.target.value;
    list = document.getElementById('tasks');
    if (list.children.length < 2) return;

    else if (sortOption == 'default') {
        sortedRows = [...list.children].sort((a, b) => (a.dataset.listId - b.dataset.listId));
    } else if (sortOption == 'completence') {
        sortedRows = [...list.children].sort((a, b) => (a.querySelector('input').checked - b.querySelector('input').checked));
    } else if (sortOption == 'name') {
        sortedRows = [...list.children].sort((a, b) => {
            let aName = a.querySelector('span.todo_item_text').textContent.toUpperCase();
            let bName = b.querySelector('span.todo_item_text').textContent.toUpperCase();
            if (aName > bName) {
                return 1;
            } else if (aName < bName) {
                return -1;
            } else {
                return 0;
            }
        });
    } else if (sortOption == 'date') {
        //! dateformat - 2020-02-19 (monthes are second - in USA format this sting sort won't work)
        sortedRows = [...list.children].sort((a, b) => {
            let aDate = a.querySelector('span.todo_item_time').textContent;
            let bDate = b.querySelector('span.todo_item_time').textContent;
            if (!aDate) aDate = "9999"; //for string compare (endless date)
            if (!bDate) bDate = "9999";

            return aDate == bDate ? 0 : (aDate > bDate ? 1 : -1);
        });
    }
    /* console.log(...sortedRows) */
    list.append(...sortedRows);
});

document.getElementById('showNodes').addEventListener('change', (event) => {
    //clear [revious filter and load results from localstorage
    (listSelect.value == "") ? shawAllTasks(): showTasks(listSelect.value)
    //!!! can't use filter( by some value) method in showTasks 'couse removing and insertion to localstorage is based on array index ID
    //!!! so easiest way is to work with DOM without rebuilding localstorage functions

    let list, sortOption, filteredRows, dateDif;
    sortOption = event.target.value;
    list = document.getElementById('tasks');
    let today = new Date();
    dateDif = function (el) {
        let dateTask = el.querySelector('.todo_item_time').textContent;
        if (!dateTask) return;

        return (new Date(dateTask) - today) / 1000 / 3600 / 24; //return of Date() is in milliseconds
    }
    if (list.children.length == 0) return;

    if (sortOption == 'all') {
        (listSelect.value == "") ? shawAllTasks(): showTasks(listSelect.value)
        return;
    } else if (sortOption == 'completed') {
        filteredRows = [...list.children].filter(el => el.querySelector('input').checked)
    } else if (sortOption == 'uncompleted') {
        filteredRows = [...list.children].filter(el => !el.querySelector('input').checked)
    } else if (sortOption == 'today') {
        filteredRows = [...list.children].filter(el => (
            dateDif(el) > 0 && dateDif(el) < 1))
    } else if (sortOption == 'tomorrow') {
        filteredRows = [...list.children].filter(el => (dateDif(el) > 0 && dateDif(el) < 2))
    } else if (sortOption == 'week') {
        filteredRows = [...list.children].filter(el => (dateDif(el) > 0 && dateDif(el) < 7))
    } else if (sortOption == 'endless') {
        filteredRows = [...list.children].filter(el => !el.querySelector('.todo_item_time').textContent)
    } else if (sortOption == 'missed') {
        filteredRows = [...list.children].filter(el => (dateDif(el) < 0 && !el.querySelector('input').checked))
    }
    list.innerHTML = "";
    list.append(...filteredRows);
    sortNodes.selectedIndex = 0;
});

/**
 * Export and import data from a localstorage
 */
/* copy('var data = '+JSON.stringify(localStorage)+';Object.keys(data).forEach(function (k){localStorage.setItem(k, data[k]);});'); */
/*let testTODO = {"bugs":"[{\"name\":\"undefined list created\",\"date\":null,\"completed\":true},{\"name\":\"tasks don't shown visually if task previously had no tasks\",\"date\":null,\"completed\":true},{\"name\":\"Hi\",\"date\":\"2021-09-02\",\"completed\":true},{\"name\":\"uncomplete\",\"date\":false,\"completed\":false}]","Graphic":"[{\"name\":\"Add glassmorphism style\",\"date\":null,\"completed\":true},{\"name\":\"make button expands effect\",\"date\":null,\"completed\":true},{\"name\":\"add Date icon\",\"date\":null,\"completed\":true}]","Watched Films":"[{\"name\":\"Iron man\",\"date\":false,\"completed\":false},{\"name\":\"Iron man 2 \",\"date\":\"2010-10-10\",\"completed\":true},{\"name\":\"Iron Man 3 \",\"date\":\"2013-10-10\",\"completed\":true},{\"name\":\"Halk 1\",\"date\":\"2008-10-10\",\"completed\":false},{\"name\":\"Gardian of the Galaxy 1\",\"date\":false,\"completed\":true},{\"name\":\"Gardian of the Galaxy 2\",\"date\":false,\"completed\":true},{\"name\":\"Gardian of the galaxy 3\",\"date\":\"2023-12-10\",\"completed\":false},{\"name\":\"Eternals\",\"date\":\"2021-09-20\",\"completed\":false},{\"name\":\"Spider man\",\"date\":\"2020-10-10\",\"completed\":false}]","methods":"[{\"name\":\"Sort by date\",\"date\":null,\"completed\":false},{\"name\":\"Hide completed\",\"date\":null,\"completed\":false},{\"name\":\"sort by complete\",\"date\":null,\"completed\":false},{\"name\":\"remove list\",\"date\":null,\"completed\":true},{\"name\":\"Date optional\",\"date\":null,\"completed\":true},{\"name\":\"show task after add\",\"date\":null,\"completed\":true},null]","default":"[{\"name\":\"add task\",\"date\":null,\"completed\":false},{\"name\":\"test\",\"date\":false,\"completed\":false},{\"name\":\"test undefined Bug\",\"date\":false,\"completed\":false}]"};Object.keys(data).forEach(function (k){localStorage.setItem(k, data[k]);});
let data = JSON.parse(testTODO);
Object.keys(data).forEach(function (k) {
  localStorage.setItem(k, data[k]);
});
*/