import { initializeApp } from 'firebase/app'
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, updateDoc, deleteDoc, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: "AIzaSyCjIiWg2zSAtflL-Cr9WvB8lmiQQfgiRUo",
	authDomain: "blog-6c67f.firebaseapp.com",
	projectId: "blog-6c67f",
	storageBucket: "blog-6c67f.appspot.com",
	messagingSenderId: "960048697813",
	appId: "1:960048697813:web:4c96d7fcb01b7e9014ad5c"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)

export async function signUpUser(auth, email, password) {
	try {
		await createUserWithEmailAndPassword(auth, email, password)

		return { success: 'Sign Up success...' }
	} catch (err) {
		const errorCode = err.code
		const errorMessage = err.message

		return { error: { code: errorCode, msg: errorMessage } }
	}
}

export async function signInUser(auth, email, password) {
	try {
		await signInWithEmailAndPassword(auth, email, password)

		return { success: 'Sign In success...' }
	} catch (err) {
		const errorCode = err.code
		const errorMessage = err.message

		return { error: { code: errorCode, msg: errorMessage } }
	}
}

export async function updateUserProfile(user, toUpdate) {
	try {
		await updateProfile(user, toUpdate)
		await auth.currentUser.reload()
		const updatedProfile = getAuth(app)

		return { success: 'Profile updated!', currentUser: updatedProfile.currentUser }
	} catch (err) {
		const errorCode = err.code
		const errorMessage = err.message

		return { error: { code: errorCode, msg: errorMessage } }
	}
}

export async function logOut() {
	await signOut(auth)
}

export async function deleteDocument(collection, docId) {
	await deleteDoc(doc(db, collection, docId))
}

export async function updateDocument(docRef, content) {
	await updateDoc(docRef, content)
}