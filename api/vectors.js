exports.dotProduct = function(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

exports.crossProduct = function(v1, v2) {
    return [
        (v1[1] * v2[2] - v2[1] * v1[2]),
        (v2[0] * v1[2] - v1[0] * v2[2]),
        (v1[0] * v2[1] - v2[0] * v1[1])
    ];
}

exports.vectorLength = function(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

exports.geoToCartesian = function(v) {
    // As we're dealing only in angles, we take the radius of the Earth to be unity
    const delta = degreesToRadians(v.delta); // Convert to radians
    const phi = degreesToRadians(v.phi);
    return [
        Math.cos(delta) * Math.cos(phi),
        Math.cos(delta) * Math.sin(phi),
        Math.sin(delta)
    ];
}

const degreesToRadians = function(degrees) {
    return degrees * Math.PI / 180;
};
