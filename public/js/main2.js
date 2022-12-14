(function (mz, cms, parentKey, subKey) {
  setTimeout(function () {
    const storeAll = "textarea,input,select";
    const formArray = mz.querySelectorAll(storeAll);
    parentKey = window.location.href + "-";
    formArray.forEach((formItem, i) => {
      if (formItem) {
        if (formItem.nodeName == 'SELECT') {
          subKey = formItem.getAttribute("name");
          var key = parentKey + subKey;
          if (localStorage[key]) {
            var _localStorage = localStorage[key];
            formItem.value = _localStorage;
          }
          formItem.addEventListener('change', (event) => {
            let _localStorage = event.target.value
            if (event.target.name == 'cmpType' && event.target.value != '') {
              document.getElementById('cmpTypeval').innerHTML = ""
            }
            if (event.target.name == 'purposeOfLone' && event.target.value != '') {
              document.getElementById('purposeOfLoneval').innerHTML = ""
            }


            localStorage.setItem(key, _localStorage);
          });
        } else {
          subKey = formItem.getAttribute("name");
          var key = parentKey + subKey + i;
          if (localStorage[key]) {
            var _localStorage = localStorage[key];
            formItem.value = _localStorage;
          }
          formItem.addEventListener("keyup", function () {
            var _localStorage = formItem.value;
            var T = formItem.getAttribute("type");
            if (T == "password" || T == "hidden" || T == "submit" || formItem.disabled) {
              console.log("Ignore: " + formItem.getAttribute("name"));
              return;
            }
            localStorage.setItem(key, _localStorage);
          }, false);
        }
        formItem;
      }
    });
    //   ---------------------------reset localStorage on form submit ---------------------------
    const submitForm = mz.querySelectorAll("form");
    submitForm.forEach((submitItem, i) => {
      if (submitItem) {
        submitItem.addEventListener("submit", function (e) {
          e.preventDefault();
          const formArray = submitItem.querySelectorAll("textarea,input,select");
          formArray.forEach((formItem) => {
            subKey = formItem.getAttribute("name");
            localStorage.removeItem(parentKey + subKey + i);
          }, false);
        }, false);
      }
      localStorage.removeItem(`${window.location.href}-currentTab`)
    });
  }, 1);
}(this.document, '', '', ''));

// -------------------------------------------------------------------------


function resetFormdata() {
  document.getElementsByClassName("tab")[currentTab].style.display = 'none';
  localStorage.removeItem(`${window.location.href}-currentTab`, parseInt(currentTab))
  const storeAll = "textarea,input,select";
  const formArray = this.document.querySelectorAll(storeAll);
  parentKey = window.location.href + "-";
  formArray.forEach((formItem, i) => {
    if (formItem) {
      if (formItem.nodeName == 'SELECT') {
        subKey = formItem.getAttribute("name");
        var key = parentKey + subKey;
        localStorage.removeItem(key);
      } else {
        subKey = formItem.getAttribute("name");
        var key = parentKey + subKey + i;
        localStorage.removeItem(key);
      }
      formItem;
    }
  });
  currentTab = 0
  showTab(currentTab);
}


function formatAmount(n) {
  return (parseInt(n)).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }).replace(".00", "")
}


// -------------------------------------------------------------------------

var $radios = $('input[name=creditScore]').change(function () {
  var value = $radios.filter(':checked').val();
  localStorage.setItem(`${window.location.href + 'creditScore'}`, value)
});
const rediobuttonKey = {
  "Poor (639 or less)": "radio1",
  "Fair (640-679)": "radio2",
  "Good (680-719)": "radio3",
  "720+": "radio4"
}

if (localStorage.getItem(`${window.location.href + 'creditScore'}`)) {
  var id = rediobuttonKey[localStorage.getItem(`${window.location.href + 'creditScore'}`)]

  $(`#${id}`).prop("checked", true);
}

