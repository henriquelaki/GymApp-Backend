# App

Gympass like app.

## Functional Requirements

- [x] Should be possible to resister a new user;
- [x] Should be possible to authenticate a user;
- [x] Should be possible to get a logged user profile;
- [x] Should be possible to get the number of check-ins of a logged user;
- [x] Should be possible for a logged user to get his/her check-ins history;
- [x] Should be possible for a logger user to search for gyms near him/her up to 10km;
- [x] Should be possible for a logged user to search for gyms by name;
- [x] Should be possible for a logged user to check-in in a gym;
- [x] Should be possible for a gym to validate a user check-in;
- [x] Should be possible to register a new gym;

## Business Rules

- [x] User cannot register with an already used email;
- [x] User cannot do two check-ins in same day;
- [x] User cannot check-in if the gym is less than 100 meters away;
- [x] Any check-in can only be validated until 20 minutes after being done;
- [x] Check-in can only be validated by admins;
- [x] Gym can only be registered by admins;

## Non-functional Requirements

- [x] User password should be encrypted;
- [x] App data should be stored in a PostgreSQL database;
- [x] All listed data should be paginated with 20 items per page;
- [x] User must be identified by a JWT token;

## Dev env installation

### Docker for PostgreSQL

Run the following command to start a PostgreSQL container on a first time:

```bash
docker-compose up -d
```

Run the following command to start a PostgreSQL container on a next times:

```bash
docker-compose start
```

Run the following command to stop a PostgreSQL container:

```bash
docker-compose stop
```
