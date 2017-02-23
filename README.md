## dbMove

`Currently under heavy development`

This is an (currently) experimental package for running mysql database migrations between multiple stages.
Currently it only supports replacing one string (`host`), but it will support multiple some time.
More Information, Docs & Tests will follow.
Here is an example config for you to play around:
```
{
  "paths": {
    "mysql": "mysql",
    "mysqldump": "mysqldump",
    "backups": "./backups"
  },
  "stages": {
    "development": {
      "host": "DB_HOST",
      "port": DB_PORT,
      "database": "DB_NAME",
      "username": "DB_USER",
      "password": "DB_PASSWORD",
      "exclude_tables": [], // Array of tables you want to exclude from the dumps
      "backup": true, // Create and store a backup before this Server gets overwritten?
      "replace": {
        "host": "localhost:8083" // Currently the only option to replace
      },
      "webhooks": {
        "before": "", // Execute Webhooks before Deploying (on the Source Server)
        "after": "" // Execute Webhooks before Deploying (on the Target Server)
      }
    },
    "other_stage": {
      "host": "DB_HOST",
      "port": DB_PORT,
      "database": "DB_NAME",
      "username": "DB_USER",
      "password": "DB_PASSWORD",
      "exclude_tables": [], // Array of tables you want to exclude from the dumps
      "backup": true, // Create and store a backup before this Server gets overwritten?
      "replace": {
        "host": "localhost:8083" // Currently the only option to replace
      },
      "webhooks": {
        "before": "", // Execute Webhooks before Deploying (on the Source Server)
        "after": "" // Execute Webhooks before Deploying (on the Target Server)
      }
    },
    "any_stage": {
      "host": "DB_HOST",
      "port": DB_PORT,
      "database": "DB_NAME",
      "username": "DB_USER",
      "password": "DB_PASSWORD",
      "exclude_tables": [], // Array of tables you want to exclude from the dumps
      "backup": true, // Create and store a backup before this Server gets overwritten?
      "replace": {
        "host": "localhost:8083" // Currently the only option to replace
      },
      "webhooks": {
        "before": "", // Execute Webhooks before Deploying (on the Source Server)
        "after": "" // Execute Webhooks before Deploying (on the Target Server)
      }
    },

  }
}
```
Store it as `.dbrc` in the root of your project.

To run deployments execute `dbmove --source=development --target=other_stage`
