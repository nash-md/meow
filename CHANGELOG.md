# Change Log

All notable changes to this project will be documented in this file.

## 2024-01-01

- Added activity log

## 2023-12-26

- Refactored lane configuration. Added setting to hide opportunities after a certain period. Lane options are now displayed per lane type.

## 2023-11-02

- Updated forecast events, there is now an additional event published with the total sum on that particular day. This can be used to report on pipeline change over time.
- The first registration on a new installation is now flagged on the database. This flag will be used to initiate the first setup steps on the frontend.

## 2023-09-20

- Removed TypeORM from the project. The project's dependence on MongoDB has increased in recent months. This is due to certain features that could not be implemented without a direct database connection. As a result, the initial idea of keeping the project database-agnostic using an ORM is no longer feasible.
- Introduced a page state to better identify the React application initiation flow

## 2023-09-08

- Consolidated frontend validation for username and password during registration and user addition after sign-up.

## 2023-09-04

- Creating an account or opportunity will create a dedicated event type.
- Entity references are stored on the data model and are shown on the account tab-

## 2023-08-12

- Added trend forecast per user. Users can now view the change over time, this feature is accessible on the forecast page.

## 2023-07-22

- The Account and Opportunity pages now share the same header layout to provide a consistent user experience. This change simplifies the process of searching for information and adding new accounts or opportunities.

## 2023-07-18

