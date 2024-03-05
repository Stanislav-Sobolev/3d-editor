import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import GUI from 'lil-gui';
import { OrbitControls } from '@react-three/drei';

import { useSelector, useDispatch } from 'react-redux';
import { RootState} from '../store/store';
import { setSelection, setWidth, setHeight, undo } from '../store/editorSlice';

import EditorScene from '../components/EditorScene';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const stateColumns = useSelector((state: RootState) => state.editor.objects);
    
  useEffect(() => {
    const gui = new GUI();
    const controlsWidth: Record<string, { width: number }> = {};
    const controlsHeight: Record<string, { height: number }> = {};
    
    const undoHandler = { undo:function(){ dispatch(undo()) }};
   
    Object.entries(stateColumns).forEach(([key, obj]) => {
    
          controlsWidth[key] = { width: obj.width };
          
          gui.add(controlsWidth[key], 'width', 1, 10, 0.1).name(`${key} Column Width`).onChange((value: number) => {
            dispatch(setSelection(Number(key)));
            dispatch(setWidth(value));
          });
          
          controlsHeight[key] = { height: obj.height };
          
          gui.add(controlsHeight[key], 'height', 1, 10, 0.1).name(`${key} Column Height`).onChange((value: number) => {
    
          dispatch(setSelection(Number(key)));
          dispatch(setHeight(value));
        });
      });

      gui.add(undoHandler, 'undo');
  }, [])
  
    
  return (
    <>
    <Canvas 
    camera={{ position: [0, 0, 5] }}
    >
      <Suspense fallback={null}>
        <EditorScene />
        {process.env.NEXT_APP_ENV === 'development' && <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />}

      </Suspense>
    </Canvas>
    </>
  );
}

export default App;
