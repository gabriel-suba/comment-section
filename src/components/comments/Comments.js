import Comment from './Comment'
import './comments.css'

const Comments = ({ comments, user, setComments, handleSubmitReply, handleOpenModal }) => {
	return (
		<div className="comments-container">
			{comments && comments.map(comment => (
				<Comment 
				key={comment.id}
				comment={comment} 
				user={user}
				comments={comments}
				setComments={setComments}
				handleSubmitReply={handleSubmitReply}
				handleOpenModal={handleOpenModal}
				/>
			))}
		</div>
	);
}

export default Comments;