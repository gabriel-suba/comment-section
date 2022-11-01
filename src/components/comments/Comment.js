import { useState, useContext } from 'react'
import { DataContext } from '../../contexts/dataContext'
import UserReply from "../userReply/UserReply"
import Replies from '../replies/Replies'

const Comment = ({ comment, handleOpenModal }) => {
	const { user, comments, setComments } = useContext(DataContext)
	const [openReply, setOpenReply] = useState(false)

	function handleToggleReply() {
		setOpenReply(prev => !prev)
	}

	function handleVote(e) {
		const { target: { name } } = e
		
		const operation = name === "plus" ? (comment.score + 1) : (comment.score - 1)
		const temp = comments.map(i => {
			if (i.id === comment.id) {
				return { ...i, score: operation }
			} else {
				return i
			}
		})
		
		localStorage.setItem('comments', JSON.stringify(temp))
		setComments(JSON.parse(localStorage.getItem('comments')))
	}

	return (
		<div className="wrapper">
			<div className="comment">
				<div className="btn-container">
					<div onClick={handleToggleReply} className="btn">
						<img className="btn-icon" src="../images/icon-reply.svg" alt="an icon of a reply button" />
						<span className="text-purple">Reply</span>
					</div>
				</div>

				<div className="vote-container">
					<img onClick={handleVote} name="plus" className="plus-icon" src="../images/icon-plus.svg" alt="an icon of a plus button" />
					<span className="text-purple vote">{comment.score}</span>
					<img onClick={handleVote} name="minus" className="minus-icon" src="../images/icon-minus.svg" alt="an icon of a minus button" />
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
			handleOpenModal={handleOpenModal}
			/> 
			}

			{openReply &&
			<UserReply 
			comment={comment} 
			toUsername={comment.user.username}
			setOpenReply={setOpenReply}
			/>
			}
	</div>
	);
}

export default Comment;