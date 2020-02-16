import React,{useEffect,useState} from 'react';
import logo from './assets/jecrs687.jpg';
import './App.css';
import { TiSocialFacebookCircular,TiSocialInstagramCircular,TiSocialGithubCircular,TiSocialLinkedinCircular } from "react-icons/ti";
import all from './services/api'
import Repos from './components/repos'
const data = require('./information.json')
// import {  Circle } from 'rc-progress';
// function Skills({value}){
//   return(     
//     <div className='skills'>    
//       <h3>{value}</h3>            
//       <div className='grid2'>

//         {data.skills[`${value}`].map((value, index,array)=> 

//           <Skill value={value} key={index}/>
//         )}
//       </div>
//     </div>
//     )
// }

// function Skill({value}){
// return(  
// <div className='skill'>
//           <h6>{value.name}</h6> 
//           <div className='box-percent'>
//           <Circle percent={`${value.percent}`} 
//           strokeWidth='10'
//           strokeColor='#ffafcf' 
//           className='circle'
//           />
//          <h4>{value.percent}%</h4>
//           </div>
// </div> 
//           )
// }





function App() {
  const [info,setInfo]=useState(data)
  const [,setReload] = useState(false)
  useEffect(
    ()=>{
    function insert(github){
      var temp = data
      temp.nick = github.login
      temp.avatar_url = github.avatar_url
      temp.repos = github.repos
      setInfo(temp)
      setReload(r=>!r)
    }
    async function load(){  
    const github =  await all();
    insert(github)
    }
    if(data.githubLogin!==''){
    load();

  }

  },[])
  return (
    <div className="App">
      <header className="App-header">
      <div className="App-background" src=''></div>        
        <div className='box'>
          <div className='box-info'>
            <div className='box-img'>
              <div>
              {console.log(info)}
              </div>
              <div>
              </div>
              <img src={info.avatar_url!==''? info.avatar_url:logo} className="App-logo" alt="logo" />
          </div>
          </div>
          <div className='bio'>
            <h1>{info.nick}</h1>
            <h5 style={{fontWeight:300}}>{info.name}, <br/>{info.work}</h5>
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

       <div className='App-body'>
       {/*   <div className='body-box'>
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
        <div className='grid1'>

          {        
          Object.keys(data.skills).map(
            (value,index)=>
         <Skills value={value} key={index}/>
          )
        }</div>
      </div> */}
      <div className='repos'>
        {info.repos.map((value,index)=>(
        <Repos repo={value} key={index}/>
      ))}      </div>

      </div>
      <div className='App-footer'><p>Powered by <a href='/#'>@jecr687</a>   2020</p>
      </div>

    </div>
  );
}

export default App;
