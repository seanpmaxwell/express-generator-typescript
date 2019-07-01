/**
 * Get users
 */
displayUsers();

/**
 * Add User
 */
document.addEventListener('click', function (event) {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('#add-user-btn')) return;

	// Don't follow the link
	event.preventDefault();

	// Setup data
	let user = {
	    name: (document.getElementById('name-input').value),
        email: (document.getElementById('email-input').value)
    };

	HttpPost('/api/users/add', user)
        .then(() => {
            displayUsers();
        })

}, false);

/**
 * Update User
 */
document.addEventListener('click', function (event) {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('.edit-user-btn')) return;

	// Don't follow the link
	event.preventDefault();

	// Get display/edit divs
	let userEle = event.target.parentNode.parentNode; // pick up here
    let normalView = userEle.getElementsByClassName('normal-view')[0];
    let editView = userEle.getElementsByClassName('edit-view')[0];

    normalView.style.display = 'none';
    editView.style.display = 'block';

	// Setup data
	// let newVals = {
	//     name: (document.getElementById('name-input').value),
    //     email: (document.getElementById('email-input').value)
    // };

	HttpPut('/api/users/update', newVals)
        .then(() => {
            displayUsers();
        })

}, false);

/**
 * Delete user
 */
document.addEventListener('click', function (event) {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('.delete-user-btn')) return;

	// Don't follow the link
	event.preventDefault();

	// Get id
    let id = event.target.getAttribute('data-user-id');

	HttpDelete('/api/users/delete/' + id)
        .then(() => {
            displayUsers();
        })

}, false);


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
            <div>Name: <input ></div>
            <div>Email: <input></div>
            <button class="submit-edit-btn" data-user-id="${user.id}">
                Edit
            </button>
            <button class="cancel-edit-btn" data-user-id="${user.id}">
                Delete
            </button>
        </div>
    </div>`;
}

function displayUsers() {
    HttpGet('/api/users/all')
    .then(response => response.json())
    .then((response) => {
        let allUsers = response.users;

        // Empty the anchor
        let allUsersAnchor = document.getElementById('all-users-anchor');
        allUsersAnchor.innerHTML = '';

        // Append users to anchor
        allUsers.forEach((user) => {
            allUsersAnchor.innerHTML += getUserDisplayEle(user);
        });
    });
}

function HttpGet(path) {
    let options = getSharedOptions();
    options.method = 'GET';
    return fetch(path, options)
}

function HttpPost(path, data) {
    let options = getSharedOptions();
    options.method = 'POST';
    options.body = JSON.stringify(data);
    return fetch(path, options)
}

function HttpPut(path, data) {
    let options = getSharedOptions();
    options.method = 'PUT';
    options.body = JSON.stringify(data);
    return fetch(path, options)
}

function HttpDelete(path) {
    let options = getSharedOptions();
    options.method = 'DELETE';
    return fetch(path, options)
}

function getSharedOptions() {
    return {
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
}
