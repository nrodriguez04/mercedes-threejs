import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion } from 'framer-motion';

import ErrorBoundary from './ErrorBoundary';

// style import
import './styles/splashScreen.module.css'

// image import
import logo from './assets/mercedesLogo.png'

const Scene = () => {
  const mount = useRef(null);
  const [renderer, setRenderer] = useState(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const viewHeight = 10; // Adjust this value to control the view height
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(-viewHeight * aspectRatio / 2, viewHeight * aspectRatio / 2, viewHeight / 2, -viewHeight / 2, 0.1, 1000);
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 0, 0);

    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(window.innerWidth, window.innerHeight);
    newRenderer.setClearColor(0xffffff);

    setRenderer(newRenderer);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      newRenderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 20, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load('/mercedes-benz_300_sl_gullwing/scene.gltf', function (gltf) {
      const carModel = gltf.scene;
      carModel.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      const box = new THREE.Box3().setFromObject(carModel);
      const center = box.getCenter(new THREE.Vector3());
      carModel.position.x += (carModel.position.x - center.x);
      carModel.position.y += (carModel.position.y - center.y);
      carModel.position.z += (carModel.position.z - center.z);

      scene.add(carModel);
    }, undefined, function (error) {
      console.error(error);
    });

    const controls = new OrbitControls(camera, newRenderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const animate = function () {
      requestAnimationFrame(animate);

      controls.update();
      newRenderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    if (mount.current && renderer) {
      mount.current.appendChild(renderer.domElement);

      return () => {
        mount.current.removeChild(renderer.domElement);
      };
    }
  }, [renderer]);

  return <div ref={mount} style={{ width: '50%', height: '100vh' }} />;
};

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4000); // Display splash screen for 4 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
  <motion.div
  initial={{ opacity: 1 }}
  animate={{ opacity: 0 }}
  transition={{ duration: 3, delay: 1 }}
  className="splashScreen"
  style={{ backgroundColor: 'black', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100 }}
  >
  <img src={logo} alt="Mercedes Logo" style={{ height: '500px', width: '800px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
  </motion.div>
  );
  };
  
 
  const App = () => {
    const [splashScreenFinished, setSplashScreenFinished] = useState(false);
  
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <ErrorBoundary>
          {!splashScreenFinished && <SplashScreen onFinish={() => setSplashScreenFinished(true)} />}
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: 0,
              padding: '1rem',
              pointerEvents: 'none',
            }}
          >
            <h1 style={{ fontSize: '1.5rem' }}>Mercedes-Benz 300 SL</h1>
            <p style={{ fontSize: '1.1rem' }}>“Elegantly controlled power”</p>
            <ul style={{ fontSize: '1rem' }}>
            <li>Engine type - Number of cylinders :	Inline 6</li>
            <li>Engine Code :	M 198 I / 198.980</li>
            <li>Fuel type :	Petrol</li>
            <li>Fuel System :	Bosch mechanical direct fuel injection</li>
            <li>Engine size - Displacement - Engine capacity :	182.8 cu-in / 2996 cm3</li>
            <li>Bore x Stroke :	3.35 x 3.46 inches (85.00 x 88.00 mm)</li>
            <li>Number of valves :	12 Valves</li>
            <li>Compression Ratio :	9.5</li>
            <li>Maximum power - Output - Horsepower :	222 HP / 225 PS / 165 kW @ 5800 rpm</li>
            <li>Maximum torque :	202 lb-ft / 274 Nm @ 4600 rpm</li>
            <li>Drive wheels - Traction - Drivetrain :	RWD</li>
            <li>Transmission Gearbox - Number of speeds :	4 speed Manual</li>
          </ul>
          </div>
          <Scene />
        </ErrorBoundary>
      </div>
    );
  };
  
  export default App;
  
    