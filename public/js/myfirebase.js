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
		//window.location.href = 'signin.html';
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

var rtdb = firebase.database();
var fsdb = firebase.firestore();
var lastIndex = 0;
rtdb.ref('knowledge/').orderByKey().limitToLast(1).on('value', function(snapshot) {
	let value = snapshot.val();
	if (value) {
		lastIndex = Object.keys(value)[0];
	}
	else
	{
		lastIndex = 0;
	}
	$('#number-knowledge').text(lastIndex);
});

$('[data-widget="control-sidebar"],#highlight-text').click(function ()
{
	let highlight = getSelectText().trim();
	$('#text-to-knowledge').val(highlight);
	$('#create-knowledge').prop('disabled', false);
	clearSelectText();
});

$('#text-to-knowledge').change(function ()
{
	let highlight = $('#text-to-knowledge').val().toLowerCase();
	$('#create-course option').each(function ()
	{
		let course = this.value.toLowerCase();
		if (highlight.includes(course))
		{
			//$('#create-course').val(this.value);
		}
	})
});

$('#create-knowledge').click(function ()
{
	let highlight = $('#text-to-knowledge').val().trim();
	let course = $('#create-course').val().trim();
	let image = $('#create-image').val().trim();

	let button = $('#create-knowledge').html();
	if (highlight.length > 0 && course.length > 0)
	{
		++lastIndex;

		highlight = highlight.charAt(0).toUpperCase() + highlight.slice(1);

		KnowledgeSave(lastIndex, highlight, course, image);
		
		$('#text-to-knowledge').val('');
		$('#create-course').val('');
		$('#create-knowledge').html('<i class="fas fa-check"></i></i> Kiến Tạo Thành Công');
		$('#create-knowledge').removeClass('btn-primary').addClass('btn-success');
		setTimeout(function(){
			$('#create-knowledge').html(button).removeClass('btn-success').addClass('btn-primary');
			document.querySelector('a[data-widget="control-sidebar"]').click();
		}, 500);
	}
});

var timer = null;
$('[data-widget="sidebar-search"] input').on('keyup change', function()
{
	clearTimeout(timer);
	timer = setTimeout(searchAction, 1000);
});

$('div.content-wrapper div.content').click(function () {
	if ($('body.control-sidebar-slide-open').length > 0)
	{
		document.querySelector('a[data-widget="control-sidebar"]').click();
	}
})

function searchAction()
{
	let keyword = $('[data-widget="sidebar-search"] input').val().trim();

	var firstSearch = fsdb.collection("posts").where('title', '==', keyword).limit(5).get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			RenderSearch(doc);
		});
	})
	.catch((error) => {
		console.log(error);
	});

	firstSearch = fsdb.collection("posts").where('creator', '==', keyword).limit(5).get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			RenderSearch(doc);
		});
	})
	.catch((error) => {
		console.log(error);
	});

	firstSearch = fsdb.collection("posts").where('slug', '==', keyword).limit(5).get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			RenderSearch(doc);
		});
	})
	.catch((error) => {
		console.log(error);
	});

	firstSearch = fsdb.collection("posts").where('category', '==', keyword).limit(5).get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			RenderSearch(doc);
		});
	})
	.catch((error) => {
		console.log(error);
	});
}

function RenderSearch(doc)
{
	let docid = doc.id;
	let docdata = doc.data();
	
	let linkurl = '/post.html?source=' + docdata.source + '&slug=' + docdata.slug + '&docid=' + docid;

	let item = '<a href="'+linkurl+'" class="list-group-item"><div class="search-title">'+docdata.title+'</div><div class="search-path">'+docdata.creator+', '+docdata.category+'</div></a>';

	$('.sidebar-search-results .list-group').append(item);
}

function KnowledgeSave(klgIndex, learn, course, image = '')
{
	let created_at = moment().unix();

	rtdb.ref('knowledge/' + klgIndex).set({
		learn : learn,
		course: course,
		created_at: created_at,
		repeat: 0,
		practice_at: 0,
		image: image
	}).catch((error) => {
		console.log(error);
	});
}

function myClock() {
	let days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
	let d = new Date();
	let day = days[d.getDay()];
	let hr = d.getHours();
	let min = d.getMinutes();
	if (min < 10) {
		min = "0" + min;
	}
	let date = d.getDate();
	let month = d.getMonth()+1;
	let year = d.getFullYear();
	let clock = day + ", " + date + "/" + month + " " + hr + ":" + min;
	$('#my-clock').text(clock);
}
myClock();
setInterval(myClock, 30*1000);
