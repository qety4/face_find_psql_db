import React from 'react'
import './faceRecog.css'

const Facerecog =({image, box})=>{
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputimage' src={image}  width='400px' height='auto' />
                <div className='bounding-box' style={{top:box.topRow,left:box.leftCol,bottom:box.bottomRow,right:box.rightCol}}></div>
            </div>
        </div>

    );
}

export default Facerecog