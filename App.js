import { StatusBar }                    from 'expo-status-bar';

import React, {useState}                from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { NavigationContainer }          from '@react-navigation/native';
import { createStackNavigator }         from '@react-navigation/stack';
import { Heading, Button, Fab, AddIcon }from 'native-base';
import { NativeBaseProvider, Text }     from 'native-base';
import { Input, Radio, VStack, Slider } from 'native-base';
import { Select, FlatList }             from 'native-base';
import { SafeAreaProvider }             from 'react-native-safe-area-context';
import {TimePicker}                     from 'react-native-simple-time-picker';

import { make_id, check_registration_data }            from './utility_functions';
import {get_registration_data, save_registration_data} from './utility_functions';

import firebase                         from "firebase/app";
import "firebase/database";

const VERSION = 0.2;
const Stack   = createStackNavigator();

const firebaseConfig = {
  apiKey:             "AIzaSyC8890qY4TxzWulJKBvt7YdQ_R89KMZ_x0",
  authDomain:         "teensleepdemoproject.firebaseapp.com",
  databaseURL:        "https://teensleepdemoproject-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:          "teensleepdemoproject",
  storageBucket:      "teensleepdemoproject.appspot.com",
  messagingSenderId:  "661172161209",
  appId:              "1:661172161209:android:fc222055baada11f46a968"
};

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

//get the node in the database
let FB_rootRef = firebase.database().ref();

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
    //Try to get stored registration data, which should be available
    //if the user is already registered on the current device.
    //If found -> Go to Datavisualision Screen. Else - enable the 
    //Registration button.
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
        <Heading 
          style={styles.welcome_screen} size="sm">
            ברוכים הבאים לאפליקציית
        </Heading>
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
    //When user clicks the 'done' button, we send the data to be verified.
    //If successful - save the registration data and navigate to the 
    //data visualization screen. Else, display the reason for failure. 
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
      <StatusBar style="auto" />
      <NativeBaseProvider>
        <VStack space={3} alignItems="center">
          <Heading marginTop="30px">הרשמה</Heading>

          <Input 
            placeholder={"אי-מייל"}
            value={registrationData.mail}
            width="90%" 
            variant="filled"
            onChangeText={(value)=> 
              setRegistrationData({...registrationData, mail:value})}
          />
          <Input 
            placeholder={"אי-מייל (שוב)"}
            value={registrationData.mail_repeat}
            width="90%" 
            variant="filled"
            onChangeText={(value)=> 
              setRegistrationData({...registrationData, mail_repeat:value})}
          />
        
          <Heading size="md">מגדר:</Heading>        
          <Radio.Group 
            defaultValue="male" 
            size="lg"
            onChange={(value)=> 
              setRegistrationData({...registrationData, gender:value})}
          >
            <Radio aria-label="male"   value="male">זכר</Radio>
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
            onChange={(value)=> 
              setRegistrationData({...registrationData, age:value})}
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
            onChangeText={(value)=> 
              setRegistrationData({...registrationData, school_code:value})}
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

///////////////////////////////////////////////
///////////////////////////////////////////////
function DataVisualisationMainScreen({navigation}){

  const data = [
    {id: "123", title: "AA"},
    {id: "124", title: "BB"},
    {id: "125", title: "CC"},
  ]

  return (
    
    <NativeBaseProvider>
      <View style={styles.dataViz}>
      <VStack mx={1} space={3} alignItems="center" safeArea> 
        <FlatList 
          data={data}
          renderItem={({item})=>(
            <Text>{item.title}</Text>
          )}
        />
        <Fab
          size="lg"
          icon={<AddIcon color="white"/>}
          onPress={()=> 
            navigation.navigate('SleepQuestioneer')}
        />
      </VStack>
      </View>
    </NativeBaseProvider>
    
    
  )
}

