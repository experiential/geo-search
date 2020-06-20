const Koa = require('koa');
const Router = require('koa-router');
//const parser = require('koa-parser');
const mysql = require('mysql2/promise');

const { pointToPolygonDistance } = require('./geo_functions');

const app = new Koa();
const PORT = 4000;

//app.use(parser());

// Set database connection parameters
const databaseParameters = {
    host: 'database',
    user: 'james',
    password: 'secret',
    database: 'geo_search'
}

const router = new Router();

// GET /species/geo-search
router.get('/species/geo-search', async ctx => {

    let debugData = "";

    // Get search point
    const test = { phi: ctx.query.phi, delta: ctx.query.delta };
    const searchRange = ctx.query.range;

    // Open database connection
    const connection = await mysql.createConnection(databaseParameters);

    // Get all polygon IDs, with associated species, from database
    // Get geo data for specified species from database
    const [ rows ] = await connection.execute(
        `SELECT species.Species_ID, Species_order, Species_family, Scientific_name, Common_name, GE_score, Polygon_ID 
        FROM polygon, species 
        WHERE polygon.Species_ID = species.Species_ID 
        ORDER BY GE_score+0, Scientific_name, Polygon_ID`
    );

    const speciesFound = new Map();

    //rows.forEach(row => { // We can't use this because of async calls to the DB
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++)
    {
        const row = rows[rowIndex];
        const speciesID = row.Species_ID;
        const polygonID = row.Polygon_ID;
        //console.log("Checking polygon " + polygonID);

        // If the search point has already been found to be *inside* the species range, we can now skip any other polygons for this species.
        // Polygons for one species should not overlap, and even if they do, any intended meaning that it could possibly have is unspecified.
        if(speciesFound.has(speciesID) && speciesFound.get(speciesID).distance === 0.0) {
            continue;
        }

        const [ points ] = await connection.execute(
            `SELECT Point_number as pointIndex, Phi as phi, Delta as delta 
            FROM polygon_points 
            WHERE Polygon_ID = ? 
            ORDER BY Boundary, Point_number`,
        [ polygonID ]);

        const distance = pointToPolygonDistance(test, points);

        if(distance <= searchRange) { // handles case where searchRange is 0.0
            // Species is within search range
            if(speciesFound.has(speciesID)) {
                speciesFound.get(speciesID).distance = Math.min(distance, speciesFound.get(speciesID).distance);
            } else {
                row.distance = Math.round(distance);
                speciesFound.set(speciesID, row);
            }
        }
    }

    // Return results
    //console.log("speciesFound:", speciesFound);
    const results = Array.from(speciesFound.values()).map( speciesData => {
        return {
            speciesID: speciesData.Species_ID,
            order: speciesData.Species_order,
            family: speciesData.Species_family,
            binomial: speciesData.Scientific_name,
            commonName: speciesData.Common_name,
            threatStatus: speciesData.GE_score,
            distance: speciesData.distance
        };
    })

    ctx.body = { results };
});

// GET /species/:id/geo-data
router.get('/species/:id/geo-range', async ctx => {

    // Check species ID has been provided and is a valid integer
    const speciesID = parseInt(ctx.params.id);
    if(!speciesID) {
        ctx.throw(400, "Species ID required but not given");
    }

    // Open database connection
    const connection = await mysql.createConnection(databaseParameters);

    // Get geo data for specified species from database
    const [rows, fields] = await connection.execute(
        `SELECT polygon_points.Polygon_ID, Boundary, Phi, Delta 
        FROM polygon_points, polygon 
        WHERE polygon_points.Polygon_ID = polygon.Polygon_ID AND Species_ID = ?`,
        [speciesID]
    );

    const polygons = [];
    const polygonMap = new Map();

    let debugData = "";

    rows.forEach(row => {
        if(polygonMap.get(row.Polygon_ID) === undefined) {
            debugData += " -- adding polygon with ID " + row.Polygon_ID;
            polygonMap.set(row.Polygon_ID, polygons.length);
            polygons.push([]);
        }

        const polygonID = polygonMap.get(row.Polygon_ID);

        if(!polygons[polygonID][row.Boundary]) {
            polygons[polygonID][row.Boundary] = [];
        }

        polygons[polygonID][row.Boundary].push(row.Phi);
        polygons[polygonID][row.Boundary].push(row.Delta);
    });

    // Return response
    //ctx.body = polygons;
    ctx.body = { speciesID, range: polygons, debugData };
});


app.use(router.routes());

app.listen(PORT);
console.log(`Server is listening on port ${PORT}`);
