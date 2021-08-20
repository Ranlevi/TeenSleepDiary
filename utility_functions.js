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