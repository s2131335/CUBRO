# CSCI3100-GroupB3-Project-CUBRO

## Description

Our group will be creating a course selection system that resembles the course selection system in
CUSIS and hence the name - CUBRO, acronym for Chinese University Basic Registration Operator. Users
will be able to create accounts, login/logout, add/drop courses along with some other advanced features like email sending system, advanced timetable, and file I/O, and more.

## Ways to run

Please type the following commands in your terminal to run, make sure the current directory under /CUBRO/server.

`npm install`
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
