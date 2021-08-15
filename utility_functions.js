import AsyncStorage from '@react-native-async-storage/async-storage';


////////////////////////////////////////////////////
////////////////////////////////////////////////////
export function make_id(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
    }
    return result;
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
export function check_registration_data(registrationData){
    //Checks if registation data entered by the user is valid.
    //If not, the reason will be returned in the info field.
    let result_obj = {
      registration_succesful: true,
      info:   ""
    }
    //TODO: validate school code - numbers only, 0-9999
    let school_code = parseInt(registrationData.school_code,10);
    if (school_code<0 || school_code>9999){
      result_obj = {
            result: false,
            info:   "קוד בית ספר אינו תקין."
          }
    }    
    
    let age = parseInt(registrationData.age, 10);
    if (age<14 || age>18){
      result_obj = {
        result: false,
        info:   "שגיאה: גיל חייב להיות בתחום שבין 14 ל-18"
      }
    }
    
    return result_obj;
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
export async function get_registration_data(DEBUG){

    if (DEBUG){
      await AsyncStorage.removeItem('user_registration_data');
    }
  
    let jsonData =  await AsyncStorage.getItem('user_registration_data');
    if (jsonData===null){
      return null;
    } else {
      return JSON.parse(jsonData);
    }
}
 
////////////////////////////////////////////////////
////////////////////////////////////////////////////
export async function save_registration_data(registration_data){
  try {
    const jsonValue = JSON.stringify(registration_data)
    await AsyncStorage.setItem('user_registration_data', jsonValue)
  } catch(error) {
    console.log('save_registration_data(): ' + error);
  }
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
export async function save_sleep_data(form_data){
  try {
    const jsonValue = JSON.stringify(form_data)
    await AsyncStorage.setItem('form_data', jsonValue)
  } catch(error) {
    console.log('save_form_data(): ' + error);
  }
}
  
////////////////////////////////////////////////////
////////////////////////////////////////////////////
export async function get_sleep_data(DEBUG){

  if (DEBUG){
    await AsyncStorage.removeItem('form_data');
  }

  let jsonData =  await AsyncStorage.getItem('form_data');

  if (jsonData===null){
    return null;
  } else {
    return JSON.parse(jsonData);
  }
}