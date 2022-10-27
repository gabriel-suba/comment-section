import { useState, useRef } from 'react'
import './app.css'
import data from './data/data.json'
import Comments from './components/comments/Comments'
import Modal from './components/modal/Modal'

const App = () => {
	const [selected, setSelected] = useState({ commentId: null, idToDelete: null })
	const [comments, setComments] = useState([...data.comments])
	const [user, setuser] = useState({ ...data.currentUser })

	const modalRef = useRef(null)

	function handleOpenReply(e) {
		e.target.parentNode.offsetParent.classList.toggle('open-reply')
	}

	function handleOpenModal(commentId, idToDelete) {
		modalRef.current.classList.toggle('open-modal')
		setSelected({ commentId, idToDelete })
	}

	function handleCloseModal() {
		modalRef.current.classList.toggle('open-modal')
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

	function handleSubmitReply(e, comment, content, toUsername) {
		e.preventDefault()
		
		const processedContent = content.split(" ").slice(1).join(" ") // remove the @username from the textarea
		const payload = {
			id: Math.floor(Math.random() * 100) + comment.replies.length,
			content: processedContent,
			createdAt: "1 second ago",
			score: 1,
			replyingTo: toUsername,
			user: { ...user },
		}

		const temp = comments.map(item => {
			if (item.id === comment.id) {
				return { ...item, replies: [...item.replies, payload] }
			} else {
				return item
			}
		})

		setComments(temp)

		e.target[0].value = `@${comment.user.username}`
		e.target.parentNode.firstChild.classList.toggle('open-reply')
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
				comments={comments} 
				user={user}

				handleOpenReply={handleOpenReply}
				handleSubmitReply={handleSubmitReply}
				handleOpenModal={handleOpenModal}
				/>
			</main>	
		</div>
	);
}

export default App;