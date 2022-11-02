import { useState, useRef, useContext, useEffect } from 'react'
import { DataContext } from '../../contexts/dataContext'
import { doc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db, updateDocument } from '../../fb';
import { formatDistance } from 'date-fns'
import UserReply from "../userReply/UserReply"
import Replies from '../replies/Replies'

const Comment = ({ post, handleOpenModal }) => {
	const { user } = useContext(DataContext)
	const [openReply, setOpenReply] = useState(false)
	const [content, setContent] = useState(post.content)
	const [edit, setEdit] = useState(false)
	const [replies, setReplies] = useState([])
	
	const plusRef = useRef(null)
	const minusRef = useRef(null)

	// TODO: FETCH REPLIES FROM THIS COMMENT'S DOC ID
	useEffect(() => {
		function fetchReplies() {
			const q = query(collection(db, 'replies'), where('commentId', '==', post.id), orderBy('createdAt', 'asc'));

			const unsub = onSnapshot(q, (snapshot) => {
				const temp = []
				snapshot.forEach(doc => {
					temp.push({ ...doc.data(), id: doc.id })
				})
				setReplies(temp)
			})

			return unsub
		}

		fetchReplies()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function handleChange(e) {
		const { target: { value } } = e
		setContent(value)
	}

	function handleToggleReply() {
		setOpenReply(prev => !prev)
	}

	function handleToggleEdit() {
		setEdit(prev => !prev)
	}

	async function handleUpdate(e) {
		e.preventDefault()

		const docRef = doc(db, 'posts', post.id)
		await updateDocument(docRef, { content: content })

		handleToggleEdit()
	}

	return (
		<div className="wrapper">
			<div className="comment">
				{(post.username === user.username) ? 
				<div className="btn-container">
					<div onClick={() => handleOpenModal('posts', post.id)} className="btn">
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
					className="plus-icon" 
					src="../images/icon-plus.svg" alt="an icon of a plus button" 
					/>
					<span className="text-purple vote">{post.score}</span>
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
							<source srcSet={post.image} type="image/svg" />
							<img src={post.image} alt="an icon of user" />
						</picture>
						<div className="user">
							<div className="username text-dark">{post.username}</div>
							{post.username === user.username && <div className="you">you</div>}
						</div>
						<div className="date text-gray">{formatDistance(new Date(Date.now()), new Date(post.createdAt))} ago</div>
					</div>

					{
					edit ?
					<form onSubmit={handleUpdate} className="edit-form">
						<textarea 
						className="styled-textarea text-dark" 
						rows="2"
						value={content}
						onChange={handleChange}
						/>
						<button className="submit" type="submit">Update</button>
					</form>
					:
					<div className="paragraph">
						<p className="text-gray">{post.content}</p>
					</div>
					}

				</div>
			</div>

			{replies.length > 0 && 
			<Replies 
			replies={replies}
			commentId={post.id}
			handleOpenModal={handleOpenModal}
			/> 
			}

			{openReply &&
			<UserReply
			commentId={post.id}
			toUsername={post.username}
			setOpenReply={setOpenReply}
			/>
			}
	</div>
	);
}

export default Comment;