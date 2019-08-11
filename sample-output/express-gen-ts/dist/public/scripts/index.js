/******************************************************************************
 *                          Fetch and display users
 ******************************************************************************/

displayUsers();


function displayUsers() {
    httpGet('/api/users/all')
        .then(response => response.json())
        .then((response) => {
            var allUsers = response.users;
            // Empty the anchor
            let allUsersAnchor = document.getElementById('all-users-anchor');
            allUsersAnchor.innerHTML = '';
            // Append users to anchor
            allUsers.forEach((user) => {
                allUsersAnchor.innerHTML += getUserDisplayEle(user);
            });
        });
};


function getUserDisplayEle(user) {
    return `<div class="user-display-ele">

        <div class="normal-view">
            <div>Name: ${user.name}</div>
            <div>Email: ${user.email}</div>
            <button class="edit-user-btn" data-user-id="${user.id}">
                Edit
            </button>
            <button class="delete-user-btn" data-user-id="${user.id}">
                Delete
            </button>
        </div>
        
        <div class="edit-view">
            <div>
                Name: <input class="name-edit-input" value="${user.name}">
            </div>
            <div>
                Email: <input class="email-edit-input" value="${user.email}">
            </div>
            <button class="submit-edit-btn" data-user-id="${user.id}">
                Submit
            </button>
            <button class="cancel-edit-btn" data-user-id="${user.id}">
                Cancel
            </button>
        </div>
    </div>`;
}


/******************************************************************************
 *                        Add, Edit, and Delete Users
 ******************************************************************************/

document.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.matches('#add-user-btn')) {
        addUser();
    } else if (event.target.matches('.edit-user-btn')) {
        showEditView();
    } else if (event.target.matches('.cancel-edit-btn')) {
        cancelEdit();
    } else if (event.target.matches('.submit-edit-btn')) {
        submitEdit();
    } else if (event.target.matches('.delete-user-btn')) {
        deleteUser();
    }
}, false)


function addUser() {
    var nameInput = document.getElementById('name-input');
    var emailInput = document.getElementById('email-input');
    var data = {
        user: {
            name: nameInput.value,
            email: emailInput.value
        },
    };
    httpPost('/api/users/add', data)
        .then(() => {
            displayUsers();
        })
}


function showEditView() {
    var userEle = event.target.parentNode.parentNode;
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'none';
    editView.style.display = 'block';
}


function cancelEdit() {
    var userEle = event.target.parentNode.parentNode;
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'block';
    editView.style.display = 'none';
}


function submitEdit() {
    var userEle = event.target.parentNode.parentNode;
    var nameInput = userEle.getElementsByClassName('name-edit-input')[0];
    var emailInput = userEle.getElementsByClassName('email-edit-input')[0];
    var id = event.target.getAttribute('data-user-id');
    var data = {
        user: {
            name: nameInput.value,
            email: emailInput.value,
            id: id
        }
    };
	httpPut('/api/users/update', data)
        .then(() => {
            displayUsers();
        })
}


function deleteUser() {
    var id = event.target.getAttribute('data-user-id');
	httpDelete('/api/users/delete/' + id)
        .then(() => {
            displayUsers();
        })
}


function httpGet(path) {
    return fetch(path, getOptions('GET'))
}


function httpPost(path, data) {
    return fetch(path, getOptions('POST', data));
}


function httpPut(path, data) {
    return fetch(path, getOptions('PUT', data));
}


function httpDelete(path) {
    return fetch(path, getOptions('DELETE'));
}


function getOptions(verb, data) {
    var options = {
        dataType: 'json',
        method: verb,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    return options;
}
