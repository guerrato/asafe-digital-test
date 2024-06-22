# A-SAFE Digital Technical Test

## Introduction

Welcome to the technical test project repository for A-Safe Digital! This project serves as a demonstration of various development strategies and coding abilities utilizing a modern tech stack. Key technologies featured include Fastify, Prisma, Git, PostgreSQL, WebSockets, Docker, and a monorepo structure.

### Overview:

The primary objective of this project is to build a "blog posts" API, where users can create, read, update, and delete their posts. The functionality resembles platforms like Medium, allowing any user to manage their authored content through a RESTful API interface.

### Technologies Utilized:

- **Fastify**: A fast and low overhead web framework for Node.js.
- **Prisma**: Modern database toolkit for TypeScript and Node.js.
- **Git**: Version control system for tracking changes in source code.
- **PostgreSQL**: Open source relational database.
- **WebSocket**: Protocol providing full-duplex communication channels over a single TCP connection.
- **Docker**: Containerization platform for developing, shipping, and running applications.
- **Monorepo**: Organizational structure for managing multiple projects within a single repository.
- **Dependency Injection**: Design pattern used to implement Inversion of Control (IoC) for managing dependencies between components.
- **SOLID principles**: Set of software design principles aimed at making software designs more understandable, flexible, and maintainable.

This repository demonstrates best practices in API development, including secure authentication, robust data management with Prisma ORM, real-time updates using WebSockets, and containerized deployment via Docker.

## Running the Project

You can execute this project using either Docker or on your local machine. Below are the steps for both methods:

### Clone the Repository

For both you'll need to clone the repository.

```bash
git clone git@github.com:guerrato/asafe-digital-test.git
cd asafe-digital-test
```

<br/>

> **Note:** Make sure you have **Node.js (version 20)** and **PostgreSQL** installed on your machine.

<br/>

### _Using Docker_

#### 1. Build and Run with Docker:

#### 1.a By Docker compose command

The project has a docker-compose.yml file in which you **should** change the environment variables in order to connect with DB and perform the application.

```bash
docker-compose up -d --build [--force-recreate]
```

This command builds the Docker images and starts the containers defined in docker-compose.yml.

#### 1.b Creating the image from command

If you prefer, you can create the Docker image and deploy it on your own server. Use the following commands as an example, and replace the variables with your own values:

Create the image:

```bash
docker build -t a-safe .
```

Create the container:

```bash
docker run -d \
  --name a-safe \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e HOST=0.0.0.0 \
  -e API_DOMAIN=prod_domain.com \
  -e DATABASE_URL=postgresql://postgres:Secr%23tPassw0rd@database.postgres:5432/a-safe?schema=public \
  -e SECRET_KEY=2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824 \
  -e JWT_SECRET=iQVvLkOYEW6XoU6VG56jpLY9fufik6fO3aQxRF8u4zo= \
  a-safe:latest \
  npm start
```

#### 2. Seed your DB

It is highly recommended to seed the database to effectively test all application endpoints

```bash
docker exec -it a-safe npx -w packages/api prisma db seed
```

#### 3. Accessing the API:

Once Docker containers are up and running, the API endpoints can be accessed locally using localhost on the specified port.

### _Running Locally_

If you prefer to run the project directly on your machine without Docker, follow these steps:

#### 1. Install Dependencies:

Make sure you have Node.js (version 20) and PostgreSQL installed on your machine. Then install the dependencies:

#### 2. Install NPM Packages:

```bash
npm -w packages/utils install
npm -w packages/api install
npm install
```

#### 3. Set Up Environment Variables:

Create a .env file in the root directory and configure necessary environment variables like database credentials, API ports, etc.

All the necessary variable examples are available in .env-example

```bash
cp ./packages/api/.env-example ./packages/api/.env
```

Be sure you have the following ones, they are required in order to execute the application:

- API_DOMAIN
- DATABASE_URL
- SECRET_KEY
- JWT_SECRET

#### 4. Configure Prisma Client

