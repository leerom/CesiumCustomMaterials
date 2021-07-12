var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;
var ellipsoid = scene.globe.ellipsoid;

var matGLSL =
    'float SPEED_STEP = 0.01; \n' +
    'vec4 drawLight(float xPos, vec2 st, float headOffset, float tailOffset, float widthOffset){ \n' +
    'float lineLength = smoothstep(xPos + headOffset, xPos, st.x) - smoothstep(xPos, xPos - tailOffset, st.x); \n' +
    'float lineWidth = smoothstep(widthOffset, 0.5, st.y) - smoothstep(0.5, 1.0 - widthOffset, st.y); \n' +
    'return vec4(lineLength * lineWidth); \n' +
    '}\n' +
    'czm_material czm_getMaterial(czm_materialInput materialInput) \n' +
    '{ \n' +
    'czm_material m = czm_getDefaultMaterial(materialInput);\n' +
    'float sinTime = sin(czm_frameNumber * SPEED_STEP * speed); \n' +
    'vec4 v4_core;\n' +
    'vec4 v4_color;\n' +
    'float xPos = 0.0; \n' +
    'if (sinTime < 0.0){ \n' +
    'xPos = cos(czm_frameNumber * SPEED_STEP * speed)+ 1.0 - tailsize; \n' +
    '}else{ \n' +
    'xPos = -cos(czm_frameNumber * SPEED_STEP * speed)+ 1.0 - tailsize; \n' +
    '} \n' +
    'v4_color = drawLight(xPos, materialInput.st, headsize, tailsize, widthoffset);\n' +
    'v4_core = drawLight(xPos, materialInput.st, coresize, coresize*2.0, widthoffset*2.0);\n' +
    'm.diffuse = color.xyz + v4_core.xyz*v4_core.w*0.8; \n' +
    'm.alpha = pow(v4_color.w, 3.0); \n' +
    'return m; \n' +
    '} \n';

var myMat = new Cesium.Material({
    fabric: {
        type: 'FlowingLineMaterial',
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 1.0), // light color
            speed: 1.0,                                  // flowing speed, speed > 0.0 
            headsize: 0.05,                              // 0.0 < headsize < 1.0
            tailsize: 0.5,                               // 0.0 < tailsize < 1.0
            widthoffset: 0.1,                            // 0.0 < widthoffset < 1.0
            coresize: 0.05                               // 0.0 < coresize < 1.0
        },
        source: matGLSL
    }

});

var primitive = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArray([0, 0, -45, 45, -90, 0]),
            width: 20.0,
            vertexFormat: Cesium.VertexFormat.ALL
        })
    }),
    appearance: new Cesium.PolylineMaterialAppearance({
        material: myMat
    })
});


// Add instances to primitives
scene.primitives.add(primitive);

Sandcastle.finishedLoading();