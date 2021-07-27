var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;

var matGLSL =
    '#define L length(c - .1*vec2(    // use: L x,y)) \n' +
    '#define M(v)   max(0., v) \n' +
    'czm_material czm_getMaterial(czm_materialInput materialInput) \n' +
    '{ \n' +
    'czm_material m = czm_getDefaultMaterial(materialInput);\n' +
    'vec2 uv = materialInput.st; \n' +
    'vec2 c = uv+uv - 1.0, \n' +
    'k = .1-.1*step(.007,abs(c)); \n' +
    'float x = L 0))*25., // x,y - polar coords \n' +
    'iTime = czm_frameNumber * 0.01, \n' +
    'y = mod(atan(c.y, c.x)+iTime, 6.28), \n' +
    'd = M(.75 - y * .4), \n' +
    'b = min( min(L -3,-1)), L 6,-4)) ), L 4,5)) ) + .06 - y * .04; \n' +
    'float result = (x < 24. ? .25 + M(cos(x + .8) - .95) * 8.4 + k.x + k.y + d * d+ M(.8 - y * (x + x + .3)): 0.) \n' +
    '+ M(1. - abs(x + x - 48.)); \n' +
    'm.diffuse = vec3(0.0, result, 0.1); \n' +
    'm.alpha = result; \n' +
    'return m; \n' +
    '} \n'

var myMat = new Cesium.Material({
    fabric: {
        type: 'RadarMaterial',
        source: matGLSL
    }
});

var primitive = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
            rectangle: Cesium.Rectangle.fromDegrees(100.0, 31.0, 110.0, 39.0),
            vertexFormat: Cesium.VertexFormat.ALL
        })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: myMat
    })
});

// Add instances to primitives
scene.primitives.add(primitive);

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(105.0, 35.0, 4500000.0)
});