var elts2 = document.getElementsByClassName('zipcodeinputfield')
Array.from(elts2).forEach(function (elt) {
  elt.addEventListener("keyup", function (event) {
    valuecheck = ""
    for (let index = 0; index < elts2.length; index++) {
      valuecheck += elts2[index].value
    }
    if (valuecheck.length > 3) {
      $.ajax({
        url: "https://ziptasticapi.com/" + valuecheck,
        type: 'GET',
        dataType: 'json',
        success: function (res) {
          if (res.error) {
            document.getElementById('shoecityofzip').innerHTML = res.error
          } {

            cityInput = document.getElementById('zipcity');
            stateInput = document.getElementById('zipstate');
            cityInput.value = res?.city
            stateInput.value = res?.state
            localStorage.setItem(`${window.location.href}-zipcity`, res?.city)
            localStorage.setItem(`${window.location.href}-zipstate`, res?.state)

            document.getElementById('shoecityofziperror').innerHTML = ''
            statecity = res.error ? res.error : (res?.city?.charAt(0).toUpperCase() + res?.city?.slice(1).toLowerCase() + ", " + res?.state?.charAt(0).toUpperCase() + res?.state?.slice(1).toLowerCase())
            document.getElementById('shoecityofzip').innerHTML = statecity ? statecity : ""
          }
        }
      });
    }
    // Number 13 is the "Enter" key on the keyboard
    if ((event.keyCode === 13 || elt.value.length == 1) && elt.value.length >= 1) {
      // Focus on the next sibling
      elt.nextElementSibling.focus()
    }
  });
})

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

  return `${taxid.slice(0, 2)}-${taxid.slice(2, 8)}`;
}
console.log(document.getElementsByName('zipCode'))


function phoneformater() {
  var inpField = document.getElementById("myInput");
  var l = inpField.value.length;
  var key = event.inputType;
  var toDelete = (key == 'deleteContentBackward' || key == 'deleteContentForward') ? 'delete' : 'keep';
  //deleteContentBackward and deleteContentForward are obtained when user hits backspace or delete keys. To get extra info from inputType, check: InputEvent https://www.w3schools.com/jsref/obj_inputevent.asp
  if (toDelete === 'delete') {
    inpField.value = "";
  }
  switch (l) {
    case 1:
      inpField.value = "+1 (" + inpField.value;
      break
    case 7:
      inpField.value = inpField.value + ") ";
      break
    case 12:
      inpField.value = inpField.value + " - ";
      break
    case 20:
      inpField.value = inpField.value.slice(0, l - 1)
  }
}

