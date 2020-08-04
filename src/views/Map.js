import React from 'react';
import '../styles/Map.css'

import {
    FullscreenControl,
    GeolocationControl, GeoObject,
    Map, Placemark,
    RouteButton,
    TypeSelector,
    YMaps,
    ZoomControl
} from "react-yandex-maps";
import {nearestCity} from "../utils/APIUtils";


class MyMap extends React.Component{
    constructor(props) {
        super(props);
        this.state = {lat: '', lng: '', nlat: '', nlng: '', isNearestToggled: false, isCenterToggled: false, getLocation: true, zoom: 5};
        this.getLocation = this.getLocation.bind(this);
        this.toggleEarthCenter = this.toggleEarthCenter.bind(this);
        this.toggleNearest = this.toggleNearest.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleLocation = this.toggleLocation.bind(this);
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log("Available");
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            this.setState({lat: position.coords.latitude, lng: position.coords.longitude});
        }, (error) => {
            this.setState({lat: '', lng: ''});
            console.log("Not Available");
            console.log(error.message);
        });

        if ("geolocation" in navigator) {
            console.log("Available");
        } else {
            console.log("Not Available");
        }
    }

    componentDidMount() {
        this.getLocation();
    }

    toggleNearest(){
        if (!this.state.isNearestToggled){
            const nearest = nearestCity(this.state.lat, this.state.lng);
            nearest.then((result) => {
                console.log(result.data[0].latitude + " " + result.data[0].longitude);
                this.setState({nlat: result.data[0].latitude, nlng: result.data[0].longitude, zoom: 10})
            }).catch((error) => {
                console.log(error);
            });
        }else{
            console.log("sa")
            this.setState({zoom: 5});
        }

        this.setState(prevState => ({
            isNearestToggled: !prevState.isNearestToggled
        }));
    }

    toggleEarthCenter(){
        this.setState(prevState => ({
            isCenterToggled: !prevState.isCenterToggled
        }));
    }

    toggleLocation(event){
        if (!this.state.getLocation){
            this.getLocation();
        }

        this.setState(prevState => ({
            getLocation: !prevState.getLocation
        }));
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }



    render () {
        return (
            <div>
                <div className="row justify-content-start">
                    <div className="col-lg-4 py-1 custom-switch justify-content-start">
                        <input type="checkbox" onClick={this.toggleNearest} className="custom-control-input" id="customSwitch1"/>
                        <label className="custom-control-label" htmlFor="customSwitch1">Show distance to the nearest city</label>
                    </div>
                    <div className="col-lg-4 py-1 custom-switch justify-content-start">
                        <input type="checkbox" onClick={this.toggleEarthCenter} className="custom-control-input" id="customSwitch2"/>
                        <label className="custom-control-label" htmlFor="customSwitch2">Show distance to the earth center</label>
                    </div>
                    <div className="col-lg-4 py-1 custom-switch justify-content-start">
                        <input type="checkbox" onClick={this.toggleLocation} className="custom-control-input" id="customSwitch3"
                               name="getLocation" defaultChecked={true}/>
                        <label className="custom-control-label" htmlFor="customSwitch3">Use Current Location</label>
                    </div>
                </div>
                <hr/>
                <div className={this.state.getLocation ? "row my-auto d-none": "row my-auto" } >
                    <div className="col-lg-2 my-auto">
                        <h6 className="">Current Coordinates</h6>
                    </div>
                    <div className="col-lg-5">
                        <div className="form-group row">
                            <label htmlFor="example-number-input" className="col-3 col-form-label">Latitude</label>
                            <div className="col-9">
                                <input className="form-control" type="number" value={this.state.lat} name="lat"
                                       onChange={this.handleChange} step="0.1" id="example-number-input"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="form-group row">
                            <label htmlFor="example-number-input" className="col-3 col-form-label">Longitude</label>
                            <div className="col-9">
                                <input className="form-control" type="number" value={this.state.lng} name="lng"
                                       onChange={this.handleChange} step="0.1" id="example-number-input" />
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col">
                        <YMaps  query={{ lang: 'en_RU' }}>
                            <Map state={{ center: [this.state.lat, this.state.lng], zoom: this.state.zoom }}
                                 width={'100%'} height={480} >
                                <FullscreenControl options={{float: "right"}}/>

                                <Placemark geometry={[this.state.lat, this.state.lng]}
                                           properties={{
                                               iconContent: 'You'
                                           }}
                                           />
                                {
                                    this.state.isCenterToggled ? (
                                        <>
                                            <Placemark geometry={[0, 0]}
                                                       properties={{balloonContentHeader: 'Current Location'}}/>
                                            <GeoObject
                                                geometry={{
                                                    type: 'LineString',
                                                    coordinates: [
                                                        [0, 0],
                                                        [this.state.lat, this.state.lng],
                                                    ],
                                                }}
                                                options={{
                                                    geodesic: true,
                                                    strokeWidth: 5,
                                                    strokeColor: '#F008'
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <span/>
                                    )
                                }
                                {
                                    this.state.isNearestToggled ? (
                                        <>
                                            <Placemark geometry={[this.state.nlat, this.state.nlng]}
                                                       properties={{balloonContentHeader: 'Current Location'}}/>
                                            <GeoObject
                                                geometry={{
                                                    type: 'LineString',
                                                    coordinates: [
                                                        [this.state.nlat, this.state.nlng],
                                                        [this.state.lat, this.state.lng],
                                                    ],
                                                }}
                                                options={{
                                                    geodesic: true,
                                                    strokeWidth: 5,
                                                    strokeColor: '#F008'
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <span/>
                                    )
                                }
                                </Map>

                        </YMaps>
                    </div>
                </div>
            </div>

        );
    }
}

export default MyMap;