Since this project uses Prisma, you need to generate the Prisma Client to interact with the database. **Additionally, it is highly recommended to seed the database to effectively test all application endpoints**.

```bash
npx -w packages/api prisma db seed
```

#### 5. Run the Application:

```bash
npm start
```

If you want to execute in Dev mode:

```bash
npm run dev
```

This command starts the application on your local machine.

#### 6. Accessing the API:

Once the application is running locally, you can access the API endpoints using 127.0.0.1 (may vary if you set the variable HOST in your .env) on the specified port.

### _Swagger or Postman_

There are many ways use and test it. The most recommended is using **Swagger** endpoint:

```
http://<a_safe_api_host>:3000/docs
```

but you can also use postman, for this, import the [asafe.postman_collection.json](./asafe.postman_collection.json) to your Postman and make the requests.

## Project structure

Writing a project for a test never is easy because we need to give as much examples as possible, but keep things on good fit and looking awesome. That's hard. So the project structure was defined to follow the requirements, but also sohowing examples of different implementations, for instance: Fastify allow defining routes in at least two basic ways:

```javascript
fastify.route({
  method: 'GET'
  url: '/health'
})
```

and

```javascript
fastify.get('/health')
```

Given the purpose of this test is to demonstrate various examples, and the final decision will be based on the tools and practices used by the development team in real life, this test includes implementations of both approaches, even if some warnings are displayed.

### Monorepo Implementation

One of the test script requirements was to implement as monorepo. It was made in this project using NPM Workspaces.

The reason for not using tools like Lerna is simply because they are awesome tools for production and daily team uses, however, this test is to show knowlege in concept not in tools, which many times abstracts the concepts. So it was avoided even if the implementation takes more time.

#### _Packages separation_

The solution is separated in two packages:

- Utils
- API

## Utils

