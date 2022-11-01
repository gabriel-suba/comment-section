import { useContext } from 'react'
import { DataContext } from '../../contexts/dataContext'
import Comment from './Comment'
import './comments.css'

const Comments = ({ handleSubmitReply, handleOpenModal }) => {
	const { comments } = useContext(DataContext)

	return (
		<div className="comments-container">
			{comments && comments.map(comment => (
				<Comment 
				key={comment.id}
				comment={comment} 
				handleSubmitReply={handleSubmitReply}
				handleOpenModal={handleOpenModal}
				/>
			))}
		</div>
	);
}

export default Comments;