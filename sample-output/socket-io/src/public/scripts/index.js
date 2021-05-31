document.addEventListener('click', function (event) {
    event.preventDefault();
    const ele = event.target;
    if (ele.matches('.nav-users-btn')) {
        window.location.href = '/users';
    } else if (ele.matches('.nav-chat-btn')) {
        window.location.href = '/chat';
    }
}, false);
