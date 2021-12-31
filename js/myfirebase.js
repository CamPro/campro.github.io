// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDvhS8XP1CDgNB_hl0l2Y78wPNPcuJoGpM",
  authDomain: "mylean-fa5f4.firebaseapp.com",
  databaseURL: "https://mylean-fa5f4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mylean-fa5f4",
  storageBucket: "mylean-fa5f4.appspot.com",
  messagingSenderId: "355120554648",
  appId: "1:355120554648:web:08aad366c09277085ca6ed"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// check nếu chưa đăng nhập thì chuyển về trang đăng nhập
firebase.auth().onAuthStateChanged(() => {
  if (firebase.auth().currentUser) {
    //logged in
    var email = firebase.auth().currentUser.email;
    $('#hello-user').text(email);
  } else {
    //logged out
    window.location.href = 'signin.html';
  }
});

// khi nhấn nút đăng xuất
$('#sign-out').click(()=>{
  firebase.auth().signOut();
  window.location.href = 'signin.html';
})

var Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 2000
});