# Technical Design

## Implementation Languages
Shortly is implemented using JavaScript and SQL, following modern full-stack web development practices.

### _JavaScript_
JavaScript serves as the primary programming language across both the frontend and backend of the application.

#### Backend Usage
* Implements all server logic using Node.js
* Handles routing, authentication, authorization, database interaction, and API communication
* Manages session-based authentication securely

#### Frontend Usage
* Powers the React-based user interface
* Manages state, user input, API calls, and conditional rendering
* Enables a responsive, interactive Single-Page Application (SPA)

#### Why JavaScript?
* Single-language full-stack development
* Large ecosystem and community support
* Great compatibility with REST APIs and modern frameworks

Docs:
* https://developer.mozilla.org/en-US/docs/Web/JavaScript

### _SQL_
Structure Query Language (SQL) is used to manage persistent data storage in PostgreSQL.

#### Responsibilities 
* Defines database schemas
* Performs CRUD operations on users and notes
* Enforces relational integrity through foreign keys

Docs:
* https://www.postgresql.org/docs/

## Implementation Frameworks
### _React_
React is used to build the client-side interface as a single-page application

#### Responsibilities 
* Component-based UI design
* Efficient DOM updates using state and props
* Client-side routing via `react-router-dom`
* Separation of concerns between pages (Home, Login, Register, Saved Notes)

#### Why React
* Scalable component architecture
* Industry-standard frontend framework
* Strong tooling

Docs:
* https://react.dev/

### _Vite_
Vite is used as the frontend build tool and development server.

#### Benefits 
* Extremely fast startup time
* Simplified configuration compared to traditional bundlers

Docs:
* https://vite.dev/

### _React Bootstrap_
React Bootstrap is used for layout and navigation components.

#### Usage
* Navigation bar styling
* Responsive layout handling
* Consistent UI across pages

Docs:
* https://react-bootstrap.github.io/

## Backend Frameworks
### _Node.js_
Node.js provides the JavaScript runtime for the backend.

#### Responsibilities
* Executes server-side JavaScript
* Handles asynchronous operations efficiently
* Serves as the foundation for Express

Docs:
* https://nodejs.org/en

### _Express.js_
Express.js is used to create the REST API server.

#### Responsibilities 
* Defines API routes
* Handles HTTP requests and responses
* Applies middleware for sessions, JSON parsing, and authentication checks

Docs:
* http://expressjs.com/

### _OpenAI API_
The OpenAI is used to generate AI-powered summaries.

#### Usage
* Receives raw study notes
* Produces structured summaries with bullet points
* Uses GPT models for natural language processing

Docs:
* https://platform.openai.com/docs/overview

## Data Storage Plan
### _PostgreSQL_
PostgreSQL is used as the primary relational database

#### Stored Data
* User accounts
* Saved study notes
* Session data

#### Key Tables
* `users`
  * Stores user credentials and profile information
* `notes`
  * Stores note title, original text, summary, and timestamps
* `session`
  * Stores authenticated session data

#### Design Decisions
* Relational structure ensures data integrity
* Foreign key constraints enforce ownership of notes
* Indexed queries improve performance

Docs:
https://www.postgresql.org/

## User Authentication
Authentication is implemented using session-based authentication 

### How it Works
1. User logs in or registers
2. Server verifies credentials
3. A session is created and stored in PostgreSQL
4. A secure session cookie is sent to the browser
5. Subsequent requests include the session automatically

### Security Measures
* Passwords are hashed using **bcrypt**
* Sessions stored server-side (not JWT)
* Cookies are `httpOnly` and protected from JavaScript access

## Authentication Logic
Authorization ensures users can only access their own data

### Rules
* Anyone may summarize text
* Only authenticated users may:
  * Saved notes
  * View saved notes
  * View individual note details

### Server-Side Enforcement
```js
if(!req.session.userId) {
  return res.status(401).json({ error: "Login required" });
}
```
This ensures authorization cannot be bypassed from frontend.

## Project Folder Structure
```pgsql
ai-study-tool/
|
|–– client/
|  |–– src/
|  |  |–– pages/
|  |  |   |–– Homes.jsx
|  |  |   |–– Login.jsx
|  |  |   |–– Register.jsx
|  |  |   |–– SavedNotes.jsx
|  |  |   |__ NoteDetail.jsx
|  |  |–– App.jsx
|  |  |–– main.jsx
|  |  |__ App.cs
|  |__ package.json
|
|–– server/
|  |–– routes/
|  |  |__ auth.js
|  |–– db/
|  |  |–– index.js
|  |  |__ schema.sql
|  |–– index.js
|  |__ .gitignore
|
|–– .gitignore
|–– READ.me
```







