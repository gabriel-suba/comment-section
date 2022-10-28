import { useRef } from 'react'
import './userReply.css'

const UserReply = ({ comment, toUsername, user, comments, setComments, setOpenReply }) => {
	const textEl = useRef(null)

	function handleSubmitReply(e) {
		e.preventDefault()

		const processedContent = textEl.current.value.split(" ").slice(1).join(" ")
		const payload = {
			id: Math.floor(Math.random() * 100) + comment.replies.length,
			content: processedContent,
			createdAt: "1 second ago",
			score: 1,
			replyingTo: toUsername,
			user: { ...user },
		}

		const temp = comments.map(item => {
			if (item.id === comment.id) {
				return { ...item, replies: [...item.replies, payload] }
			} else {
				return item
			}
		})

		setComments(temp)
		
		textEl.current.value = `@${comment.user.username}`
		setOpenReply(prev => !prev)
	}

	return (
		<form onSubmit={handleSubmitReply} className="user-reply">
			<picture className="avatar">
				<source srcSet={user.image.webp} type="image/webp" />
				<source srcSet={user.image.png} type="image/png" />
				<img src={user.image.png} alt="an icon of user" />
			</picture>
			<textarea ref={textEl} className="styled-textarea text-dark" rows="5" defaultValue={`@${toUsername} `}></textarea>
			<button className="submit-reply-btn">Reply</button>
		</form>
	);
}

export default UserReply;