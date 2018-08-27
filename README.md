# Neighborhood Map project 

It is a single page application featuring a map of London City restaurants. After clicking one of the markers on the map or restaurant title in the sidebar list, detailed information about selected restaurant will be shown. 
The application built with React, Google Maps API and Forsquare API.

## Table of Contents

* [Instructions](#instructions)
* [Dependencies](#dependencies)

## Instructions

- To start the app download or clone the repository

- In this folder run 'npm install' to install dependencies

- After installation you can run app in developer mode or in build mode

  - For developer mode

    - run 'npm start' to start server
    - with your server running, visit the site: `http://localhost:3000`

  - For build mode

    - use 'npm run build' to create a production build
    - after build folder is ready, serve it with static server. Use 'npm install -g serve' and 'serve -s build' after the static server is installed
    - visit the site: `http://localhost:5000`

    Notice: Service worker is available in production build only.

## Dependencies

- This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

-  [Google Maps](https://developers.google.com/maps/documentation/)

- [Foursquare api](https://developer.foursquare.com) used to provide information when a map marker or list view entry is clicked

  Notice: The Foursquare API has a limit of 50 Premium API Calls per day for Sandbox Tier Accounts. For this project used Premium method to get rich info (including image, hours of work and rating). So when the limit is reached no info will be shown on marker click till tne next day. Instead the "data unavailable" message will be shown.