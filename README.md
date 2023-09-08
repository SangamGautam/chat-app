# Chat System Documentation

The MEAN stack (MongoDB, Express, Angular, Node) will be used to create a real-time text/video chat system, together with `sockets.io` and `Peer.js`. The system offers several authorization levels and enables user communication across various groups and channels. In the initial phase, only a few fundamental functionalities were implemented, and the environment was set up using Express, Angular, Node, and JSON to store data. It is more like configuring the server site and front end.

## Table of Contents
- [Git Repository Organization](#git-repository-organization)
- [Data Structures](#data-structures)
- [Angular Architecture](#angular-architecture)
- [Node Server Architecture](#node-server-architecture)
- [Server Routes](#server-routes)
- [Client-Server Interaction](#client-server-interaction)

## Git Repository Organization
- **Client and Server**: The two main directories that make up the repository.
- **Branching**: Development was carried out in the development branch, which was then removed after it was merged with the main branch.
- **Commit Frequency**: To promote clarity and traceability, commits were made frequently with concise and illustrative commit statements.
- **Directory Organization**: The Angular application is located in the client directory, whereas the server directory holds all backend-related code.

## Data Structures
### Client-Side
- **Users**: Represented as objects that have the following properties: id, username, email, roles, and groups.
- **Groups**: A collection of group names.
- **Channels**: A list of channel names organised by group.

### Server-Side
- **Users**: Saved in a JSON file with the following fields: id, username, email, password, and roles.
- **Groups**: Each group can be established, changed, and deleted independently.
- **Channels**: Each channel in the group can be formed.

## Angular Architecture
- **Components**: Dashboard components for user login, registration, chat, and admin functionality.
- **Services**: Include API call handling, user and group services, and user authentication.
- **Models**: Models that have been created for the user but have not yet been implemented in this first phase.
- **Routes**: Different views have been routed based on user roles and authentication status, and Guard has also been created.

## Node Server Architecture
- **Modules**: Express was used to build up the server, JSON was used to store data and read and write from it, and local and session storage were implemented to remember user sign-in to the server.
- **Functions**: These are the functions that handle CRUD activities for users, groups, and channels.
- **Files**: Routes, server, users, groups, controllers, and some other fundamental files are organized.
- **Global Variables**: Arrays for storing users, groups, and channels.

## Server Routes
- `/users`: User CRUD operations.
- `/groups`: Group CRUD operations.
- `/channels`: Channel CRUD operations.
- `/authenticate`: User authentication.
- `/register`: New user registration.

## Client-Server Interaction
- **User Creation**: The client transmits user information to the server, which stores it in the data directory in JSON format.
- **User Login**: The client sends a username and password, which the server checks and sends back after reading the JSON file.
- **Groups/Channel**: Super admin and group admin have the ability to establish groups and assign users to them.
- **Admin Functions**: Admin functions are handled by HTTP Client routes to authenticate data from the JSON file, and for the time being, some basic user interface functionality is used.

---

Data is converted to JSON and saved in a text file on a regular basis, especially after major changes. When the server boots up, data from this JSON file is loaded. Further development of applications will be using MongoDB, `socket.io` and `peer.js` for real-time chatting.
