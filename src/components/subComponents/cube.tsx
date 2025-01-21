import React from 'react'
import "./cube.css"


export function Cube({}) {
  return (
    <div className="cube">
        <div>
        <span style={{ '--i': 1 } as React.CSSProperties}/>
        <span style={{ '--i': 2 } as React.CSSProperties}/>
        <span style={{ '--i': 3 } as React.CSSProperties}/>
        <span style={{ '--i': 4 } as React.CSSProperties}/>
        </div>
    </div>
  )
}