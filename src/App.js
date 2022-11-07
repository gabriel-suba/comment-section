import { useState, useRef, useContext } from 'react'
import { DataContext } from './contexts/dataContext'
import { logOut } from './fb'
import Comments from './components/comments/Comments'
import Login from './components/login/Login'
import Modal from './components/modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGear, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'
import './App.css'

library.add(faGear, faRightFromBracket, faUser)

const App = () => {
	const { loggedIn, loading, setLoggedIn } = useContext(DataContext)
	const [selected, setSelected] = useState({ collection: null, docId: null, replies: [] })
	const [openOption, setOpenOption] = useState(false)
	const modalRef = useRef(null)

	function handleOpenModal(collection, docId, replies = []) {
		modalRef.current.classList.toggle('open-modal')
		setSelected({ collection: collection, docId: docId, replies: replies })
	}

	function handleLogout() {
		logOut()
		setLoggedIn(false)
		setOpenOption(false)
	}

	if (loading) return <div className="App"><div>loading...</div></div>

	if (!loggedIn) return <div className="App"><Login /></div>
	
	return (
		<div className="App">
			<div onClick={handleLogout} className="logout-btn container"><FontAwesomeIcon icon="fa-solid fa-right-from-bracket" /> Logout</div>
			<Modal ref={modalRef} selected={selected} setSelected={setSelected} />
			<main className="container">
				<Comments handleOpenModal={handleOpenModal} />
			</main>
		</div>
	);
}

export default App;