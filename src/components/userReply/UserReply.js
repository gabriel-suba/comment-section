import { useState, useContext } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../fb'
import { DataContext } from '../../contexts/dataContext'
import './userReply.css'

const UserReply = ({ commentId, toUsername, setOpenReply }) => {
	const { user } = useContext(DataContext)
	const [content, setContent] = useState(`@${toUsername} `)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	function handleChange(e) {
		const { target: { value } } = e
		setContent(value)
	}

	async function handleSubmitReply(e) {
		e.preventDefault()

		const processedContent = content.split(" ").slice(1).join(" ")

		if (processedContent.length <=0) {
			setError('Text cannot be empty')
			return
		}

		try {
			setLoading(true)

			const payload = {
				commentId: commentId,
				content: processedContent,
				replyingTo: toUsername,
				score: 1,
				createdAt: Date.now(),
				user: user.id,
				username: user.username,
				image: user.image.svg,
			}

			const collectionRef = collection(db, 'replies')
			await addDoc(collectionRef, payload)

			setContent(`@${toUsername} `)
			setError(null)
			setLoading(false)
			setOpenReply(prev => !prev)
		} catch (err) {
			console.error('Error adding document: ', err);
		}
	}

	return (
		<form onSubmit={handleSubmitReply} className="user-reply">
			<picture className="avatar">
				<source srcSet={user.image.svg} type="image/svg" />
				<img src={user.image.svg} alt="an icon of user" />
			</picture>
			<textarea 
			className="styled-textarea text-dark" 
			rows="5" 
			onChange={handleChange}
			value={content} 
			/>
			{ error && <span className="text-red">{error}</span> }
			<button className="submit-reply-btn" disabled={loading}>Reply</button>
		</form>
	);
}

export default UserReply;