# Inventory Manager
Electron Desktop application to create a simple inventory with items and sells.
It uses Sqlite3 for the Database.

## Requirements
- Git 2.3 or higher
- Node v12 or higher
- For Windows 10
  - Option 1
    - Install all the required tools and configurations using Microsoft's windows-build-tools using `npm install --global windows-build-tools` from an elevated PowerShell or CMD.exe (run as Administrator). (NOT TESTED BUT WORTH TRYING IT NEXT TIME)
  - Option 2
    - Python 3.7 or higher
    - Visual Studio 2019 Community or later including the "Desktop development with C++" workload. (For more details https://github.com/nodejs/node-gyp#on-windows)

## Development
```sh
$ npm install

# Run the "main" side with electron
$ npm run start-dev

# Run the "renderer" side with webpack
$ npm run renderer-start-dev
```
