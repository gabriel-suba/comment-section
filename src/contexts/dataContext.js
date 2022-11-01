import { useState, createContext } from 'react'
import data from '../data/data.json'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
	const [comments, setComments] = useState([...data.comments])
	const user = {...data.currentUser}

	return (
		<DataContext.Provider value={{ comments, user, setComments }}>
			{children}
		</DataContext.Provider>
	)
}