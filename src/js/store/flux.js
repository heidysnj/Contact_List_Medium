import firebase from "firebase/app";
import "firebase/firestore";

const getState = ({ getStore, setStore, getActions }) => {
	return {
		store: {
			userId: "",
			contacts: [],
			contactsFB: []
		},
		actions: {
			getUserId: userId => {
				setStore(userId);
			},
			getContactFromFB: async () => {
				try {
					const getContact = firebase.firestore().collection("newContacts");
					const response = await getContact.get();
					console.log("response", response);
					let arr = [];
					response.forEach(contact => {
						console.log("contactforEach", contact);
						arr.push({ ...contact.data(), id: contact.id });
					});
				} catch (e) {
					console.log(e);
				} finally {
					console.log("Last result", getStore().contactsFB);
				}
			},
			addContactFB: async (name, phone, email, address, id) => {
				firebase
					.firestore()
					.collection("newContacts")
					.doc(id)
					.set({
						full_name: name,
						phone: phone,
						email: email,
						address: address
					})
					.then(() => {
						console.log("Contact saved!");
					})
					.catch(error => {
						alert(error);
					})
					.then(() => getActions().getContactFromFB());
			},
			deleteContactFB(id) {
				firebase
					.firestore()
					.collection("newContacts")
					.doc(id)
					.delete()
					.then(() => {
						console.log("Document successfully deleted!");
					})
					.catch(error => {
						console.error("Error removing document: ", error);
					})
					.then(() => getActions().getContactFromFB());
			}
		}
	};
};

export default getState;
