import { useState, useEffect, useContext } from 'react'
import { doc, collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db, updateDocument, deleteDocument } from '../../fb';
import { DataContext } from '../../contexts/dataContext'
import { formatDistance } from 'date-fns'
import UserReply from '../userReply/UserReply'

const Reply = ({ reply, commentId, handleOpenModal }) => {
	const { user } = useContext(DataContext)
	const [openReply, setOpenReply] = useState(false)
	const [content, setContent] = useState(`@${reply.replyingTo} ${reply.content} `)
	const [edit, setEdit] = useState(false)

	const [score, setScore] = useState(0)
	const [voted, setVoted] = useState(null)

	useEffect(() => {
		function fetchVotes() {
			const q = query(collection(db, 'votes'), where('docId', '==', reply.id))

			const unsub = onSnapshot(q, (snapshot) => {
				const temp = []

				snapshot.forEach(doc => {
					temp.push({ ...doc.data(), id: doc.id })
				})

				// check if user voted
				const isVoted = temp.filter(vote => vote.user === user.id)
				if (isVoted.length > 0) setVoted({ id: isVoted[0].id, upvoted: isVoted[0].upvoted })

				// check the score
				const upvotes = temp.filter(vote => vote.upvoted === true)
				const downvotes = temp.filter(vote => vote.downvoted === true)

				setScore(upvotes.length - downvotes.length)
			})

			return unsub
		}

		fetchVotes()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function handleChange(e) {
		const { target: { value } } = e
		setContent(value)
	}

	async function handleUpdate(e) {
		e.preventDefault()

		const processedContent = content.split(" ").slice(1).join(" ")
	
		const docRef = doc(db, 'replies', reply.id)
		await updateDocument(docRef, { content: processedContent })

		setEdit(prev => !prev)
	}

	async function handleVote(e) {
		const { target: { name } } = e
		
		if (voted === null) {
			const collectionRef = collection(db, 'votes')
			const payload = {
				docId: reply.id,
				user: user.id,
				upvoted: name === 'plus', 
				downvoted: name === 'minus'
			}
			
			await addDoc(collectionRef, payload)
			return
		}

		// if user already voted and clicking on the same button
		if ((voted.upvoted === true && name === 'plus') || (voted.upvoted === false && name === 'minus')) {
			deleteDocument('votes', voted.id)
			setVoted(null)
		}

		// if user upvoted and clicked on minus button
		if (voted.upvoted === true && name === 'minus') {
			const docRef = doc(db, 'votes', voted.id)
			updateDocument(docRef, { upvoted: false, downvoted: true })
		}

		// if user downvoted and clicked on plus button
		if (voted.upvoted === false && name === 'plus') {
			const docRef = doc(db, 'votes', voted.id)
			updateDocument(docRef, { upvoted: true, downvoted: false })
		}
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
					<div onClick={() => setEdit(prev => !prev)} className="btn">
						<img className="edit-icon btn-icon" src="../images/icon-edit.svg" alt="an icon of a reply button" />
						<span className="text-purple">Edit</span>
					</div>
				</div>
				:
				<div className="btn-container">
					<div onClick={() => setOpenReply(prev => !prev)} className="btn">
						<img className="reply-icon btn-icon" src="../images/icon-reply.svg" alt="an icon of a reply button" />
						<span className="icon text-purple">Reply</span>
					</div>
				</div>
				}

				<div className="vote-container">
					<img
					onClick={handleVote}
					name="plus" 
					className={`plus-icon ${voted?.upvoted === true ? 'voted' : ''}`} 
					src="../images/icon-plus.svg" 
					alt="an icon of a plus button" 
					/>
					<span className="text-purple vote">{score}</span>
					<img 
					onClick={handleVote}
					name="minus" 
					className={`minus-icon ${voted?.upvoted === false ? 'voted' : ''}`}
					src="../images/icon-minus.svg" 
					alt="an icon of a minus button" 
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
							<span className="replyingTo content-paragraph">@{reply.replyingTo}</span>
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