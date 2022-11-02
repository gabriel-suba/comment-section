import { useState, useContext } from 'react';
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../fb';
import { DataContext } from '../../contexts/dataContext'

const AddComment = () => {
	const { user } = useContext(DataContext)
	const [post, setPost] = useState('')

	function handleChange(e) {
		const { target: { value } } = e
		setPost(value)
	}

	async function handleSubmit(e) {
		e.preventDefault()

		try {
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
				<button type="submit">Post</button>
			</form>
		</div>
	);
}

export default AddComment;