import Reply from './Reply';
import './replies.css'

const Replies = ({ comment, user, comments, setComments, handleOpenModal }) => {
	return (
		<div className="replies-container">
			{comment.replies.map(reply => (
			<Reply 
			key={reply.id}
			comment={comment}
			reply={reply}
			user={user}
			comments={comments}
			setComments={setComments}
			handleOpenModal={handleOpenModal}
			/>
			))}
		</div>
	);
}

export default Replies;