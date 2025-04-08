# Meow - Open Sales Pipeline

Welcome to the world of free sales pipeline management. You can use it setup your sales funnel, opportunities and forecast your sales. Your forecast is automatically update whenever you move the deal down the funnel. Meow was built to simplify your sales process, giving you a bird's eye view of your entire funnel.

Manage your sales and accounts all in one place.

Manage customer data and create/edit profiles of companies you work with.
Create a data schema that fits your needs using our intuitive drag-and-drop editor.
Forecast sales performance, monitor your team's progress, and analyze changes in sales stages over time.
Through these features, Meow enables streamlined sales management and offers critical insights to drive your success.

<img src="dashboard-view-screenshot.webp" alt="Meow Dashboard" width="800">

## Try It

![Frontend and Backend](https://github.com/nash-md/meow/actions/workflows/build_all.yml/badge.svg)

Do you not have a server? - [Try this ](https://hello.sales-funnel.app/).

## Features

Manage your customer data, create, modify, and delete profiles for individual customers and companies. Additionally, customize data fields to align the account data with specific business requirements.

<img src="account-list-view-screenshot.webp" alt="Meow Account List" width="800">

Create a schema for your data. Easily customize the data model with our intuitive drag-and-drop editor. Store all the relevant information for your accounts and opportunities.

<img src="schema-editor-view-screenshot.webp" alt="Meow Schema Editor" width="800">

Forecast your sales performance. Select your preferred time range, and get an overview of team performance and sales cycle progression. Gain insights into how stages in your sales process evolve over time.

<img src="forecast-view-screenshot.webp" alt="Meow Dashboard" width="800">

## How to Install

This project is written in Typescript and split into two parts, the frontend written in [React](https://reactjs.org/) and the backend based on [Express](https://expressjs.com/). You find the React UI sources in `/frontend`, the server in `/backend`.

### Your own Server - Backend

In order to build the project make sure that you have Node.js v16+ and higher and Git installed.

Clone a copy into your local project directory.

`git clone https://github.com/nash-md/meow.git`

Change the directory to `/backend` and install the dependencies.

`npm install`

Build the project using

`npm run build`

Before you run the build, you’ll need to define the following variables for later use.

- `MONGODB_URI` - pointing to your MongoDB instance.
- `SESSION_SECRET` - a string used to hash the JWT sessons
- `PORT` - server port, if not set the server will use port `9000`
- `IP_ADDRESS` - the backend server address, default is `127.0.0.1`
- `LOG_LEVEL` - self-explanatory
- `NODE_ENV` - please set this value to `production` for a production build

In `production` mode the server will not allow any cross-origin requests.

Run the project with

`node build/worker.js`

If you want to load environment variables from a file, install dotenv package to handle local environment variables.

`npm install dotenv`

In the root directory create a file called `.env`, then add the following to top of worker.ts

```
import * as dotenv from 'dotenv';

dotenv.config();
```

After the build, you will find the UI in the `/build` directory.

### Frontend

Change the directory to `/frontend` and install the dependencies.

`npm install`

Before building the React frontend, you'll need to set the following variables.

- `VITE_URL` this is the url the frontend will try to connect to, if not set it will try to connect to the backend on the same server on `/public` and `/api`.

This project was built with [Vite](https://vitejs.dev/guide/).

`npm run build`

You will find the build artifacts in the `build` directory. Host the static files it on the server of your choice.

### Using Docker

Docker is a platform that allows you to easily create, deploy, and run applications in containers. Containers are lightweight and portable, providing an isolated environment that runs consistently across different systems. To install Docker follow this [guide](https://docs.docker.com/get-docker/).

The root directory of this project contains a `Dockerfile` and a `docker-compose.yml`, you can build and run it with.

`docker-compose up`

### Database Support

This project heavily depends on MongoDB](https://www.mongodb.com/).

While it is possible to replace MongoDB with another database, please note that due to the significant dependencies and specific optimizations tailored for MongoDB, such a migration might be challenging.

### Documentation

[Setup the Sales Funnel](docs/sales-funnel.md) <br>
[Configure Opportunities](docs/opportunity-setup.md) <br>
[Create Leads via API](docs/create-leads.md) <br>
[Create Accounts via API](docs/create-accounts-via-api.md) <br>
[Changelog](CHANGELOG.md)

### Security

The Typescript backend is compiled with the following [CORS](https://github.com/expressjs/cors) setup, you can change it in `backend/worker.ts`

```
corsOptions: cors.CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
};

if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = false;
}
```

Setting `origin` to `false` in production mode means that the server will not allow any cross-origin requests. This is a security measure that prevents unauthorized access to the server's resources from other domains. By default, when an origin is not allowed, the browser will return a 403 Forbidden response to the client.

### License

All files on this GitHub repository are subject to the AGPLv3 license. Please read the License file at the root of the project.
# new-meow
