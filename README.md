Geo-Search
==========

This is a geographial search tool designed to help people find endangered species that live within any given area on the Earth. The interface is built with Cesium, React and Redux, and the backend API with Node, Koa and MySQL.

I usually have a working version of this tool running [here](http://157.245.45.254/)

Note that the set of species in the database is a very small subset of all species on Earth; however it does include many endangered and evolutionarily distinct species of mammals and amphibians.


Installing
----------

The simplest way to install this locally is to clone the repo. You will need Docker and Docker Compose installed; do this first if you have not done so already. From the command line, navigate to the geo-search directory and run the command 
```sh
docker-compose up --build
```
which will start the system in dev mode and make it accessible from `localhost:3050`


Search Algorithm
----------------

The backend algorithm used here for finding all species at a given point on the Earth's surface is a combination of a fairly standard point-in-polygon (crossing number) algorithm and a method I created for finding the distance from a point (the search point) to a line (the species range boundary). More information on this can be found [here](https://docs.google.com/presentation/d/1Z572wENXD9VdTXfraKUSwOVYYKWFMJ1nG6wValiYPwE/edit?usp=sharing)


Bugs and other issues
---------------------

- It is difficult to differentiate between selecting an existing species range (polygon) and searching at a point on the globe. My preferred option would be to use double-click on desktop and tap-hold on mobile to search, but Cesium currently does not recognise tap-hold events
- A couple of species (blue whale, fin whale) do not display properly; this is an issue with Cesium