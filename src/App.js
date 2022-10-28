import { useState, useRef } from 'react'
import data from './data/data.json'
import Comments from './components/comments/Comments'
import Modal from './components/modal/Modal'
import './app.css'

const App = () => {
	const [selected, setSelected] = useState({ commentId: null, idToDelete: null })
	const [comments, setComments] = useState([...data.comments])
	const [user, setuser] = useState({ ...data.currentUser })

	const modalRef = useRef(null)

	function handleOpenModal(commentId, idToDelete) {
		modalRef.current.classList.toggle('open-modal')
		setSelected({ commentId, idToDelete })
	}

	function handleCloseModal() {
		modalRef.current.classList.toggle('open-modal')
		setSelected({ commentId: null, idToDelete: null })
	}

	function handleDeleteReply() {
		const temp = comments.map(item => {
			if (item.id === selected.commentId) {
				const replies = item.replies.filter(i => i.id !== selected.idToDelete)
				return { ...item, replies: [...replies] }
			} else {
				return item
			}
		})

		setComments(temp)
		handleCloseModal()
	}
	
	return (
		<div className="App">
			<Modal
			ref={modalRef} 
			handleCloseModal={handleCloseModal}
			handleDeleteReply={handleDeleteReply}
			/>
			<main className="container">
				<Comments
				user={user}
				comments={comments} 
				setComments={setComments}
				handleOpenModal={handleOpenModal}
				/>
			</main>	
		</div>
	);
}

export default App;