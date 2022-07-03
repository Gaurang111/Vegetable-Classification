vegie_list = [];

//---------------------Load model---------------------------------------
let model;
(async function () {
    $('#image-selector').hide();
    $('#flip').hide();
    $('#add1').hide();
    $('#add2').show();
    model = await tf.loadLayersModel("http://localhost:81/tfjs-model/model.json");
    console.log("model loaded...")
    $(".progress-bar").html("Model loaded...")
})();

//-------------------neccesssary functions------------------------------------
$("#reset").click( function () {

    //location.reload();    
    $('#content').empty();
    vegie_list=[];
    console.log(vegie_list)

});

function convertURIToImageData(URI) {
        return new Promise(function(resolve, reject) {
        if (URI == null) return reject();
        var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        image = new Image();
        image.addEventListener('load', function() {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(context.getImageData(0, 0, canvas.width, canvas.height));
    }, false);
    image.src = URI;
    });
    }

function unique(list) {
  var result = [];
  $.each(list, function(i, e) {
    if ($.inArray(e, result) == -1) result.push(e);
  });
  return result;
}


//----------------------------chooose image-------------------------------
$(".upload-options").click(function()
        {
        if ($(this).attr('id')=="choosepicture")
                { 
                $('#flip').hide();
                $('#image-selector').show();
                $('#add2').hide();
                $('#add1').show();
                Webcam.reset("#my_camera");

                $("#image-selector").change(function () 
                {

                let reader = new FileReader();
                reader.onload = function () 
                        {
                        let dataURL = reader.result;
                        $("#selected-image").attr("src", dataURL);
                        $(".progress-bar").html("Image selected! Click 'Add' to predict...");
                        }
                let file = $("#image-selector").prop("files")[0];
                reader.readAsDataURL(file);
                }); 
                console.log("i am first choosepicture")
                $(".progress-bar").html("Choose image from storage...");
                $("#add1").click(async function () {
                $(".progress-bar").html("Predicting vegetable...");
                let image = $("#selected-image").get(0);
                let offset = tf.scalar(127.5);
                let tensor = tf.browser.fromPixels(image)
                .resizeNearestNeighbor([224, 224])
                .toFloat()
                .sub(offset)
                .div(offset)
                .reshape([224, 224, 3])
                .expandDims();



// More pre-processing to be added here later
let predictions = await model.predict(tensor).data();
let top = Array.from(predictions)
    .map(function (p, i) {
        return {
            probability: p,
            className: LABELS[i]
        };
    }).sort(function (a, b) {
        return b.probability - a.probability;
    }).slice(0, 1);

    if (!vegie_list.includes(top[0].className))
        {vegie_list.push(top[0].className);
        addVeg(top[0].className)
        //vegie_list = unique(vegie_list)
        console.log(vegie_list)
        $(".progress-bar").html("Vegetable predicted...");
    }
});
}

//-----------------------------take image------------------------
    if ($(this).attr('id')=="takepicture")
    {
    $('#image-selector').hide();
    $('#flip').show();
    $('#add1').hide();
    $('#add2').show();
        console.log("i am first choosepicture")
    $(".progress-bar").html("Camera on! Click 'Add' to predict...");
    $("#add2").click( function () {
    Webcam.snap( function(data_uri) {
    $(".progress-bar").html("Predicting vegetable...");
    convertURIToImageData(data_uri).then(async function(image) {
    let offset = tf.scalar(127.5)
    var tensor = tf.browser.fromPixels(image)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .sub(offset)
    .div(offset)
    .reshape([224, 224, 3])
    .expandDims();


let predictions = await model.predict(tensor).data().then();

let top = Array.from(predictions)
    .map(function (p, i) {
        return {
            probability: p,
            className: LABELS[i]
        };
    }).sort(function (a, b) {
        return b.probability - a.probability;
    }).slice(0, 1);
    if (!vegie_list.includes(top[0].className))
        {vegie_list.push(top[0].className);
        addVeg(top[0].className)
        //vegie_list = unique(vegie_list)
        console.log(vegie_list);
        $(".progress-bar").html("Vegetable predicted...");
    }
});
});
});
}
});