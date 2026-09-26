// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

// Start
displayUsers();

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Call api
 */
function displayUsers() {
  Http.get('/api/users/all')
    .then(checkResponse)
    .then((resp) => resp.json())
    .then((resp) => {
      const allUsersAnchor = document.getElementById('all-users-anchor');
      allUsersAnchor.innerHTML = renderUsers(resp.users);
    })
    .catch(showError);
}

// Setup event listener for button click
document.addEventListener('click', (event) => {
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
  }
});

/**
 * Add a new user.
 */
function addUser() {
  var nameInput = document.getElementById('name-input');
  var emailInput = document.getElementById('email-input');
  if (!nameInput.value || !emailInput.value) {
    return;
  }
  var data = {
    user: {
      name: nameInput.value,
      email: emailInput.value,
    },
  };
  Http.post('/api/users/add', data)
    .then(checkResponse)
    .then(() => {
      nameInput.value = '';
      emailInput.value = '';
      displayUsers();
    })
    .catch(showError);
}

/**
 * Show edit view.
 */
function showEditView(userEle) {
  var normalView = userEle.getElementsByClassName('normal-view')[0];
  var editView = userEle.getElementsByClassName('edit-view')[0];
  normalView.style.display = 'none';
  editView.style.display = 'block';
}

/**
 * Cancel edit.
 */
function cancelEdit(userEle) {
  var normalView = userEle.getElementsByClassName('normal-view')[0];
  var editView = userEle.getElementsByClassName('edit-view')[0];
  normalView.style.display = 'block';
  editView.style.display = 'none';
}

/**
 * Submit edit.
 */
function submitEdit(ele) {
  var userEle = ele.parentNode.parentNode;
  var nameInput = userEle.getElementsByClassName('name-edit-input')[0];
  var emailInput = userEle.getElementsByClassName('email-edit-input')[0];
  if (!nameInput.value || !emailInput.value) {
    return;
  }
  var data = {
    user: {
      id: ele.getAttribute('data-user-id'),
      name: nameInput.value,
      email: emailInput.value,
      created: ele.getAttribute('data-user-created'),
    },
  };
  Http.put('/api/users/update', data)
    .then(checkResponse)
    .then(() => displayUsers())
    .catch(showError);
}

/**
 * Delete a user
 */
function deleteUser(ele) {
  var id = ele.getAttribute('data-user-id');
  Http.delete('/api/users/delete?id=' + encodeURIComponent(id))
    .then(checkResponse)
    .then(() => displayUsers())
    .catch(showError);
}

/**
 * Reject non-2xx responses with the server's error message.
 */
function checkResponse(resp) {
  if (resp.ok) {
    return resp;
  }
  return resp
    .json()
    .catch(() => ({}))
    .then((body) => {
      throw new Error(body.error || 'Request failed: ' + resp.status);
    });
}

/**
 * Surface a failed request to the user.
 */
function showError(err) {
  alert(err.message);
}
