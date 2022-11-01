import { useState, useRef, useContext } from 'react'
import { DataContext } from '../../contexts/dataContext'
import UserReply from '../userReply/UserReply'

const Reply = ({ comment, reply, handleOpenModal }) => {
	const { user, comments, setComments } = useContext(DataContext)
	const [openReply, setOpenReply] = useState(false)
	const [edit, setEdit] = useState(false)
	const textEl = useRef(null)

	function handleToggleEdit() {
		setEdit(prev => !prev)
	}

	function handleToggleReply() {
		setOpenReply(prev => !prev)
	}

	function handleUpdate(e) {
		e.preventDefault()

		const processedContent = textEl.current.value.split(" ").slice(1).join(" ")
		const temp = comments.map(i => {
			if (i.id === comment.id) {
				const toUpdate = i.replies.map(j => {
					if (j.id === reply.id) {
						return { ...j, content: processedContent }
					} else {
						return j
					}
				})
				
				return { ...i, replies: [...toUpdate] }
			} else {
				return i
			}
		})

		setComments(temp)
		handleToggleEdit()
	}

	function handleVote(e) {
		const { target: { name } } = e
		
		
		const temp = comments.map(i => {
			if (i.id === comment.id) {
				const toUpdate = i.replies.map(j => {
					if (j.id === reply.id) {
						const operation = name === "plus" ? (j.score + 1) : (j.score - 1)
						return { ...j, score: operation }
					} else {
						return j
					}
				})
				
				return { ...i, replies: [...toUpdate] }
			} else {
				return i
			}
		})

		setComments(temp)
	}

	return (
		<div className="wrapper">
			<div className={`reply ${openReply ? 'open-reply' : ''}`}>
				{(reply.user.username === user.username) ? 
				<div className="btn-container">
					<div onClick={() => handleOpenModal(comment.id, reply.id)} className="btn">
						<img className="delete-icon btn-icon" src="../images/icon-delete.svg" alt="an icon of a reply button" />
						<span className="text-red">Delete</span>
					</div>
					<div onClick={handleToggleEdit} className="btn">
						<img className="edit-icon btn-icon" src="../images/icon-edit.svg" alt="an icon of a reply button" />
						<span className="text-purple">Edit</span>
					</div>
				</div>
				:
				<div className="btn-container">
					<div onClick={handleToggleReply} className="btn">
						<img className="reply-icon btn-icon" src="../images/icon-reply.svg" alt="an icon of a reply button" />
						<span className="icon text-purple">Reply</span>
					</div>
				</div>
				}

				<div className="vote-container">
					<img onClick={handleVote} name="plus" className="plus-icon" src="../images/icon-plus.svg" alt="an icon of a plus button" />
					<span className="text-purple vote">{reply.score}</span>
					<img onClick={handleVote} name="minus" className="minus-icon" src="../images/icon-minus.svg" alt="an icon of a minus button" />
				</div>

				<div className="body">
					<div className="user-info">
						<picture className="avatar">
							<source srcSet={reply.user.image.webp} type="image/webp" />
							<source srcSet={reply.user.image.png} type="image/png" />
							<img src={reply.user.image.png} alt="an icon of user" />
						</picture>
						<div className="user">
							<div className="username text-dark">{reply.user.username}</div>
							{reply.user.username === user.username && <div className="you">you</div>}
						</div>
						<div className="date text-gray">{reply.createdAt}</div>
					</div>
					{
						edit ?
						<form onSubmit={handleUpdate} className="edit-form">
							<textarea 
							ref={textEl} 
							className="styled-textarea text-dark" 
							rows="5"
							defaultValue={`@${reply.replyingTo} ${reply.content} `}
							>
							</textarea>
							<button className="submit" type="submit">Update</button>
						</form>
						:
						<div className="paragraph">
							<p className="text-gray">
								<span className="replyingTo">@{reply.replyingTo}</span>
								{reply.content}
							</p>
						</div>
					}
				</div>
			</div>
			
			{openReply &&
			<UserReply 
			comment={comment}
			toUsername={reply.user.username}
			user={user}
			comments={comments}
			setComments={setComments}
			setOpenReply={setOpenReply}
			/>
			}
		</div>
	);
}

export default Reply;