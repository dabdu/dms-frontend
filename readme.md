### Department Management System

A modern web application for managing organizational department hierarchies built with Next.js and GraphQL.

## Overview

The Department Management System provides a comprehensive solution for organizations to create, manage, and visualize their departmental structure. It offers an intuitive interface for administrators to organize departments, create sub-departments, and maintain the organizational hierarchy.

## Features

- User Authentication: Secure login system for administrators
- Department Management: Create, update, and delete departments
- Sub-Department Management: Create and manage sub-departments under parent departments
- Hierarchical Visualization: Visual representation of the department structure
- Dashboard: Overview of department statistics and structure
- Responsive Design: Works seamlessly on desktop and mobile devices
- Dark/Light Mode: Support for both dark and light themes

## URL

https://vercel.com/dabdus-projects/dms-frontend

## Technologies Used

- Frontend:

- Next.js 14+
- React 18+
- Apollo Client for GraphQL
- Tailwind CSS
- shadcn/ui components
- TypeScript

- Backend (GraphQL API):

- GraphQL server with mutations and queries
- JWT authentication

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- GraphQL API endpoint

### Setup

1. Clone the repository:

```shellscript
git clone https://github.com/dabdu/dms-frontend
cd dms-frontend
```

2. Install dependencies:

```shellscript
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```plaintext
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://dms-backend-vcy3.onrender.com/graphql
```

4. Run the development server:

```shellscript
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

Create .env and add this variable

NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://dms-backend-vcy3.onrender.com/graphql

## Usage

### Authentication

1. Navigate to the login page
2. Enter your credentials (default: username: "admin", password: "admin123")
3. Upon successful login, you'll be redirected to the dashboard

### Managing Departments

#### Creating a Department

1. Navigate to "Add Department" from the sidebar
2. Enter the department name
3. Optionally add sub-departments
4. Click "Create Department"

#### Editing a Department

1. Navigate to the Departments page
2. Click the edit icon next to the department you want to modify
3. Update the department name or add sub-departments
4. Click "Update Department"

#### Deleting a Department

1. Navigate to the Departments page
2. Click the delete icon next to the department you want to remove
3. Confirm the deletion in the dialog

## GraphQL API Endpoints

The application interacts with the following GraphQL endpoints:

### Queries

- `login`: Authenticates a user and returns a JWT token
- `getDepartments`: Retrieves all departments with their sub-departments

### Mutations

- `createDepartment`: Creates a new department with optional sub-departments
- `createSubDepartment`: Creates a sub-department under an existing department
- `updateDepartment`: Updates an existing department
- `deleteDepartment`: Deletes a department and its sub-departments