The purpose of the `utils` package is to become an NPM package, intended for use as a dependency in various other packages, including the API. Its target deployment is a software registry like [npmjs.com](https://npmjs.com). It includes helper functions for tasks such as verifying text emptiness, generating and verifying JWT tokens, creating password hashes, and formatting HTTP response bodies.

## API

On the other hand, the `API` package is designed to function as a service, to be hosted on servers, and capable of `scaling horizontally without issues`.

Although both packages reside in the same repository, they serve entirely different purposes. This is also why a Dockerfile has been included as an example, providing a deployment method that can be used with AWS, Azure, Kubernetes, or any other orchestrator.

### Why services, repositories and some others were not packaged inside `packages`

As mentioned before, the purpose is to demonstrate key concepts. This `architectural` example illustrates how the packages are interrelated. In this setup, the services and repositories are intrinsically tied to the `API`; they are essentially meaningless without the `API`. Conversely, the `API` loses its functionality without these packages. The same principle applies to the controllers package. Thus, the `api` package encapsulates all these interdependent packages, which do not have standalone significance.

This does not imply a lack of organization. On the contrary, their concepts are clearly separated, and their responsibilities are well-defined, as explained below.

#### _Repositories_

To ensure the system is future-proof, the repository package will manage data persistence and provide flexibility in case `Prisma` becomes unsuitable for the project in the future.

> #### _Successful Use Case for Using Repositories_
>
> <br />
> In nearly every project I have worked on involving databases, especially before ORMs were widely adopted, the repository pattern played a crucial role. Over time, the repository layer became less common in small applications as ORM solutions evolved to include these functions. Even in large projects, ORMs often provide sufficient capabilities for operations traditionally handled by repositories.

> <br />
> However, I recently updated my legacy project, written in JavaScript using Sequelize. For various reasons, I wanted to switch from Sequelize to Prisma. This transition would have been a nightmare without the Repository Layer and all the code written in the business rules Layer.

> <br />
> Technology evolves rapidly, and we must build systems that are as future-proof as possible.

#### _Services_

This package contains all the business logic implementations, as well as the necessary handling to provide information to all interfaces that interact with the API.

#### **Controllers**

This package is responsible for processing data for incoming and outgoing communications. It handles system communications, not business logic.

#### **Routes**

This package defines routes and schemas for `Fastify`, facilitating the creation of RESTful endpoints.

#### **Middlewares**

This package serves as the `security` layer for the API. Here, you'll find rules for access protection and communication restrictions. It handles endpoint data treatment, ensuring that only authorized operations are permitted for user requests.

This doesn't imply that the `Services` neglect unauthorized operations. However, their focus is not on endpoint protection.

#### **Models**

Here are the packages that define the entity contracts bridging the aforementioned layers. The models encapsulated here represent the core data structures and relationships fundamental to the application's domain. These models serve as the foundation for ensuring data consistency and integrity across various components of the system. They define how data is structured, validated, and manipulated throughout the application, fostering coherence and reliability in data management operations.

## Solid and Dependency Injection

The project prioritizes adherence to `SOLID` principles, aiming to establish a robust and maintainable software architecture. Each component diligently follows the principles of Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.

`Dependency Injection (DI)` plays a pivotal role in fostering loose coupling between components, thereby enhancing testability, facilitating easier refactoring and extension of functionalities. By implementing DI, the project promotes modular design, where dependencies are injected dynamically rather than being hardcoded. This approach enhances flexibility and scalability.

Through these practices, the project strives to achieve exemplary code quality, readability, and extensibility, ensuring that modifications and updates can be implemented seamlessly without compromising the overall system integrity.

## Tests

I have implemented test examples using Jest and Supertest to showcase my commitment to testing in this technical project. The goal of these tests is not to provide exhaustive coverage, as testing is a vast and essential topic. Instead, these examples aim to demonstrate how testing can be implemented effectively.

Jest and Supertest were chosen for their simplicity and effectiveness in testing Node.js applications and APIs. These tests cover critical scenarios to validate the functionality and behavior of the application endpoints, ensuring reliability and correctness.

While these examples serve as a starting point, they highlight the importance of incorporating testing practices into software development to enhance quality and maintainability. They demonstrate my approach to ensuring that the application behaves as expected under different conditions, providing confidence in its performance.

## Useful Tools and Team Productivity

In this project, I've integrated two essential tools—Prettier and Husky—to enhance code formatting consistency and streamline the development process:

- **Prettier**: Ensures consistent code formatting across the project. By adopting Prettier, the team adheres to a standardized code style, enhancing readability and reducing formatting-related issues during code reviews.

- **Husky**: Implements Git hooks to enforce pre-commit checks. Specifically, Husky is configured to prevent commits that include unformatted code or fail unit tests. This ensures that all code commits meet quality standards before being pushed to the repository, maintaining codebase integrity and minimizing errors in the development workflow.

These tools are instrumental in fostering a collaborative environment where code quality, consistency, and productivity are prioritized, ultimately contributing to efficient project development and team synergy.

## Conclusion

In conclusion, this technical test project for A-SAFE Digital showcases a comprehensive approach to modern API development and software architecture. By leveraging technologies such as Fastify, Prisma, Docker, and more within a monorepo structure, the project demonstrates versatility and scalability in building a robust "blog posts" API.

The project emphasizes adherence to SOLID principles and utilizes Dependency Injection to promote modular design and maintainable code. This architectural approach ensures flexibility and scalability, enabling seamless integration of new features and enhancements.

Testing plays a pivotal role in the project's development, exemplified by the implementation of Jest and Supertest. These tests validate critical functionalities of the API, ensuring reliability and correctness across different scenarios.

Moreover, the integration of tools like Prettier and Husky underscores a commitment to code quality and team productivity. Prettier maintains consistent code formatting, while Husky enforces pre-commit checks, minimizing errors and enhancing collaboration among team members.

Overall, this project not only meets technical requirements but also exemplifies best practices in API development, testing, and team workflow management. It serves as a testament to my capabilities in delivering scalable, maintainable software solutions that adhere to industry standards and promote efficient collaboration.
