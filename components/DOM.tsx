import React from 'react';

import { ScrollScene, UseCanvas } from '@14islands/r3f-scroll-rig';
import { useRef } from 'react';
import { FBMShaderPlane } from './chemicals/dopamine/webgpu';

interface GalleryProps {

}

const Dop: React.FC<GalleryProps> = ({ }) => {
    const track = useRef(null)

    return (
        <>
            <div ref={track} className='sticky top-0 left-0 h-screen w-full' />
            {/* <UseCanvas>
                <ScrollScene track={track}>
                    {() => (
                        null
                        // <FBMShaderPlane />
                    )}
                </ScrollScene>
            </UseCanvas> */}
        </>
    )
}

interface DOMProps { }


const DOM: React.FC<DOMProps> = () => {
    return (
        <main className='relative h-screen w-full bg-black/90'>
            {/* <Gallery /> */}
            {/* <Dop /> */}
        </main>
    )
}

export default DOM