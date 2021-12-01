import React,{useEffect,useState} from 'react';
import './App.css';
import { TiDocument } from "react-icons/ti";
import {GoRepo,GoHome,GoProject} from "react-icons/go";
import {FaAngleDoubleLeft,FaSun,FaMoon,FaBrain} from "react-icons/fa";
import {getGithub,getDevTo} from './services/api'
import {Repos} from './components/repos'
import {Projects} from './components/Projects'
import {ListSkills}from './components/skills';
import {ListArticles}from './components/articles';
import {Home} from './components/home'
const data = require('./information.json')






function App() {
  const [info,setInfo]=useState(data)
  const [guia,setGuia]=useState('home')
  const [dark,setDark]=useState(true)
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
      <div className='navBar'>
        <div onClick={()=>{setGuia('home')}} className='box-logo'>
        <span className='logo'>Jecrs687</span>
        <FaAngleDoubleLeft className="icon"/>

        </div>
        <ul className='navBar-nav'>
         <li  onClick={()=>{setGuia('home')}} className='navBar-item'>
            <GoHome className='icon'/>
            <span className='nav-link'>home</span>
          </li>
          <li  onClick={()=>{setGuia('repos')}} className='navBar-item'>
            <GoRepo className='icon'/>
            <span className='nav-link'>Repositories</span>
          </li>
          <li onClick={()=>{setGuia('skills')}} className='navBar-item'>
            <TiDocument className='icon'/>
            <span className='nav-link' >Skills</span>
          </li>
          <li onClick={()=>{setGuia('articles')}} className='navBar-item'>
            <FaBrain className='icon'/>
            <span className='nav-link' >articles</span>
          </li>
          <li onClick={()=>{setGuia('projects')}} className='navBar-item'>
            <GoProject className="icon"/>
            <span className='nav-link' >Projects</span>
          </li>
          {dark?          
          <li className='navBar-item'  onClick={
            ()=>{    
                
              document.body.style.setProperty('--theme','#000')
              document.body.style.setProperty('--primary','#fff')
                document.body.style.setProperty('--navTheme','#fff')
                document.body.style.setProperty('--navPrimary','#111')
                setDark(!dark)
            }}>
              <FaMoon className='icon'/>
              <span className='nav-link' >Dark</span>
          </li>:          
          <li className='navBar-item' 
            onClick={
              ()=>{
                document.body.style.setProperty('--theme','#fff')
                document.body.style.setProperty('--primary','#000')
                  document.body.style.setProperty('--navTheme','#111')
                  document.body.style.setProperty('--navPrimary','#fff')
                  setDark(!dark)
              }
              }>
              <FaSun className='icon'/>
              <span className='nav-link' >light</span>
            </li>
        }

        </ul>
       </div>
       <div className="body">
       { guia==='home'?
      <Home data={info}/>:

       <div className='App-body'>
      { guia==='repos'?
        <Repos info={info}/>:
        guia==='skills'?<ListSkills data={info}/>:
        guia==='articles'?<ListArticles data={info}/>:
        guia==='projects'?<Projects data={info}/>:
        null}
      </div>}
      
      <div className='App-footer'><p>Powered by <a href='/#'>@jecr687</a>   2020</p>
      </div>

    </div>
    </div>
  );
}

export default App;
