import axios from 'axios'
import user from '../information.json'
import { REPOS_FALLBACK } from '../constants/REPOS_FALLBACK'
import { GITHUB_FALLBACK } from '../constants/GITHUB_FALLBACK'
import { ARTICLES_FALLBACK } from '../constants/ARTICLES_FALLBACK'
const github = axios.create({baseURL:`https://api.github.com/users/${user.githubUser}`})
const  devTo = axios.create({baseURL:`https://dev.to/api/articles?username=${user.devToUser}`})
export async function getGithub(){
   var userInfoPromise =  github.get('').catch(() => GITHUB_FALLBACK)
   var reposPromise    =   github.get('/repos').catch(() => REPOS_FALLBACK)
   const [userInfo,repos] = await Promise.all([userInfoPromise,reposPromise])
   return {...userInfo, repos:repos}
    }

export async function getDevTo(){
   var devToArtics = (await devTo.get('').catch(
      ()=> ({data: ARTICLES_FALLBACK})
   )).data 
   return {devToArticles:devToArtics}
   }
  