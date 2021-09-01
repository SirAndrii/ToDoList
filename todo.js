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

    createList(id); //create new DOM node - option

    new InfoMessage('List name was added successfully').alert;
}

/**
 * Saves new task as object in Array to localstorage and calls function showOneTask() to create DOM node
 * @param {*} id - list name
 * @param {*} name - task name
 * @param {Date} date - date
 */
function newTask(id, name, date) {
    if (id === "") {
        id = "default";
        newId(id);
    } //if user didn't create list script - make @default list

    let prevData = [],
        index = 0;
    let newData = {
        name: name,
        date: date,
        completed: false
    };

    if (localStorage.getItem(id).length > 0) {
        prevData = JSON.parse(localStorage.getItem(id));
        index = prevData.length; // get number of arr obj to assign it to delete button
    }
    prevData.push(newData);
    localStorage.setItem(id, JSON.stringify(prevData))

    showOneTask(id, name, date, false, index + 1);
}

/**
 * Create DOM node with task
 * @param {*} id - list name
 * @param {*} name - task name
 * @param {Date} date - deadline
 * @param {Boolean} completed 
 * @param {Number} index - position in array
 */
function showOneTask(id, name, date, completed, index) {
    document.querySelector('.todo_list > div').insertAdjacentHTML('beforeend', `
        <div class="todo_item ${ completed ? "completed":""}" data-list="${id}" data-list-id="${index}">
            <input type="checkbox" ${ completed ? "checked":""}>
            <div>${date} - ${name} (${id})</div>
            <button data-delete="delete">&times;</button>
        </div>`);
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


function createList(id) {
    let option = document.createElement('option');
    option.textContent = id;
    listSelect.prepend(option);
}


function showTasks(sel) {
    if (sel == "" || localStorage.getItem(sel).length == 0) {
        document.querySelector('.todo_list').hidden = true
        return
    }
    //очистить текущие рузльтаты
    document.querySelector('.todo_list').hidden = false

    document.querySelector('.todo_list > div').innerHTML = '';
    document.querySelector('.todo_info').innerHTML = '';

    let tasksList = JSON.parse(localStorage.getItem(sel));
    //filter array if there are empty elements after delete. 
    if (tasksList.includes(null) || tasksList.includes(undefined)) {
        tasksList = tasksList.filter((el) => el);
        localStorage.setItem(sel, JSON.stringify(tasksList));
    }


    for (let [index, obj] of tasksList.entries()) {
        showOneTask(sel, obj.name, obj.data, obj.completed, index);
    }

    document.querySelector('.todo_form input').value = ''
    document.querySelector('.todo_form textarea').value = ''
}

for (let key of Object.keys(localStorage)) {
    createList(key);
}
//addList 
document.getElementById('addList').addEventListener('click', () => {
    let idName = document.getElementById('new-name').value;
    if (!idName.trim()) {
        //infoMessage("List name mustn't be empty" );
        new InfoMessage("List name mustn't be empty").ok;
        //error.ok;
        return;
    }
    newId(idName);

})

//add new task
document.querySelector('.todo_form button').addEventListener('click',
    function (e) {
        let idName = document.getElementById('taskList').value;
        let date = document.querySelector('.todo_form input').value
        let message = document.querySelector('.todo_form textarea').value

        // лишняя опция

        if (!message.trim()) { //опопвещение об ошибке со скрытием, можно в ООП, так как нужно будет часто.
            infoMessage("Task description must not be empty");
            return;
        }
        if (!date) {
            infoMessage("Your task was marked as endLess") //if date is empty - set the endless date
            date = new Date()
            date.setFullYear(date.getFullYear + 100);
        }

        newTask(idName, message, date)
        //update()
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
            parentEl.className = "todo_item completed"
        } else {
            tasksList[index].completed = false;
            parentEl.className = "todo_item"
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

//очистка списка
document.querySelector('.todo_list > button').addEventListener('click', function () {
    if (localStorage.length && confirm("Clear List?")) {
        localStorage.clear()
        update()
        document.querySelector('.todo_list').hidden = true
    } else if (!localStorage.length) {
        alert('list is empty')
    }
})

//onchange option - rebuild (create list)
//можно добавить сортировку

listSelect.addEventListener('change', (event) => {
    showTasks(listSelect.value)

});
showTasks(listSelect.value)




/* 
function update() {
    if (!localStorage.length) {
        document.querySelector('.todo_list').hidden = true
    } else {
        document.querySelector('.todo_list').hidden = false
    }

    document.querySelector('.todo_list > div').innerHTML = '';
    document.querySelector('.todo_info').innerHTML = '';
    for (let key of Object.keys(localStorage)) {
        document.querySelector('.todo_list > div').insertAdjacentHTML('beforeend', `
            <div class="todo_item">
                <div>${key} - ${localStorage.getItem(key)}</div>
                <button data-time="${key}">&times;</button>
            </div>
            `)
    }

    document.querySelector('.todo_form input').value = ''
    document.querySelector('.todo_form textarea').value = ''
    if (document.querySelector('.audioAlert')) {
        document.querySelector('.audioAlert').remove()
    }
}

//Удаление с localstorage
document.querySelector('.todo_list').addEventListener('click', function (e) {
    if (!e.target.dataset.date) return;
    localStorage.removeItem(e.target.dataset.date)
    update()
})
//сравнение и вывод уведомления.
setInterval(() => {
    let currentDate = new Date();
    let currentHour = currentDate.getHours()
    if (currentHour < 10) currentHour = '0' + currentHour
    let currentMinute = currentDate.getMinutes()
    if (currentMinute < 10) currentMinute = '0' + currentMinute

    let currentTime = currentMinute + ":" + currentMinute

    for (let key of Object.keys(localStorage)) {
        let keyHour = key.split(':')[0]
        let keyMinute = key.split(':')[1]

        if (key == currentTime || (keyHour == currentHour && keyMinute < currentMinute)) {
            document.querySelector(`button[data-time="${key}"]`).closest('.todo_item')
                .classList.add('todo_warning')
        }
        if (!document.querySelector('.audioAlert')) {
            document.querySelector('body').insertAdjacentHTML('afterbegin', '<audio loop class="audioAlert"><source src="../source/alert.mp3" type="audio/mpeg"></audio>')
            document.querySelector('.audioAlert').play()
        }
    }
}, 1000)
update() */