import React, { useRef } from 'react'
import {Canvas, useFrame} from "@react-three/fiber"
import {OrbitControls} from "@react-three/drei"
import { group } from 'console'

type Props = {}




const CubeTest = () => {

    const ref = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (ref.current) {
            //ref.current.rotation.x += delta;
            //ref.current.rotation.z += delta;
            ref.current.rotation.y -= delta 
        }
        })


    return(
        <group>


              {/* Utiliza useFrame dentro del componente Canvas */}



            <OrbitControls />
            <mesh ref={ref}>
            <boxGeometry  />
            <meshNormalMaterial />
            </mesh>

        </group>
    )
}


const Test3D = (props: Props) => {

    


      

  return (
        <Canvas shadows camera={{fov:65,position:[0,0,4]}} >



              <CubeTest />



        </Canvas>
  )
}

export default Test3D