import React, { useState, useEffect } from "react";
import * as Location from "react-native-location";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';



export default function App() {
  const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
  const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      minLength={2} // minimum length of text to search
      autoFocus={false}
      fetchDetails={true}
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
        key: 'AIzaSyBlduVD6U_I2cpDHlcOWzqIippfMdDSoZ8',
        language: 'en', // language of the results
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
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
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
  )

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  paragraph: {
    color: 'black'
  }
});