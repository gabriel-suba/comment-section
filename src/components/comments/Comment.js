import { useState, useRef, useContext, useEffect } from 'react'
import { DataContext } from '../../contexts/dataContext'
import UserReply from "../userReply/UserReply"
import Replies from '../replies/Replies'

const Comment = ({ comment, handleOpenModal }) => {
	const { user, comments, setComments, setUser } = useContext(DataContext)
	const [openReply, setOpenReply] = useState(false)
	
	const plusRef = useRef(null)
	const minusRef = useRef(null)

	useEffect(() => {
		const voted = user.votes.filter(item => item.id === comment.id)

		if (voted.length > 0 && voted[0]) {
			if (voted[0].upvote) {
				plusRef.current.classList.add('voted')
			} else if (voted[0].downvote) {
				minusRef.current.classList.add('voted')
			} else {
				return
			}
		}

	}, [comment.id, user])

	function handleToggleReply() {
		setOpenReply(prev => !prev)
	}

	function saveUserAndComments(modifiedUser, modifiedComment) {
		localStorage.setItem('user', JSON.stringify({ ...user, votes: [...modifiedUser] }))
		setUser(JSON.parse(localStorage.getItem('user')))

		localStorage.setItem('comments', JSON.stringify(modifiedComment))
		setComments(JSON.parse(localStorage.getItem('comments')))
	}

	function handleVote(e) { 
		const { target: { name } } = e
		
		const votedList = user.votes.filter(item => item.id === comment.id)

		// if clicking the opposite button of the voted comment
		if (votedList[0] && votedList[0].upvote && name === 'minus') {
			const modifyVote = votedList.map(i => {
				if (i.id === votedList[0].id) {
					return { ...votedList[0], upvote: false, downvote: true }
				} else {
					return i
				}
			})

			const commentTemp = comments.map(i => {
				if (i.id === comment.id) {
					return { ...comment, score: comment.score - 2 }
				} else {
					return i
				}
			})

			saveUserAndComments(modifyVote, commentTemp)

			minusRef.current.classList.add('voted')
			plusRef.current.classList.remove('voted')

			return
		} else if (votedList[0] && votedList[0].downvote && name === 'plus') {
			const modifyVote = votedList.map(i => {
				if (i.id === votedList[0].id) {
					return { ...votedList[0], upvote: true, downvote: false }
				} else {
					return i
				}
			})

			const commentTemp = comments.map(i => {
				if (i.id === comment.id) {
					return { ...comment, score: comment.score + 2 }
				} else {
					return i
				}
			})

			saveUserAndComments(modifyVote, commentTemp)

			plusRef.current.classList.add('voted')
			minusRef.current.classList.remove('voted')

			return
		} else if ((votedList[0] && votedList[0].upvote && name === 'plus') || (votedList[0] && votedList[0].downvote && name === 'minus')) {
			const votesTemp = user.votes.filter(item => item.id !== comment.id) // remove current vote

			const commentTemp = comments.map(i => {
				if (i.id === comment.id) {
					return { ...comment, score: name === 'plus' ? comment.score - 1 : comment.score + 1 }
				} else {
					return i
				}
			})

			saveUserAndComments(votesTemp, commentTemp)

			name === 'plus' ? plusRef.current.classList.remove('voted') : minusRef.current.classList.remove('voted')

			return
		} else {
			const upvoted = name === "plus"
			const votesTemp = [ ...user.votes, { id: comment.id, upvote: upvoted, downvote: !upvoted } ]

			const commentTemp = comments.map(i => {
				if (i.id === comment.id) {
					return { ...comment, score: name === "plus" ? (comment.score + 1) : (comment.score - 1) }
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
			<div className="comment">
				<div className="btn-container">
					<div onClick={handleToggleReply} className="btn">
						<img className="btn-icon" src="../images/icon-reply.svg" alt="an icon of a reply button" />
						<span className="text-purple">Reply</span>
					</div>
				</div>

				<div className="vote-container">
					<img
					ref={plusRef}
					onClick={handleVote} 
					name="plus" 
					className="plus-icon" 
					src="../images/icon-plus.svg" alt="an icon of a plus button" 
					/>
					<span className="text-purple vote">{comment.score}</span>
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