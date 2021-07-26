var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;

var matGLSL =
    'vec3 RadarPing(in vec2 uv, in vec2 center, in float innerTail, \n' +
    'in float frontierBorder, in float timeResetSeconds, \n' +
    'in float radarPingSpeed, in float fadeDistance, float t) \n' +
    '{ \n' +
    'vec2 diff = center - uv; \n' +
    'float r = length(diff); \n' +
    'float time = mod(t, timeResetSeconds) * radarPingSpeed; \n' +
    'float circle; \n' +
    'circle += smoothstep(time - innerTail, time, r) * smoothstep(time + frontierBorder, time, r); \n' +
    'circle *= smoothstep(fadeDistance, 0.0, r); \n' +
    'return vec3(circle); \n' +
    '} \n' +
    'czm_material czm_getMaterial(czm_materialInput materialInput) \n' +
    '{ \n' +
    'czm_material m = czm_getDefaultMaterial(materialInput);\n' +
    'vec2 uv = materialInput.st; \n' +
    'uv = uv.xy * 2.; \n' +
    'uv += vec2(-1.0, -1.0); \n' +
    'float fadeDistance = 1.8; \n' +
    'float resetTimeSec = 5.; \n' +
    'float radarPingSpeed = 0.2; \n' +
    'vec2 greenPing = vec2(0.0, 0.0); \n' +
    'vec3 outColor;\n' +
    'float iTime = czm_frameNumber * 0.01; \n' +
    'outColor += RadarPing(uv, greenPing, 0.08, 0.00025, resetTimeSec, radarPingSpeed, fadeDistance, iTime); \n' +
    'outColor += RadarPing(uv, greenPing, 0.08, 0.00025, resetTimeSec, radarPingSpeed, fadeDistance, iTime + 1.5); \n' +
    'outColor += RadarPing(uv, greenPing, 0.08, 0.00025, resetTimeSec, radarPingSpeed, fadeDistance, iTime + 3.0); \n' +
    'm.diffuse = outColor * color.xyz; \n' +
    'm.alpha = outColor.r; \n' +
    'return m; \n' +
    '} \n'

var myMat = new Cesium.Material({
    fabric: {
        type: 'RippleMaterial',
        uniforms: {
            color: new Cesium.Color(0.0, 1.0, 0.0) // light color
        },
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