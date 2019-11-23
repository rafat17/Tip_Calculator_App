const controller = (() => {
	let uid = null
	let email = null
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
		// User is signed in.
		uid = user.uid
		email = user.email.split('.').join('-')


		let exists = null

		firebase.database().ref('users/' + email).once('value', (snapshot) =>{
			exists = snapshot.val() !== null

			if(exists) console.log('User exists in the database !')

				else{
					firebase.database().ref('users/'+ email).set({
						default_tip: 5,
						custom_tip: null,
						history: {}
					})
				}
			})

	}
	else{
		uid = null
		window.location.replace('login.html')
	}
})

	return {
		logOut : () =>{
			firebase.auth().signOut()
		}
	}
})()


// function logOut(){
// 	firebase.auth().signOut()
// }
