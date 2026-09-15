/* =========================================
   STORAGE KEYS
========================================= */

const USERS_KEY = "authflow_users";

const SESSION_KEY = "authflow_current_user";



/* =========================================
   HELPER FUNCTIONS
========================================= */

function getUsers() {

    try {

        const users =
            localStorage.getItem(USERS_KEY);

        return users
            ? JSON.parse(users)
            : [];

    } catch (error) {

        console.error(
            "Unable to read users:",
            error
        );

        return [];
    }
}


function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}


function getCurrentUser() {

    try {

        const user =
            localStorage.getItem(SESSION_KEY);

        return user
            ? JSON.parse(user)
            : null;

    } catch (error) {

        return null;
    }
}


function setCurrentUser(user) {

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );
}


function logout() {

    localStorage.removeItem(SESSION_KEY);

    window.location.href = "index.html";
}



/* =========================================
   SHOW MESSAGE
========================================= */

function showMessage(
    element,
    message,
    type
) {

    if (!element) return;

    element.textContent = message;

    element.className =
        `message ${type}`;
}



/* =========================================
   PASSWORD VALIDATION
========================================= */

function isValidPassword(password) {

    /*
        Password requirements:

        1. At least 8 characters
        2. At least 1 number
    */

    const minimumLength =
        password.length >= 8;

    const hasNumber =
        /\d/.test(password);

    return minimumLength && hasNumber;
}



/* =========================================
   REGISTER
========================================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById(
                        "registerUsername"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            /* -------------------------
               Username validation
            ------------------------- */

            if (username.length < 3) {

                showMessage(
                    message,
                    "Username must be at least 3 characters.",
                    "error"
                );

                return;
            }


            /* -------------------------
               Password validation
            ------------------------- */

            if (!isValidPassword(password)) {

                showMessage(
                    message,
                    "Password must contain at least 8 characters and 1 number.",
                    "error"
                );

                return;
            }


            /* -------------------------
               Confirm password
            ------------------------- */

            if (password !== confirmPassword) {

                showMessage(
                    message,
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            /* -------------------------
               Get existing users
            ------------------------- */

            const users = getUsers();


            /* -------------------------
               Duplicate check
            ------------------------- */

            const usernameExists =
                users.some(
                    user =>
                        user.username.toLowerCase() ===
                        username.toLowerCase()
                );


            const emailExists =
                users.some(
                    user =>
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                );


            if (
                usernameExists ||
                emailExists
            ) {

                showMessage(
                    message,
                    "An account with this username or email already exists.",
                    "error"
                );

                return;
            }


            /* -------------------------
               Create user
            ------------------------- */

            const newUser = {

                id:
                    Date.now().toString(),

                username:
                    username,

                email:
                    email,

                password:
                    password,

                createdAt:
                    new Date().toISOString()
            };


            users.push(newUser);


            saveUsers(users);


            /* -------------------------
               Success
            ------------------------- */

            showMessage(
                message,
                "Registration successful! Redirecting to login...",
                "success"
            );


            registerForm.reset();


            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                1000
            );
        }
    );
}



/* =========================================
   LOGIN
========================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const identifier =
                document
                    .getElementById(
                        "loginIdentifier"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const users = getUsers();


            /*
                Search by username OR email.
            */

            const user =
                users.find(
                    currentUser =>
                        (
                            currentUser.username
                                .toLowerCase() ===
                            identifier
                        )
                        ||
                        (
                            currentUser.email
                                .toLowerCase() ===
                            identifier
                        )
                );


            /*
                IMPORTANT:
                We intentionally use one generic
                error message.

                We don't tell the user whether
                username/email OR password was wrong.
            */

            if (
                !user ||
                user.password !== password
            ) {

                showMessage(
                    message,
                    "Invalid username/email or password.",
                    "error"
                );

                return;
            }


            /* -------------------------
               Successful login
            ------------------------- */

            const sessionUser = {

                id:
                    user.id,

                username:
                    user.username,

                email:
                    user.email
            };


            setCurrentUser(sessionUser);


            showMessage(
                message,
                "Login successful! Redirecting...",
                "success"
            );


            setTimeout(
                function () {

                    window.location.href =
                        "dashboard.html";

                },
                500
            );
        }
    );
}



/* =========================================
   PROTECTED DASHBOARD
========================================= */

if (
    window.location.pathname.endsWith(
        "dashboard.html"
    )
) {

    const currentUser =
        getCurrentUser();


    /*
        If there is no logged-in user,
        don't allow access.
    */

    if (!currentUser) {

        window.location.href =
            "index.html";

    } else {

        const usernameElement =
            document.getElementById(
                "dashboardUsername"
            );


        const userUsername =
            document.getElementById(
                "userUsername"
            );


        const userEmail =
            document.getElementById(
                "userEmail"
            );


        if (usernameElement) {

            usernameElement.textContent =
                currentUser.username;
        }


        if (userUsername) {

            userUsername.textContent =
                currentUser.username;
        }


        if (userEmail) {

            userEmail.textContent =
                currentUser.email;
        }
    }
}



/* =========================================
   LOGOUT
========================================= */

const logoutButton =
    document.getElementById("logoutBtn");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );
}
