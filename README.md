# CS 7330 Project

## How to Run

Node.js version 18 or higher is required to run this project.

1. Clone the repository
2. Install the required packages

```bash
git clone https://github.com/myusernamesthisreal/cs7330-project.git
cd cs7330-project
npm install
```

A sample .env file is provided in the [.env.example](.env.example) file. Copy this file to a new file named `.env` and fill in the required values.

```bash
cp .env.example .env
```

Create the database tables and run the migrations:

```bash
npx prisma db push
```

To run the project, use the following command:

```bash
npm run dev
```

Visit <http://localhost:3000> in a browser to view the project.

## Database Schema

The database schema is viewable in the [prisma/schema.prisma](prisma/schema.prisma) file.
