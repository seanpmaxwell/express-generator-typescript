/******************************************************************************
                                Constants
******************************************************************************/

const DateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatDate = (date) => DateFormatter.format(new Date(date));

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Render users
 */
function renderUsers(users) {
  return users
    .map((user) => {
      return `
        <div class="user-display-ele">
          <div class="normal-view">
            <div><b>Name:</b> ${user.name}</div>
            <div><b>Email:</b> ${user.email}</div>
            <div><b>Created:</b> ${formatDate(user.created)}</div>
            <button
              type="button"
              class="btn btn-primary edit-user-btn"
              data-user-id="${user.id}"
            >
              Edit
            </button>
            <button
              class="btn btn-danger delete-user-btn"
              data-user-id="${user.id}"
            >
              Delete
            </button>
          </div>

          <div class="edit-view">
            <div>
              Name:&nbsp;
              <input
                type="text"
                class="form-control name-edit-input"
                value="${user.name}"
              />
            </div>
            <div class="email-edit">
              Email:&nbsp;
              <input
                type="email"
                class="form-control email-edit-input"
                value="${user.email}"
              />
            </div>
            <button
              class="btn btn-primary submit-edit-btn"
              data-user-id="${user.id}"
              data-user-created="${user.created}"
            >
              Submit
            </button>
            <button
              class="btn btn-secondary cancel-edit-btn"
              data-user-id="${user.id}"
            >
              Cancel
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}