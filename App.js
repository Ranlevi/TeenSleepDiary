import { StatusBar }                    from 'expo-status-bar';
import React, {useState}                from 'react';
import { Pressable  }                   from 'react-native';
import { StyleSheet, View, ScrollView}  from 'react-native';
import { NavigationContainer }          from '@react-navigation/native';
import { createStackNavigator }         from '@react-navigation/stack';
import { Fab, AddIcon, InfoOutlineIcon } from 'native-base';
import { Heading, Button, Box }         from 'native-base';
import { NativeBaseProvider, Text }     from 'native-base';
import { Input, Radio, VStack }         from 'native-base';
import { Modal }                        from 'native-base';
import { Select, FlatList}              from 'native-base';
import { SafeAreaProvider }             from 'react-native-safe-area-context';
import { make_id }                      from './utility_functions';
import { get_registration_data, save_registration_data} from './utility_functions';
import { save_sleep_data, get_sleep_data }              from './utility_functions';
import firebase                         from "firebase/app";
import "firebase/database";
import DateTimePicker from '@react-native-community/datetimepicker';
//https://github.com/react-native-datetimepicker/datetimepicker

const VERSION            = 0.3;
const Stack              = createStackNavigator();
const DEBUG              = false; //Erase registation data and sleep logs

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
      <Box style={styles.container} bgColor='lightBlue.100'>    

        <Heading 
          style={styles.welcome_screen} size="sm">
            ???????????? ?????????? ????????????????????
        </Heading>
        <Heading style={styles.welcome_screen}>???????? ????????</Heading>
            
        <Button
          colorScheme="teal"
          marginTop="50px"
          isDisabled={isButtonDisabled}
          onPress={()=> navigation.navigate('Registration')}
        >
          ??????????
        </Button>

      </Box>
      
    </NativeBaseProvider>
  )
}

///////////////////////////////////////////////
///////////////////////////////////////////////
function RegistrationScreen({navigation}){

  const [ageIsInvalid, setAgeIsInvalid]               = useState(false);
  const [schoolCodeIsInvalid, setSchoolCodeIsInvalid] = useState(false);
  const [errorText, setErrorText]                     = useState("");

  const [registrationData, setRegistrationData]       = useState({
    user_id:      make_id(6),    
    gender:       "",
    age:          "",
    school_code:  "0000"
  });
  
  return (
      <NativeBaseProvider>   
        <StatusBar style="auto" />    
        <Box style={styles.registraion_screen}>
        
          <Heading marginTop="100px">??????????</Heading>
          <Text highlight marginTop="10px">{errorText}</Text>

          <Heading marginTop="30px" size="md">????????:</Heading>        
          <Radio.Group 
            defaultValue= "male" 
            size=         "lg"
            marginTop=    "10px"
            onChange={(value)=> 
              setRegistrationData({...registrationData, gender:value})}
          >
            <Radio aria-label="male"   value="male">??????</Radio>
            <Radio aria-label="female" value="female">????????</Radio>
          </Radio.Group>
        
          <Heading marginTop="30px" size="md">??????:</Heading>
          <Input 
            textAlign=         "center"
            isInvalid=         {ageIsInvalid}
            variant=           "rounded"
            width=             "30%"
            keyboardType=      "numeric"
            maxLength=         {2}
            selectTextOnFocus= {true}
            value=             {registrationData.age}
            onChangeText={(value)=> {
              setRegistrationData({...registrationData, age:value})                            
            }}
          />    

          <Heading marginTop="30px" size="md">?????? ??????"??:</Heading> 
          <Input 
            textAlign=         "center"
            isInvalid=         {schoolCodeIsInvalid}
            variant=           "rounded"
            width=             "30%"
            keyboardType=      "numeric"
            maxLength=         {4}
            selectTextOnFocus= {true}
            value=             {registrationData.school_code}
            onChangeText={(value)=> {
              setRegistrationData({...registrationData, school_code:value})                            
            }}
          />  

          <Button 
            marginTop="30px"
            onPress={()=>{
              //Validate inputs:

              //Valid Age, 14-18
              let isnum = /^\d+$/.test(registrationData.age);
              let age = parseInt(registrationData.age, 10);
              if (!isnum || age<14 || age>18){
                setAgeIsInvalid(true);
                setErrorText("??????????: ?????? ???????? ?????????? ?????????? ???????? 14 ??-18");
                return;
              } else {
                setAgeIsInvalid(false);
              }             
              
              //validate school code
              //numbers only, 0-9999 (can't be above 4 digits anyway)
              isnum = /^\d+$/.test(registrationData.school_code);
              if (!isnum || 
                registrationData.school_code.length===0){
                  setSchoolCodeIsInvalid(true);
                  setErrorText("?????? ?????? ?????? ???????? ????????.");
                  return;
                } else {
                  setSchoolCodeIsInvalid(false);
                }

              //Inputs are valid!
              save_registration_data(registrationData);
              user_registration_data = registrationData;
              navigation.navigate('DataVisualisationMain');
            }}            
          >
            ????????
          </Button>

       </Box>
    </NativeBaseProvider>
    
  )
}

