import React from 'react';
import './skills.css'
import {  Circle } from 'rc-progress';

function Skills({value,data}){
  return(     
    <div className='skills'>    
      <h3>{value}</h3>            
      <div className='grid2'>

        {data.skills[`${value}`].map((value, index,array)=> 

          <Skill value={value} key={index}/>
        )}
      </div>
    </div>
    )
}

function Skill({value}){
return(  
<div className='skill'>
          <h6>{value.name}</h6> 
          <div className='box-percent'>
          <Circle percent={`${value.percent}`} 
          strokeWidth='10'
          strokeColor='#ffafcf' 
          className='circle'
          />
         <h4>{value.percent}%</h4>
          </div>
</div> 
          )
}

export function ListSkills({data}){
    return(
    <div className='body-box'>
    <div className='App-data2'>
      <h1>Skills</h1>
      <div className='grid1'>
        {        
        Object.keys(data.skills).map(
          (value,index)=>
       <Skills value={value} data={data} key={index}/>
        )
      }
      </div>
      </div>
      </div>
      
    )
}