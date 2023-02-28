# Change Log

All notable changes to this project will be documented in this file.

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
