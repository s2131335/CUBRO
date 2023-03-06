# CUBRO Backend

This is the official documentaion of the CUBRO backend server. There are 2 routes available, namely:

-   [`/api/users`](#apiusers), for managing users
-   [`/api/testing`](#apitesting), for generating testing database documents

## Quick Start

1. Before starting the server, be sure to go to the right folder and install all dependecies:

```
npm i
```

2. Note that the module, [nodemon](https://www.npmjs.com/package/nodemon) is also required. It can be installed by the following command:

```
npm i nodemon -g
```

3. Create a new file named `.env` under this folder, namely `server`. Type the following into the file and replace all the <...> variables with your own information:

```
DB_URI=<YOUR_DATABASE_LINK>
PORT=<BACKEND_PORT>
FRONTEND_PORT=<FRONTEND_PORT>
SECRET=<SECRET_STRING>
ADMIN_DEFAULT=<ADMIN_DEFAULT_PASSWORD>
DOMAIN=<DOMAIN_ADDRESS>
SENDER_EMAIL=<SERVICE_EMAIL_ADDRESS>
SENDER_PASSWORD=<SERVICE_EMAIL_PASSWORD>
```

| Field                    | Description                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| <YOUR_DATABASE_LINK>     | The link to access your mongoDB                                     |
| <BACKEND_PORT>           | The port number for this server                                     |
| <FRONTEND_PORT>          | The port number for your frontend server                            |
| <SECRET_STRING>          | A random secret string that is used to encrypt your data            |
| <ADMIN_DEFAULT_PASSWORD> | The default admin password for your system                          |
| <DOMAIN_ADDRESS>         | The domain of your system, used for sending email                   |
| <SERVICE_EMAIL_ADDRESS>  | The email addres of your service email                              |
| <SERVICE_EMAIL_PASSWORD> | The password, might also be the app password, of your service email |

4. The server can now be started with:

```
npm start
```

## `/api/users`

This is the router for managing users. The following are a list of apis that can be used for acheiving the desired functions. One can simply append the header of each section to the end of `api/users` to get the full api. The list of apis are as follows:

-   [`/register`](#register)
-   [`/activate-account/:token`](#activate-accounttoken)
-   [`/login`](#login)
-   [`/logout`](#logout)
-   [`/update-password`](#update-password)
-   [`/show-students`](#show-students-admin-only)
-   [`/add-roles`](#add-roles-admin-only)
-   [`/forget`](#forget)
-   [`/reset-password/:token`](#reset-passwordtoken)

</ul>

### `/register`

This is the api for registering a new user. **_Note that there are constraints for some parameters that can lead to errors being raised._**

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| POST | Send "ok" with status 200 | Please refer to the error documentation. |

#### POST body

| Field           | Required | Type   | Description                    |
| --------------- | -------- | ------ | ------------------------------ |
| `fullName`      | True     | String | The full name of the user      |
| `nickname`      | False    | String | The nickname of the user       |
| `email`         | True     | String | The email address of the user  |
| `contactNumber` | True     | String | The contact number of the user |

### `/activate-account/:token`

After regsitering for an account, users are stilled forbidden from using the system unless their account has been activated. This api allows users to activate their own account.

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| GET  | Send "ok" with status 200 | Please refer to the error documentation. |

### `/login`

This is the api for loggin into the system. Note that a user can only login if he/she has not logged in before.

#### Request

| Type | On Success                   | On Error                                 |
| ---- | ---------------------------- | ---------------------------------------- |
| POST | Send "Login" with status 200 | Please refer to the error documentation. |

#### POST body

| Field      | Required | Type   | Description                    |
| ---------- | -------- | ------ | ------------------------------ |
| `email`    | True     | String | The email address of the user  |
| `password` | True     | String | The login password of the user |

### `/logout`

This is the api for logging out of the system. Note that a user can only logout of the system if he/she is already logged in before.

#### Request

| Type | On Success    | On Error                                 |
| ---- | ------------- | ---------------------------------------- |
| POST | Send "Logout" | Please refer to the error documentation. |

### `/update-password`

This is the api for users to change their own password after logging in.

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| POST | Redirect(307) to "logout" | Please refer to the error documentation. |

#### POST body

| Field      | Required | Type   | Description                    |
| ---------- | -------- | ------ | ------------------------------ |
| `password` | True     | String | The login password of the user |

### `/show-students` [Admin only]

This is the api for listing all users with the role of "STUDENT".

#### Request

| Type | On Success           | On Error                                 |
| ---- | -------------------- | ---------------------------------------- |
| GET  | JSON with status 200 | Please refer to the error documentation. |

### `/add-roles` [Admin only]

This is the api for admins to add permission roles to users.

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| POST | Send "ok" with status 200 | Please refer to the error documentation. |

#### POST body

| Field   | Required | Type            | Description                      |
| ------- | -------- | --------------- | -------------------------------- |
| `_id`   | True     | String          | The id of the user to change     |
| `roles` | True     | Array of String | The roles for the user to change |

### `/forget`

This is the api for users to reacquire their password if they somehow managed to forget it. Users should then receive an email sent from the system, prompting them for a new password change.

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| POST | Send "ok" with status 200 | Please refer to the error documentation. |

#### POST body

| Field   | Required | Type   | Description                   |
| ------- | -------- | ------ | ----------------------------- |
| `email` | True     | String | The email address of the user |

### `/reset-password/:token`

After getting the email from the method above, by using this api, users can reset their password with a new one.

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| POST | Send "ok" with status 200 | Please refer to the error documentation. |

#### POST body

| Field      | Required | Type   | Description                    |
| ---------- | -------- | ------ | ------------------------------ |
| `password` | True     | String | The login password of the user |

## `/api/testing`

This is the api route for generating test database documents. It is particularly useful for the testing phase of the system development. One can simply append the header of each section to the end of `api/users` to get the full api. The list of apis are as follows:

-   [`/gen-students/:no`](#gen-studentsno)

### `/gen-students/:no`

This is the api for generating `no` of random fake students in the system, where `no` is the given parameter via the api request. The maximum is 100 students per request.

#### Request

| Type | On Success                                  | On Error                                 |
| ---- | ------------------------------------------- | ---------------------------------------- |
| GET  | Send "successfully generated `no` students" | Please refer to the error documentation. |
