import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider, Heading } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

let app_state = {
  is_user_registered: false
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Welcome"}>

          <Stack.Screen 
            name=     "Welcome"
            component={WelcomeScreen}
            options=  {{headerShown:false}}
          />

          <Stack.Screen 
            name=       "Registration" 
            component=  {RegistrationScreen} 
            options=    {{headerShown:false}}                          
          />

          <Stack.Screen
            name=     "DataVisualisationMain"
            component={DataVisualisationMainScreen}                      
          />

          <Stack.Screen
            name=     "SleepQuestioneer"
            component={SleepQuestioneerScreen}
            options=  {{headerShown:false}}          
          />

          <Stack.Screen
            name=     "UserDetails"
            component={UserDetailsScreen}            
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

function WelcomeScreen(){
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Heading style={{fontFamily:"sans-serif-thin", textAlign:"center"}}>ברוכים הבאים לאפליקציית יומן שינה</Heading>
      </View>
    </NativeBaseProvider>
  )
}

function RegistrationScreen(){
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  )
}

function DataVisualisationMainScreen(){
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  )
}

function SleepQuestioneerScreen(){
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  )
}

function UserDetailsScreen(){
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
