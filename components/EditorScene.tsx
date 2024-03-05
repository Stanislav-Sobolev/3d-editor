import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing';
import PlaneGeometryComponent from './PlaneGeometryComponent';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setSelection, deselect } from '../store/editorSlice';
import { Vector3, Group, Box3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';

const EditorScene: React.FC = () => {
  const dispatch = useDispatch();
  const stateColumns = useSelector((state: RootState) => state.editor.objects);
  const { scene } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group>(new THREE.Group());
  const boxHelperRef = useRef<THREE.BoxHelper>(new THREE.BoxHelper(new THREE.Object3D(), 0xff0000));
  const boundingBoxRef = useRef<THREE.Box3>(new THREE.Box3());

  const handlePlaneSelect = (index: number) => {
    dispatch(setSelection(index));
  };

  const handlePlaneDeselect = () => {
    dispatch(deselect());
  };

  const wallTextures = useTexture({
    map: 'textures/Wood_baseColor.jpg',
    normalMap: 'textures/Wood_normal.jpg',
  });

  const updateBoundingBoxHelper = () => {
    boundingBoxRef.current.makeEmpty();

    Object.entries(stateColumns).forEach(([key, obj]) => {
      const halfWidth = obj.width / 2;
      const halfHeight = obj.height / 2;

      const box = new Box3(
        new Vector3(-halfWidth, -halfHeight, 0),
        new Vector3(halfWidth, halfHeight, 0)
      );

      boundingBoxRef.current.expandByPoint(box.min);
      boundingBoxRef.current.expandByPoint(box.max);
    });

    boxHelperRef.current.setFromObject(groupRef.current);
  };
  
  useEffect(() => {
    updateBoundingBoxHelper();
  }, [stateColumns]);

  const centerCameraOnObject = () => {
    const boundingBox = boundingBoxRef.current;

    if (boundingBox.isEmpty()) {
      return;
    }

    const size = boundingBox.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (cameraRef.current) {
      const fov = cameraRef.current.fov || 50;
      const distance = maxDim / (2 * Math.tan(fov * Math.PI / 360));

      cameraRef.current.position.copy(boundingBox.getCenter(new Vector3()));
      cameraRef.current.position.z += 1.1 * distance;
      cameraRef.current.lookAt(boundingBox.getCenter(new Vector3()));
    }
  };

  useEffect(() => {
    centerCameraOnObject();
  }, [scene]);

  useFrame(() => {
    centerCameraOnObject();
  });

  return (
    <>
      <ambientLight intensity={5} />
      <directionalLight />
      <axesHelper args={[5]} />
      <Selection>
        <EffectComposer multisampling={8} autoClear={false} disableNormalPass={true}>
          <Outline blur edgeStrength={20} width={10000} />
        </EffectComposer>
        <group ref={groupRef}>
          {Object.entries(stateColumns).map(([key, obj]) => (
            <PlaneGeometryComponent
              key={key}
              index={parseInt(key)}
              originPosition={[obj.width / 2, obj.height / 2, 0]}
              meshPosition={[0, 0, 0]}
              rotation={[0, 0, 0]}
              height={1}
              wallTextures={wallTextures}
              onSelect={handlePlaneSelect}
              onDeselect={handlePlaneDeselect}
            />
          ))}
        </group>
        {boxHelperRef.current && <primitive object={boxHelperRef.current} />}
      </Selection>
      <perspectiveCamera ref={cameraRef} position={[0, 0, 5]} />
    </>
  );
};

export default EditorScene;
