import axios from 'axios'
import user from '../information.json'
const github = axios.create({baseURL:`https://api.github.com/users/${user.githubUser}`})
const  devTo = axios.create({baseURL:`https://dev.to/api/articles?username=${user.devToUser}`})
export async function getGithub(){
   var userInfoPromise =  github.get('')
   var reposPromise    =   github.get('/repos')
   const [userInfo,repos] = await Promise.all([userInfoPromise,reposPromise])
   return {...userInfo, projects:repos}
    }

export async function getDevTo(){
   var devToArtics = (await devTo.get('')).data
   // var devToArtics={};
   return {devToArticles:devToArtics}
   }
  