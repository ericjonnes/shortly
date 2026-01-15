# Shortly – AI Study Notes App

Shortly is a full-stack web app that allows users to summarize study notes using AI and optionally save those summaries by creating an account. The application is designed so any user can generate summaries, while only authenticated users can save and revisit notes. The application divides the summary into two main categories: Key Ideas and Important Dates/Formulas.

## [Technology Selection](technology-selection.md)
Shortly uses JavaScript for both frontend and backend to keep development consistnet across the entire application. React is used to build the user interface, while Node.js and Express handle backend logic and API requests. PostgreSQL is used to store user accounts and saved notes in a structured and reliable way.

## [Technical Design](technical-design.md)
The project is designed using a client-server model where the frontend and backend are clearly separated. React handles user interaction and page navigation, while Express backend processes requests, manages sessions, and interacts with the database. Authentication and authorization are handled on the server to ensure users can only access their own saved notes.

## [Implementation](implementation.md)
The application is implemented with separate client and server folders, each with its own dependencies and configuration. Environment variables are used to securely store sensitive values like database credentials and API keys. The project is run locally by starting both the frontend development server and the backend Express server.
