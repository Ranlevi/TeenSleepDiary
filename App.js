import { StatusBar }                    from 'expo-status-bar';
import React, {useState}                from 'react';
import { Pressable, TextInput, ToastAndroid}          from 'react-native';
import { StyleSheet, View, ScrollView}  from 'react-native';
import { NavigationContainer }          from '@react-navigation/native';
import { createStackNavigator }         from '@react-navigation/stack';
import { Fab, AddIcon, HStack }         from 'native-base';
import { Heading, Button }              from 'native-base';
import { NativeBaseProvider, Text }     from 'native-base';
import { Input, Radio, VStack }         from 'native-base';
import { Modal }                        from 'native-base';
import { Select, FlatList}              from 'native-base';
import { SafeAreaProvider }             from 'react-native-safe-area-context';
import { make_id, check_registration_data }             from './utility_functions';
import {get_registration_data, save_registration_data}  from './utility_functions';
import { save_sleep_data, get_sleep_data }              from './utility_functions';
import firebase                         from "firebase/app";
import "firebase/database";
import DateTimePicker from '@react-native-community/datetimepicker';
//https://github.com/react-native-datetimepicker/datetimepicker

const VERSION            = 0.3;
const Stack              = createStackNavigator();
const DEBUG              = true; //Erase registation data and sleep logs
const VALID_SCHOOL_CODES = ["0000", "0001"]; //TODO: replace with 4 digit integers

