// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const DateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

/**
 * A user record as returned by the API.
 *
 * @typedef {object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} created - ISO 8601 date string.
 */

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Build the HTML for the users list, including each user's edit form.
 *
 * @param {User[]} users
 * @returns {string} HTML to assign to `innerHTML`.
 */
function renderUsers(users) {
  return users
    .map((user) => {
      return `
        <div class="user-display-ele">
          <div class="normal-view">
            <div><b>Name:</b> ${esc(user.name)}</div>
            <div><b>Email:</b> ${esc(user.email)}</div>
            <div><b>Created:</b> ${esc(formatDate(user.created))}</div>
            <button
              type="button"
              class="btn btn-primary edit-user-btn"
              data-user-id="${esc(user.id)}"
            >
              Edit
            </button>
            <button
              class="btn btn-danger delete-user-btn"
              data-user-id="${esc(user.id)}"
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
                value="${esc(user.name)}"
              />
            </div>
            <div class="email-edit">
              Email:&nbsp;
              <input
                type="email"
                class="form-control email-edit-input"
                value="${esc(user.email)}"
              />
            </div>
            <button
              class="btn btn-primary submit-edit-btn"
              data-user-id="${esc(user.id)}"
              data-user-created="${esc(user.created)}"
            >
              Submit
            </button>
            <button
              class="btn btn-secondary cancel-edit-btn"
              data-user-id="${esc(user.id)}"
            >
              Cancel
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

// ================================ Helpers ================================ //

/**
 * Format a date as MM/DD/YYYY.
 *
 * Used by: {@link renderUsers}
 *
 * @param {string | number | Date} date - Anything `new Date()` accepts.
 * @returns {string}
 */
function formatDate(date) {
  return DateFormatter.format(new Date(date));
}

/**
 * User data is untrusted, so escape it before it goes into innerHTML.
 *
 * Used by: {@link renderUsers}
 *
 * @param {unknown} val - Converted to a string before escaping.
 * @returns {string}
 */
function esc(val) {
  return String(val).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}
