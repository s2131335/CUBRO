# CUBRO Backend

This is the official documentation of the CUBRO backend server. There are 3 routes available, namely:

-   [`/api/users`](#apiusers), for managing users
-   [`/api/courses`](#apicourses), for dealing with courses
-   [`/api/testing`](#apitesting), for generating testing database documents

## Quick Start

1. Before starting the server, be sure to go to the right folder and install all dependencies:

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
| <SERVICE_EMAIL_ADDRESS>  | The email address of your service email                             |
| <SERVICE_EMAIL_PASSWORD> | The password, might also be the app password, of your service email |

4. The server can now be started with:

```
npm start
```

<!-- user api -->

## `/api/users`

This is the router for managing users. The following are a list of apis that can be used for achieving the desired functions. One can simply append the header of each section to the end of `api/users` to get the full api. The list of apis are as follows:

-   [CUBRO Backend](#cubro-backend)
    -   [Quick Start](#quick-start)
    -   [`/api/users`](#apiusers)
        -   [`/register`](#register)
            -   [Request](#request)
            -   [POST body](#post-body)
        -   [`/activate-account/:token`](#activate-accounttoken)
            -   [Request](#request-1)
        -   [`/login`](#login)
            -   [Request](#request-2)
            -   [POST body](#post-body-1)
        -   [`/logout`](#logout)
            -   [Request](#request-3)
        -   [`/update-password`](#update-password)
            -   [Request](#request-4)
            -   [POST body](#post-body-2)
        -   [`/show-users` \[Admin only\]](#show-users-admin-only)
            -   [Request](#request-5)
        -   [`/add-user` \[Admin only\]](#add-user-admin-only)
            -   [Request](#request-6)
            -   [POST body](#post-body-3)
        -   [`/add-roles` \[Admin only\]](#add-roles-admin-only)
            -   [Request](#request-7)
            -   [POST body](#post-body-4)
        -   [`/forget`](#forget)
            -   [Request](#request-8)
            -   [POST body](#post-body-5)
        -   [`/reset-password/:token`](#reset-passwordtoken)
            -   [Request](#request-9)
            -   [POST body](#post-body-6)
    -   [`/api/courses`](#apicourses)
        -   [`/browse`](#browse)
            -   [Request](#request-10)
            -   [Query](#query)
        -   [`/info/:id`](#infoid)
            -   [Request](#request-11)
        -   [`/select`](#select)
            -   [Request](#request-12)
            -   [POST body](#post-body-7)
        -   [`/import-courses` \[Admin only\]](#import-courses-admin-only)
            -   [Request](#request-13)
            -   [POST body](#post-body-8)
            -   [Excel file format](#excel-file-format)
    -   [`/api/testing`](#apitesting)
        -   [`/gen-students/:no`](#gen-studentsno)
            -   [Request](#request-14)
    -   [`/api/courses`](#apicourses-1)
        -   [`import-courses` \[Admin only\]](#import-courses-admin-only-1)
            -   [Request](#request-15)
            -   [POST body](#post-body-9)
    -   [Custom Error Documentation](#custom-error-documentation)
        -   [`Unknown`](#unknown)
        -   [`ValidatorError`](#validatorerror)
        -   [`EmailExist`](#emailexist)
        -   [`PasswordTooShort`](#passwordtooshort)
        -   [`UserNotFound`](#usernotfound)
        -   [`PasswordIncorrect`](#passwordincorrect)
        -   [`EmailNotValid`](#emailnotvalid)
        -   [`NameNotValid`](#namenotvalid)
        -   [`AccountNotActivated`](#accountnotactivated)
        -   [`FailToSendMail`](#failtosendmail)
        -   [`TokenInvalid`](#tokeninvalid)
        -   [`DatabaseUpdate`](#databaseupdate)
    -   [User Schema](#user-schema)

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

After registering for an account, users are stilled forbidden from using the system unless their account has been activated. This api allows users to activate their own account.

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| GET  | Send "ok" with status 200 | Please refer to the error documentation. |

### `/login`

This is the api for logging into the system. Note that a user can only login if he/she has not logged in before.

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

### `/show-users` [Admin only]

This is the api for listing all users matches the filters

#### Request

| Type | On Success           | On Error                                 |
| ---- | -------------------- | ---------------------------------------- |
| POST | JSON with status 200 | Please refer to the error documentation. |

POST body
| Field | Required | Type | Description |  
| --- | --- | --- | --- |  
`filter` | True | Object | Filters that want to be matched. Details refer to user schema document|

`filter` example:

```json
{
	"role": "ADMIN"
}
```

### `/add-user` [Admin only]

This is the api for adding new users, including Tutors, Students, and Admins

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| POST | Send "ok" with status 200 | Please refer to the error documentation. |

#### POST body

| Field           | Required | Type            | Description                    |
| --------------- | -------- | --------------- | ------------------------------ |
| `fullName`      | True     | String          | The full name of the user      |
| `nickname`      | False    | String          | The nickname of the user       |
| `email`         | True     | String          | The email address of the user  |
| `contactNumber` | True     | String          | The contact number of the user |
| `role`          | True     | Array of String | The roles of the user          |

### `/add-roles` [Admin only]

This is the api for admins to add permission roles to users.

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| POST | Send "ok" with status 200 | Please refer to the error documentation. |

#### POST body

| Field  | Required | Type            | Description                      |
| ------ | -------- | --------------- | -------------------------------- |
| `_id`  | True     | String          | The id of the user to change     |
| `role` | True     | Array of String | The roles for the user to change |

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

<!-- courses api -->

## `/api/courses`

This is the api for dealing with courses, meant to use for both admins and users of this system. One can simply append the header of each section to the end of `api/courses` to get the full api. The list of apis are as follows:

-   [`/browse`](#browse)
-   [`/info/:id`](#infoid)
-   [`/import-courses`](#import-courses-admin-only)

### `/browse`

This is for users to browse a list of courses based on a user defined filter. One can search for the courses by either the course ID or the course name.

#### Request

| Type | On Success                                       | On Error                                 |
| ---- | ------------------------------------------------ | ---------------------------------------- |
| GET  | JSON of list of filtered courses with status 200 | Please refer to the error documentation. |

#### Query

| Field        | Required | Type   | Description                    |
| ------------ | -------- | ------ | ------------------------------ |
| `courseCode` | False    | String | A substring of the course code |
| `courseName` | False    | String | A substring of the course name |

### `/info/:id`

This is for users to get a more detailed information on the course in query by passing the course id in the `id` field.

#### Request

| Type | On Success                                    | On Error                                 |
| ---- | --------------------------------------------- | ---------------------------------------- |
| GET  | JSON of details of the course with status 200 | Please refer to the error documentation. |

### `/select`

This api is for course selection and shopping cart addition.

#### Request

| Type | On Success                | On Error                                 |
| ---- | ------------------------- | ---------------------------------------- |
| POST | Send "ok" with status 200 | Please refer to the error documentation. |

#### POST body

| Field     | Required | Type           | Description                                                                               |
| --------- | -------- | -------------- | ----------------------------------------------------------------------------------------- |
| `select`  | True     | Boolean        | "true" indicates a course selection, whereas a "false" indicates a shopping cart addition |
| `courses` | True     | List of String | A list of string containing course ID(s).                                                 |

### `/import-courses` [Admin only]

This api is for admins to import courses from an excel file, allowing an easy way to create courses in the system

#### Request

| Type | On Success                            | On Error                                 |
| ---- | ------------------------------------- | ---------------------------------------- |
| POST | Send "All successful" with status 200 | Please refer to the error documentation. |

#### POST body

| Field  | Required | Type | Description                           |
| ------ | -------- | ---- | ------------------------------------- |
| `file` | True     | File | The excel file containing the courses |

#### Excel file format

The excel file should contain a total 10 columns, namely:

-   courseCode
-   courseName
-   type
-   class
-   venue
-   instructor
-   seat
-   dates
-   time
-   description

<!-- testing api -->

## `/api/testing`

This is the api route for generating test database documents. It is particularly useful for the testing phase of the system development. One can simply append the header of each section to the end of `api/testing` to get the full api. The list of apis are as follows:

-   [`/gen-students/:no`](#gen-studentsno)

### `/gen-students/:no`

This is the api for generating `no` of random fake students in the system, where `no` is the given parameter via the api request. The maximum is 100 students per request.

#### Request

| Type | On Success                                  | On Error                                 |
| ---- | ------------------------------------------- | ---------------------------------------- |
| GET  | Send "successfully generated `no` students" | Please refer to the error documentation. |

## `/api/courses`

This is the router for managing users. The following are a list of apis that can be used for acheiving the desired functions. One can simply append the header of each section to the end of `api/users` to get the full api.

### `import-courses` [Admin only]

This is the api for registering a new user.

#### Request

| Type | On Success                | On Error           |
| ---- | ------------------------- | ------------------ |
| POST | Send "ok" with status 200 | <ul><li></li></ul> |

#### POST body

| Field  | Required | Type      | Description              |
| ------ | -------- | --------- | ------------------------ |
| `file` | True     | .xls file | .xls file of course info |

## Custom Error Documentation

### `Unknown`

```json
Unknown: {
    status: 500,
    code: 4000,
    message: "Something Wrong",
}
```

### `ValidatorError`

```json
ValidatorError: {
    status: 500,
    code: 1000,
    message: "Validator Error",
}
```

### `EmailExist`

```json
EmailExist: {
    status: 500,
    code: 1001,
    message: "Email has been used",
}
```

### `PasswordTooShort`

```json
PasswordTooShort: {
    status: 500,
    code: 1002,
    message: "Password Too Short",
}
```

### `UserNotFound`

```json
UserNotFound: {
    status: 500,
    code: 1003,
    message: "User Not Found",
}
```

### `PasswordIncorrect`

```json
PasswordIncorrect: {
    status: 500,
    code: 1004,
    message: "Password Incorrect",
}
```

### `EmailNotValid`

```json
EmailNotValid: {
    status: 500,
    code: 1005,
    message: "Email Not Valid",
}
```

### `NameNotValid`

```json
NameNotValid: {
    status: 500,
    code: 1006,
    message: "Name Not Valid",
	}
```

### `AccountNotActivated`

```json
AccountNotActivated: {
    status: 400,
    code: 1009,
    message: "Account Not Activated",
}
```

### `FailToSendMail`

```json
FailToSendMail: {
    status: 500,
    code: 2001,
    message: "Fail to send email",
}
```

### `TokenInvalid`

```json
TokenInvalid: {
    status: 401,
    code: 3001,
    message: "Token Invalid",
}
```

### `DatabaseUpdate`

```json
DatabaseUpdate: {
    status: 500,
    code: 5001,
    message: "Update not success",
}
```

## User Schema

| Field           | Required | Unique | Type            | Default       | Description                         |
| --------------- | -------- | ------ | --------------- | ------------- | ----------------------------------- |
| `fullName`      | True     | False  | String          |               | Full name of user                   |
| `email`         | True     | True   | String          |               | Email of user                       |
| `password`      | True     | False  | String          |               | Hashed password of user             |
| `role`          | True     | False  | Array of String | `["STUDENT"]` | Role of user. {TUTOR,STUDENT,ADMIN} |
| `contactNumber` | True     | False  | Number          |               | Phone number of user                |
| `activated`     | True     | False  | Boolean         | `false`       | Indicate if account is activated    |
| `token`         | False    | False  | String          |               | Save jwt token for verification     |
