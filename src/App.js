import { useState, useRef, useContext } from 'react'
import { DataContext } from './contexts/dataContext'
import Comments from './components/comments/Comments'
import Login from './components/login/Login'
import Modal from './components/modal/Modal'
import Nav from './components/nav/Nav'
import './App.css'

const App = () => {
	const { loggedIn, loading } = useContext(DataContext)
	const [selected, setSelected] = useState({ collection: null, docId: null, replies: [] })
	const modalRef = useRef(null)

	function handleOpenModal(collection, docId, replies = []) {
		modalRef.current.classList.toggle('open-modal')
		setSelected({ collection: collection, docId: docId, replies: replies })
	}

	if (loading) return <div className="App"><div>loading...</div></div>

	if (!loggedIn) return <div className="App"><Login /></div>
	
	return (
		<div className="App">
			<Modal ref={modalRef} selected={selected} setSelected={setSelected} />
			<main className="container">
				<Comments handleOpenModal={handleOpenModal} />
			</main>
		</div>
	);
}

export default App;