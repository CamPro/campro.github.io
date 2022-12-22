var url = new URL(window.location.href);

fetch('./html_sidebar.html')
.then(response => response.text())
.then(data => {
	$('.sidebar nav').html(data);
	$('a.nav-link[href="'+url.pathname+'"]').addClass('active');
});

if (sessionStorage.darkMode == 'true')
{
	$('#dark-mode').prop('checked', true);
	$('body').addClass('dark-mode');
	$('#header').removeClass('navbar-light');
	$('#header').addClass('navbar-dark');
}
if (sessionStorage.sidebarCollapse == 'true')
{
	$('body').addClass('sidebar-collapse');
}

$('[data-toggle="tooltip"]').tooltip()

$('#dark-mode').click(function ()
{
	if ($(this).is(':checked'))
	{
		$('body').addClass('dark-mode');
		$('#header').removeClass('navbar-light');
		$('#header').addClass('navbar-dark');
		sessionStorage.darkMode = true;
	}
	else
	{
		$('body').removeClass('dark-mode');
		$('#header').removeClass('navbar-dark');
		$('#header').addClass('navbar-light');
		sessionStorage.darkMode = null;
	}
	document.querySelector('a[data-widget="control-sidebar"]').click();
});

$('[data-widget="pushmenu"]').click(function ()
{
	setTimeout(function ()
	{
		if ($('body.sidebar-collapse').length > 0)
		{
			sessionStorage.sidebarCollapse = true;
		}
		else
		{
			sessionStorage.sidebarCollapse = null;
		}
	}, 1000);
})

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
	if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0)
	{
		document.getElementById("back-to-top").style.display = "block";
	} else {
		document.getElementById("back-to-top").style.display = "none";
	}
}
function backToTop() {
	$("html, body").animate({scrollTop: 0}, 500);
}
window.getSelection().toString();

function getSelectText()
{
	var text = null;
	if (window.getSelection)
	{
		text = window.getSelection().toString();
	}
	else if (document.selection && document.selection.type != "Control")
	{
		text = document.selection.createRange().text;
	}
	return text;
}
function clearSelectText()
{
	if (window.getSelection)
	{
		if (window.getSelection().empty)// Chrome
		{
			window.getSelection().empty();
		}
		else if (window.getSelection().removeAllRanges)// Firefox
		{
			window.getSelection().removeAllRanges();
		}
	}
	else if (document.selection)// IE?
	{
		document.selection.empty();
	}
}

function TextToSlug(str)
{
	/* Chuyển hết sang chữ thường */
	str = str.toLowerCase();     
	/* xóa dấu */
	str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
	str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
	str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
	str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
	str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
	str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
	str = str.replace(/(đ)/g, 'd');
	/* Xóa ký tự đặc biệt */
	str = str.replace(/([^0-9a-z-\s])/g, '');
	/* Xóa khoảng trắng thay bằng ký tự - */
	str = str.replace(/(\s+)/g, '-');
	/* xóa phần dự - ở đầu */
	str = str.replace(/^-+/g, '');
	/* xóa phần dư - ở cuối */
	str = str.replace(/-+$/g, '');
	str = str.replace(/-+/g, '-').trim();
	/* return */
	return str;
}