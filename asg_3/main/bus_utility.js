function drawTwoWindows(windowStartMatrix, windowColor) {
    var windowOne = new Cube();
    windowOne.color = windowColor;
    windowOne.matrix = new Matrix4(windowStartMatrix);
    windowOne.matrix.scale(0.20, 0.22, 0.2);
    windowOne.render();

    var windowTwo = new Cube();
    windowTwo.color = windowColor;
    windowTwo.matrix = new Matrix4(windowStartMatrix);
    windowTwo.matrix.translate(0, 0, 0.23);
    windowTwo.matrix.scale(0.20, 0.22, 0.2);
    windowTwo.render();
}

function drawBus(busRootMatrix, busColor, tyreColor, windowColor, headsignColor) {

    var body = new Cube();
    body.color = busColor;
    body.matrix = new Matrix4(busRootMatrix);
    body.matrix.scale(0.5, 0.5, 1.5);
    body.render();



    var frontWindowLeft = new Cube();
    frontWindowLeft.color = windowColor;
    frontWindowLeft.matrix = new Matrix4(busRootMatrix);
    frontWindowLeft.matrix.scale(0.20, 0.25, 0.2);
    frontWindowLeft.matrix.translate(-0.54, 0, -3.26);
    frontWindowLeft.render();

    var frontWindowRight = new Cube();
    frontWindowRight.color = windowColor;
    frontWindowRight.matrix = new Matrix4(busRootMatrix);
    frontWindowRight.matrix.scale(0.20, 0.25, 0.2);
    frontWindowRight.matrix.translate(0.54, 0, -3.26);
    frontWindowRight.render();

    // left side driver window
    frontWindowRight.color = windowColor;
    frontWindowRight.matrix = new Matrix4(busRootMatrix);
    frontWindowRight.matrix.scale(0.20, 0.22, 0.2);
    frontWindowRight.matrix.translate(0.9, 0, -3.1);
    frontWindowRight.render();

    // left window bwtween the two others
    var leftMiddleWindow = new Cube();
    leftMiddleWindow.color = windowColor;
    leftMiddleWindow.matrix = new Matrix4(busRootMatrix);
    leftMiddleWindow.matrix.scale(0.14, 0.22, 0.16);
    leftMiddleWindow.matrix.translate(1.4, 0.28, 0.6);
    leftMiddleWindow.render();

    // front left
    var windowStartMatrix = new Matrix4(busRootMatrix);
    windowStartMatrix.translate(0.18, 0.06, -0.37);
    drawTwoWindows(windowStartMatrix, windowColor);

    // back left
    windowStartMatrix.translate(0.0, 0.0, 0.7);
    drawTwoWindows(windowStartMatrix, windowColor);

    // back right
    windowStartMatrix.translate(-0.35, 0.0, 0.0);
    drawTwoWindows(windowStartMatrix, windowColor);

    // front right
    windowStartMatrix.translate(0.0, 0.0, -0.7);
    drawTwoWindows(windowStartMatrix, windowColor);

    // front right door
    windowStartMatrix.scale(1, 1.6, 0.35);
    windowStartMatrix.translate(0.0, -0.035, -0.8);
    drawTwoWindows(windowStartMatrix, windowColor);

    // back right door
    windowStartMatrix.translate(0.0, 0.0, 2.0);
    drawTwoWindows(windowStartMatrix, windowColor);

    // Headsign
    var leftMiddleWindow = new Cube();
    leftMiddleWindow.color = headsignColor;
    leftMiddleWindow.matrix = new Matrix4(busRootMatrix);
    leftMiddleWindow.matrix.scale(0.4, 0.08, 0.5);
    leftMiddleWindow.matrix.translate(0.0, 2.4, -1.02);
    leftMiddleWindow.render();

    // tire front left
    var tireFrontLeft = new Cylinder(10);
    tireFrontLeft.color = tyreColor;
    tireFrontLeft.matrix = new Matrix4(busRootMatrix);
    tireFrontLeft.matrix.scale(0.55, 0.5, 0.5);
    tireFrontLeft.matrix.rotate(90, 0, 1, 0);
    tireFrontLeft.matrix.translate(0.8, -0.48, 0.0);
    tireFrontLeft.matrix.rotate(-g_tireAngle, 0, 0, 1);
    tireFrontLeft.matrix.scale(1, 1, 0.15);
    tireFrontLeft.matrix.translate(0.0, 0.0, 2.6);
    tireFrontLeft.render();

    // tire front right
    tireFrontLeft.matrix.translate(0.0, 0.0, -5.2);
    tireFrontLeft.render();

    tireFrontLeft.matrix.rotate(g_tireAngle, 0, 0, 1);

    // tire back right
    tireFrontLeft.matrix.translate(-1.4, 0.0, 0.0);
    tireFrontLeft.matrix.rotate(-g_tireAngle, 0, 0, 1);
    tireFrontLeft.render();

    // tire back left
    tireFrontLeft.matrix.translate(0.0, 0.0, 5.2);
    tireFrontLeft.render();
}

