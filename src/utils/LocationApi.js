import axios from 'axios'

export default function LocationApi(name = 'ho chi minh'){
    return axios({
        method:'GET',
        headers: { 'Content-Type': 'application/json'},
        url:`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${name}`
    }).catch(error=>{
        console.log(error)})
}
