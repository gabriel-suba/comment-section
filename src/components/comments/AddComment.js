import { useState, useContext } from 'react';
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../fb';
import { DataContext } from '../../contexts/dataContext'

const AddComment = () => {
	const { user } = useContext(DataContext)
	const [post, setPost] = useState('')
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	function handleChange(e) {
		const { target: { value } } = e
		setPost(value)
	}

	async function handleSubmit(e) {
		e.preventDefault()

		if (post.length <=0) {
			setError('Text cannot be empty')
			return
		}
		
		try {
			setLoading(true)
			const collectionRef = collection(db, 'posts')
			const payload = {
				content: post,
				createdAt: Date.now(),
				score: 1,
				user: user.id,
				username: user.username,
				image: user.image.svg,
			}
			await addDoc(collectionRef, payload)
			setPost('')
			setError(null)
			setLoading(false)
		} catch (err) {
			console.error('Error adding document: ', err)
		}
	}

	return (
		<div className="add-comment">
			<div className="user-details">
				<img src={user.image.svg} alt="an icon of the user" />
				<span className="text-dark">{user.username}</span>
			</div>
			<form onSubmit={handleSubmit}>
				<textarea 
				className="styled-textarea text-dark" 
				rows="2" 
				placeholder="What's on your mind?"
				onChange={handleChange}
				value={post}
				/>
				{ error && <span className="text-red">{error}</span> }
				<button type="submit" disabled={loading}>Post</button>
			</form>
		</div>
	);
}

export default AddComment;