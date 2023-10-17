# Chat System Documentation

Using the **MEAN** stack (MongoDB, Express, Angular, Node), we are crafting a real-time text chat system. With `sockets.io` and `Peer.js` supplementing the core functionality, our system addresses multiple authorization levels and facilitates communication across varied groups and channels.

## Table of Contents:
- [Git Repository Organization](#git-repository-organization)
- [Data Structures](#data-structures)
- [Angular Architecture](#angular-architecture)
- [Node Server Architecture](#node-server-architecture)
- [Server Routes](#server-routes)
- [Client-Server Interaction](#client-server-interaction)
- [Testing](#testing)

## Git Repository Organization

### Directories
- **Client**: Houses the Angular application.
- **Server**: Contains Express server, MongoDB models, and other backend utilities.

### Branching Strategy
- **Development Branch**: All feature development and bug fixes are carried out here.
- **Main Branch**: Stable releases, after rigorous testing, are merged here from the development branch.

### Commit Strategy
Each commit is atomic, addressing a single feature or bug, ensuring easy traceability and rollback.

## Data Structures

### Client-Side
- **Users**: User objects encompass id, username, email, roles, groups, and a link to their profile image.
- **Groups**: An array structure with group names and associated metadata.
- **Channels**: Hierarchical data, wherein each group has an array of channel names and their details.

### Server-Side (MongoDB)
- **Users Collection**: Data like id, username, email, encrypted password, roles, and profile image URL.
- **Groups Collection**: Each document represents a group, with fields like group name, description, and associated channels.
- **Channels Collection**: Information about each channel, its members, chat history (including images and text), and associated group.

## Angular Architecture

### Components
#### Dashboard Component
- **Purpose**: Acts as the main interface once the user logs in. It provides a holistic view of the user's activities and available options.
- **Features**:
  - Displays a list of groups the user is a part of.
  - Shows available channels within those groups.
  - Provides options to switch between different channels or groups.
  - Allows direct navigation to chat or admin functionalities based on user roles.
  
#### Login & Registration Components
- **Purpose**: These are the gateways for user authentication.
- **Login Features**:
  - Fields for username and password input.
  - Option to remember user credentials for future sessions.
  - Error handling for incorrect credentials.
- **Registration Features**:
  - Input fields for username, email, password, and password confirmation.
  - Validation for email format and password strength.
  - Feedback on successful registration or errors.

#### Chat Component
- **Purpose**: Central component for real-time messaging.
- **Features**:
  - Displays chat history, including text messages and images.
  - Text input field for composing messages.
  - Option to upload and send images within the chat.
  - Real-time updates as users send messages.
  - Notifications for new messages if the user is not actively on the chat window.
  
#### Admin Component
- **Purpose**: Dedicated space for administrative tasks.
- **Features**:
  - Group management: Add, remove, or modify user roles.
  - Group management: Create new groups or modify existing ones.
  - Channel management within groups: Add, remove, or modify channels.

### Services
#### API Service
- **Purpose**: Centralizes all HTTP requests to the server.
- **Features**:
  - Functions for GET, POST, PUT, DELETE requests.
  - Error handling for failed requests.
  - Parsing and formatting data for transmission.

#### Authentication Service
- **Purpose**: Oversee all authentication-related operations.
- **Features**:
  - Login: Verifies user credentials and initiates sessions.
  - Logout: Ends the user session and clears any stored credentials.
  - Session Persistence: Maintains user session across page reloads or revisits.

#### Group & Channel Service
- **Purpose**: Manages all operations related to groups and channels.
- **Features**:
  - Fetches all groups and channels for a user.
  - Adds or removes users from groups or channels.
  - Creates or deletes groups or channels.

### Routes & Guards
#### Routes
- **Purpose**: Define the URL structure and associate each URL with a specific component.
- **Features**:
  - Routes like `/login`, `/register`, `/dashboard`, `/chat`, and `/admin` load the respective components.
  - Nested routes for navigating between different channels within a group.
  
#### Guards
- **Purpose**: Ensure that users access routes based on their authentication status and roles.
- **Features**:
  - Authentication Guard: Checks if a user is logged in. If not, redirect to the login page.
  - Role-based Guard: Checks the user's role to determine if they have permission to access specific routes, such as the admin route.

## Node Server Architecture

### Modules
- **Express**: Provides the framework for server setup and route handling.
- **MongoDB**: The NoSQL database for persistent storage.
- **Socket.io**: Enables real-time bi-directional communication.
- **Peer.js**: Facilitates video chat capabilities.

### Middleware
- **Authentication Middleware**: Verifies user tokens and roles.
- **Error Handling**: Catches and processes server errors.
- **Database Models**: Define the structure of collections in MongoDB.
- **Global Variables**: These temporarily hold user sessions, active socket connections, and active channels for efficient management.

## Server Routes

**/users**: CRUD operations for users. Can fetch, update, delete, or add a user.
**/groups**: Operations related to groups. List all, create a new one, modify, or delete.
**/channels**: CRUD for channels, fetch chat history.
**/authenticate**: Verifies user credentials and returns tokens.
**/register**: Accepts user details and registers a new user.
**/upload**: Endpoint to handle image uploads, returning the stored image URL.

### REST API Routes

#### User Authentication and Management
- **Route**: `/api/users/login`
  - **Method**: POST
  - **Parameters**: `{ username: string, password: string }`
  - **Return Value**: `{ success: boolean, token: string, user: { id, username, email, roles } }`
  - **Purpose**: Authenticate users based on their username and password.
  
- **Route**: `/api/users/register`
  - **Method**: POST
  - **Parameters**: `{ username: string, email: string, password: string }`
  - **Return Value**: `{ success: boolean, message: string }`
  - **Purpose**: Register a new user into the system.

- **Route**: `/api/users/profile`
  - **Method**: GET
  - **Parameters**: User token in headers
  - **Return Value**: `{ user: { id, username, email, roles } }`
  - **Purpose**: Fetch the profile details of the authenticated user.

#### Group Management
... [and so on for the other routes]

## Client-Server Interaction

**Authentication**: Once the user submits credentials, the client sends a POST request to `/authenticate`. The server checks these against the MongoDB and responds with success or failure.
**Chatting**: When a user enters a channel, a socket connection is established. Messages sent are broadcast via `socket.io` to all members in real-time.
**Profile & Chat Image Upload**: Utilizes the `/upload` endpoint. Once the image is uploaded to the server, a URL is returned, which is then saved in MongoDB and displayed on the client.

## Testing

**Angular**: Automated testing is done using Jasmine and Karma. Coverage reports are generated with `ng test --code-coverage`.
**Node Server**: Backend testing is conducted using Mocha and Chai. Socket.io functionality is tested using the `socket-io-client`.
