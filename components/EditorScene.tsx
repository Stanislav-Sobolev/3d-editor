import { useTexture } from "@react-three/drei";
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing'
import PlaneGeometryComponent from './PlaneGeometryComponent';

import { useSelector, useDispatch } from 'react-redux';
import { RootState} from '../store/store';
import { setSelection, deselect} from '../store/editorSlice';


const EditorScene: React.FC = () => {

  const dispatch = useDispatch();
  const stateColumns = useSelector((state: RootState) => state.editor.objects);
  
  const handlePlaneSelect = (index: number) => {
    dispatch(setSelection(index));
  };

  const handlePlaneDeselect = () => {
    dispatch(deselect());
  };
  
    const wallTextures = useTexture({
        map: 'textures/Wood_baseColor.jpg',
        normalMap: 'textures/Wood_normal.jpg',
    })

    return (
    <>
    <ambientLight intensity={5} />
      <directionalLight />
      {/* <pointLight position={[1, 1, -1]} intensity={11}/> */}
      <axesHelper args={[5]} />
      <Selection>
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline blur  edgeStrength={100} width={10000} />
      </EffectComposer>
      <PlaneGeometryComponent
        index={1}
        originPosition={[(stateColumns[1].width)/2, (stateColumns[1].height)/2, 0]}
        meshPosition={[0, 0, 0]}
        rotation={[0,0,0]}
        height={1}
        wallTextures={wallTextures}
        onSelect={handlePlaneSelect}
        onDeselect={handlePlaneDeselect}
      />
      <PlaneGeometryComponent
        index={2}
        originPosition={[(stateColumns[2].width)/2, (stateColumns[2].height)/2, 0]}
        meshPosition={[(stateColumns[1].width), 0, 0]}
        rotation={[0,0,0]}
        height={1}
        wallTextures={wallTextures}
        onSelect={handlePlaneSelect}
        onDeselect={handlePlaneDeselect}
      />
      </Selection>
    </>
  );
};

export default EditorScene;
