import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps'
import React from 'react';
import * as Location from "expo-location"

export default function App() {
  const[locPermission, setLocPermission] = React.useState(false)

  async function getPermission(){
    const foregroundPermission = await Location.requestForegroundPermissionsAsync()
    return foregroundPermission.granted
  }

React.useEffect(
  ()=>{
    async function start(){
      const Permission = await getPermission()
      setLocPermission(Permission)
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
        showsUserLocation={locPermission}
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