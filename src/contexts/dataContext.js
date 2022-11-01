import { useState, useEffect, createContext } from 'react'
import data from '../data/data.json'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
	const [comments, setComments] = useState([])
	const user = {...data.currentUser}
	// const sample = localStorage.getItem()
	useEffect(() => {
		const commentStorage = JSON.parse(localStorage.getItem('comments')) || [...data.comments]

		setComments(commentStorage)
	}, [])

	return (
		<DataContext.Provider value={{ comments, user, setComments }}>
			{children}
		</DataContext.Provider>
	)
}