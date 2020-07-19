/********************************************** 
* main.js
* Manu Shirur
*
* This file implements feedbackform validation
***********************************************/

function submitFeedbackForm(event){
    var form = document.forms.feedback;

    // Get the form element values if form validity is True
    if (form.checkValidity()){
        // Get the form elements
        var name = form.elements.name.value;
        var address = form.elements.address.value;
        var phone = form.elements.phone.value;
        var email = form.elements.email.value;
        var experience = form.elements.experience.value;
        var comments = form.elements.comments.value;

        // Check for empty string, null, valid phone and email
        // phone can include: country code (+ and upto 3 digits) which is optional and 10 digits (123-456-7890)
        // email can incude special charactres like ., -, _  and domain can end with . followed bt 2 or 3 characters (io, com)
        if (name == "" || address == "" || phone == ""
        || email == "" || experience == "" || comments == ""
        || name === null || address  === null || phone === null 
        || email  === null || experience  === null || comments  === null) {  
            document.getElementById("error").innerHTML = "All fields are mandatory. Please try again!!!";
        } else if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) { 
            document.getElementById("error").innerHTML = "Please give a valid email address";
        } else if (!(/^\d{3}-\d{3}-\d{4}$/.test(phone))) {
            document.getElementById("error").innerHTML = "Please give a valid phone number";
        }  else { 
            return true;
            // form.submit();
            // alert("Thank You, " + name +" for your feedback!!!")   
            // document.getElementById("error").innerHTML = ""; 
            // window.location.reload();
        }
        return false;
    }
}

// var form = document.forms.feedback;
// // Not to submit the form when errors are present
// function handleForm(event) { 
//     // event.preventDefault(); 
//     return false;
// } 
// form.addEventListener('submit', handleForm);





