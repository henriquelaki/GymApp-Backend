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
- [x] All listed data should be paginated with 20 items per p

## Defined Routes

You can see below the defined routes for this app:

### User

| Method | Route | Description |

| GET | /me | Retrieves authenticated user profile info |

| POST | /users | Sign up a new user |

| POST | /sessions | Authenticate a user |

| PATCH | /token/refresh | Get a new session and refresh token to keep user authenticated |

### Check-in

| Method | Route | Description |

| GET | /check-ins/history | Retrieves authenticated user check-ins history |

| GET | /check-ins/metrics | Retrieves authenticated user check-ins metrics |

| PATCH | /check-ins/:checkInId/validate | Validates a check-in |

### Gym

| Method | Route | Description |

| GET | /gyms/search | Search for gyms by title |

| GET | /gyms/nearby | Search for gyms near authenticated user |

| POST | /gyms/:gymId/check-in | Check-in in a gym |

| POST | /gyms | Register a new gym |

## Running the app

### Docker

Run the following command to start the database:

```bash
docker-compose up -d
```

Run the following command to stop the database:

```bash
docker-compose stop
```
