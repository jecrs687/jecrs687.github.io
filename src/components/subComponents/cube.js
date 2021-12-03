import React from 'react'
import "./cube.css"


export function Cube({color}) {
  return (
    <div className="cube">
        <div>
        <span styleSheet={`--i:1;`}/>
        <span styleSheet={`--i:2;`}/>
        <span styleSheet={`--i:3;`}/>
        <span styleSheet={`--i:4;`}/>
        </div>
    </div>
  )
}