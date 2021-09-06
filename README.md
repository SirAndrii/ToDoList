# ToDoList with multilists based on localstorage
Beatiful ToDo tasker writed on JS for summer SoftServe JS Core courses. Used glassmorphism design.
![alt text](https://github.com/SirAndrii/ToDoList/blob/44cf8708b99f143d78a4b4e8bc1952b7ed3701d1/demo2.jpg)

## What it can do
 - creates new list and immediatly change DOM to show it
 - abbility to delete one task or whole list.
 - creates new tasks that can be endless or have deadlines  
 - check for empty data in inputs, empty fields hidden are animated
 - show all tasks 
 - show tasks by list
 - filter tasks by condition (time,completance,name)
 - sort tasks


![alt text](https://github.com/SirAndrii/ToDoList/blob/44cf8708b99f143d78a4b4e8bc1952b7ed3701d1/demo1.JPG)



### To create demo localstorage object put this code in console.
```javascript
let testTODO = {"bugs":"[{\"name\":\"undefined list created\",\"date\":null,\"completed\":true},{\"name\":\"tasks don't shown visually if task previously had no tasks\",\"date\":null,\"completed\":true},{\"name\":\"Hi\",\"date\":\"2021-09-02\",\"completed\":true},{\"name\":\"uncomplete\",\"date\":false,\"completed\":false}]","Graphic":"[{\"name\":\"Add glassmorphism style\",\"date\":null,\"completed\":true},{\"name\":\"make button expands effect\",\"date\":null,\"completed\":true},{\"name\":\"add Date icon\",\"date\":null,\"completed\":true}]","Watched Films":"[{\"name\":\"Iron man\",\"date\":false,\"completed\":false},{\"name\":\"Iron man 2 \",\"date\":\"2010-10-10\",\"completed\":true},{\"name\":\"Iron Man 3 \",\"date\":\"2013-10-10\",\"completed\":true},{\"name\":\"Halk 1\",\"date\":\"2008-10-10\",\"completed\":false},{\"name\":\"Gardian of the Galaxy 1\",\"date\":false,\"completed\":true},{\"name\":\"Gardian of the Galaxy 2\",\"date\":false,\"completed\":true},{\"name\":\"Gardian of the galaxy 3\",\"date\":\"2023-12-10\",\"completed\":false},{\"name\":\"Eternals\",\"date\":\"2021-09-20\",\"completed\":false},{\"name\":\"Spider man\",\"date\":\"2020-10-10\",\"completed\":false}]","methods":"[{\"name\":\"Sort by date\",\"date\":null,\"completed\":false},{\"name\":\"Hide completed\",\"date\":null,\"completed\":false},{\"name\":\"sort by complete\",\"date\":null,\"completed\":false},{\"name\":\"remove list\",\"date\":null,\"completed\":true},{\"name\":\"Date optional\",\"date\":null,\"completed\":true},{\"name\":\"show task after add\",\"date\":null,\"completed\":true},null]","default":"[{\"name\":\"add task\",\"date\":null,\"completed\":false},{\"name\":\"test\",\"date\":false,\"completed\":false},{\"name\":\"test undefined Bug\",\"date\":false,\"completed\":false}]"};Object.keys(data).forEach(function (k){localStorage.setItem(k, data[k]);});
let data = JSON.parse(testTODO);
Object.keys(data).forEach(function (k) {
  localStorage.setItem(k, data[k]);
});

```

