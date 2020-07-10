import axios from 'axios'
import LocationApi from './LocationApi'


export default function CallApi(id){
    return axios({
        method:'GET',
        headers: { 'Content-Type': 'application/json'},
        url: `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${id}/`
    }).catch(error =>{
        console.log(error)
    })
}


