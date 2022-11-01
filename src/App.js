import { useState, useRef } from 'react'
import { DataProvider } from './contexts/dataContext'
import Comments from './components/comments/Comments'
import Modal from './components/modal/Modal'
import './app.css'

const App = () => {
	const [selected, setSelected] = useState({ commentId: null, idToDelete: null })
	const modalRef = useRef(null)

	function handleOpenModal(commentId, idToDelete) {
		modalRef.current.classList.toggle('open-modal')
		setSelected({ commentId, idToDelete })
	}
	
	return (
		<div className="App">
			<DataProvider>
				<Modal ref={modalRef} selected={selected} setSelected={setSelected} />
				<main className="container">
					<Comments handleOpenModal={handleOpenModal} />
				</main>
			</DataProvider>
		</div>
	);
}

export default App;