- Opportunity and Account histories are now created in an event-driven approach via an emitter. Currently, there is one strategy implemented using the internal Node.js event API.
- The Logger is now configured directly on the `worker``, not in a separate file.

## 2023-07-14

- Improved the layout and responsiveness on mobile devices for a better user experience.
- Added a warning and lock mechanism for 'Closed Won' and 'Closed Lost' opportunities. They need to be unlocked first before any edits can be made.
- Implemented input sanitization in the schema editor: attribute names are now automatically trimmed of leading and trailing whitespaces upon losing focus (blur event).

## 2023-05-07

- Added filters to table list views: Users can now filter opportunities, users, and accounts.

## 2023-05-03

- Updated the account table view: You can now sort by clicking on the column header. The default sort order is descending. Click the header again to change it to ascending.

## 2023-04-27

- The user's preferred browser language is now used to format all currency values. This means that the currency symbols and formatting will now reflect the user's language and region preferences based on the team's configured currency symbol.

## 2023-04-24

- Added the ability to open and edit opportunities directly from the forecast view, improving the overall user experience.

## 2023-04-18

- Added a screen resolution warning at login, emphasizing that the application is currently designed for desktop use only.
- Enabled full-text search on the frontend, allowing users to easily search for opportunities or stage names from the top-left corner of their dashboard.

## 2023-04-15

- The database connection has been moved to a separate file from the `worker.ts` module. This change prevents issues that could occur if other components (e.g. a worker thread) import the datasource, which could inadvertently re-initialize the Express server.
- Fixed minor issues with TypeORM `0.3.15`. The good news is that TypeORM now supports the latest MongoDB drivers. The separate `MongoClient` client used for reporting has now been initialized with the correct types.

## 2023-04-11

- Revised the opportunity history view, text size and the layout is improved for readability.

## 2023-04-09

- Opportunities can now be filtered for `recently updated` items, displaying all opportunities updated within the last 3 days. Along with minor UI enhancements, the `Closed Lost` and `Closed Won` lanes have been slightly redesigned.

## 2023-04-02

- Added statistics, click [here](https://www.sales-funnel.app/updates) for a more detailed overview
- Migrating frontend from Create React App (CRA) to Vite
- Accounts now support a custom attribute schema

## 2023-03-21

- The React schema editing components are now shared between Account and Opportunity entities to standardize the editing process.
- Opportunities are now automatically created upon registration with a close date set to tomorrow to improve forecast visualization.

## 2023-03-20

- Added opportunity age and last opportunity update to history

## 2023-03-17

- Opportunities now store an `inLaneSince` timestamp value, enabling easier creation of statistics regarding the duration of opportunities in a particular stage.
- Added `nextFollowUpAt` date to opportunity and user interface. The next follow-up date is now mandatory on the UI when updating an opportunity, as we believe every opportunity should have a subsequent step. On the API, `nextFollowUpAt` is optional; while it is usually clear what the next step should be after qualifying an opportunity, this may not always be the case for many API use cases, such as inbound leads.
- Mandatory fields for new opportunities are now highlighted in red if missing.

## 2023-03-12

- Added `LaneType` enum to frontend and backend. Enum values are `ClosedWon`, `ClosedLost` and `Normal`
- Moved the forecast amount calculation to a separate service to improve performance and reduce coupling between components.

## 2023-03-08

- Added confirmation message to the account and opportunity forms to inform users when changes have been saved. The confirmation message will appear at the bottom of the screen and will disappear after a few seconds.
- The Redux store now contains a complete user entity for the session

## 2023-03-07

- The new user flow is updated to make it easier for new users to join the platform. Instead of having a password set by the administrator, new users can now simply use an invite link to get started. Once they click on the link, they'll be prompted to set their own password using a unique code provided in the invite.

## 2023-03-06

- Added user settings. Users can now change settings and logout by clicking on the bottom left avatar. Account settings and user settings are now split.

## 2023-03-05

- Accounts now have a tab with comments, users can comment accounts the same way as opportunities

## 2023-03-04

- If the token cannot be validated upon page reload, the UI will display an error message asking the user to check their internet connection. The token will not be deleted
- The UI uses now a translations file for some error messages
- The backend is now validating the token without a JSON response, a HTTP status code `200 OK` is returned instead. If the token is valid,the `login` route will accept the token to login the user.

## 2023-03-02

- Added basic search to the accounts page, you can search for a name

## 2023-02-28

- Attribute changes on opportunities are now stored with details, the history will show `updated`, `added` and `removed`, including the changed value.

## 2023-02-27

- Added the `Account` entity, you can now create a basic company profile for your opportunities
- The former `Account` entity is now `Team`

## 2023-02-25

- Support for light and dark mode, it will use the OS default via media query `prefers-color-scheme`

## 2023-02-24

- Extended the OpenAPI definitions .yml file, added route and schema for `POST card/{cardId}`, updated inline requests to `$ref`
- `POST /cards` now supports `laneName` and `laneId`, either `laneName` or `laneId` must be included in the request
- Upon registration, the account now contains example opportunities to help users understand how to use the application.
- Opportunities are not longer deleted, instead `status: deleted` indicates the deletion
- To ensure consistency in the data model, document references to an `_id` field are now named `{entity}Id`

## 2023-02-23

- extended the OpenAPI definitions .yml file to include additional routes and parameters
- added Docker configuration, you can now run the project with `docker-compose up`
- opportunity attributes are now an object instead of an array

## 2023-02-21

- add components and route to delete additional users
- added password change

## 2023-02-19

- opportunity card positions are now persisted, drag and drop now supports index position on lane
- added user update route
- improved lane validation upon card create

## 2023-02-18

- fixed attributes defaults
- added API tests with [Ava](https://github.com/avajs/ava)

## 2023-02-17

- the deal attributes have now a basic validation, empty dropdown values or missing names are not allowed
- changes on the configuration are now confirmed with a modal

## 2023-02-16

- the frontend now supports custom attributes. You can now configure and use custom fields

## 2023-02-15

- added schema controller and entity
- support for schema configuration on opportunities. You can now add custom fields; textarea, text and dropdown.

## 2023-02-14

- added logout to frontend
- extended forecast, it will show the closed deals and predicted deals in the selected timeframe
- the funnel configuration now includes a stage type to indicate the function of each stage, which enables users to rename the **Closed Won** and **Closed Lost** stages if needed.

## 2023-02-13

- added list with won opportunities
- opportunities can be re-assigned on the frontend

## 2023-02-12

- added forecast to frontend
- support for top level async

## 2023-02-10

- added OpenAPI 3.0 definitions
- handle missing amount gracefully
- validate ISO 8601 close date

## 2023-02-10

- added User create and list route
- Express middleware to check database connection
- updated JSON schema validation

## 2023-02-07

- wrapped all forecast values in a `Currency` component
- added Lanes to Redux store and backend
- switched drag-and-drop functionality to react-beautiful-dnd

## 2023-02-06

- Added currency support
- Initial commit
