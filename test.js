function showTasks(selected){
    console.log(selected ,'==>', JSON.parse(localStorage.getItem ( selected )) )

    if ( selected = "" || localStorage.getItem(selected).length==0 ) {
        return
    }
    //очистить текущие рузльтаты
    document.querySelector('.notification__list > div').innerHTML = '';
    document.querySelector('.notification__info').innerHTML = '';

    let ololo = JSON.parse(localStorage.getItem ( selected ));
    
    
    for (let obj of ololo){
        document.querySelector('.notification__list > div').insertAdjacentHTML('beforeend', `
        <div class="notification__item">
            <div>${obj.date} - ${obj.name}</div>
            <button data-time="{позиция объекта в массиве}">&times;</button>
        </div>
        `)
    }
}