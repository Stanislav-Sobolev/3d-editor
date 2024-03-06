import { useState, useRef, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Mesh, Group, Texture } from 'three';
import * as THREE from "three";
import { Text } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';

interface WallTextures {
  map: Texture;
  normalMap: Texture;
}

interface PlaneGeometryComponentProps {
  index: number;
  originPosition: [number, number, number];
  meshPosition: [number, number, number];
  rotation: [number, number, number];
  height: number;
  wallTextures: WallTextures;
  camDistance: number;
  onSelect: (width: number, height: number) => void;
  onDeselect: () => void;
}

const PlaneGeometryComponent: React.FC<PlaneGeometryComponentProps> = ({
  index,
  originPosition,
  meshPosition,
  rotation,
  wallTextures,
  camDistance,
  onSelect,
  onDeselect,
}) => {
  const { width, height } = useSelector((state: RootState) => state.editor.objects[index]);

  const [hover, setHover] = useState(false);
  const group = useRef<Group>(null!);
  const mesh = useRef<Mesh>(null!);

  useLayoutEffect(() => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.MeshStandardMaterial;
      const geometry = mesh.current.geometry as THREE.BufferGeometry;

      if (material.map) {
        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        const uvAttribute = geometry.attributes.uv;

        uvAttribute.setXY(0, 0, 0);
        uvAttribute.setXY(1, width, 0);
        uvAttribute.setXY(2, 0, height);
        uvAttribute.setXY(3, width, height);

        uvAttribute.needsUpdate = true;
      }

      material.needsUpdate = true;
    }
  }, [mesh, width, height]);

  return (
    <group ref={group} position={originPosition}>
      <Select enabled={hover}>
        <mesh
          position={meshPosition}
          rotation={rotation}
          ref={mesh}
          onPointerOver={(event) => (event.stopPropagation(), setHover(true), onSelect(width, height))}
          onPointerOut={(event) => {setHover(false), onDeselect()}}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial {...wallTextures} side={THREE.DoubleSide} />
        </mesh>
      </Select>
      <Text
        visible={hover}
        font='/BebasNeue-Regular.ttf'
        position={[meshPosition[0], meshPosition[1], meshPosition[2] + 0.1]}
        scale={[1, 1, 1]}
        color="white"
        fontSize={0.1*camDistance}
        anchorX="center"
        anchorY="middle"
      >
        width: {width.toFixed(2)}
      </Text>
    </group>
  );
};

export default PlaneGeometryComponent;
