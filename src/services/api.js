import axios from 'axios'
const user = require('../information.json')
const api = axios.create({baseURL:`https://api.github.com/users/${user.githubLogin}`})
export default async function getData(){
   var userInfo =  (await api.get('')).data
   var repos =  (await api.get('/repos')).data
   return {...userInfo,repos:repos}
    }
  