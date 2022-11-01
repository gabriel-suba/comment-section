import { useState, useRef, useContext, useEffect } from 'react'
import { DataContext } from '../../contexts/dataContext'
import UserReply from '../userReply/UserReply'

const Reply = ({ comment, reply, handleOpenModal }) => {
	const { user, setUser, comments, setComments } = useContext(DataContext)
	const [openReply, setOpenReply] = useState(false)
	const [edit, setEdit] = useState(false)
	const textEl = useRef(null)
	const plusRef = useRef(null)
	const minusRef = useRef(null)

	useEffect(() => {
		const voted = user.votes.filter(item => item.id === reply.id)

		if (voted.length > 0 && voted[0]) {
			if (voted[0].upvote) {
				plusRef.current.classList.add('voted')
			} else if (voted[0].downvote) {
				minusRef.current.classList.add('voted')
			} else {
				return
			}
		}

	}, [reply.id, user])

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

		localStorage.setItem('comments', JSON.stringify(temp))
		setComments(JSON.parse(localStorage.getItem('comments')))

		handleToggleEdit()
	}

	function saveUserAndComments(modifiedUser, modifiedReply) {
		localStorage.setItem('user', JSON.stringify({ ...user, votes: [...modifiedUser] }))
		setUser(JSON.parse(localStorage.getItem('user')))

		localStorage.setItem('comments', JSON.stringify(modifiedReply))
		setComments(JSON.parse(localStorage.getItem('comments')))
	}

	function handleVote(e) {
		const { target: { name } } = e

		const votedList = user.votes.filter(item => item.id === reply.id)
		console.log(votedList)

		if (votedList[0] && votedList[0].upvote && name === 'minus') {
			console.log("condition 1")

			const modifyVote = votedList.map(i => {
				if (i.id === votedList[0].id) {
					return { ...votedList[0], upvote: false, downvote: true }
				} else {
					return i
				}
			})

			const commentTemp = comments.map(i => { // used on modifying reply score
				if (i.id === comment.id) {
					const replyVote = i.replies.map(j => {
						if (j.id === reply.id) {
							return { ...reply, score: reply.score - 2 }
						} else {
							return j
						}
					})

					return { ...i, replies: [...replyVote] }
				} else {
					return i
				}
			})

			saveUserAndComments(modifyVote, commentTemp)

			minusRef.current.classList.add('voted')
			plusRef.current.classList.remove('voted')

			return
		} else if (votedList[0] && votedList[0].downvote && name === 'plus') {
			console.log("condition 2")

			const modifyVote = votedList.map(i => {
				if (i.id === votedList[0].id) {
					return { ...votedList[0], upvote: true, downvote: false }
				} else {
					return i
				}
			})

			const commentTemp = comments.map(i => { // used on modifying reply score
				if (i.id === comment.id) {
					const replyVote = i.replies.map(j => {
						if (j.id === reply.id) {
							return { ...reply, score: reply.score + 2 }
						} else {
							return j
						}
					})

					return { ...i, replies: [...replyVote] }
				} else {
					return i
				}
			})

			saveUserAndComments(modifyVote, commentTemp)

			plusRef.current.classList.add('voted')
			minusRef.current.classList.remove('voted')

			return
		} else if ((votedList[0] && votedList[0].upvote && name === 'plus') || (votedList[0] && votedList[0].downvote && name === 'minus')) {
			console.log("condition 3")
			
			const votesTemp = user.votes.filter(item => item.id !== reply.id) // remove current vote

			const commentTemp = comments.map(i => { // used on modifying reply score
				if (i.id === comment.id) {
					const replyVote = i.replies.map(j => {
						if (j.id === reply.id) {
							return { ...reply, score: name === 'plus' ? reply.score - 1 : reply.score + 1 }
						} else {
							return j
						}
					})

					return { ...i, replies: [...replyVote] }
				} else {
					return i
				}
			})

			saveUserAndComments(votesTemp, commentTemp)

			name === 'plus' ? plusRef.current.classList.remove('voted') : minusRef.current.classList.remove('voted')

			return
		} else {
			console.log("condition 4")
			const upvoted = name === "plus"
			const votesTemp = [ ...user.votes, { id: reply.id, upvote: upvoted, downvote: !upvoted } ]
			
			const commentTemp = comments.map(i => { // used on modifying reply score
				if (i.id === comment.id) {
					const replyVote = i.replies.map(j => {
						if (j.id === reply.id) {
							return { ...reply, score: name === 'plus' ? reply.score + 1 : reply.score - 1 }
						} else {
							return j
						}
					})

					return { ...i, replies: [...replyVote] }
				} else {
					return i
				}
			})

			saveUserAndComments(votesTemp, commentTemp)

			return
		}
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
					<img
					ref={plusRef}
					onClick={handleVote} 
					name="plus" 
					className="plus-icon" src="../images/icon-plus.svg" 
					alt="an icon of a plus button" 
					/>
					<span className="text-purple vote">{reply.score}</span>
					<img 
					ref={minusRef}
					onClick={handleVote} 
					name="minus" 
					className="minus-icon" 
					src="../images/icon-minus.svg" alt="an icon of a minus button" 
					/>
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