function drawLegRight(legRootMatrix, offset) {
    if (g_animationsEnabled) {
        var g_armAngle_local = 45 * Math.sin((g_seconds + offset) * g_walkingSpeed);
    }
    else {
        var g_armAngle_local = 0;
    }
    var x_anim_angle = 30 + (g_armAngle_local / 3);
    var y_anim_angle = (g_armAngle_local / 2);


    var centerColor = [0.05, 0.05, 0.05, 1.0];
    var segmentColor = [0.1, 0.1, 0.1, 1.0];

    var legTop = new Cube();
    legTop.color = centerColor;
    legTop.matrix = new Matrix4(legRootMatrix);
    legTop.matrix.scale(0.2, 0.2, 0.2);
    legTop.render();

    var legTopSection = new Cube();
    legTopSection.color = segmentColor;
    legTopSection.matrix = new Matrix4(legRootMatrix);
    legTopSection.matrix.rotate(-(x_anim_angle / 2), (y_anim_angle / 20), (y_anim_angle / 20), 1);
    legTopSection.matrix.rotate(-g_legBaseBonus, 0, 0, 1);
    legTopSection.matrix.scale(0.8, 0.12, 0.12);
    legTopSection.matrix.translate(0.44, 0.0, 0.0);
    legTopSection.render();

    var legMid = new Cube();
    legMid.color = centerColor;
    legMid.matrix = new Matrix4(legTopSection.matrix);
    legMid.matrix.scale(0.2, 1.5, 1.5);
    legMid.matrix.translate(2.9, 0.0, 0.0);
    legMid.render();

    var legMidSection = new Cube();
    legMidSection.color = segmentColor;
    legMidSection.matrix = new Matrix4(legMid.matrix);
    legMidSection.matrix.rotate(-(x_anim_angle / 2), (y_anim_angle / 30), 0, 1);
    legMidSection.matrix.rotate(-g_legMidBonus, 0, 0, 1);
    legMidSection.matrix.scale(3, 0.6, 0.6);
    legMidSection.matrix.translate(0.4, 0.0, 0.0);
    legMidSection.render();

    var legLower = new Cube();
    legLower.color = centerColor;
    legLower.matrix = new Matrix4(legMidSection.matrix);
    legLower.matrix.scale(0.3, 1.6, 1.6);
    legLower.matrix.translate(1.6, 0.0, 0.0);
    legLower.render();

    var legLowerSection = new Cube();
    legLowerSection.color = segmentColor;
    legLowerSection.matrix = new Matrix4(legLower.matrix);
    legLowerSection.matrix.rotate(-(x_anim_angle / 2), (y_anim_angle / 30), 0, 1);
    legLowerSection.matrix.scale(3, 0.6, 0.6);
    legLowerSection.matrix.translate(0.60, 0.0, 0.0);
    legLowerSection.render();
}

function drawGround(groundCenterMatrix, groundWidth, groundLength) {
    var spacer = 1.001;
    for (y = 0; y < groundLength; y++) {
        for (x = 0; x < groundWidth; x++) {
            var legLowerSection = new Cube();
            var myY = (y + groundColorsOffset) % (groundLength - 1);
            legLowerSection.color = groundColors[x][myY];
            legLowerSection.matrix = new Matrix4(groundCenterMatrix);
            // legLowerSection.matrix.rotate(-(x_anim_angle/2), (y_anim_angle/30), 0, 1);
            legLowerSection.matrix.scale(0.5, 0.5, 0.5);
            legLowerSection.matrix.translate(x * spacer, 0.0, (y * spacer) - g_groundOffset);
            legLowerSection.render();
        }
    }

    if (g_groundOffset > 1) {
        g_groundOffset = 0;
        groundColorsOffset = groundColorsOffset + 1;
    }
}

function drawSpiderBus(rootMatrix) {
    var busColor = [0.9, 0.9, 0.9, 1.0];
    var windowColor = [0.1, 0.1, 0.1, 1.0];
    var headsignColor = [1.0, 0.85, 0.0, 1.0];
    var tyreColor = [0.27, 0.27, 0.27, 1.0];

    // draw bus
    drawBus(rootMatrix, busColor, tyreColor, windowColor, headsignColor);

    // draw left legs
    rootMatrix.scale(0.5, 0.5, 0.5);
    rootMatrix.translate(0.5, -0.4, 0);
    drawLegRight(rootMatrix, 0);

    rootMatrix.translate(0, 0.0, 1.0);
    drawLegRight(rootMatrix, 0.8);

    rootMatrix.translate(0.0, 0.0, -2.0);
    drawLegRight(rootMatrix, 1.8);

    // draw right legs
    rootMatrix.rotate(180, 0, 1, 0);
    rootMatrix.translate(1.0, 0.0, -1.0);
    drawLegRight(rootMatrix, 0.0);

    rootMatrix.translate(0, 0.0, 1.0);
    drawLegRight(rootMatrix, 0.7);

    rootMatrix.translate(0.0, 0.0, -2.0);
    drawLegRight(rootMatrix, 1.9);

}