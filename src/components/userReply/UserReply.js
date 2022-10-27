import { useRef } from 'react'
import './userReply.css'

const UserReply = ({ comment, toUsername, user, handleSubmitReply }) => {
	const textEl = useRef(null)

	return (
		<form onSubmit={(e) => handleSubmitReply(e, comment, textEl.current.value, toUsername)} className="user-reply">
			<picture className="avatar">
				<source srcSet={user.image.webp} type="image/webp" />
				<source srcSet={user.image.png} type="image/png" />
				<img src={user.image.png} alt="an icon of user" />
			</picture>
			<textarea ref={textEl} className="text-dark" rows="5" defaultValue={`@${toUsername} `}></textarea>
			<button className="submit-reply-btn">Reply</button>
		</form>
	);
}

export default UserReply;