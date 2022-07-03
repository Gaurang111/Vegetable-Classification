vegie_list=[];
(async function () {
	vegie_list = JSON.parse(sessionStorage.getItem("vegie_list"));
	console.log(vegie_list)


	var search_q = "Recipes with";
	var API_KEY = "AIzaSyDp6VIRnLkGkUqLQgPkBJZJzd4KM0x4Hjw";
	var maxResults=10;
	for (var i = 0; i < vegie_list.length; i++) {
		search_q = search_q + " " + vegie_list[i]
	}
	console.log(search_q)
	
	var url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}
    &part=snippet&q=${search_q}&maxResults=${maxResults}&type=video`

    $.ajax({
    	method:'GET',
    	url:url,
    	success:function(data){
    		console.log(data)
    		displaydata(data);
    	}
    })
	


	//Nutri Info Table
	vegie_list.forEach(item => {

	const params={
	api_key:"fWeUAVXqIJd6g9Zls7l3AgHQSuLMg7qTwgrR7Irq",
	query:"Raw "+item,
	dataType:["Survey (FNDDS)"],
	pagesize:1,
		}	

	const api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(params.api_key)}&query=${encodeURIComponent(params.query)}&dataType=${encodeURIComponent(params.dataType)}&pageSize=${encodeURIComponent(params.pagesize)}`
	fetch(api_url).then((response)=>{
		return response.json();
	}).then((data) => createTable(data, item));
	})


})();

function displaydata(data){
	$("#table").show()

	var videoData = ""
	data.items.forEach(item => {
		videoData = `
                    <tr class="table-raw">
                    <td>
                    <img width="200" height="180" src="${item.snippet.thumbnails.high.url}"/>
                    </td>
                    <td>
                    <a target="_blank" href="https://www.youtube.com/watch?v=${item.id.videoId}">
                    ${item.snippet.title}</td>
                    
                    </tr>
                  `;
 
      $("#results").append(videoData);
  })
}

function createTable(data, item){
	console.log(data)
	nutriInfo=`<tr>
				<td>
               	<b>${item.charAt(0).toUpperCase()+item.slice(1)}</b>
                </td>
               	<td>
               	${data.foods[0].foodNutrients[0].value}
                </td>
                <td>
               	${data.foods[0].foodNutrients[1].value}
                </td>
                <td>
               	${data.foods[0].foodNutrients[2].value}
                </td>
                <td>
               	${data.foods[0].foodNutrients[3].value}
                </td>
              </tr>`

	$("#results-2").append(nutriInfo);
}



//<td>
//<a target="_blank" href="https://www.youtube.com/channel/${item.snippet.channelId}">${item.snippet.channelTitle}</a>
//</td>