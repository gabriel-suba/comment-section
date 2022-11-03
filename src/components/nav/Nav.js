/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext } from 'react';
import { DataContext } from '../../contexts/dataContext';
import { logOut } from '../../fb';
import './nav.css'

const Nav = () => {
	const { setLoggedIn } = useContext(DataContext)

	function handleLogout() {
		logOut()
		setLoggedIn(false)
	}

	return (
		<nav>
			<div className="container nav-wrapper">
				<h1>IDLE-chat</h1>
				<ul>
					<li><a href="#">Profile</a></li>
					<li onClick={handleLogout}><a href="#">Logout</a></li>
				</ul>
			</div>
		</nav>
	);
}

export default Nav;