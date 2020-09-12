# express-typeorm-boilerplate

- Language: Typescript
- Server: express
- DB: MySQL
- ORM: typeorm
- Testing: Mocha + chai + chai-http
- etc: typedi(DI) + celebrate(Validator) + lodash(utils) + eslint

## Project Structure

- 3 Layer Architecture - Controller -> Service Layer -> Data Access Layer

```
src
│   app.js          # App entry point
└───api-routes      # Express route controllers for all the endpoints of the app
└───config          # Environment variables and configuration related stuff
└───loaders         # Split the startup process into modules
└───entity          # Typeorm models
└───services        # All the business logic is here
└───subscribers     # Event handlers for async task
└───types           # Type declaration files (d.ts) for Typescript
└───interfaces      # Interface declaration for Typescript
└───utils           # Interface declaration for Typescript
└───jobs            # Jobs definitions for agenda.js
```

Ref: https://github.com/santiq/bulletproof-nodejs
