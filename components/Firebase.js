import * as firebase from 'firebase';
import * as keys from '../keys/Keys';

const firebaseKey = keys["default"]["firebaseKey"];

const firebaseConfig = {
    apiKey: firebaseKey,
    authDomain: 'designcode-app.firebaseapp.com',
    databaseURL: 'https://designcode-app.firebaseio.com',
    storageBucket: 'designcode-app.appspot.com'
};

firebase.initializeApp(firebaseConfig);

export default firebase;
