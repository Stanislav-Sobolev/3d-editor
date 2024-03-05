import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing';
import PlaneGeometryComponent from '../PlaneGeometryComponent';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelection, deselect } from '../../store/editorSlice';
import { Vector3, Box3, PerspectiveCamera } from 'three';
import { useFrame, useThree } from '@react-three/fiber';


const EditorScene: React.FC = () => {
  const dispatch = useDispatch();
  const stateColumns = useSelector((state: RootState) => state.editor.objects);
  const { scene, camera } = useThree();
  const cameraRef = useRef<PerspectiveCamera>(new PerspectiveCamera());

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
    
    if (camera) {
      const fov = (camera as PerspectiveCamera).fov || 50;
      
      const distance = maxDim / (2 * Math.tan(fov * Math.PI / 360));
      
      camera.position.copy(new Vector3(size.x / 2, size.y / 2, size.z / 2));
      camera.position.z += 1.1 * distance;
      console.log(distance)
      
      camera.lookAt(new Vector3(size.x / 2, size.y/2, size.z / 2));

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
          <PlaneGeometryComponent
            index={1}
            originPosition={[(stateColumns[1].width) / 2, (stateColumns[1].height) / 2, 0]}
            meshPosition={[0, 0, 0]}
            rotation={[0, 0, 0]}
            height={1}
            wallTextures={wallTextures}
            onSelect={handlePlaneSelect}
            onDeselect={handlePlaneDeselect}
          />
          <PlaneGeometryComponent
            index={2}
            originPosition={[(stateColumns[2].width) / 2, (stateColumns[2].height) / 2, 0]}
            meshPosition={[(stateColumns[1].width), 0, 0]}
            rotation={[0, 0, 0]}
            height={1}
            wallTextures={wallTextures}
            onSelect={handlePlaneSelect}
            onDeselect={handlePlaneDeselect}
          />
        </group>
        {boxHelperRef.current && <primitive object={boxHelperRef.current} />}
      </Selection>
    </>
  );
};

export default EditorScene;
