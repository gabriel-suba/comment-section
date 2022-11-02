import { useState, useContext } from 'react';
import { DataContext } from '../../contexts/dataContext';
import { auth, signUpUser, signInUser, updateUserProfile, db } from '../../fb';
import { collection, addDoc } from 'firebase/firestore';
import './login.css'

const Login = () => {
	const { setUser } = useContext(DataContext)
	const [newUser, setNewuser] = useState(false)
	const [userDetails, setUserDetails] = useState({ email: '', username: '', password: '' })
	const [error, setError] = useState({ msg: null })

	function handleToggleNewUser() {
		setNewuser(prev => !prev)
	}

	function handleInputChange(e) {
		const { target: { name, value } } = e
		setUserDetails(prev => ({ ...prev, [name]: value }))
	}

	async function handleSubmit(e) {
		e.preventDefault()

		if (newUser) {
			const { error, success } = await signUpUser(auth, userDetails.email, userDetails.password)

			if (error) setError({ msg: error.msg })

			if (success) {
				// update user's username and photo url immidiately after sign up
				const dicebearURL = `https://avatars.dicebear.com/api/avataaars/${Date.now()}.svg`
				const updatePayload = { displayName: userDetails.username, photoURL: dicebearURL }

				// reload user's auth to force re-render user's state
				const { currentUser } = await updateUserProfile(auth.currentUser, updatePayload)
				setUser({
					'image': {
						'svg': currentUser.photoURL,
					},
					'username': currentUser.displayName,
					'id': currentUser.uid,
					'votes': []
				})

				// store user details to db
				const userPayload = { username: userDetails.username, image: dicebearURL }
				const collectionRef = collection(db, 'users')
				await addDoc(collectionRef, userPayload)
			}
		} 
		
		if (!newUser) {
			const { error } = await signInUser(auth, userDetails.email, userDetails.password)

			if (error) setError({ msg: error.msg })
		}
	}

	return (
		<div className="login-container">
			<form onSubmit={handleSubmit} className="flex-col">
				<div className="input-group flex-col">
					<label htmlFor="email">Email</label>
					<input onChange={handleInputChange} type="text" name="email" value={userDetails.email} />
				</div>
				{ newUser && 
				<div className="input-group flex-col">
					<label htmlFor="username">Username</label>
					<input onChange={handleInputChange} type="text" name="username" value={userDetails.username} />
				</div>
				}
				<div className="input-group flex-col">
					<label htmlFor="password">Password</label>
					<input onChange={handleInputChange} type="password" name="password" value={userDetails.password} />
				</div>

				<button type="submit">{newUser ? "Sign Up" : "Log In"}</button>
				{ error !== null && <span className="error text-red">{error.msg}</span> }
			</form>
			<span onClick={handleToggleNewUser}>{newUser ? "Log In" : "Sign Up"}</span>
		</div>
	);
}

export default Login;