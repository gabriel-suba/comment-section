import { useContext } from 'react'
import { DataContext } from '../../contexts/dataContext'
import AddComment from './AddComment'
import Comment from './Comment'
import './comments.css'

const Comments = ({ handleSubmitReply, handleOpenModal }) => {
	const { posts } = useContext(DataContext)

	return (
		<div className="comments-container">
			<AddComment />
			{posts && posts.map(post => (
				<Comment 
				key={post.id}
				post={post} 
				handleSubmitReply={handleSubmitReply}
				handleOpenModal={handleOpenModal}
				/>
			))}
		</div>
	);
}

export default Comments;