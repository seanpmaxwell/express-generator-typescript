/******************************************************************************
 *                          Fetch and display users
 ******************************************************************************/

displayUsers();


function displayUsers() {
    Http.Get('/api/users/all')
        .then(response => response.json())
        .then((response) => {
            var allUsers = response.users;
            // Empty the anchor
            var allUsersAnchor = document.getElementById('all-users-anchor');
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
    var ele = event.target;
    if (ele.matches('#add-user-btn')) {
        addUser();
    } else if (ele.matches('.edit-user-btn')) {
        showEditView(ele.parentNode.parentNode);
    } else if (ele.matches('.cancel-edit-btn')) {
        cancelEdit(ele.parentNode.parentNode);
    } else if (ele.matches('.submit-edit-btn')) {
        submitEdit(ele);
    } else if (ele.matches('.delete-user-btn')) {
        deleteUser(ele);
    } else if (ele.matches('#logout-btn')) {
        logoutUser();
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
    Http.Post('/api/users/add', data)
        .then(() => {
            displayUsers();
        })
}


function showEditView(userEle) {
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'none';
    editView.style.display = 'block';
}


function cancelEdit(userEle) {
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'block';
    editView.style.display = 'none';
}


function submitEdit(ele) {
    var userEle = ele.parentNode.parentNode;
    var nameInput = userEle.getElementsByClassName('name-edit-input')[0];
    var emailInput = userEle.getElementsByClassName('email-edit-input')[0];
    var id = ele.getAttribute('data-user-id');
    var data = {
        user: {
            name: nameInput.value,
            email: emailInput.value,
            id: id
        }
    };
	Http.Put('/api/users/update', data)
        .then(() => {
            displayUsers();
        })
}


function deleteUser(ele) {
    var id = ele.getAttribute('data-user-id');
	Http.Delete('/api/users/delete/' + id)
        .then(() => {
            displayUsers();
        })
}

/******************************************************************************
 *                        Add, Edit, and Delete Users
 ******************************************************************************/

function logoutUser() {
    Http.Get('/api/auth/logout')
        .then(() => {
            window.location.href = '/';
        })
}
