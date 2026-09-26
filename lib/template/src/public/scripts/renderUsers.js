// ========================================================================= //
//                                 CONSTANTS                                 //
// ========================================================================= //

const DateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatDate = (date) => DateFormatter.format(new Date(date));

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// User data is untrusted, so escape it before it goes into innerHTML
const esc = (val) => String(val).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Render users
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
