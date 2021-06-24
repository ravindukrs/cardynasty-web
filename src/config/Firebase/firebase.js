import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


const config = {
    apiKey: "AIzaSyDRSVCKAJm0ByMpCsId9ZHBwNiAP1EKHWc",
    authDomain: "cardynasty-rs.firebaseapp.com",
    databaseURL: "https://cardynasty-rs.firebaseio.com",
    projectId: "cardynasty-rs",
    storageBucket: "cardynasty-rs.appspot.com",
    messagingSenderId: "760569910094",
    appId: "1:760569910094:web:f3df5c043ee6be3efe841f",
    measurementId: "G-3XFEKGP92M"
};

class Firebase {
    constructor() {
        firebase.initializeApp(config);

        this.auth = firebase.auth()
        this.db = firebase.firestore();
        // this.analytics = firebase.analytics();
    }
    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    createNewUser = (userData, otherData) => {
        this.db.collection('users').doc(`${userData.user.uid}`).set(
            {
                userType: "Admin",
                ...otherData
            }
        )
    }

    getAllVehicles = async() => {
        const snapshot = await firebase.firestore().collection('constants').get()
        console.log("Get all vehicles")
        console.log(snapshot)
        //return snapshot.docs.map(doc => doc.data());
    }


}

export default Firebase;