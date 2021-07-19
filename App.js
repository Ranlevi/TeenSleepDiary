import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider, Heading, Button, Input } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

///////////////////////////////////////
async function getRegistrationData(){
  //Returns a Promise which resolves to true if user is registered.
  try {
    return await AsyncStorage.getItem('@is_user_registered_key');
  } catch(error){
    console.log("getRegistrationData(): " + error);
  }  
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

////////////////////////////////////////////////
///////////////////////////////////////////////
function WelcomeScreen({navigation}){
  //First screen presented to the user.
  //Right away, check internal storage if user is already registered.
  //If not - enable a button that takes the user to a registration page.
  //If already registered: go to the Data Visualization Screen.

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  getRegistrationData().then((is_user_registered) => {
      if (is_user_registered===true){
        navigation.navigate('DataVisualisationMain');
      } else {
        setIsButtonDisabled(false);        
      }
    }    
  )  

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Heading style={styles.welcome_screen} size="sm">ברוכים הבאים לאפליקציית</Heading>
        <Heading style={styles.welcome_screen}>יומן שינה</Heading>
      </View>
      <View style={styles.container}>
        <Button 
          isDisabled={isButtonDisabled}
          onPress={()=> navigation.navigate('Registration')}
        >
          הרשמה
        </Button>
      </View>
    </NativeBaseProvider>
  )
}

///////////////////////////////////////////////
///////////////////////////////////////////////
function RegistrationScreen(){

  const [registrationData, setRegistrationData] = useState({
    email: "אי-מייל",
    email_repeat: ""
  });
  //TODO: fix the email update state
  return (
    <NativeBaseProvider>      
      <View style={styles.form}>
        <Heading marginTop="30px">הרשמה</Heading>        
        <Input 
          marginTop="30px" 
          value={registrationData.email}
          width="90%" 
          variant="filled"
          onChange={(value)=> setRegistrationData({...registrationData, email: value})}
        />
      </View>
    </NativeBaseProvider>
  )
}

function DataVisualisationMainScreen(){
  return (
    <View style={styles.container}>
      <Heading>Hello</Heading>
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
  welcome_screen: {
    fontFamily:"sans-serif-thin", 
    textAlign:"center"
  },
  form: {
    flex: 1,
    justifyContent: "flex-start",
    // alignContent: "flex-start",
    alignItems: "center"
  }
});
