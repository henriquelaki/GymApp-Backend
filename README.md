# GymPass-like App

Welcome to a GymPass-like app, a platform that allows users to search for gyms, register their profiles, and check-in at their preferred gym. This app is built with user-friendly features, such as:

## Functional Requirements

- [x] Registration of a new user
- [x] Authentication of a user
- [x] Retrieval of a logged-in user's profile
- [x] Retrieval of a logged-in user's check-ins metrics
- [x] Retrieval of a logged-in user's check-ins history
- [x] Search for gyms near the logged-in user up to 10km
- [x] Search for gyms by name
- [x] Check-in at a gym by a logged-in user
- [x] Validation of a user's check-in by a gym
- [x] Registration of a new gym

## Business Rules

This app has defined business rules that enhance user experience, including:

- [x] Users cannot register with an already used email
- [x] Users cannot do two check-ins on the same day
- [x] Users cannot check-in if the gym is less than 100 meters away
- [x] Any check-in can only be validated until 20 minutes after being done
- [x] Check-in can only be validated by admins
- [x] Gyms can only be registered by admins

## Non-functional Requirements

This app also meets the following non-functional requirements to enhance user security and data management:

- [x] User passwords are encrypted
- [x] App data is stored in a PostgreSQL database
- [x] All listed data is paginated with 20 items per page

## Defined Routes

The app has defined routes to improve frontend integration, including:

### User

| Method | Route          | Description                                                    |
| ------ | -------------- | -------------------------------------------------------------- |
| GET    | /me            | Retrieves authenticated user profile info                      |
| POST   | /users         | Sign up a new user                                             |
| POST   | /sessions      | Authenticate a user                                            |
| PATCH  | /token/refresh | Get a new session and refresh token to keep user authenticated |

### Check-in

| Method | Route                          | Description                                    |
| ------ | ------------------------------ | ---------------------------------------------- |
| GET    | /check-ins/history             | Retrieves authenticated user check-ins history |
| GET    | /check-ins/metrics             | Retrieves authenticated user check-ins metrics |
| PATCH  | /check-ins/:checkInId/validate | Validates a check-in                           |

### Gym

| Method | Route                 | Description                             |
| ------ | --------------------- | --------------------------------------- |
| GET    | /gyms/search          | Search for gyms by title                |
| GET    | /gyms/nearby          | Search for gyms near authenticated user |
| POST   | /gyms/:gymId/check-in | Check-in at a gym                       |
| POST   | /gyms                 | Register a new gym                      |

## Running the App

This app is built with a Docker container for its database that simplifies installation and usage. Follow the steps below to get started:

1. Start the database by running the following command:

```bash
docker-compose up -d
```

2. Stop the database by running the following command:

```bash
docker-compose stop
```

We hope you enjoy using our GymPass-like app! Feel free to fork or improve it as you wish.
