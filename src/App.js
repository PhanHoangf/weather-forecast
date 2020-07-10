import React, { Component } from 'react'
import {Button, Row, Col, Card} from 'antd'
import {Typography} from 'antd'
import './App.css'
import WeatherApi from './utils/WeatherApi'
import LocationApi from './utils/LocationApi'
import StringToDate from './services/StringToDate'
import { isEmpty, values } from 'lodash'
import CallApi from './utils/WeatherApi'


export default class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            cityName:'',
            weatherList:[],
            todayWeather: {},
            txtCity:''
        }
    }
    componentDidMount(){
        //fetch initial data
        LocationApi().then(res=>{
                var id = res.data[0].woeid
                this.setState({
                    cityName:res.data[0].title
                })
                WeatherApi(id).then(res=>{
                    this.setState({
                        weatherList: res.data.consolidated_weather,
                        todayWeather: res.data.consolidated_weather[0]
                    })
                })
        })
    }

    onChange = e =>{
        var target = e.target;
        var value = target.value;
        var name = target.name;
        this.setState({
            [name]: value
        })
    }

    // search order city forecast
    onSubmit = e =>{
        e.preventDefault();
        var name = this.state.txtCity;
        LocationApi(name).then(res=>{
            if(res !== undefined){
                if(!isEmpty(res.data)){
                    console.log(res)
                    var id = res.data[0].woeid
                    this.setState({
                        cityName:res.data[0].title
                    })
                    WeatherApi(id).then(res=>{
                        this.setState({
                            weatherList: res.data.consolidated_weather,
                            todayWeather: res.data.consolidated_weather[0]
                        })
                    })
                }
                else{
                    alert('please enter city or capital name')
                }
            }
            else{
                alert('please enter city or capital name')
            }
            
        })
    }

    render() {
        const { Title } = Typography
        var { weatherList } = this.state
        var { todayWeather } = this.state
        var nextFourDays = weatherList.map((weather,index)=>{
            if(index > 0 && index < 5)
            {
                var iconUrl = "https://www.metaweather.com/static/img/weather/"+weather.weather_state_abbr+".svg"
                return(
                    <Col key = {index} span={6}>
                            <Card   
                                className="card-restyle" bordered={false} 
                                style={{textAlign:"center",background:"#60B6E1",color:"#ffffff",borderRadius:'5px' }}
                            >
                                <p style={{fontWeight:'bold',fontSize:'15px'}}>{StringToDate(weather.applicable_date)}</p>
                                <img src={iconUrl} alt="..." style={{width:'50px',height:'50px',marginBottom:"8px"}} />
                                <p>Min: {weather.min_temp.toFixed(2)}&#186;</p>
                                <p>Max: {weather.max_temp.toFixed(2)}&#186;</p>
                            </Card>
                    </Col>
                )
            }
            
        })
        if(isEmpty(todayWeather)){
            return <div className="wrapper">
                <Title level={1}>Loading...</Title>
            </div>
        }
        else {
            var neededValue = {
                max_temp: todayWeather.max_temp.toFixed(2),
                min_temp: todayWeather.min_temp.toFixed(2),
                wind_speed: todayWeather.wind_speed.toFixed(1),//mph
                humidity: todayWeather.humidity, //percentage
                air_pressure: todayWeather.air_pressure.toFixed(1), //mbar
                visibility: todayWeather.visibility.toFixed(2) //miles
            } //Select only needed value from api
            return (
                <div className="wrapper">
                    <div className="search-box">
                        <form onSubmit = {this.onSubmit}>
                            <input 
                                type="text" 
                                className="search-bar" 
                                placeholder="search..."
                                name = "txtCity"
                                value = {this.state.txtCity}
                                onChange = {this.onChange} 
                            ></input>
                        </form>
                    </div>
                    {currentForeCast(todayWeather,this.state.cityName,neededValue)}
                    <Title type="secondary" level = {4} style={{marginTop:"2px"}}>Forecast</Title>
                    <Row justify = {"center"} gutter={[16, 16]}>
                        {nextFourDays}
                    </Row>
                </div>
            )
        }
    }
}
const currentForeCast = (weather,cityName, neededValue) =>{
    const { Title } = Typography
    var date = new Date()
    var iconUrl = "https://www.metaweather.com/static/img/weather/"+weather.weather_state_abbr+".svg"
    return (
        <div className="today-weather">
            <Row>
                <Col span={24}  >
                    <Title type="secondary" style={{marginBottom:"0px"}}>{cityName}</Title>
                    <Title type="secondary" level = {4} style={{marginTop:"2px"}}>{date.toDateString()}</Title>
                </Col>
            </Row>
            <Row></Row>
            <Row gutter={[16, 16]}>
                <Col  span={4} style={{padding:'30px 30px 30px 30px'}}>
                    <img src={iconUrl} style={{width:'80px',height:'80px'}} alt="..."></img>
                </Col>
                <Col span={4} style={{padding:'30px 30px 30px 30px'}} >
                    <Title level={3} style={{color:'#ffffff'}}>{weather.the_temp.toFixed(2)}&#186;</Title>
                    <p>{weather.weather_state_name}</p>    
                </Col>
                <Col span={16} >
                    <Row justify="center" gutter={[0, 0]} >
                        <Col span={8} >
                            <Card  bordered={false} style={{textAlign:"center",background:"#60B6E1" }}>
                                <h4>{neededValue.max_temp}&#186;</h4>
                                <p>High</p>
                            </Card>
                        </Col>
                        <Col span={8} >
                            <Card bordered={false} style={{textAlign:"center",background:"#60B6E1" }}>
                                <h4>{neededValue.wind_speed} mph</h4>
                                <p>Wind speed</p>
                            </Card>
                        </Col>
                        <Col span={8} >
                            <Card bordered={false} style={{textAlign:"center",background:"#60B6E1" }}>
                                <h4>{neededValue.air_pressure} mbar</h4>
                                <p>Air pressure</p>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={[0, 0]}>
                        <Col span={8} >
                            <Card  bordered={false} style={{textAlign:"center",background:"#60B6E1" }}>
                                <h4>{neededValue.min_temp}&#186;</h4>
                                <p>Low</p>
                            </Card>
                        </Col>
                        <Col span={8} >
                            <Card  bordered={false} style={{textAlign:"center",background:"#60B6E1" }}>
                                <h4>{neededValue.humidity}%</h4>
                                <p>Humidity</p>
                            </Card>
                        </Col>
                        <Col span={8} >
                            <Card  bordered={false} style={{textAlign:"center",background:"#60B6E1" }}>
                                <h4>{neededValue.visibility} miles</h4>
                                <p>Visibility</p>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

