import Reply from './Reply';
import './replies.css'

const Replies = ({ replies, commentId, handleOpenModal }) => {
	return (
		<div className="replies-container">
			{replies.map(reply => (
			<Reply 
			key={reply.id}
			reply={reply}
			commentId={commentId}
			handleOpenModal={handleOpenModal}
			/>
			))}
		</div>
	);
}

export default Replies;