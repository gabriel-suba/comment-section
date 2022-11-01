import { forwardRef, useContext } from 'react'
import { DataContext } from '../../contexts/dataContext'
import './modal.css'

const Modal = forwardRef((props, ref) => {
	const { comments, setComments } = useContext(DataContext)
	const { selected, setSelected } = props

	function handleCloseModal() {
		ref.current.classList.toggle('open-modal')
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

	const element = (
		<div ref={ref} className="modal">
			<div className="modal-content">
				<span className="warning">Delete comment</span>
				<p>
					Are you sure you want to delete this comment?
					This will remove the comment and can't be undone.
				</p>
				<div className="modal-buttons">
					<button onClick={handleCloseModal} className="cancel-btn">no, cancel</button>
					<button onClick={handleDeleteReply} className="confirm-btn">yes, delete</button>
				</div>
			</div>
		</div>
	)

	return element
})

export default Modal;