///////////////////////////////////////////////
///////////////////////////////////////////////
function SleepQuestioneerScreen({navigation}){

  const [bedEntryTime_H, setBedEntryTime_H]             = useState(0);
  const [bedEntryTime_M, setBedEntryTime_M]             = useState(0);
  const [sleepDecisionTime_H, setSleepDecisionTime_H]   = useState(0);
  const [sleepDecisionTime_M, setSleepDecisionTime_M]   = useState(0);
  const [bedActivity, setBedActivity]                   = useState("טלפון");
  const [bedActivityOther, setBedActivityOther]         = useState("");
  const [bedActivityInputDsbd, setBedActivityInputDsbd] = useState(true);
  const [timeUntilSleep, setTimeUntilSleep]             = useState(0);
  const [numOfAwakenings, setNumOfAwakenings]           = useState(0);
  const [totalTimeOfAwakenings, setTotalTimeOfAwakenings] = useState(0);
  const [wakeUpTime_H, setWakeUpTime_H]                 = useState(0);
  const [wakeUpTime_M, setWakeUpTime_M]                 = useState(0);
  const [wakeUpMethod, setWakeUpMethod]                 = useState("שעון מעורר");
  const [wakeUpMethodOther, setWakeUpMethodOther]       = useState("");
  const [wakeUpMethodInputDslbd, setWakeUpMethodInputDslbd] = useState(true);
  const [riseFromBedTime_H, setRiseFromBedTime_H]       = useState(0);
  const [riseFromBedTime_M, setRiseFromBedTime_M]       = useState(0);
  const [actualSleepTime, setActualSleepTime]           = useState(0);
  
  const save_form_data = () => {

    let new_item_ref = FB_rootRef.push();
    
    new_item_ref.set({
      userID:                 user_registration_data.user_id,
      formSubmitTime:         new Date().toString(),
      bedEntryTime:           `${bedEntryTime_H}:${bedEntryTime_M}`,      
      sleepDecisionTime:      `${sleepDecisionTime_H}:${sleepDecisionTime_M}`, 
      bedActivity:            bedActivity,
      bedActivityOther:       bedActivityOther,
      timeUntilSleep:         timeUntilSleep,
      numOfAwakenings:        numOfAwakenings,
      totalTimeOfAwakenings:  totalTimeOfAwakenings,
      wakeUpTime:             `${wakeUpTime_H}:${wakeUpTime_M}`,
      wakeUpMethod:           wakeUpMethod,
      wakeUpMethodOther:      wakeUpMethodOther,
      riseFromBedTime_H:      `${riseFromBedTime_H}:${riseFromBedTime_M}`,
      actualSleepTime:        actualSleepTime
    });
  }
 
  return (
    <ScrollView>
      <StatusBar style="auto" />
      <NativeBaseProvider>
        <VStack mx={20} space={3} alignItems="center" safeArea>          
            <Heading>שאלון שינה</Heading>

            <Heading size="md">שעת כניסה למיטה:</Heading>
            <TimePicker              
              minutesInterval={15}
              value={{minutes:bedEntryTime_M, hours:bedEntryTime_H}}
              onChange={(value)=> {
                setBedEntryTime_H(value.hours);
                setBedEntryTime_M(value.minutes);
              }}
            />

            <Heading size="md">השעה בה החלטת לעצום עיניים ולהרדם:</Heading>
            <TimePicker              
              minutesInterval={15}
              value={{minutes:sleepDecisionTime_M, hours:sleepDecisionTime_H}}
              onChange={(value)=> {
                setSleepDecisionTime_H(value.hours);
                setSleepDecisionTime_M(value.minutes);
              }}
            />

            <Heading size="md">מה עשית במיטה לפני שהחלטת להרדם?</Heading>
            <Select 
              minWidth={200} 
              selectedValue={bedActivity}
              onValueChange={(value)=>{
                if (value==="אחר"){
                  setBedActivityInputDsbd(false);
                  setBedActivity(value);                  
                } else {
                  setBedActivityInputDsbd(true);
                  setBedActivity(value);
                  setBedActivityOther("");
                }
              }}
            >
              <Select.Item label="טלפון"      value="טלפון" />
              <Select.Item label="מחשב"       value="מחשב" />
              <Select.Item label="טאבלט"      value="טאבלט" />
              <Select.Item label="ספר"        value="ספר" />
              <Select.Item label="מוזיקה"     value="מוזיקה" />
              <Select.Item label="טלוויזיה"   value="טלוויזיה" />
              <Select.Item label="אחר (פרט.י לעיל)" value="אחר" />
            </Select>
            <Input               
              w="80%"
              isDisabled={bedActivityInputDsbd}
              placeholder="פירוט"
              value={bedActivityOther}
              variant="filled"
              onChangeText={(value)=> 
                setBedActivityOther(value)
              }
            />

            <Heading size="md">הזמן מהרגע שהחלטת להירדם ועד שנרדמת:</Heading>
            <Text>{timeUntilSleep} דקות</Text>
            <Slider
              defaultValue={timeUntilSleep}
              minValue={0}
              maxValue={180}
              accessibilityLabel="Time Until Sleep"
              step={15}
              width="80%"
              size="md"
              onChange={(value)=> 
                setTimeUntilSleep(value)}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>

            <Heading size="md">מספר היקיצות שלך בלילה:</Heading>
            <Text>{numOfAwakenings} יקיצות</Text>
            <Slider
              defaultValue={numOfAwakenings}
              minValue={0}
              maxValue={9}
              accessibilityLabel="Number of Awakeinings"
              step={1}
              width="80%"
              size="md"
              onChange={(value)=> 
                setNumOfAwakenings(value)}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>

            <Heading size="md">סך כל זמן היקיצות בלילה עד היציאה מהמיטה בבוקר:</Heading>
            <Text>{totalTimeOfAwakenings} דקות</Text>
            <Slider
              defaultValue={totalTimeOfAwakenings}
              minValue={0}
              maxValue={180}
              accessibilityLabel="Total Time Awake"
              step={15}
              width="80%"
              size="md"
              onChange={(value)=> 
                setTotalTimeOfAwakenings(value)}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
        
            <Heading size="md">שעת היקיצה הסופית שלך בבוקר:</Heading>
            <TimePicker              
              minutesInterval={15}
              value={{minutes:wakeUpTime_M, hours:wakeUpTime_H}}
              onChange={(value)=> {
                setWakeUpTime_H(value.hours);
                setWakeUpTime_M(value.minutes);
              }}
            />

            <Heading size="md">כיצד התעוררת?</Heading>
            <Select 
              minWidth={200} 
              selectedValue={wakeUpMethod}
              onValueChange={(value)=>{
                if (value==="אחר"){
                  setWakeUpMethodInputDslbd(false);
                  setWakeUpMethod(value);                  
                } else {
                  setWakeUpMethodInputDslbd(true);
                  setWakeUpMethod(value);
                  setWakeUpMethodOther("");
                }
              }}
            >
              <Select.Item label="שעון מעורר"      value="שערון מעורר" />
              <Select.Item label="העירו אותי"       value="העירו אותי" />
              <Select.Item label="התעוררתי לבד"      value="התעוררתי לבד" />
              <Select.Item label="התעוררתי מרעש\אור"        value="התעוררתי מראש\אור" />
              <Select.Item label="אחר (פרט.י לעיל)" value="אחר" />
            </Select>
            <Input               
              w="80%"
              isDisabled={wakeUpMethodInputDslbd}
              placeholder="פירוט"
              value={wakeUpMethodOther}
              variant="filled"
              onChangeText={(value)=> 
                setWakeUpMethodOther(value)
              }
            />

            <Heading size="md">השעה בה יצאת מהמיטה:</Heading>
            <TimePicker              
              minutesInterval={15}
              value={{minutes:riseFromBedTime_M, hours:riseFromBedTime_H}}
              onChange={(value)=> {
                setRiseFromBedTime_H(value.hours);
                setRiseFromBedTime_M(value.minutes);
              }}
            />

            <Heading size="md">כמה זמן להערכתך ממש ישנת:</Heading>
            <Text>{actualSleepTime} שעות</Text>
            <Slider
              defaultValue={actualSleepTime}
              minValue={0}
              maxValue={12}
              accessibilityLabel="Actual Sleep Time"
              step={0.25}
              width="80%"
              size="md"
              onChange={(value)=> 
                setActualSleepTime(value)}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>

            <Button 
              onPress={()=> {
                save_form_data();
                navigation.navigate('DataVisualisationMain');
              }}
            >
              סיום
            </Button>
        </VStack>
      </NativeBaseProvider>
    </ScrollView>    
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
    alignItems: "center"
  },
  dataViz: {   
    flex: 1, 
    justifyContent: "flex-start",    
  }
});
