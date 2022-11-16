// if ($(window).width() < 1200) {

//     $('#toggle').click(function () {

//         $(this).toggleClass('active');

//         $('#overlay').toggleClass('open');

//         $('.logo-box img').toggleClass('open');

//     });

//     }

var currentTab = 0;
showTab(currentTab);
function showTab(n) {
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  if (n == x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  // fixStepIndicator👎
}

function nextPrev(n) {
  var x = document.getElementsByClassName("tab");
  if (n == 1 && !validateForm()) return false;
  x[currentTab].style.display = "none";
  currentTab = currentTab + n;
  if (currentTab >= x.length) {
    document.getElementById("regForm").submit();
    return false;
  }
  showTab(currentTab);
}

function validateForm() {
  obj = {};
  var isSave = false;
  var x = document
    .getElementsByClassName("tab")
    [currentTab].getElementsByTagName("input");

  console.log(x)

  console.log(x[0].name)
 
  if (x.length > 1) {
    fieldvalue = "";
    if (x[0].name == "startDate") {
      let mon, yy;
      for (let i = 0; i < x.length; i++) {
        fieldvalue += x[i].value;
        if (i < 2) {
          mon = +fieldvalue;
          if ((i + 1) % 2 == 0) fieldvalue += "-";
        } else yy += x[i].value;
      }
      yy = +yy;
      if (mon <= 0 || mon > 12 || yy > 2023) {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");
        y[0].innerHTML =
          " Error! Please enter months between 1 to 12 only/ Please enter the year before 2023";
        y[0].style.display = "block";
        return false;
      }
    }
    if (x[0].name == "zipCode") {
      for (let i = 0; i < x.length; i++) {
        fieldvalue += x[i].value;
      }
    }

    if(x[0].name=='creditScore'){
      for(i = 0; i < x.length; i++) {
        if(x[i].checked){ 
          fieldvalue = x[i].value
        }
       
       }
    }

    obj[x[0].name] = fieldvalue;
  }
  // else if (x[0].type == "file") {
  //   const name = x[0].name;
  //   const files = x[0].value;
  //   const formData = new FormData();
  //   console.log(files);
  //   //formData.append(  name, name.value);
  //   for (let i = 0; i < files.files.length; i++) {
  //     formData.append(name, files.files[i]);
  //   }
  //   obj = formData;
  // }
  else obj[x[0].name] = x[0].value;

  console.log(obj);
  if (isfieldokay()) {
    $.ajax({
      type: "POST",
      url: "/modifyformvalue",
      data: obj,
      cache: false,
      async: false,
      success: function (data, textStatus, xhr) {
        console.log(xhr.status);
        if (xhr.status == 201) {
          isSave = true;
          console.log(data);
        } else {
          isSave = false;
        }
      },
    });
  }
  return isSave;
}

function isfieldokay() {
  var x = document
    .getElementsByClassName("tab")
    [currentTab].getElementsByTagName("input");

  flag = true;
  switch (x[0].name) {
    case "fullName":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your full name ";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "cmpName":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");
        console.log(y[0]);
        y[0].innerHTML = "Please enter your company name";
        y[0].style.display = "block";
        flag = false;
      }
      break;

    case "industry":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");
        console.log(y[0]);
        y[0].innerHTML = "Please select your business industry";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "cmpType":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");
        console.log(y[0]);
        y[0].innerHTML = "Please select your entity type.";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "startDate":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your business start date";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "zipCode":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your zip code ";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "loanAmount":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter the requested loan amount";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "annualRevenue":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = " Please enter your annual revenue";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "creditScore":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please select your credit score";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "purposeOfLone":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter the purpose of your loan";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "phone":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your phone number ";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "email":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your email address ";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "ssn":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your SSN. ";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "website":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your website. ";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "taxId":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your Tax ID ";
        y[0].style.display = "block";
        flag = false;
      }
      break;

    case "drivinLicense":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Kindly upload your drivers license ";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "voided":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Kindly upload your voided check ";
        y[0].style.display = "block";
        flag = false;
      }
      break;
    case "bankStatemets":
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Kindly upload previous 3 months bank statements ";
        y[0].style.display = "block";
        flag = false;
      }
      break;

    default:
      flag = true;
  }
  return flag;
}

// if (x[0].value == "") {
//   var y = document
//     .getElementsByClassName("tab")
//     [currentTab].getElementsByTagName("h5");
//   console.log(y[0]);
//   y[0].innerHTML = `${x[0].name} value sould not be empty`;
//   y[0].style.display = "block";
//   return false;
// }
// return true;
