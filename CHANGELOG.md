# Change Log

All notable changes to this project will be documented in this file.

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
