import React, { useState, useEffect } from "react";

export default function Contacter() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSendMessage = async (event) => {
        event.preventDefault()

        const donnees = {
            email, 
            message
        }; 
        
        try {
            const response = fetch('http://localhost:3000/api/ContacterSupport', {
                method : 'POST', 
                credentials: 'include', 
                headers : {
                    'Content-Type' : 'application/json',
                }, 
                body : JSON.stringify(donnees),
            });
            if (response.ok) {
                const data = response.json();
                console.log(data);
            } else {
                const errorData = await response.json();
                console.log("Erreur de la réponse :", errorData.err);      
            }
        } catch (err) {
            console.error("Erreur lors de la vérification de la connexion :", err);
        }
    }




  return (
    <div className="div_generaletask">

<form class="form_container" onSubmit={handleSendMessage}>
  <p class="title">Envoyez Nous Un Message</p>
  <span class="subtitle">En cas de soucis, de question ou quoi que se soit, envoyez nous un message ici.</span>
  <div class='input_container_message_and_email'>
      <div class='input_container_email'>
          <label className='label_email_contact' for="email">Email</label>
          <input className='email_contact' id='email' type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
      </div>
      <div class='input_container_message'>
          <label className='label_message_contact' for="message">Message</label>
          <textarea className='message_contact' id='message' type='message' placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
      </div>
  </div>
  <button className='envoie_contact' type='submit'>Envoyer</button>
</form>

</div>  
)
}
