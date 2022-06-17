import { getDatabase, onValue, set, ref, push } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./fb-credentials"
import { snakeCase } from "lodash";



export function initDBConnection() {
    initializeApp(firebaseConfig);
}

export function storeHistoryItem(dbObj,data,callback) {
    const db = getDatabase();
    const reference = ref(db, `${dbObj}/`);
    push(reference, data);
    console.log("Entered")
    return callback();

}


export function setupDataListener(dbObj,callbackHistory) {
    console.log("setDataListener called");
    const db = getDatabase();
    const reference = ref(db, `${dbObj}/`);
    onValue(reference, (snapshot) => {
        console.log("data listener fires up with: ", snapshot)
        if(snapshot?.val()){
            const fbObject=snapshot.val();
            const newArr=[];
            let counter=0;
            Object.keys(fbObject).map((key,index)=>{

                console.log(`${key} || ${index} || ${fbObject[key]}`);
                newArr.push({...fbObject[key],id:key,seqId:counter})
                counter++;
            });
            callbackHistory(newArr);
        }else{
            callbackHistory([]);
        }

    });
}

export function setupDataProfileListener(profile,callbackHistory) {
    console.log("setDataListener called");
    const db = getDatabase();
    const reference = ref(db, `profile/`);
    onValue(reference, (snapshot) => {
        console.log("data listener fires up with: ", snapshot)
        if(snapshot?.val()){
            const fbObject=snapshot.val();
            const newArr=[];
            let counter=0;
            Object.keys(fbObject).map((key,index)=>{

                console.log(`${key} || ${index} || ${fbObject[key]}`);
                newArr.push({...fbObject[key],id:key,seqId:counter})
                counter++;
            });
            callbackHistory(newArr);
        }else{
            callbackHistory([]);
        }

    });
}