var currentTab = parseInt(localStorage.getItem(`${window.location.href}-currentTab`)) || 0;
showTab(currentTab);
function showTab(n) {
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";

  if (currentTab == 0) {
    document.getElementById('prevBtn').style.display = "none"
  } else {
    document.getElementById('prevBtn').style.display = "block"
  }

  if (n == x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
}

function nextPrev(n) {
  var x = document.getElementsByClassName("tab");
  if (currentTab + n < 0) return false
  if (n == -1) {
    var y = document.getElementsByClassName("tab")[currentTab - 1].getElementsByTagName("h5");
    y[0].style.display = "block";
  }
  if (n == 1 && !isfieldokay()) return false;
  if (currentTab + n == x.length) {
    submitFormpage()
    return false;
  } else {
    x[currentTab].style.display = "none";
    currentTab = parseInt(currentTab) + parseInt(n);
    localStorage.setItem(`${window.location.href}-currentTab`, parseInt(currentTab))
    showTab(currentTab);
  }
}

function submitFormpage() {
  toggleLoading()
  var data = new FormData();
  var form_data = $('#regForm').serializeArray();
  $.each(form_data, function (key, input) {
    data.append(input.name, input.value);
  });
  x = $('input[name="drivinLicense"]');
  if (x[0].name == 'drivinLicense') {
    var file_data = $("#drivinLicense").prop("files")[0]
    data.append("drivinLicense", file_data)
  }
  y = $('input[name="voided"]');
  if (y[0].name == 'voided') {
    var file_data2 = $("#voided").prop("files")[0]
    data.append("voided", file_data2)
  }
  $.ajax({
    url: "/create-account",
    method: "post",
    processData: false,
    contentType: false,
    data: data,
    success: function (data) {
      resetFormdata()
      toggleLoading()
      // showThanksMessage()
      document.getElementById('thanks-box1').style.display = 'block'
      // document.getElementById('showfirst').style.display='block'
      // setTimeout(() => {
      //   document.getElementById('showfirst').style.display='block'
      //   document.getElementById('showfirst').style.display='none'
      // }, 1500);

      document.getElementById('regForm').style.display = 'none'

      // alert(JSON.stringify(data))
    },
    error: function (e) {
      toggleLoading()
      alert(JSON.stringify(e))
    }
  });

}


function showThanksMessage() {
  document.getElementById('thanks-animation').style.display = 'block'
  setTimeout(() => {
    document.getElementById('thanks-animation').style.display = 'none'
  }, 3000);
}

$('.businessstartdate').on("keyup", function (e) {
  var $input = $(this);
  if ($input.val().length == 0 && e.which == 8) {
    $input.prev('.businessstartdate').focus();
  }
  else if ($input.val().length >= parseInt($input.attr("maxlength"), 10)) {
    $input.next('.businessstartdate').focus();
  }
});


$('.zipcodeinputfield').on("keyup", function (e) {
  var $input = $(this);
  if ($input.val().length == 0 && e.which == 8) {
    $input.prev('.zipcodeinputfield').focus();
  }
  else if ($input.val().length >= parseInt($input.attr("maxlength"), 10)) {
    $input.next('.zipcodeinputfield').focus();
  }
});

$("#fullnameInput").on("input", function (e) {
  if (!/^[a-zA-Z-'. ]+$/.test($(e.target).val()) && $(e.target).val() != "") {
    document.getElementById('fullnameInput').style.backgroundColor = "#ffdddd"
  } else {
    document.getElementById('nameinputerror').innerHTML = ""
    document.getElementById('fullnameInput').style.backgroundColor = "#fff"
  }
});

$("#loanAmount").on("input", function (e) {
  const inputField = document.getElementById('loanAmount')
  var inputvalue = inputField.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
  inputvalue = inputvalue == "" ? 0 : inputvalue
  if (inputvalue == 0) {
    inputField.value = ""
    return
  }
  inputField.value = formatAmount(inputvalue)
});


$("#annualRevenuevalue").on("input", function (e) {
  const inputField = document.getElementById('annualRevenuevalue')
  var inputvalue = inputField.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
  inputvalue = inputvalue == "" ? 0 : inputvalue
  if (inputvalue == 0) {
    inputField.value = ""
    return
  }
  inputField.value = formatAmount(inputvalue)
});


var fileInput = document.getElementById("drivinLicense")
fileInput.addEventListener("change", function (event) {
  $('#shoedrivinglicense').text(`${this.value.replace('fakepath', '').replace(`C:\\`, "").replace('\\', "")} uploaded`);
});

var fileInput = document.getElementById("voided")
fileInput.addEventListener("change", function (event) {
  $('#shoevoided').text(`${this.value.replace('fakepath', '').replace(`C:\\`, "").replace('\\', "")} uploaded`);
});


function isfieldokay() {
  var x = document.getElementsByClassName("tab")[currentTab].getElementsByTagName("input");
  // console.log(x)
  flag = true;
  if (x[0] != undefined) {
    switch (x[0].name) {
      case "fullName":
        var y = document
          .getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");
        if (x[0].value == "") {
          y[0].innerHTML = "Please enter your full name ";
          y[0].style.display = "block";
          flag = false;
        } else if (!/^[a-zA-Z-'. ]+$/.test(x[0].value)) {
          y[0].innerHTML = "Invalid name";
          y[0].style.display = "block";
          flag = false;
        } else {
          y[0].innerHTML = "";
        }
        break;

      case "cmpName":
        var y = document.getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");
        if (x[0].value == "") {
          console.log(y[0]);
          y[0].innerHTML = "Please enter your company name";
          y[0].style.display = "block";
          flag = false;
        } else {
          y[0].innerHTML = "";
        }
        break;

      case "startDate":

        var y = document.getElementsByClassName("tab")[currentTab].getElementsByTagName("h5");
        var mon = ""
        var yy = "";
        var fieldvalue = ""
        for (let i = 0; i < x.length; i++) {
          fieldvalue += x[i].value;
          if (i < 2) {
            mon += x[i].value;
            if ((i + 1) % 2 == 0) fieldvalue += "-";
          } else {
            yy += x[i].value;
          }
        }
        if (fieldvalue.length < 6) {
          y[0].innerHTML = `please enter business start date`;
          y[0].style.display = "block";
          flag = false;
        }
        else if (parseInt(mon) <= 0 || parseInt(mon) > 12 || parseInt(yy) > parseInt(new Date().getFullYear()) || parseInt(yy) < 1800) {
          y[0].innerHTML = `Error! Please enter months between 1 to 12 only/The year should be between 1900 and ${new Date().getFullYear()}`;
          y[0].style.display = "block";
          flag = false;
        } else {
          y[0].innerHTML = "";
        }

        break;

      case "zipCode":
        checkzipCoderegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/
        var y = document.getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");

        if (x[0].value == "") {
          y[0].innerHTML = "Please enter your zip code ";
          y[0].style.display = "block";
          flag = false;
        } else {
          fieldvalue = ""
          for (let index = 0; index < x.length; index++) {
            fieldvalue += x[index].value;
          }

          if (ifZipCode(fieldvalue)) {
            y[0].innerHTML = "Please enter correct zip code ";
            y[0].style.display = "block";
            flag = false;
          } else {
            y[0].innerHTML = "";
          }
        }
        break;
      //rohit
      case "loanAmount":
        var y = document.getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");
        if (x[0].value == "") {
          y[0].innerHTML = "Please enter the requested loan amount";
          y[0].style.display = "block";
          flag = false;
        } else if (x[0].value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').length < 4) {
          y[0].innerHTML = "Requested loan amount should we grater than $999";
          y[0].style.display = "block";
          flag = false;
        } else {
          y[0].innerHTML = "";
        }
        break;

      case "annualRevenue":
        var y = document
          .getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");
        if (x[0].value == "") {
          y[0].innerHTML = " Please enter your annual revenue";
          y[0].style.display = "block";
          flag = false;
        } else if (x[0].value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').length < 5) {
          y[0].innerHTML = "Annual Revenue should we grater than $9999";
          y[0].style.display = "block";
          flag = false;
        } else {
          y[0].innerHTML = "";
        }
        break;

      case "creditScore":
        var y = document.getElementsByClassName("tab")[currentTab].getElementsByTagName("h5");
        if (x[0].value == "") {
          y[0].innerHTML = "Please select your credit score";
          y[0].style.display = "block";
          flag = false;
        } else {
          y[0].innerHTML = ""
        }
        break;

      case "purposeOfLone":
        var y = document
          .getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");
        if (x[0].value == "") {

          y[0].innerHTML = "Please enter the purpose of your loan";
          y[0].style.display = "block";
          flag = false;
        } else {
          y[0].innerHTML = ""
        }
        break;

      case "phone":
        var y = document
          .getElementsByClassName("tab")
        [currentTab].getElementsByTagName("h5");

        if (x[0].value == "") {
          y[0].innerHTML = "Please enter your phone number ";
          y[0].style.display = "block";
          flag = false;
        }
        else {

          String.prototype.isNumber = function () { return /^\d+$/.test(this); }

          if (!x[0].value.replaceAll('(', "").replaceAll(')', "").replaceAll('-', "").replaceAll('+', "").replaceAll(' ', "").isNumber()) {
            y[0].innerHTML = "You have entered an invalid phone number!";
            y[0].style.display = "block";
            flag = false;
          } else {
            y[0].innerHTML = "";
          }
        }
        break;

      case "email":
        var y = document.getElementsByClassName("tab")[currentTab].getElementsByTagName("h5");
        if (x[0].value == "") {
          y[0].innerHTML = "Please enter your email address ";
          y[0].style.display = "block";
          flag = false;
        } else {
          var emailregex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if (!emailregex.test(x[0].value)) {
            y[0].innerHTML = "You have entered an invalid email address!";
            y[0].style.display = "block";
            flag = false;
          } else {
            y[0].innerHTML = "";
          }
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

      case "hidden_public_token":
        if (x[0].value == "") {
          var y = document
            .getElementsByClassName("tab")
          [currentTab].getElementsByTagName("h5");
          y[0].innerHTML = "Please your bank account first";
          y[0].style.display = "block";
          flag = false;
        }
        break;

      default:
        flag = true;
    }
  } else {
    var selectbox = document.getElementsByClassName("tab")[currentTab].getElementsByTagName("select");
    if (selectbox[0]) {
      switch (selectbox[0].name) {
        case "cmpType":
          if (selectbox[0].value == "") {
            var y = document.getElementsByClassName("tab")
            [currentTab].getElementsByTagName("h5");
            y[0].innerHTML = "Please select your entity type.";
            y[0].style.display = "block";
            flag = false;
          }
          break

        case "industry":
          if (selectbox[0].value == "") {
            var y = document.getElementsByClassName("tab")
            [currentTab].getElementsByTagName("h5");
            y[0].innerHTML = "Please select your business industry";
            y[0].style.display = "block";
            flag = false;
          }
          break
        case "purposeOfLone":
          if (selectbox[0].value == "") {
            var y = document
              .getElementsByClassName("tab")
            [currentTab].getElementsByTagName("h5");

            y[0].innerHTML = "Please enter the purpose of your loan";
            y[0].style.display = "block";
            flag = false;
          }
          break;

        default:

          flag = true;
      }
    }
  }
  return flag;
}


Object.defineProperty(String.prototype, 'capitalize', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});


(async function () {
  const fetchLinkToken = async () => {
    const response = await fetch('/create_link_token', { method: 'POST' });
    const responseJSON = await response.json();
    console.log("fetch token >>>>>>>>>>>>>", responseJSON)
    localStorage.setItem('linkTokenData',responseJSON.link_token )
    return responseJSON.link_token;
  };

  const configs = {
    token: await fetchLinkToken(),
    onSuccess: async function (public_token, metadata) {
      const payload = { public_token: public_token, item_id: "636d650b9402bf3b1cdd153a" }
      document.getElementById("hidden_public_token").value = public_token;
      nextPrev(1)

      fetch("/get/plaid-address", {
        method: "POST",
        body: JSON.stringify({ public_token: public_token }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then(response => response.json()).then(json => {
        document.getElementById("hidden_address").value = json.address;
      });
    },

    onExit: async function (err, metadata) {
      if (err != null && err.error_code === 'INVALID_LINK_TOKEN') {
        linkHandler.destroy();
        linkHandler = Plaid.create({
          ...configs,
          token: await fetchLinkToken(),
        });
      }
      if (err != null) {
        console.log("null>>>>>>>>>>>>>>>>>>>>>>.")
      }
    },
  };

  var linkHandler = Plaid.create(configs);

  document.getElementById('link-button').onclick = function () {
    linkHandler.open();
  };
})();



function ifZipCode(num) {
  return ziparray.includes(num + "")
}

var loadingOverlay = document.querySelector('.loading');

function toggleLoading(event) {
  document.activeElement.blur();
  if (loadingOverlay.classList.contains('hidden')) {
    loadingOverlay.classList.remove('hidden');
  } else {
    loadingOverlay.classList.add('hidden');
  }
}

toggleLoading()




if (localStorage.getItem(`${window.location.href}-zipcity`)) {
  document.getElementById('zipcity').value = localStorage.getItem(`${window.location.href}-zipcity`)
}

if (localStorage.getItem(`${window.location.href}-zipstate`)) {
  document.getElementById('zipstate').value = localStorage.getItem(`${window.location.href}-zipstate`)
}
