//sets the custom tip percentage system if set manually by the user
function setPercentage(db_route, percentage){

	if(percentage !== NaN && percentage > 0 && percentage < 100){
		 db_route.set(percentage)
		 alert('Tip value changed successfully !')
	}

	else alert('Tip value has not been changed !')
		
}


//removes the custom tip percentage if triggered
function setDefaultPercentage(db_route){
	db_route.set(null)
}


//inserts a new calculation history in the user's history table in the database
//triggered everytime a calculation is performed
function insertUserHistory(db_route, history_entry){

	db_route.once('value', (snapshot) => {
			db_route.push(history_entry)

	})
}


//calculates the tip from the bill based on the user input
//the tip percent used to find the tip can be either custom(set manually by user)
//or set to default value (5 percent)
function calculateTip(input){

		
	firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/custom_tip`)
		.once('value', (snapshot) =>{

			let custom_tip = snapshot.val()

			if(custom_tip !== null){

				let tip = input * (parseFloat(custom_tip).toFixed(2)/100)
				let newhtml = `<section class="output_section"><div class="wrapper">
				<div id="output">
				The tip as per your bill set at <strong id="tip_percentage">${parseFloat(custom_tip).toFixed(2)}</strong>% 
				will be <strong>${tip.toFixed(2)}</strong></div></div></section>`

				let date = new Date()

				let calc_hist_obj = { bill: input,
					                  tip_percent: custom_tip,
					                  tip: tip,
					                  date_calc: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}, 
					                  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}


			    document.querySelector('body').insertAdjacentHTML('beforeend', newhtml)

			    //insert the history_entry into the database
			    let db_route = firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/history`)
			    insertUserHistory(db_route, calc_hist_obj)

			}


			else{

				let tip = input * (5/100)
				let newhtml = `<section class="output_section"><div class="wrapper">
				<div id="output">
				The tip as per your bill set at <strong id="tip_percentage">${5}</strong>% 
				will be <strong>${tip.toFixed(2)}</strong></div></div></section>`

				let date = new Date()

				let calc_hist_obj = { bill: input,
					                  tip_percent: 5,
					                  tip: tip,
					                  date_calc: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}, 
					                  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}


			    document.querySelector('body').insertAdjacentHTML('beforeend', newhtml)

			    //insert the history_entry into the database
			    let db_route = firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/history`)
			    insertUserHistory(db_route, calc_hist_obj)

			}
		})


}



//deals with setting the custom tip percentage
//use the custom tip percentage to calculate tip from the bill if set by the user
//else use the default value of tip percent (5%)
document.getElementById('percentage_btn').addEventListener('click', () => {

	let custom_tip = null

	firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/custom_tip`)
	.once("value", (snapshot) =>{
		
		custom_tip = snapshot.val()
		
		if(custom_tip !== null){
			let percentage = parseFloat(prompt('Enter your custom percentage tip !', custom_tip))
			let db_route = firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/custom_tip`)
			setPercentage(db_route, percentage)}

		else{
			let percentage = parseFloat(prompt('Enter your custom percentage tip !', 5))
			let db_route = firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/custom_tip`)
			setPercentage(db_route, percentage)}
	})
		
})



//deals with resetting the default setting of the tip percentage
//deletes the custom tip if set by the user
document.getElementById('reset_btn').addEventListener('click', () => {

	let custom_tip = null

	firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/custom_tip`)
	.once("value", (snapshot) =>{
		
		custom_tip = snapshot.val()
		
		if(custom_tip !== null){
			let db_route = firebase.database().ref(`users/${firebase.auth().currentUser.email.split('.').join('-')}/custom_tip`)
			setDefaultPercentage(db_route)}
			alert('Tip percentage has been set to default value of 5%')
		})
})



//calculates the tip amount for the user as per the bill amount
document.getElementById('tip_btn').addEventListener('click', () => {
	
	let input = parseFloat(document.getElementById('input_tip').value)

	if(input > 0){

		if(document.querySelector('.output_section') === null) calculateTip(input)

		else{
			document.querySelector('.output_section').parentNode.removeChild(document.querySelector('.output_section'))
			calculateTip(input)
		}
	}
	
})



//clears the screen
document.getElementById('clear_btn').addEventListener('click', () =>{

	if(document.querySelector('.output_section') !== null){
		document.getElementById('input_tip').value = ''
		document.querySelector('.output_section').parentNode.removeChild(document.querySelector('.output_section'))
	}
})



//redirects you to the history page
//there we will be able to see the calculation history of the user
document.getElementById('history_btn').addEventListener('click', () => {
	location.replace('history.html')
})



