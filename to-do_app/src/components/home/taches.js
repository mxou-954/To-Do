import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Taches() {
  const { tacheId } = useParams();
  const [tache, setTache] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const fetchTache = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/taches/${tacheId}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch task details');
        }
        const data = await response.json();
        setTache(data);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };


    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tache/message/${tacheId}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const messages = await response.json();
        setChat(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchTache();
    fetchMessages();
  }, [tacheId]);

  const handleMessage = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/tache/message/${tacheId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setChat([...chat, newMessage]); // Add new message to chat array
        setMessage(''); // Clear message input after sending
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la modification au backend", error);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/delete/${tacheId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

    if (response.ok) {
      setTache()
    } else {
      throw new Error('Failed to delete task');
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la modification au backend", error);
  }
  }

  return (
    <div className='mid'>
     <div className='chat'>
        <form onSubmit={handleMessage}>
          <input
            className='chatbox'
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button type='submit' className='sendMessage'>Envoyer</button>
        </form>
        <div className='messages'>
          {chat.map((msg, index) => (
            <div key={index}>
              <p>{msg.utilisateur.username}: {msg.message}</p>
            </div>
          ))}
        </div>
        </div>



      {tache ? (
        <div>
          <h1>{tache.objet}</h1>
          <p>{tache.description}</p>
          <p>Date de début: {tache.date_debut}</p>
      <p>Date de fin: {tache.date_fin}</p>
      <p>Importance: {tache.importance}</p>
      <Link to={'/Home'}><button onClick={handleDelete}>Delete</button></Link>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default Taches;
