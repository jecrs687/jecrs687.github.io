import './skills.css'
import {  Circle } from 'rc-progress';

function Skills({value, data}: {value: string, data: {skills: {[key: string]: {name: string, percent: number}[]}}}){
  return(     
    <div className='skills'>    
      <h3>{value}</h3>            
      <div className='sub-skills'>
        {data.skills[`${value}`].map((value, index)=> 
          <Skill value={value} key={index}/>
        )}
      </div>
    </div>
    )
}

function Skill({value}: {value: {name: string, percent: number}}){
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

export function ListSkills({data}: {data: {skills: {[key: string]: {name: string, percent: number}[]}}}){
    return(
    <div className='box-container'>
      <h1>Skills</h1>
      <div className='skills-container'>
        {        
        Object.keys(data.skills).map(
          (value,index)=>
       <Skills value={value} data={data} key={index}/>
        )
      }
      </div>
      </div>      
    )
}