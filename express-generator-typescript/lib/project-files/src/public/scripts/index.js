fetch('/api/users/all', {
        method: 'get',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then((response) => {
        let user = response.user;
        let nameElem = document.querySelector('#user-name-field');
        nameElem.textContent = user.name;
        let emailElem = document.querySelector('#user-email-field');
        emailElem.textContent = user.email;
    });
