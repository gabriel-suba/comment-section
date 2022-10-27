import { forwardRef } from 'react'
import './modal.css'

const Modal = forwardRef((props, ref) => {
	const element = (
		<div ref={ref} className="modal">
			<div className="modal-content">
				<span className="warning">Delete comment</span>
				<p>
					Are you sure you want to delete this comment?
					This will remove the comment and can't be undone.
				</p>
				<div className="modal-buttons">
					<button onClick={props.handleCloseModal} className="cancel-btn">no, cancel</button>
					<button onClick={props.handleDeleteReply} className="confirm-btn">yes, delete</button>
				</div>
			</div>
		</div>
	)

	return element
})

export default Modal;