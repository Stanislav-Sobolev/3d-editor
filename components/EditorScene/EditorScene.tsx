import { useEffect, useRef, FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelection, deselect } from '../../store/editorSlice';
import { Vector3, Box3, PerspectiveCamera, Group } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing';
import PlaneGeometryComponent from '../PlaneGeometryComponent';

const EditorScene: FC = () => {
  const dispatch = useDispatch();
  const stateColumns = useSelector((state: RootState) => state.editor.objects);
  const { scene, camera } = useThree();
  const [camDistance, setCamDistance ] = useState<number>(1);

  const groupRef = useRef<Group>(new Group());
  const boundingBoxRef = useRef<Box3>(new Box3());

  const shouldRotateCamera = process.env.NEXT_APP_ENV !== 'development';

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
      setCamDistance(distance);
      const boundingBoxHalfSizes = new Vector3(size.x , size.y / 2, size.z);

      camera.position.copy(boundingBoxHalfSizes);
      camera.position.z += 1.8 * distance;

      camera.lookAt(boundingBoxHalfSizes);
    }
  };

  useEffect(() => {
    if (!shouldRotateCamera) {
      centerCameraOnObject();
    }
  }, [scene]);

  useFrame(() => {
    if (!shouldRotateCamera) {
      centerCameraOnObject();
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="white" />
      <directionalLight />
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
            camDistance={camDistance}
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
            camDistance={camDistance}
            wallTextures={wallTextures}
            onSelect={handlePlaneSelect}
            onDeselect={handlePlaneDeselect}
          />
        </group>
      </Selection>
      {shouldRotateCamera && <OrbitControls />}
    </>
  );
};

export default EditorScene;
