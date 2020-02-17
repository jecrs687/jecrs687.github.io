import React,{useEffect,useState} from 'react';
import logo from './assets/jecrs687.jpg';
import './App.css';
import { TiSocialFacebookCircular,TiSocialInstagramCircular,TiSocialGithubCircular,TiSocialLinkedinCircular } from "react-icons/ti";
import {getGithub,getDevTo} from './services/api'
import {Repos} from './components/repos'
import {ListSkills}from './components/skills';
import {ListArticles}from './components/articles';

const data = require('./information.json')






function App() {
  const [info,setInfo]=useState(data)
  const [guia,setGuia]=useState('')
  // const [,setReload] = useState(false)
  useEffect(
    ()=>{
    function insert(github){
      var temp = data
      temp.nick = github.login
      temp.name = github.name
      temp.avatar_url = github.avatar_url
      temp.repos = github.repos
      setInfo(temp)
    }
    async function load(){  
    const github =  await getGithub();
    await insert(github)
    const devTo =  await getDevTo();
    setInfo(value=>({...value, ...devTo}))
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
       <div className='navBar'>
         <button onClick={()=>{setGuia('repos')}}>Repos</button>
         <button onClick={()=>{setGuia('skills')}}>Skills</button>
         <button onClick={()=>{setGuia('articles')}}>articles</button>

       </div>
      
      { guia==='repos'?
        <Repos info={info}/>:
        guia==='skills'?<ListSkills data={info}/>:
        guia==='articles'?<ListArticles data={info}/>:null}
      </div>
      <div className='App-footer'><p>Powered by <a href='/#'>@jecr687</a>   2020</p>
      </div>

    </div>
  );
}

export default App;
