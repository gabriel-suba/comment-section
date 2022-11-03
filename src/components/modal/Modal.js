import { forwardRef } from 'react'
import { deleteDocument } from '../../fb'
import './modal.css'


const Modal = forwardRef((props, ref) => {
	const { selected, setSelected } = props

	function handleCloseModal() {
		ref.current.classList.toggle('open-modal')
		setSelected({ commentId: null, idToDelete: null })
	}

	async function handleDeleteReply() {
		await deleteDocument(selected.collection, selected.docId)
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