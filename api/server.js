const Koa = require('koa');
const Router = require('koa-router');
//const parser = require('koa-parser');
const mysql = require('mysql2/promise');

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

// create a root route
// welcome to koa application
/*const router = new Router();
router.get('/', (ctx, next) => {
    ctx.body = "Welcome to Koa Application!";
});*/

const router = new Router();

// GET /species/geo-search
router.get('/species/geo-search', ctx => {
    ctx.body = {};
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
        'SELECT polygon_points.Polygon_ID, Boundary, Phi, Delta FROM polygon_points, polygon WHERE polygon_points.Polygon_ID = polygon.Polygon_ID AND Species_ID =  ?',
        [speciesID]
    );

    const polygons = [];
    const polygonMap = new Map();

    let debugData = "";

    rows.forEach(row => {
        if(polygonMap.get(row.Polygon_ID) === undefined) {
            debugData += " -- adding polygon with ID "+row.Polygon_ID;
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
