import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyB6CBA4XALpRohwDK15PxM3H4numiSkRQY",
  authDomain: "data-app-aa930.firebaseapp.com",
  projectId: "data-app-aa930",
  storageBucket: "data-app-aa930.appspot.com",
  messagingSenderId: "949450055340",
  appId: "1:949450055340:web:9bbdc43ed0416e210ec909"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function handleFirestoreOperations() {
  try {
    const querySnapshot = await getDocs(collection(db, "docs"));
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = ''; // Clear previous data

    if (querySnapshot.empty) {
      dataContainer.innerHTML = '<p>No data found</p>';
      return;
    }

    const ul = document.createElement('ul');
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const listItem = document.createElement('li');
      // Format the timestamp
      const timestamp = docData.timestamp ? new Date(docData.timestamp.seconds * 1000).toLocaleString() : 'No timestamp';
      listItem.textContent = `ID: ${doc.id}, First: ${docData.first}, Last: ${docData.last}, Born: ${docData.born}, Timestamp: ${timestamp}`;
      ul.appendChild(listItem);
    });
    dataContainer.appendChild(ul);
  } catch (e) {
    console.error("Error getting documents: ", e);
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}

document.getElementById('docForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const birthYear = parseInt(document.getElementById('birthYear').value, 10);

  try {
    const docRef = await addDoc(collection(db, "docs"), {
      first: firstName,
      last: lastName,
      born: birthYear,
      timestamp: Timestamp.now() // Add timestamp
    });
    document.getElementById('message').textContent = `Document written with ID: ${docRef.id}`;
    document.getElementById('docForm').reset(); // Clear form fields
  } catch (e) {
    document.getElementById('message').textContent = `Error adding document: ${e.message}`;
    console.error("Error adding document: ", e);
  }
});

document.getElementById('seeDataButton').addEventListener('click', handleFirestoreOperations);
