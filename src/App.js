import React from 'react';
import logo from './assets/jecrs687.jpg';
import './App.css';
import { TiSocialFacebookCircular,TiSocialInstagramCircular,TiSocialGithubCircular,TiSocialLinkedinCircular } from "react-icons/ti";
import {  Circle } from 'rc-progress';
const data = require('./information.json')
function Skill({value}){
return(  
<li className='skill'>
          <h6>{value.name}</h6> 
          <div className='box-percent'>
          <Circle percent={`${value.percent}`} 
          strokeWidth='10'
          strokeColor='#ffcce0' 
          className='circle'
          />
         <h4>{value.percent}%</h4>
          </div>
</li> 
          )
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div className="App-background" src=''></div>        
        <div className='box'>
          <div className='box-info'>
            <div className='box-img'>
              <div>
              </div>
              <div>
              </div>
              <img src={logo} className="App-logo" alt="logo" />
          </div>
          </div>
          <div className='bio'>
            <h1>{data.nick}</h1>
            <h5 style={{fontWeight:300}}>{data.name}, <br/>{data.work}</h5>
                I LOVE:
                <ul>
                {data.loves.map((value,index)=><li key={index} style={{fontFamily:'sans-serif', fontWeight:100}}>{value}</li>)}
                </ul>
          </div>

          <div className='box-icon'>
            <a href={data.facebook}><TiSocialFacebookCircular className='icon'/></a>
            <a href={data.github}><TiSocialGithubCircular className='icon'/></a>
            <a href={data.instagram}><TiSocialInstagramCircular className='icon'/></a>
            <a href={data.linkerdin}><TiSocialLinkedinCircular className='icon'/></a>
          </div> 

        </div>

      </header>

       <body className='App-body'>
         <div className='body-box'>
      <div className='App-data'>
          <h1>Basic Information</h1>
          <ul style={{textAlign:'justify'}}>
            <li>Country: {data.country}</li>
            <li>Age:{data.age}</li>
            <li>Email: {data.email}</li>
            <li>Phone:{data.phone}</li>
            <li>City: {data.city}</li>
            <li>Address: {data.address}</li>
            </ul>
          <p>
          </p>
        </div>
      <div style={{paddingRight:'75px', paddingLeft:'75px'}} className='App-data'>
      <h4>Bio</h4>
      <div>
      <p>
  "{data.bio}"
         </p>
         </div>
      </div>
      </div>
      <div className='App-data2'>
        <h1>Skills</h1>
        <ul className='grid1'>{        
          
          Object.keys(data.skills).map(
            (value,index)=>
          <li key={index}>
            
            <h3>{value}</h3>          
        <ul className='grid2'>

            {data.skills[`${value}`].map((value, index,array)=> 
          <Skill value={value} key={index}/>
          )}
        </ul>
          
          
            </li>
          )
        }</ul>
      </div>
      </body> 
      <p>Powered by <a href='/#'>me</a></p>

    </div>
  );
}

export default App;
