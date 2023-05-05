# CSCI3100-GroupB3-Project-CUBRO

## Description

Our group will be creating a course selection system that resembles the course selection system in
CUSIS and hence the name - CUBRO, acronym for Chinese University Basic Registration Operator. Users
will be able to create accounts, login/logout, add/drop courses along with some other advanced features like email sending system, advanced timetable, and file I/O, and more.

## Ways to run

1. Please type the following commands in your terminal to install dependencies, make sure the current directory under /CUBRO/server.
   `npm install`
   `npm i nodemon -g`

2. Create a new file named `.env` under this folder, namely `server`. Type the following into the file and replace all the <...> variables with your own information:

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

3. The server can now be started with:
   `npm start`

After that, the web can be access at http://localhost:8000

## Folder structure

server  
├── config # configuration file for authentication module  
├── controllers  
├── database  
├── global_var.js # global variables  
├── middleware  
├── public # public files for frontend  
├── routes  
├── server.js # server starting script  
├── services # database access functions  
├── uploads # temporary storage for uploaded files  
├── utils # utility functions  
└── views # frontend views

Remark: some miscellaneous folders/files are ignored
