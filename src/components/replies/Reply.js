import { useState, useRef, useContext } from 'react'
import { doc } from 'firebase/firestore'
import { db, updateDocument } from '../../fb'
import { DataContext } from '../../contexts/dataContext'
import { formatDistance } from 'date-fns'
import UserReply from '../userReply/UserReply'

const Reply = ({ reply, commentId, handleOpenModal }) => {
	const { user } = useContext(DataContext)
	const [openReply, setOpenReply] = useState(false)
	const [content, setContent] = useState(`@${reply.replyingTo} ${reply.content} `)
	const [edit, setEdit] = useState(false)
	const plusRef = useRef(null)
	const minusRef = useRef(null)

	// useEffect(() => {
	// 	const voted = user.votes.filter(item => item.id === reply.id)

	// 	if (voted.length > 0 && voted[0]) {
	// 		if (voted[0].upvote) {
	// 			plusRef.current.classList.add('voted')
	// 		} else if (voted[0].downvote) {
	// 			minusRef.current.classList.add('voted')
	// 		} else {
	// 			return
	// 		}
	// 	}

	// }, [reply.id, user])

	function handleChange(e) {
		const { target: { value } } = e
		setContent(value)
	}

	function handleToggleEdit() {
		setEdit(prev => !prev)
	}

	function handleToggleReply() {
		setOpenReply(prev => !prev)
	}

	async function handleUpdate(e) {
		e.preventDefault()

		const processedContent = content.split(" ").slice(1).join(" ")
	
		const docRef = doc(db, 'replies', reply.id)
		await updateDocument(docRef, { content: processedContent })

		handleToggleEdit()
	}

	return (
		<div className="wrapper">
			<div className={`reply ${openReply ? 'open-reply' : ''}`}>
				{(reply.username === user.username) ? 
				<div className="btn-container">
					<div onClick={() => handleOpenModal('replies', reply.id)} className="btn">
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
					<img
					ref={plusRef}
					name="plus" 
					className="plus-icon" src="../images/icon-plus.svg" 
					alt="an icon of a plus button" 
					/>
					<span className="text-purple vote">{reply.score}</span>
					<img 
					ref={minusRef}
					name="minus" 
					className="minus-icon" 
					src="../images/icon-minus.svg" alt="an icon of a minus button" 
					/>
				</div>

				<div className="body">
					<div className="user-info">
						<picture className="avatar">
							<source srcSet={reply.image} type="image/svg" />
							<img src={reply.image} alt="an icon of user" />
						</picture>
						<div className="user">
							<div className="username text-dark">{reply.username}</div>
							{reply.username === user.username && <div className="you">you</div>}
						</div>
						<div className="date text-gray">{formatDistance(new Date(Date.now()), new Date(reply.createdAt))} ago</div>
					</div>
					{
					edit ?
					<form onSubmit={handleUpdate} className="edit-form">
						<textarea 
						className="styled-textarea text-dark" 
						rows="2"
						value={content}
						onChange={handleChange}
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
			commentId={commentId}
			toUsername={reply.username}
			setOpenReply={setOpenReply}
			/>
			}
		</div>
	);
}

export default Reply;