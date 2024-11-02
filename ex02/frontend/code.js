function init() {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Loading todos, please wait...'
    loadTodos()
}

async function loadTodos() {
    // change ip and port if needed
    let response = await fetch('https://todoapp-56zf.onrender.com/todos')
    let todos = await response.json()
    console.log(todos)
    showTodos(todos)
}

function createTodoListItem(todo) {
    // create a new LI element
    let li = document.createElement('li')
    // create a new id attribute
    let li_attr = document.createAttribute('id')
    // add todo id value to attribute
    li_attr.value = todo._id
    // add attribute to LI element
    li.setAttributeNode(li_attr)
    // add a new text node with todo text
    let text = document.createTextNode(todo.text)
    // add text node to LI element
    li.appendChild(text)

    // create a new SPAN element, x chat -> delete todo
    let span1 = document.createElement('span')
    // create a new attribute
    let span1_attr = document.createAttribute('class')
    // add delete value (look css)
    span1_attr.value = 'delete'
    // add attribute to SPAN element
    span1.setAttributeNode(span1_attr)
    // create a text node with x text
    let x = document.createTextNode(' x ')
    // add text node to SPAN element
    span1.appendChild(x)
    // add event listener to SPAN element, onclick event call removeTodo function
    span1.onclick = function() { removeTodo(todo._id) }
    // add SPAN element to LI element
    li.appendChild(span1)

    let span2 = document.createElement('span')
    let span2_attr = document.createAttribute('class')
    span2_attr.value = 'edit'
    span2.setAttributeNode(span2_attr)
    let e = document.createTextNode(' e ')
    span2.appendChild(e)
    span2.onclick = function() { editTodo(todo._id) }
    li.appendChild(span2)

    // return created LI element
    // will be following formula: <li>Call Esa!<span class="remove">x</span></li>
    return li
}

function showTodos(todos) {
    let todosList = document.getElementById('todosList')
    let infoText = document.getElementById('infoText')
    // no todos
    if (todos.length === 0) {
        infoText.innerHTML = 'No Todos'
    } else {
        todos.forEach(todo => {
            let li = createTodoListItem(todo)
            todosList.appendChild(li)
        })
        infoText.innerHTML = ''
    }
}

async function addTodo() {
    let newTodo = document.getElementById('newTodo')
    const data = { 'text': newTodo.value }
    const response = await fetch('https://todoapp-56zf.onrender.com/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    let todo = await response.json()
    let todosList = document.getElementById('todosList')
    let li = createTodoListItem(todo)
    todosList.appendChild(li)

    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    newTodo.value = ''
}

async function removeTodo(id) {
    const response = await fetch('https://todoapp-56zf.onrender.com/todos/'+id, {
        method: 'DELETE'
    })
    let responseJson = await response.json()
    let li = document.getElementById(id)
    li.remove()

    let todosList = document.getElementById('todosList')
    if (!todosList.hasChildNodes()) {
        let infoText = document.getElementById('infoText')
        infoText.innerHTML = 'No Todos'
    }
}

async function editTodo(id) {
    document.getElementById('newTodo').value = document.getElementById(id).firstChild.nodeValue
    let addButton = document.getElementById('addButton')
    addButton.style.backgroundColor = 'yellow'
    addButton.innerHTML = 'save'
    addButton.setAttribute('onclick', "saveTodo('"+id+"')")
}

async function saveTodo(id) {
    let newTodo = document.getElementById('newTodo')
    const data = { 'text': newTodo.value, '_id': id }
    const response = await fetch('https://todoapp-56zf.onrender.com/todos/'+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    let todo = await response.json()
    document.getElementById(todo._id).firstChild.nodeValue = todo.text
    let addButton = document.getElementById('addButton')
    addButton.setAttribute('onclick', "addTodo()")
    addButton.innerHTML = 'Add'
    addButton.style.backgroundColor = ""
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    newTodo.value = ''
}
