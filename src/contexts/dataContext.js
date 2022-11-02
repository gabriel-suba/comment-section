import { useState, useEffect, createContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { auth, db } from '../fb'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
	const [posts, setPosts] = useState([])
	const [user, setUser] = useState({})
	const [loggedIn, setLoggedIn] = useState(false)
	const [loading, setLoading] = useState(false)
	
	useEffect(() => {
		function authObserver() {
			const unsub = onAuthStateChanged(auth, user => {
				if (user) {
					const currentUser = {
						'image': {
							'svg': user.photoURL,
						},
						'username': user.displayName,
						'id': user.uid,
						'votes': []
					}
	
					setUser(currentUser)
					setLoggedIn(true)
				}
			})
	
			return unsub
		}

		function fetchPosts() {
			const q = query(collection(db, "posts"), orderBy('createdAt', 'desc'));
			setLoading(true)

			const unsub = onSnapshot(q, (snapshot) => {
				const temp = []
				snapshot.forEach(doc => {
					temp.push({ ...doc.data(), id: doc.id })
				})
				setPosts(temp)
			})
			setLoading(false)

			return unsub
		}

		authObserver()
		fetchPosts()
	}, [])

	return (
		<DataContext.Provider value={{ posts, user, loggedIn, loading, setPosts, setUser }}>
			{children}
		</DataContext.Provider>
	)
}