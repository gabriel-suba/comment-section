import './replies.css'
import UserReply from '../userReply/UserReply'

const Replies = ({ comment, user, handleOpenReply, handleSubmitReply, handleOpenModal }) => {
	return (
		<div className="replies-container">
			{comment.replies.map(reply => (
			<div className="wrapper" key={reply.id}>
				<div className="reply">
					{(reply.user.username === user.username) ? 
					<div className="btn-container">
						<div onClick={() => handleOpenModal(comment.id, reply.id)} className="btn">
							<img className="delete-icon btn-icon" src="../images/icon-delete.svg" alt="an icon of a reply button" />
							<span className="text-red">Delete</span>
						</div>
						<div className="btn">
							<img className="edit-icon btn-icon" src="../images/icon-edit.svg" alt="an icon of a reply button" />
							<span className="text-purple">Edit</span>
						</div>
					</div>
					:
					<div className="btn-container">
						<div onClick={handleOpenReply} className="btn">
							<img className="reply-icon btn-icon" src="../images/icon-reply.svg" alt="an icon of a reply button" />
							<span className="icon text-purple">Reply</span>
						</div>
					</div>
					}

					<div className="vote-container">
						<img className="plus-icon" src="../images/icon-plus.svg" alt="an icon of a plus button" />
						<span className="text-purple vote">{reply.score}</span>
						<img className="minus-icon" src="../images/icon-minus.svg" alt="an icon of a minus button" />
					</div>

					<div className="body">
						<div className="user-info">
							<picture className="avatar">
								<source srcSet={reply.user.image.webp} type="image/webp" />
								<source srcSet={reply.user.image.png} type="image/png" />
								<img src={comment.user.image.png} alt="an icon of user" />
							</picture>
							<div className="user">
								<div className="username text-dark">{reply.user.username}</div>
								{reply.user.username === user.username && <div className="you">you</div>}
							</div>
							<div className="date text-gray">{reply.createdAt}</div>
						</div>
						<div className="paragraph">
							<p className="text-gray">
								<span className="replyingTo">@{reply.replyingTo}</span>
								{reply.content}
							</p>
						</div>
					</div>
				</div>

				{/** User reply here */}
				<UserReply 
				comment={comment}
				toUsername={reply.user.username}
				user={user}

				handleSubmitReply={handleSubmitReply}
				/>
			</div>
			))}
		</div>
	);
}

export default Replies;