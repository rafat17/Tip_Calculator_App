//this function generates the history of user's past calculations
//this function is triggered everytime the user visits the history page from his dashboard 
function generateTable(){


	firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/history`)
	.once('value', (snapshot) => {


		if(snapshot.val() !== null){

			document.querySelector('.wrapper').innerHTML = ''
			
			let html_body = `<table><tr><th>Bill</th><th>Tip Percentage</th>
			<th>Tip</th><th>Date</th></tr>`

			for(var key in snapshot.val()){

				html_body = html_body + 
				`<tr>
				<td>${parseFloat(snapshot.val()[key]['bill']).toFixed(2)}</td>
				<td>${parseFloat(snapshot.val()[key]['tip_percent']).toFixed(2)}</td>
				<td>${parseFloat(snapshot.val()[key]['tip']).toFixed(2)}</td>
				<td>${snapshot.val()[key]['date_calc']}</td></tr>`
				
			}

			html_body = html_body + '</table>'
			document.querySelector('.wrapper').insertAdjacentHTML('beforeend', html_body)
		}
			
		else{
			document.querySelector('.wrapper').innerHTML = ''
			document.querySelector('.wrapper').insertAdjacentHTML('beforeend', `<div class="nohistory_section">
			<h1>No HISTORY Found !</h1></div>`)
		}
	})

}



//goes back to the home page
document.getElementById('back_btn').addEventListener('click', () =>{
	location.replace('index.html')
})


//clears all of the history of app usage from the user's profile
document.getElementById('clearhistory_btn').addEventListener('click', () =>{

	let target = document.querySelector('.wrapper')

	if(document.querySelector('table')){
		let table = document.querySelector('table')
		table.parentNode.removeChild(table)

		target.insertAdjacentHTML('beforeend', `<div class="nohistory_section">
		<h1>No HISTORY Found !</h1></div>`)

		firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/history`)
		.set(null)

		alert('All History has been deleted !')

	}
})


//A timeout is set to the function of generateTable
//This is done to ensure that the user's login authentication script runs before this function is called
setTimeout(generateTable, 2500)
