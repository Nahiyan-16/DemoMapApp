import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import {useState, useEffect} from 'react'
import * as Location from "expo-location"
import APIKey from './API'
import testData from './testData'

export default function App() {
  const[location, setLocation] = useState({
    permission: false,
    region: {
      longitude: 0,
      latitude: 0,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }
  })

  const[mosqueData, setMosqueData] = useState({})

  useEffect(
    ()=>{
      findLocation()
      findMosques()
    },
    []
  )

  async function findMosques(){
    const radius = 10000
    const res1 = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=mosque&location=${location.region.latitude}%2C${location.region.longitude}&radius=${radius}&type=mosque&key=${APIKey}`)
    const resData1 = await res1.json()

    let obj = await Promise.all(resData1.results.map(async mosque => {
      return {
        name: mosque.name, 
        lat: mosque.geometry.location.lat, 
        lon: mosque.geometry.location.lng,
        placeID: mosque.place_id
      }
    }))
    setMosqueData(obj)
  }

  async function findLocation(){
    const locationAry = await getPermission()
    setLocation({
      permission: locationAry[2],
      region:{
        longitude: locationAry[0],
        latitude: locationAry[1],
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }
    })
  }

  async function getPermission(){
    const foregroundPermission = await Location.requestForegroundPermissionsAsync()
    const userLocation = await Location.getCurrentPositionAsync({})
    const loc = JSON.parse(JSON.stringify(userLocation))
    return [loc.coords.longitude, loc.coords.latitude, foregroundPermission.granted]
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        mapType='standard' 
        showsUserLocation={location.permission}
        // region = {location.region}
        region = {{
          longitude: -73.787651,
          latitude: 40.738590,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
        >
        {mosqueData.map(mosque => <Marker title={mosque.name} coordinate={{latitude: mosque.lat, longitude: mosque.lon}} key={mosque.placeID}/>)}
      </MapView> 
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  map: {
    width: '100%',
    height: '50%',
  },
})