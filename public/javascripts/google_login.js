var googleUser = {};
var startApp = function() {
    gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
        client_id: '754821054162-5druqjr810u3idpgo78t86ovv9mptas6.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('customBtn'));
    });
};

function attachSignin(element) 
{
    console.log(element.id);
    auth2.attachClickHandler(element, {},
        function(googleUser)
        {  
            $(".google_Inform_container").css("display", "block");
            
            document.getElementById('name').innerText = "Signed in: " + googleUser.getBasicProfile().getName();
            document.getElementById('ID').innerText = "ID: " + googleUser.getBasicProfile().getId();
            //document.getElementById('Image').innerText = "Image URL: " + googleUser.getBasicProfile().getImageUrl();
            document.getElementById('Image').style.backgroundImage = "url(" + googleUser.getBasicProfile().getImageUrl() + ")";
            document.getElementById('Image').style.backgroundPosition = "center center";
            document.getElementById('Image').style.backgroundRepeat = "no-repeat";
            document.getElementById('Image').style.backgroundSize = "cover";
            document.getElementById('Email').innerText = "Email: " + googleUser.getBasicProfile().getEmail();
        }, function(error) {
        alert(JSON.stringify(error, undefined, 2));
        });
}


function onSignIn(googleUser)
{
    var profile = googleUser.getBasicProfile();
    $(".google_Inform_container").css("display", "block");
    $("#pic").attr("src", profile.getImageUrl());
    $("#email").text(profile.getEmail());


//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut()
{
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function(){

        alert("You have been successfully signed out");

        $(".google_Inform_container").css("display", "none");


    });
}



