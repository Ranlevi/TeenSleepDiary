import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider, Text, Heading, Button, Input, Radio, VStack, Slider } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import { make_id } from './utility_functions';
import {check_registration_data} from './utility_functions';
import {get_registration_data, save_registration_data} from './utility_functions';


const VERSION            = 0.2;
const Stack              = createStackNavigator();


let user_registration_data = {
  user_id:      "",
  mail:         "",
  mail_repeat:  "",
  gender:       "",
  age:          16,
  school_code:  "1111"
}; 


//////////////////////////////////////////////////
///////////////////////////////////////////////////
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
            options=    {{headerShown:false}}
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

  get_registration_data().then((data)=> {
    if (data!==null){
      user_registration_data = data;      
      navigation.navigate('DataVisualisationMain');
    } else {      
      setIsButtonDisabled(false);
    }
  })

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
function RegistrationScreen({navigation}){

  const [reason_of_failure, set_reason_of_failure] = useState("");

  const [registrationData, setRegistrationData] = useState({
    user_id:      make_id(6),
    mail:         "",
    mail_repeat:  "",
    gender:       "",
    age:          16,
    school_code:  "0000"
  });

  const process_registration_data = () => {
    
    let result = check_registration_data(registrationData);
    if (result.registration_succesful){

      save_registration_data(registrationData);
      user_registration_data = registrationData;
      navigation.navigate('DataVisualisationMain');
    } else {
      set_reason_of_failure(result.info);
    }
  }
  
  return (
    <ScrollView>
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
          onPress={()=> process_registration_data()}
        >
          סיום
        </Button>
        <Text highlight>{reason_of_failure}</Text>
      </VStack>      
    </NativeBaseProvider>
    </ScrollView>
  )
}

function DataVisualisationMainScreen(){
  return (
    <NativeBaseProvider>
    <View style={styles.container}>
      <Heading>Hello</Heading>
    </View>
    </NativeBaseProvider>
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
