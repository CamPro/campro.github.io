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
	window.location.href = '/signin.html';
})

var Toast = Swal.mixin({
	toast: true,
	position: 'center',
	showConfirmButton: false,
	timer: 2000
});

var rtdb = firebase.database();
var fsdb = firebase.firestore();

$('[data-widget="control-sidebar"],#fast-highlight').click(function ()
{
	let highlight = getSelectText().trim();
	$('#fast-content').val(highlight);
	clearSelectText();

	// lấy danh sách lĩnh vực
	if ($('#fast-categories option').length == 0)
	{
		$('#fast-categories').html('<option>-- Chọn chủ đề --</option>');
		fsdb.collection("categories").orderBy("index", "asc").get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				let docid = doc.id;
				let docdata = doc.data();
				var code = '<option value="' + docid + '">' + docdata.category + '</option>';
				$('#fast-categories').append(code);
			});
		})
		.catch((error) => {
			console.log(error);
		});
	}
});
// load course to fast
$('#fast-categories').change(function ()
{
	let category_id = $('#fast-categories').val();

	$('#fast-courses').html('');

	fsdb.collection("courses").where('category_id', '==', category_id).orderBy("index", "asc").get()
	.then((querySnapshot) =>
	{
		querySnapshot.forEach((doc) => {
			let docid = doc.id;
			let docdata = doc.data();

			var code = '<option value="' + docid + '">' + docdata.course + '</option>';
			$('#fast-courses').append(code);
		});
	})
	.catch((error) => {
		console.log(error);
	});
})

// lưu kiến thức nhanh
$('#fast-knowledge').click(function ()
{
	let highlight = $('#fast-content').removeClass('is-invalid').val().trim();
	let course_id = $('#fast-courses').removeClass('is-invalid').val();

	if (!highlight)
	{
		$('#fast-content').addClass('is-invalid');
		return;
	}
	if (!course_id)
	{
		$('#fast-courses').addClass('is-invalid');
		return;
	}

	let before = $('#fast-knowledge').removeClass('btn-primary').html();
	let created_at = moment().unix();

	fsdb.collection("informations").add({
		course_id: course_id,
		lesson_id: null,
		created_at: created_at,
		study: highlight
	})
	.then((docRef) => {
		// reset form
		$('#fast-content').val('');
		$('#fast-courses').val('');
		$('#fast-knowledge').addClass('btn-success').html('<i class="fas fa-check"></i>');
		setTimeout(function(){
			$('#fast-knowledge').removeClass('btn-success').addClass('btn-primary').html(before);
			document.querySelector('a[data-widget="control-sidebar"]').click();
		}, 500);
	})
	.catch((error) => {
		console.log(error);
		$('#fast-knowledge').html('<i class="fas fa-exclamation-triangle"></i>');
	});
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

	var pacificDaylightTime = new Date().toLocaleString(undefined, {timeZone: 'America/Los_Angeles'});
	$('#my-clock').attr('title', pacificDaylightTime + ' (PDT)');
}
myClock();
setInterval(myClock, 30*1000);
