import Reply from './Reply';
import './replies.css'

const Replies = ({ comment, handleOpenModal }) => {
	return (
		<div className="replies-container">
			{comment.replies.map(reply => (
			<Reply 
			key={reply.id}
			comment={comment}
			reply={reply}
			handleOpenModal={handleOpenModal}
			/>
			))}
		</div>
	);
}

export default Replies;