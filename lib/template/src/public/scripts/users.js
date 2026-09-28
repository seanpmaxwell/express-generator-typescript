// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

displayUsers();
document.addEventListener('click', onDocumentClick);

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Fetch all users and render them into the page.
 *
 * Used by: @EXEC
 *   {@link addUser}
 *   {@link submitEdit}
 *   {@link deleteUser}
 *
 * @returns {void}
 */
function displayUsers() {
  HttpClient.get('/api/users/all')
    .then(checkResponse)
    .then((resp) => resp.json())
    .then((resp) => {
      const allUsersAnchor = document.getElementById('all-users-anchor');
      allUsersAnchor.innerHTML = renderUsers(resp.users);
    })
    .catch(showError);
}

// =========================== `onDocumentClick` =========================== //

/**
 * Route clicks on the page's buttons to their handlers.
 *
 * @listens click
 * @param {MouseEvent} event
 * @returns {void}
 */
function onDocumentClick(event) {
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
}

/**
 * Create a user from the "Add User" form, then refresh the list.
 *
 * Used by: {@link onDocumentClick}
 *
 * @returns {void}
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
  HttpClient.post('/api/users/add', data)
    .then(checkResponse)
    .then(() => {
      nameInput.value = '';
      emailInput.value = '';
      displayUsers();
    })
    .catch(showError);
}

/**
 * Switch a user's row to its edit form.
 *
 * Used by: {@link onDocumentClick}
 *
 * @param {HTMLElement} userEle - The `.user-display-ele` wrapper for the user.
 * @returns {void}
 */
function showEditView(userEle) {
  var normalView = userEle.getElementsByClassName('normal-view')[0];
  var editView = userEle.getElementsByClassName('edit-view')[0];
  normalView.style.display = 'none';
  editView.style.display = 'block';
}

/**
 * Close a user's edit form without saving.
 *
 * Used by: {@link onDocumentClick}
 *
 * @param {HTMLElement} userEle - The `.user-display-ele` wrapper for the user.
 * @returns {void}
 */
function cancelEdit(userEle) {
  var normalView = userEle.getElementsByClassName('normal-view')[0];
  var editView = userEle.getElementsByClassName('edit-view')[0];
  normalView.style.display = 'block';
  editView.style.display = 'none';
}

/**
 * Save a user's edit form, then refresh the list.
 *
 * Used by: {@link onDocumentClick}
 *
 * @param {HTMLElement} ele - The clicked "Submit" button; carries the user's
 *   id and created date in data attributes.
 * @returns {void}
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
  HttpClient.put('/api/users/update', data)
    .then(checkResponse)
    .then(() => displayUsers())
    .catch(showError);
}

/**
 * Delete a user, then refresh the list.
 *
 * Used by: {@link onDocumentClick}
 *
 * @param {HTMLElement} ele - The clicked "Delete" button; carries the user's
 *   id in `data-user-id`.
 * @returns {void}
 */
function deleteUser(ele) {
  var id = ele.getAttribute('data-user-id');
  HttpClient.delete('/api/users/delete/' + encodeURIComponent(id))
    .then(checkResponse)
    .then(() => displayUsers())
    .catch(showError);
}

// ============================= Shared Helpers ============================ //

/**
 * Reject non-2xx responses with the server's error message.
 *
 * Used by:
 *   {@link displayUsers}
 *   {@link addUser}
 *   {@link submitEdit}
 *   {@link deleteUser}
 *
 * @param {Response} resp
 * @returns {Response | Promise<never>} The response when it succeeded.
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
 *
 * Used by:
 *   {@link displayUsers}
 *   {@link addUser}
 *   {@link submitEdit}
 *   {@link deleteUser}
 *
 * @param {Error} err
 * @returns {void}
 */
function showError(err) {
  alert(err.message);
}