///////////////////////////////////////////////
///////////////////////////////////////////////
function DataVisualisationMainScreen(){

  const [showFormModal, setShowFormModal]   = useState(false);  
  const [showInfoModal, setShowInfoModal]   = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const [bedEntryTime, setBedEntryTime]                     = useState("--:--");
  const [showBedEntryTimePicker, setShowBedEntryTimePicker] = useState(false);
  const [sleepDecisionTime, setSleepDecisionTime]                     = useState("--:--");
  const [showSleepDecisionTimePicker, setShowSleepDecisionTimePicker] = useState(false);  
  const [bedActivity, setBedActivity]                       = useState("??????????");
  const [bedActivityOther, setBedActivityOther]             = useState("");
  const [bedActivityInputDsbd, setBedActivityInputDsbd]     = useState(true);
  const [timeUntilSleep, setTimeUntilSleep]                 = useState("000");
  const [numOfAwakenings, setNumOfAwakenings]               = useState("000");
  const [totalTimeOfAwakenings, setTotalTimeOfAwakenings]   = useState("000");
  const [wakeUpTime, setWakeUpTime]                         = useState("--:--");
  const [showWakeUpTimePicker, setShowWakeUpTimePicker]     = useState(false);
  const [wakeUpMethod, setWakeUpMethod]                     = useState("???????? ??????????");
  const [wakeUpMethodOther, setWakeUpMethodOther]           = useState("");
  const [wakeUpMethodInputDslbd, setWakeUpMethodInputDslbd] = useState(true);
  const [riseFromBedTime, setRiseFromBedTime]               = useState("--:--");
  const [showRiseFromBedTimePicker, setShowRiseFromBedTimePicker] = useState(false);
  const [actualSleepTime_H, setActualSleepTime_H]           = useState("HH");
  const [actualSleepTime_M, setActualSleepTime_M]           = useState("MM");
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
    let day_names = ["??????????", "??????", "??????????", "??????????", "??????????", "????????", "??????"];

    let date=     new Date();    
    let day_num=  date.getDay();
    let day=      date.getDate();
    let month=    date.getMonth() + 1;
    let year=     date.getFullYear();
    let hours=    date.getHours();
    let minutes=  date.getMinutes();

    let str = `${day_names[day_num]}, ${day}.${month}.${year}, ${hours}:${minutes}`;
    
    let data = {      
      key:                    str,
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
  
  return (
    
    <NativeBaseProvider>
      <View style={styles.dataViz}>

        {/* //Data Visualization Screen */}
        <VStack mx={1} space={3} alignItems="center" safeArea> 
          <Heading marginTop="30px">???????????? ???????????? ????????:</Heading>

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
            placement="bottom-right"
            icon={<AddIcon color="white"/>}
            onPress={()=>               
              setShowFormModal(true)
            }
          />
          <Fab
            placement="bottom-left"
            icon={<InfoOutlineIcon size="sm" color="black"/>}            
            onPress={()=>               
              setShowAboutModal(true)
            }
          />
        </VStack>    

        {/* //About Info Modal */}
        <Modal
          isOpen={showAboutModal}
          onClose={()=> setShowAboutModal(false)}
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>??????????</Modal.Header>
            <Modal.Body>
              <VStack>
                <Text>???????? {VERSION}</Text>
                <Text>???????? ??"??: ???? ??????</Text>
                <Text>???????????? ??????: tbd@tbd.com</Text>                            
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
            
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
                      <Heading size="md">?????? ???? ?????????????? ??????????:</Heading>  
                  
                      {/* ///////////////////////////////////////////// */}                      
                      <Text>?????? ?????????? ??????????:  </Text>                      
                      <Pressable 
                        onPress={() => {setShowBedEntryTimePicker(true)}}>
                        <Text fontSize="xl" color="primary.500">{bedEntryTime}</Text>
                      </Pressable>
                      
                      
                      {showBedEntryTimePicker && 
                      <DateTimePicker 
                        mode=     "time"
                        is24Hour= {true}
                        value=    {new Date()}
                        onChange={(event, selectedTime) => { 
                          if (event.type!=="dismissed"){
                            let hours   = selectedTime.getHours();
                            let minutes = selectedTime.getMinutes();                          
                            setShowBedEntryTimePicker(false);
                            setBedEntryTime(`${hours}:${minutes}`);
                          }
                        }}
                      />}

                      {/* ///////////////////////////////////////////// */}                      
                      <Text>???????? ???? ?????????? ?????????? ???????????? ????????????:  </Text>                      
                      <Pressable 
                        onPress={() => {setShowSleepDecisionTimePicker(true)}}>
                        <Text fontSize="xl" color="primary.500">{sleepDecisionTime}</Text>
                      </Pressable>
                      
                      
                      {showSleepDecisionTimePicker && 
                      <DateTimePicker 
                        mode=     "time"
                        is24Hour= {true}
                        value=    {new Date()}
                        onChange={(event, selectedTime) => { 
                          if (event.type!=="dismissed"){
                            let hours = selectedTime.getHours();
                            let minutes = selectedTime.getMinutes();                          
                            setShowSleepDecisionTimePicker(false);
                            setSleepDecisionTime(`${hours}:${minutes}`);
                          }                          
                        }}
                      />}    

                      {/* ///////////////////////////////////////////// */}
                      <Text>???? ???????? ?????????? ???????? ???????????? ???????????</Text>
                      <Select 
                        minWidth=     {200} 
                        selectedValue={bedActivity}
                        onValueChange={(value)=>{
                          if (value==="??????"){
                            setBedActivityInputDsbd(false);
                            setBedActivity(value);                  
                          } else {
                            setBedActivityInputDsbd(true);
                            setBedActivity(value);
                            setBedActivityOther("");
                          }
                        }}
                      >
                        <Select.Item label="??????????"      value="??????????" />
                        <Select.Item label="????????"       value="????????" />
                        <Select.Item label="??????????"      value="??????????" />
                        <Select.Item label="??????"        value="??????" />
                        <Select.Item label="????????????"     value="????????????" />
                        <Select.Item label="????????????????"   value="????????????????" />
                        <Select.Item label="?????? (??????.?? ????????)" value="??????" />
                      </Select>
                      <Input               
                        w=          "80%"
                        isDisabled= {bedActivityInputDsbd}
                        placeholder="??????????"
                        value=      {bedActivityOther}
                        variant=    "filled"
                        onChangeText={(value)=> 
                          setBedActivityOther(value)
                        }
                      />

                      {/* ///////////////////////////////////////////// */}
                      <Text>???????? ?????????? ???????????? ???????????? ?????? ???????????? (??????????):</Text>
                      <Input
                        textAlign=         "center"
                        variant=           "rounded"
                        width=             "30%"
                        keyboardType=      "numeric"
                        maxLength=         {3}
                        selectTextOnFocus= {true}
                        value=             {timeUntilSleep}
                        onChangeText={(value)=> {
                          setTimeUntilSleep(value);
                        }}
                      /> 
                      
                      {/* ///////////////////////////////////////////// */}
                      <Text>???????? ?????????????? ?????? ??????????:</Text>
                      <Input
                        textAlign=         "center"
                        variant=           "rounded"
                        width=             "30%"
                        keyboardType=      "numeric"
                        maxLength=         {2}
                        selectTextOnFocus= {true}
                        value=             {numOfAwakenings}
                        onChangeText={(value)=> {
                          setNumOfAwakenings(value);
                        }}                        
                      />                                            

                      {/* ///////////////////////////////////////////// */}
                      <Text>???? ???? ?????? ?????????????? ?????????? ???? ???????????? ???????????? ?????????? (??????????):</Text>
                      <Input
                        textAlign=         "center"
                        variant=           "rounded"
                        width=             "30%"
                        keyboardType=      "numeric"
                        maxLength=         {3}
                        selectTextOnFocus= {true}
                        value=             {totalTimeOfAwakenings}
                        onChangeText={(value)=> {
                          setTotalTimeOfAwakenings(value);
                        }}                        
                      />                                         

                      {/* ///////////////////////////////////////////// */}                      
                      <Text>?????? ???????????? ???????????? ?????? ??????????:  </Text>                      
                      <Pressable 
                        onPress={() => {setShowWakeUpTimePicker(true)}}>
                        <Text fontSize="xl" color="primary.500">{wakeUpTime}</Text>
                      </Pressable>
                      
                      
                      {showWakeUpTimePicker && 
                      <DateTimePicker 
                        mode=         "time"
                        is24Hour=     {true}
                        value=        {new Date()}
                        onChange={(event, selectedTime) => { 
                          if (event.type!=="dismissed"){
                            let hours   = selectedTime.getHours();
                            let minutes = selectedTime.getMinutes();                          
                            setShowWakeUpTimePicker(false);
                            setWakeUpTime(`${hours}:${minutes}`);
                          }
                        }}
                      />}                   

                      {/* ///////////////////////////////////////////// */}
                      <Heading size="sm">???????? ???????????????</Heading>
                      <Select 
                        minWidth={200} 
                        selectedValue={wakeUpMethod}
                        onValueChange={(value)=>{
                          if (value==="??????"){
                            setWakeUpMethodInputDslbd(false);
                            setWakeUpMethod(value);                  
                          } else {
                            setWakeUpMethodInputDslbd(true);
                            setWakeUpMethod(value);
                            setWakeUpMethodOther("");
                          }
                        }}
                      >
                        <Select.Item label="???????? ??????????"      value="?????????? ??????????" />
                        <Select.Item label="?????????? ????????"       value="?????????? ????????" />
                        <Select.Item label="???????????????? ??????"      value="???????????????? ??????" />
                        <Select.Item label="???????????????? ????????\??????"        value="???????????????? ????????\??????" />
                        <Select.Item label="?????? (??????.?? ????????)" value="??????" />
                      </Select>
                      <Input               
                        w=            "80%"
                        isDisabled=   {wakeUpMethodInputDslbd}
                        placeholder=  "??????????"
                        value=        {wakeUpMethodOther}
                        variant=      "filled"
                        onChangeText={(value)=> 
                          setWakeUpMethodOther(value)
                        }
                      />

                      {/* ///////////////////////////////////////////// */}                      
                      <Text>???????? ???? ???????? ????????????:  </Text>                      
                      <Pressable 
                        onPress={() => {setShowRiseFromBedTimePicker(true)}}>
                        <Text fontSize="xl" color="primary.500">{riseFromBedTime}</Text>
                      </Pressable>
                      
                      
                      {showRiseFromBedTimePicker && 
                      <DateTimePicker 
                        mode=       "time"
                        is24Hour=   {true}
                        value=      {new Date()}
                        onChange={(event, selectedTime) => { 
                          if (event.type!=="dismissed"){
                            let hours   = selectedTime.getHours();
                            let minutes = selectedTime.getMinutes();                          
                            setShowRiseFromBedTimePicker(false);
                            setRiseFromBedTime(`${hours}:${minutes}`);
                          }                         
                        }}
                      />}

                      {/* ///////////////////////////////////////////// */}
                      <Text>?????? ?????? ?????????????? ?????? ????????:</Text>                      
                      <Input
                        textAlign=         "center"
                        variant=           "rounded"
                        width=             "30%"
                        keyboardType=      "numeric"
                        maxLength=         {2}
                        selectTextOnFocus= {true}
                        value=             {actualSleepTime_H}
                        onChangeText={(value)=> {
                          setActualSleepTime_H(value);
                        }}
                      />                         
                      <Input
                        textAlign=         "center"
                        variant=           "rounded"
                        width=             "30%"
                        keyboardType=      "numeric"
                        maxLength=         {2}
                        selectTextOnFocus= {true}
                        value=             {actualSleepTime_M}
                        onChangeText={(value)=> {
                          setActualSleepTime_M(value);
                        }}
                      />                       
                      

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
                ????????
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
                      <Heading size="sm">?????? ?????????? ??????????:</Heading>
                      <Text>{infoForModal.bedEntryTime}</Text>

                      <Heading size="sm">?????? ?????????? ????????????:</Heading>
                      <Text>{infoForModal.sleepDecisionTime}</Text>

                      <Heading size="sm">???? ???????? ?????????? ???????? ??????????:</Heading>
                      <Text>{infoForModal.bedActivity}</Text>
                      <Text>{infoForModal.bedActivityOther}</Text>

                      <Heading size="sm">?????? ???? ????????????:</Heading>
                      <Text>{infoForModal.timeUntilSleep}</Text>

                      <Heading size="sm">???????? ?????????????? ???????????? ??????????:</Heading>
                      <Text>{infoForModal.numOfAwakenings}</Text>

                      <Heading size="sm">???? ???? ???????? ?????????????? ??????????:</Heading>
                      <Text>{infoForModal.totalTimeOfAwakenings}</Text>

                      <Heading size="sm">?????? ???????????????? ??????????:</Heading>
                      <Text>{infoForModal.wakeUpTime}</Text>

                      <Heading size="sm">???????? ?????????????????? ??????????:</Heading>
                      <Text>{infoForModal.wakeUpMethod}</Text>
                      <Text>{infoForModal.wakeUpMethodOther}</Text>

                      <Heading size="sm">???????? ???? ???????? ????????????:</Heading>
                      <Text>{infoForModal.riseFromBedTime}</Text>

                      <Heading size="sm">?????? ???????? ??????????:</Heading>
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
  //Basic Layout: everything is centered on both axes. White BG.
  container: {
    flex: 1,    
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome_screen: {
    fontFamily:"sans-serif-thin", 
    textAlign:"center"
  },
  registraion_screen: {
    flex:            1,
    backgroundColor: '#fff',
    alignItems:      'center',
    justifyContent: 'flex-start',
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
