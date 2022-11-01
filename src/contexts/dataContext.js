import { useState, useEffect, createContext } from 'react'
import data from '../data/data.json'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
	const [comments, setComments] = useState([])
	const [user, setUser] = useState({})
	
	useEffect(() => {
		const commentStorage = JSON.parse(localStorage.getItem('comments')) || [ ...data.comments ]
		const userStorage = JSON.parse(localStorage.getItem('user')) || { ...data.currentUser }

		setComments(commentStorage)
		setUser(userStorage)
	}, [])

	return (
		<DataContext.Provider value={{ comments, user, setComments, setUser }}>
			{children}
		</DataContext.Provider>
	)
}