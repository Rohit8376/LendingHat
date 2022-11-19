// if ($(window).width() < 1200) {

//     $('#toggle').click(function () {

//         $(this).toggleClass('active');

//         $('#overlay').toggleClass('open');

//         $('.logo-box img').toggleClass('open');

//     });

//     }




var elts = document.getElementsByClassName('businessstartdate')
Array.from(elts).forEach(function (elt) {
  elt.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if ((event.keyCode === 13 || elt.value.length == 1) && elt.value.length >= 1) {
      // Focus on the next sibling
      elt.nextElementSibling.focus()
    }
  });
})

var elts2 = document.getElementsByClassName('zipcodeinputfield')
Array.from(elts2).forEach(function (elt) {
  elt.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if ((event.keyCode === 13 || elt.value.length == 1) && elt.value.length >= 1) {
      // Focus on the next sibling
      elt.nextElementSibling.focus()
    }
  });
})



// var elts = document.getElementsByClassName('businessstartdate2')
// Array.from(elts).forEach(function(elt){
//   elt.addEventListener("keyup", function(event) {
//     // Number 13 is the "Enter" key on the keyboard
//     if (event.keyCode === 8) {
//       // Focus on the next sibling
//       elt.previousSibling.focus()
//     }
//   });
// })



function ssnFormatter() {
  const inputField = document.getElementById('ssninputbox');
  const formatedValue = formatSSN(inputField.value);
  inputField.value = formatedValue;
}


function formatSSN(value) {
  if (!value) return value;
  const ssn = value.replace(/[^\d]/g, '');
  const ssnLength = ssn.length;

  if (ssnLength < 4) return ssn;

  if (ssnLength < 6) {
    return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
  }

  return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 8)}`;
}

function taxidFormatter() {
  const inputField = document.getElementById('taxidinputbox');
  const formatedValue = formattaxid(inputField.value);
  inputField.value = formatedValue;
}



function formattaxid(value) {
  if (!value) return value;
  const taxid = value.replace(/[^\d]/g, '');
  const taxidLength = taxid.length;

  if (taxidLength < 3) return taxid;

  // if (ssnLength < 6) {
  //   return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
  // }

  return `${taxid.slice(0, 2)}-${taxid.slice(2, 8)}`;
}


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
    if (x[0].name == 'creditScore') {
      for (i = 0; i < x.length; i++) {
        if (x[i].checked) {
          fieldvalue = x[i].value
        }

      }
    }
    obj[x[0].name] = fieldvalue;

  }else {
    obj[x[0].name] = x[0].value;
  }

  var isfile = false
  if (x[0].name == 'drivinLicense') {
    var file_data = $("#drivinLicense").prop("files")[0]
    var form_data = new FormData()
    console.log(file_data)
    form_data.append("drivinLicense", file_data)
    obj = form_data
    console.log(obj)
    isfile = true
  } 
  
  else if (x[0].name == 'voided') {
    var file_data = $("#voided").prop("files")[0]
    var form_data = new FormData()
    console.log(file_data)
    form_data.append("voided", file_data)
    obj = form_data
    console.log(obj)
    isfile = true
  } 
  
  else if (x[0].name == 'bankStatemets') {
    var file_data = $("#bankStatemets").prop("files")[0]
    var form_data = new FormData()
    console.log(file_data)
    form_data.append("bankStatemets", file_data)
    obj = form_data
    console.log(obj)
    isfile = true
  }

  console.log(obj)

  if (isfieldokay()) {

    return Datebaseupdatehandler(isfile, obj).then(res => {
      return true
    }).catch(err => {
      return false
    })

  } else {

    console.log("moving to the next " + isSave)
    return isSave;

  }


}


const Datebaseupdatehandler = async (isfile, obj) => {
  return new Promise(function (resolve, reject) {
    if (!isfile) {
      $.ajax({
        type: "POST",
        url: "/modifyformvalue",
        data: obj,
        cache: false,
        async: false,
        success: function (data, textStatus, xhr) {
          console.log(xhr.status);
          if (xhr.status == 201) {
            resolve()
            console.log(data);
          } else {
            reject()
          }
        },
      });
    } else {

      $.ajax({
        type: "POST",
        url: "/modifyformvalue",
        data: obj,
        contentType: false,
        processData: false,
        success: function (data, textStatus, xhr) {
          console.log(xhr.status);
          if (xhr.status == 201) {
            resolve()
            console.log(data);
          } else {
            reject()
          }
        },
      });
    }

  })
  // return isSave2;
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
        var y = document.getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5"); 
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
      checkzipCoderegex = /^[0-9]{5}(?:-[0-9]{4})?$/

      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your zip code ";
        y[0].style.display = "block";
        flag = false;
      }
      if (x[0].value.match(checkzipCoderegex))
        if (!valid) {
          var y = document
            .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");

          y[0].innerHTML = "Please enter correct zip code ";
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
      regexp = /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/;
      var valid = regexp.test(x[0].value);
      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");
        y[0].innerHTML = "Please enter your SSN. ";
        y[0].style.display = "block";
        flag = false;
      } else if (!valid) {
        var y = document
          .getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");
        y[0].innerHTML = "Please enter correct SSN no. ";
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

      // taxidcheck = /^([07][1-7]|1[0-6]|2[0-7]|[35][0-9]|[468][0-8]|9[0-589])-?\d{7}$/g
      taxidcheck = /^(01|02|03|04|05|06|10|11|12|13|14|15|16|20|21|22|23|24|25|26|27|30|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|46|47|48|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|71|72|73|74|75|76|77|80|81|82|83|84|85|85|86|86|87|87|88|88|90|91|92|92|93|94|95|98|99|)-\d{7}$/g
      var valid = taxidcheck.test(x[0].value);

      if (x[0].value == "") {
        var y = document
          .getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter your Tax ID ";
        y[0].style.display = "block";
        flag = false;
      }
      if (!valid) {
        var y = document
          .getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");

        y[0].innerHTML = "Please enter correct Tax ID ";
        y[0].style.display = "block";
        flag = false;
      }
      break;

    case "drivinLicense":

      console.log(x[0].value)

      // var file_data = $("#drivinLicense").prop("files")[0]
      // console.log(file_data)
      // var form_data = new FormData()
      // form_data.append("drivinLicense", file_data)

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
        var y = document.getElementsByClassName("tab")
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


