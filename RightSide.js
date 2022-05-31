var addon = function(){
	const veg = document.getElementById('getmytext').value;
	
	if (!vegie_list.includes(veg))
        {vegie_list.push(veg);
        addVeg(veg)
        document.getElementById('getmytext').value=null;
        //vegie_list = unique(vegie_list)
        console.log(vegie_list)
    }
}

function addVeg(Vegetable){
const content = document.getElementById("content");

const text = `<div class="item">
			${Vegetable}
			</div>`

const position="beforeend";

content.insertAdjacentHTML(position,text);
}

