import Replies from '../replies/Replies'
import UserReply from '../userReply/UserReply';
import './comments.css'

const Comments = ({ comments, user, handleOpenReply, handleSubmitReply, handleOpenModal }) => {
	return (
		<div className="comments-container">
			{comments && comments.map(comment => (
			<div className="wrapper" key={comment.id}>
				<div className="comment">
					<div className="btn-container">
						<div onClick={handleOpenReply} className="btn">
							<img className="btn-icon" src="../images/icon-reply.svg" alt="an icon of a reply button" />
							<span className="text-purple">Reply</span>
						</div>
					</div>

					<div className="vote-container">
						<img className="plus-icon" src="../images/icon-plus.svg" alt="an icon of a plus button" />
						<span className="text-purple vote">{comment.score}</span>
						<img className="minus-icon" src="../images/icon-minus.svg" alt="an icon of a minus button" />
					</div>

					<div className="body">
						<div className="user-info">
							<picture className="avatar">
								<source srcSet={comment.user.image.webp} type="image/webp" />
								<source srcSet={comment.user.image.png} type="image/png" />
								<img src={comment.user.image.png} alt="an icon of user" />
							</picture>
							<div className="user">
								<div className="username text-dark">{comment.user.username}</div>
								{comment.user.username === user.username && <div className="you">you</div>}
							</div>
							<div className="date text-gray">{comment.createdAt}</div>
						</div>
						<div className="paragraph">
							<p className="text-gray">{comment.content}</p>
						</div>
					</div>
				</div>

				{comment.replies.length > 0 && 
				<Replies 
				comment={comment} 
				user={user} 
				handleOpenReply={handleOpenReply}

				handleSubmitReply={handleSubmitReply}
				handleOpenModal={handleOpenModal}
				/> 
				}

				<UserReply 
				comment={comment} 
				toUsername={comment.user.username}
				user={user}

				handleSubmitReply={handleSubmitReply}
				/>
			</div>
			))}
		</div>
	);
}
 
export default Comments;