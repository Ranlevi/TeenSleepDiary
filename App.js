import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider, Heading, Button, Input, Radio, VStack, Slider } from 'native-base';
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
    mail:         "",
    mail_repeat:  "",
    gender:       "",
    age:          16,
    school_code:  "0000"
  });

  return (
    <NativeBaseProvider>
      <VStack space={3} alignItems="center">
        <Heading marginTop="30px">הרשמה</Heading>

        <Input 
          placeholder={"אי-מייל"}
          value={registrationData.mail}
          width="90%" 
          variant="filled"
          onChangeText={(value)=> setRegistrationData({...registrationData, mail:value})}
        />
        <Input 
          placeholder={"אי-מייל (שוב)"}
          value={registrationData.mail_repeat}
          width="90%" 
          variant="filled"
          onChangeText={(value)=> setRegistrationData({...registrationData, mail_repeat:value})}
        />
        
        <Heading size="md">מגדר:</Heading>        
        <Radio.Group 
          defaultValue="male" 
          size="lg"
          onChange={(value)=> setRegistrationData({...registrationData, gender:value})}
        >
          <Radio aria-label="male" value="male">זכר</Radio>
          <Radio aria-label="female" value="female">נקבה</Radio>
        </Radio.Group>
        
        <Heading size="md">גיל: {registrationData.age}</Heading>
        <Slider
          defaultValue={registrationData.age}
          minValue={14}
          maxValue={18}
          accessibilityLabel="Age Slider"
          step={1}
          width="70%"
          size="lg"
          onChange={(value)=> setRegistrationData({...registrationData, age:value})}
        >
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb />
        </Slider>

        <Heading size="md">קוד ביה"ס:</Heading>
        <Input 
          placeholder={registrationData.school_code}
          value={registrationData.school_code}
          width="50%" 
          variant="filled"
          onChangeText={(value)=> setRegistrationData({...registrationData, school_code:value})}
        />

        <Button marginTop="30px"
          onPress={()=> console.log("pressed")}
        >
          סיום
        </Button>
      </VStack>      
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
