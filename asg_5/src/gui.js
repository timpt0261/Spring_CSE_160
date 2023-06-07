// Initialize dat.GUI
const gui = new dat.GUI();

// GUI for Hemisphere Light
const hemisphereLightFolder = gui.addFolder('Hemisphere Light');
hemisphereLightFolder.addColor(hemiLight, 'color').name('Color');
hemisphereLightFolder.addColor(hemiLight, 'groundColor').name('Ground Color');
hemisphereLightFolder.add(hemiLight, 'intensity', 0, 1).name('Intensity');
hemisphereLightFolder.open();

// GUI for Directional Light
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.addColor(dirLight, 'color').name('Color');
directionalLightFolder.add(dirLight, 'intensity', 0, 2).name('Intensity');
directionalLightFolder.add(dirLight.position, 'x', -100, 100).name('X Position');
directionalLightFolder.add(dirLight.position, 'y', -100, 100).name('Y Position');
directionalLightFolder.add(dirLight.position, 'z', -100, 100).name('Z Position');
directionalLightFolder.open();

// GUI for Point Light
const pointLightFolder = gui.addFolder('Point Light');
pointLightFolder.addColor(pointLight, 'color').name('Color');
pointLightFolder.add(pointLight, 'intensity', 0, 2).name('Intensity');
pointLightFolder.add(pointLight.position, 'x', -100, 100).name('X Position');
pointLightFolder.add(pointLight.position, 'y', -100, 100).name('Y Position');
pointLightFolder.add(pointLight.position, 'z', -100, 100).name('Z Position');
pointLightFolder.open();