//FireBase Config and Init
//////////////////////////////////////////
const firebaseConfig = {
  apiKey:             "AIzaSyC8890qY4TxzWulJKBvt7YdQ_R89KMZ_x0",
  authDomain:         "teensleepdemoproject.firebaseapp.com",
  databaseURL:        "https://teensleepdemoproject-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:          "teensleepdemoproject",
  storageBucket:      "teensleepdemoproject.appspot.com",
  messagingSenderId:  "661172161209",
  appId:              "1:661172161209:android:fc222055baada11f46a968"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

//get the node in the database
let FB_rootRef = firebase.database().ref();

///////////////////////////////////////////
///////////////////////////////////////////

let user_registration_data = {
  user_id:      "",  
  gender:       "",
  age:          16,
  school_code:  "1111"
}; 

let form_data        = [];

//Try to load existing sleep logs from storage, if any.
get_sleep_data(DEBUG).then((data)=>{
  if (data!==null){
    form_data = data;
  }
})

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

  get_registration_data(DEBUG).then((data)=> {
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
  const [registrationData, setRegistrationData]    = useState({
    user_id:      make_id(6),    
    gender:       "",
    age:          "",
    school_code:  "0000"
  });

  //////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////
  
  return (
    <ScrollView>
      <StatusBar style="auto" />
      <NativeBaseProvider>
        <VStack space={3} alignItems="center">
          <Heading marginTop="30px">הרשמה</Heading>

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
          <TextInput 
            style={styles.minutes_input}
            keyboardType="numeric"
            maxLength={2}
            value={registrationData.age}
            onChangeText={(value)=> {
              setRegistrationData({...registrationData, age:value})                            
            }}
            selectTextOnFocus={true}
          />          

          <Heading size="md">קוד ביה"ס:</Heading>          
          <TextInput 
            style={styles.minutes_input}
            keyboardType="numeric"
            maxLength={4}
            value={registrationData.school_code}
            onChangeText={(value)=> 
              setRegistrationData({...registrationData, school_code:value})}
            selectTextOnFocus={true}
          />  
          {/* <Input 
            placeholder={registrationData.school_code}
            value={registrationData.school_code}
            width="50%" 
            variant="filled"
            onChangeText={(value)=> 
              setRegistrationData({...registrationData, school_code:value})}
          /> */}

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
function DataVisualisationMainScreen(){

  const [showFormModal, setShowFormModal]                   = useState(false);
  const [showInfoModal, setShowInfoModal]                   = useState(false);
  const [bedEntryTime, setBedEntryTime]                     = useState("--:--");
  const [showBedEntryTimePicker, setShowBedEntryTimePicker] = useState(false);
  const [sleepDecisionTime, setSleepDecisionTime]                     = useState("--:--");
  const [showSleepDecisionTimePicker, setShowSleepDecisionTimePicker] = useState(false);  
  const [bedActivity, setBedActivity]                       = useState("טלפון");
  const [bedActivityOther, setBedActivityOther]             = useState("");
  const [bedActivityInputDsbd, setBedActivityInputDsbd]     = useState(true);
  const [timeUntilSleep, setTimeUntilSleep]                 = useState("000");
  const [numOfAwakenings, setNumOfAwakenings]               = useState("000");
  const [totalTimeOfAwakenings, setTotalTimeOfAwakenings]   = useState("0");
  const [wakeUpTime, setWakeUpTime]                         = useState("--:--");
  const [showWakeUpTimePicker, setShowWakeUpTimePicker]     = useState(false);
  const [wakeUpMethod, setWakeUpMethod]                     = useState("שעון מעורר");
  const [wakeUpMethodOther, setWakeUpMethodOther]           = useState("");
  const [wakeUpMethodInputDslbd, setWakeUpMethodInputDslbd] = useState(true);
  const [riseFromBedTime, setRiseFromBedTime]               = useState("--:--");
  const [showRiseFromBedTimePicker, setShowRiseFromBedTimePicker] = useState(false);
  const [actualSleepTime_H, setActualSleepTime_H]           = useState("00");
  const [actualSleepTime_M, setActualSleepTime_M]           = useState("00");
  const [refreshFlatlist, setRefreshFlatlist]               = useState(false);

  const [infoForModal, setInfoForModal] = useState({
      key:                    "",
      bedEntryTime:           "",
      sleepDecisionTime:      "",
      bedActivity:            "",
      bedActivityOther:       "",
      timeUntilSleep:         "",
      numOfAwakenings:        "",
      totalTimeOfAwakenings:  "",
      wakeUpTime:             "",
      wakeUpMethod:           "",
      wakeUpMethodOther:      "",
      riseFromBedTime:      "",
      actualSleepTime:        ""
  })
  
  ///Save the submitted sleep log to local storage & Firebase.
  const save_form_data = () => {
    
    let data = {
      key:                    new Date().toLocaleString('he-IL'),
      userID:                 user_registration_data.user_id,      
      bedEntryTime:           bedEntryTime,      
      sleepDecisionTime:      sleepDecisionTime, 
      bedActivity:            bedActivity,
      bedActivityOther:       bedActivityOther,
      timeUntilSleep:         timeUntilSleep,
      numOfAwakenings:        numOfAwakenings,
      totalTimeOfAwakenings:  totalTimeOfAwakenings,
      wakeUpTime:             wakeUpTime,
      wakeUpMethod:           wakeUpMethod,
      wakeUpMethodOther:      wakeUpMethodOther,
      riseFromBedTime:        riseFromBedTime,
      actualSleepTime:        `${actualSleepTime_H}:${actualSleepTime_M}`
    }

    form_data.push(data);
    save_sleep_data(form_data);
    let new_item_ref = FB_rootRef.push();    
    new_item_ref.set(data);

    setRefreshFlatlist(refreshFlatlist => !refreshFlatlist);
  }

  ////////////////////////////////////////
  const check_input = (event) => {
    console.log(event);
  }

  
  return (
    
    <NativeBaseProvider>
      <View style={styles.dataViz}>

        {/* //Data Visualization Screen */}
        <VStack mx={1} space={3} alignItems="center" safeArea> 
          <Heading marginTop="30px">נתונים שהוזנו בעבר:</Heading>

          <FlatList 
            extraData={refreshFlatlist}
            data={form_data}
            renderItem={({item})=>(
              <Button 
                mt={3}
                variant="outline"
                onPress={()=>{
                  setInfoForModal({
                    ...infoForModal, 
                    bedEntryTime: item.bedEntryTime,
                    sleepDecisionTime: item.sleepDecisionTime,
                    bedActivity:       item.bedActivity,
                    bedActivityOther:  item.bedActivityOther,
                    timeUntilSleep:    item.timeUntilSleep,
                    numOfAwakenings:   item.numOfAwakenings,
                    totalTimeOfAwakenings:  item.totalTimeOfAwakenings,
                    wakeUpTime:         item.wakeUpTime,
                    wakeUpMethod:       item.wakeUpMethod,
                    wakeUpMethodOther:  item.wakeUpMethodOther,
                    riseFromBedTime:    item.riseFromBedTime,
                    actualSleepTime:    item.actualSleepTime
                  });
                  setShowInfoModal(true);
                }}
              >
                {item.key}
              </Button>              
            )}
          />

          <Fab
            size="lg"
            icon={<AddIcon color="white"/>}
            onPress={()=>               
              setShowFormModal(true)
            }
          />
        </VStack>
            
        {/* Sleep Questioneer Form     */}
        <Modal
          isOpen={showFormModal}
          onClose={()=> setShowFormModal(false)}
        >
          <Modal.Content>
            <Modal.CloseButton onPress={()=> setShowFormModal(false)} />
            
            <Modal.Body>
              <ScrollView>
                <NativeBaseProvider>

                  <VStack space={3} alignItems="center" safeArea>          
                      <Heading size="md">מלא את הנתונים הבאים:</Heading>  
                  
                      {/* ///////////////////////////////////////////// */}
                      <Pressable 
                        onPress={() => {setShowBedEntryTimePicker(true)}}>
                        <Text 
                          fontSize="xl" 
                          textDecoration="underline" 
                          color="red.500">
                          שעת כניסה למיטה:
                        </Text>
                      </Pressable>
                      <Text>{bedEntryTime}</Text>
                      
                      {showBedEntryTimePicker && 
                      <DateTimePicker 
                        mode="time"
                        is24Hour={true}
                        value={new Date()}
                        onChange={(event, selectedTime) => { 
                          let hours = selectedTime.getHours();
                          let minutes = selectedTime.getMinutes();                          
                          setShowBedEntryTimePicker(false);
                          setBedEntryTime(`${hours}:${minutes}`);
                        }}
                      />}

                      {/* ///////////////////////////////////////////// */}
                      <Pressable 
                        onPress={() => {setShowSleepDecisionTimePicker(true)}}>
                        <Text 
                          fontSize="xl" 
                          textDecoration="underline" 
                          color="red.500">
                          השעה בה החלטת לעצום עיניים ולהרדם:
                        </Text>
                      </Pressable>
                      <Text>{sleepDecisionTime}</Text>
                      
                      {showSleepDecisionTimePicker && 
                      <DateTimePicker 
                        mode="time"
                        is24Hour={true}
                        value={new Date()}
                        onChange={(event, selectedTime) => { 
                          let hours = selectedTime.getHours();
                          let minutes = selectedTime.getMinutes();                          
                          setShowSleepDecisionTimePicker(false);
                          setSleepDecisionTime(`${hours}:${minutes}`);
                        }}
                      />}    

                      {/* ///////////////////////////////////////////// */}
                      <Heading size="sm">מה עשית במיטה לפני שהחלטת להרדם?</Heading>
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

                      {/* ///////////////////////////////////////////// */}
                      <Heading size="sm">הזמן מהרגע שהחלטת להירדם ועד שנרדמת (בדקות):</Heading>
                      <TextInput 
                        style={styles.minutes_input}
                        keyboardType="numeric"
                        maxLength={3}
                        value={timeUntilSleep}
                        onChangeText={setTimeUntilSleep}
                        selectTextOnFocus={true}
                      />
                      

                      {/* ///////////////////////////////////////////// */}
                      <Heading size="sm">מספר היקיצות שלך בלילה:</Heading>

                      <TextInput 
                        style={styles.minutes_input}
                        keyboardType="numeric"
                        maxLength={3}
                        value={numOfAwakenings}
                        onChangeText={setNumOfAwakenings}
                        selectTextOnFocus={true}
                      />
                     

                      {/* ///////////////////////////////////////////// */}
                      <Heading size="sm">סך כל זמן היקיצות בלילה עד היציאה מהמיטה בבוקר (בדקות):</Heading>

                      <TextInput 
                        style={styles.minutes_input}
                        keyboardType="numeric"
                        maxLength={3}
                        value={totalTimeOfAwakenings}
                        onChangeText={setTotalTimeOfAwakenings}
                        selectTextOnFocus={true}
                      />                      

                      {/* ///////////////////////////////////////////// */}
                      <Pressable 
                        onPress={() => {setShowWakeUpTimePicker(true)}}>
                        <Text 
                          fontSize="xl" 
                          textDecoration="underline" 
                          color="red.500">
                          שעת היקיצה הסופית שלך בבוקר:
                        </Text>
                      </Pressable>
                      <Text>{wakeUpTime}</Text>
                      
                      {showWakeUpTimePicker && 
                      <DateTimePicker 
                        mode="time"
                        is24Hour={true}
                        value={new Date()}
                        onChange={(event, selectedTime) => { 
                          let hours = selectedTime.getHours();
                          let minutes = selectedTime.getMinutes();                          
                          setShowWakeUpTimePicker(false);
                          setWakeUpTime(`${hours}:${minutes}`);
                        }}
                      />}                   

                      {/* ///////////////////////////////////////////// */}
                      <Heading size="sm">כיצד התעוררת?</Heading>
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

                      {/* ///////////////////////////////////////////// */}
                      <Pressable 
                        onPress={() => {setShowRiseFromBedTimePicker(true)}}>
                        <Text 
                          fontSize="xl" 
                          textDecoration="underline" 
                          color="red.500">
                          השעה בה יצאת מהמיטה:
                        </Text>
                      </Pressable>
                      <Text>{riseFromBedTime}</Text>
                      
                      {showRiseFromBedTimePicker && 
                      <DateTimePicker 
                        mode="time"
                        is24Hour={true}
                        value={new Date()}
                        onChange={(event, selectedTime) => { 
                          let hours = selectedTime.getHours();
                          let minutes = selectedTime.getMinutes();                          
                          setShowRiseFromBedTimePicker(false);
                          setRiseFromBedTime(`${hours}:${minutes}`);
                        }}
                      />}

                      {/* ///////////////////////////////////////////// */}
                      <Heading size="sm">כמה זמן להערכתך ממש ישנת:</Heading>
                      <HStack>
                        {/* <TextInput 
                          style={styles.minutes_input}
                          keyboardType="numeric"
                          maxLength={2}
                          value={actualSleepTime_H}
                          onChangeText={setActualSleepTime_H}                          
                          selectTextOnFocus={true}
                        />
                        <Text> : </Text>
                        <TextInput 
                          style={styles.minutes_input}
                          keyboardType="numeric"
                          maxLength={2}
                          value={actualSleepTime_M}
                          onChangeText={setActualSleepTime_M}
                          selectTextOnFocus={true}
                        /> */}
                      </HStack>

                  </VStack>
                </NativeBaseProvider>
              </ScrollView>    
            </Modal.Body>
            <Modal.Footer>
              <Button
                onPress={()=> {
                  setShowFormModal(false);
                  save_form_data();
                }}
              >
                סיום
              </Button>
            </Modal.Footer>
          </Modal.Content>

        </Modal>

        {/* Show Info Modal */}
        <Modal
          isOpen={showInfoModal}
          onClose={()=> setShowInfoModal(false)}
        >
          <Modal.Content>
            <Modal.CloseButton 
              onClose={()=> setShowInfoModal(false)}
            />
              <Modal.Body>
                <ScrollView>
                  <NativeBaseProvider>
                    <VStack space={3} alignItems="center" safeArea>          
                      <Heading size="sm">שעת כניסה למיטה:</Heading>
                      <Text>{infoForModal.bedEntryTime}</Text>

                      <Heading size="sm">שעת החלטה להירדם:</Heading>
                      <Text>{infoForModal.sleepDecisionTime}</Text>

                      <Heading size="sm">מה עשית במיטה לפני השינה:</Heading>
                      <Text>{infoForModal.bedActivity}</Text>
                      <Text>{infoForModal.bedActivityOther}</Text>

                      <Heading size="sm">זמן עד שנרדמת:</Heading>
                      <Text>{infoForModal.timeUntilSleep}</Text>

                      <Heading size="sm">מספר היקיצות במרוצת הלילה:</Heading>
                      <Text>{infoForModal.numOfAwakenings}</Text>

                      <Heading size="sm">סך כל הזמן העירנות בלילה:</Heading>
                      <Text>{infoForModal.totalTimeOfAwakenings}</Text>

                      <Heading size="sm">שעת התעוררות בבוקר:</Heading>
                      <Text>{infoForModal.wakeUpTime}</Text>

                      <Heading size="sm">אופן ההתעוררות בבוקר:</Heading>
                      <Text>{infoForModal.wakeUpMethod}</Text>
                      <Text>{infoForModal.wakeUpMethodOther}</Text>

                      <Heading size="sm">השעה בה יצאת מהמיטה:</Heading>
                      <Text>{infoForModal.riseFromBedTime}</Text>

                      <Heading size="sm">זמן שינה מוערך:</Heading>
                      <Text>{infoForModal.actualSleepTime}</Text>
                              
                    </VStack>
                  </NativeBaseProvider>
                </ScrollView>    
              </Modal.Body>              
            </Modal.Content>
        </Modal>

      </View>
    </NativeBaseProvider>        
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
  },
  minutes_input: {
    borderBottomWidth: 1
    // borderWidth: 1,
    // paddingHorizontal: 20
    // paddingLeft: 10,
    // paddingRight: 10    
  }
});
