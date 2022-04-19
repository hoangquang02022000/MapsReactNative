import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, PermissionsAndroid } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';



const initCamera = {
    center: {
        // latitude: 10.9560368,
        // longitude: 106.7989811
        latitude: 10.964112,
        longitude: 106.856461,
    },
    zoom: 8.5,
    heading: 0,
    pitch: 0,
    altitude: 0
}



export default ScreenMap = () => {
    const API = 'AIzaSyBlduVD6U_I2cpDHlcOWzqIippfMdDSoZ8'

    const [address, setAddress] = useState(
        {
            address: "",
            province: "",
            district: ""
        }
    )
    const [locaiton, setlocation] = useState(
        {
            latitude: 10.964112,
            longitude: 106.856461,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
    )
    const [BienHoa, setBienHoa] = useState({

        latitude: 10.964112,
        longitude: 106.856461,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,

    })

    // const { BienHoa } = state


    const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
    const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };


    //cap quyen vi tri
    const requestPermissions = async () => {
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization();
            Geolocation.setRNConfiguration({
                skipPermissionRequests: false,
                authorizationLevel: 'whenInUse',
            });
        }

        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
        }
    }

    const componentDidMount = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                // console.log(position);
                setlocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );

        console.log(locaiton)
    }

    // lay dia chi hien tai
    const getAddress = async (lat, lng) => {
        Geocoder.init(API)
        Geocoder.from(lat, lng)
            .then(json => {
                const length = json.results[0].address_components.length
                setAddress({
                    address: json.results[0].formatted_address,
                    province: json.results[0].address_components[length - 2].long_name,
                    district: json.results[0].address_components[length - 3].long_name

                })
                // console.log(json)
            })
    }
    const ref = useRef();
    useEffect(() => {
        requestPermissions()
        componentDidMount()
        getAddress(
            locaiton.latitude, locaiton.longitude
        )
        ref.current?.setAddressText("");
    }, [])





    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: 'white', height: 70, }}>
                <Text
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 5,
                        flex: 3,
                        color: 'black'
                    }}>
                    Vị Trí Hiện Tại : {address.address}
                </Text>
            </View>

            <View style={{ marginTop: 5 }}>
            <GooglePlacesAutocomplete
                        placeholder="Search"
                        minLength={2} // minimum length of text to search
                        autoFocus={false}
                        fetchDetails={true}
                        autoFillOnNotFound = {true}
                        
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(data);
                            console.log(details);
                        }}
                        getDefaultValue={() => {
                            return ''; // text input default value
                        }}
                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyCJzwLTQ4ADlEr2vftLexbX2xY81hO9yq0',
                            language: 'vi', // language of the results
                        }}
                        styles={{
                            description: {
                                fontWeight: 'bold',
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb',
                            },
                            listView: {
                                color: 'black', //To see where exactly the list is
                                zIndex: 1000, //To popover the component outwards
                                position: 'absolute',
                                top: 45
                            },
                        }}
                        currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                        currentLocationLabel="Current location"
                        nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        GoogleReverseGeocodingQuery={
                            {
                                // key: 'AIzaSyCCIAKf3XuR0ZmWb--Sw-lhF7OzNZ0NY_4'
                            }
                        }
                        GooglePlacesDetailsQuery={{
                            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                            fields: 'formatted_address',
                        }}
                        filterReverseGeocodingByTypes={[
                            'locality',
                            'administrative_area_level_3',
                        ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                        predefinedPlaces={[homePlace, workPlace]}
                        predefinedPlacesAlwaysVisible={true}
                    />


                <MapView
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    zoomControlEnabled={true}
                    followsUserLocation={true}

                    provider={PROVIDER_GOOGLE}

                    userInterfaceStyle='light'


                    // provider='google'
                    initialCamera={initCamera}
                    style={styles.map}
                >
                    
                    <Marker
                        coordinate={BienHoa}
                    />
                    <MapViewDirections
                        origin={initCamera.center}
                        destination={BienHoa}
                        apikey={API}
                        strokeWith={5}
                        strokeColor="red"
                    />

                </MapView>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor : 'white'
    },
    map: {
        marginTop: 50,
        width: '100%',
        height: '70%',
    }
})