import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps'
import React from 'react';
import * as Location from "expo-location"

export default function App() {
  const[location, setLocation] = React.useState({
    permission: false,
    region: {
      longitude: 0,
      latitude: 0,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }
  })

  async function getPermission(){
    const foregroundPermission = await Location.requestForegroundPermissionsAsync()
    const userLocation = await Location.getCurrentPositionAsync({})
    const loc = JSON.parse(JSON.stringify(userLocation))
    return [loc.coords.longitude, loc.coords.latitude, foregroundPermission.granted]
  }

React.useEffect(
  ()=>{
    async function start(){
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
    start()
  },
  []
)
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        mapType='standard' 
        showsUserLocation={location.permission}
        region = {location.region}
        />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
})