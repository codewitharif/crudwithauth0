import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const App = () => {
  const {
    loginWithRedirect,
    loginWithPopup,
    logout,
    isAuthenticated,
    user,
    getIdTokenClaims,
  } = useAuth0();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "" });
  console.log("my audience is ", import.meta.env.VITE_AUTH0_AUDIENCE);
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);

  const login = async () => {
    await loginWithPopup({
      audience: import.meta.env.VITE_AUTH0_AUDIENCE, // Pass audience dynamically here
      scope: "openid profile email",
    });
  };

  const fetchContacts = async () => {
    const token = await getIdTokenClaims();
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/contacts`,
      {
        headers: { Authorization: `Bearer ${token.__raw}` },
      }
    );
    setContacts(response.data);
  };

  const addContact = async () => {
    const token = await getIdTokenClaims();

    await axios.post(`${import.meta.env.VITE_API_URL}/contacts`, form, {
      headers: { Authorization: `Bearer ${token.__raw}` },
    });
    setForm({ name: "", phone: "" });
    fetchContacts();
  };

  if (!isAuthenticated) {
    return <button onClick={login}>Log In</button>;
  }

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log Out
      </button>

      <h2>Your Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact._id}>
            {contact.name} - {contact.phone}
          </li>
        ))}
      </ul>

      <h2>Add Contact</h2>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <button onClick={addContact}>Add</button>
    </div>
  );
};

export default App;
