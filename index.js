const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp({ databaseURL: "https://secret-mailbox-a73ab-default-rtdb.firebaseio.com" });

exports.onMessageApproved = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if(req.method === 'OPTIONS'){ res.status(204).send(''); return; }

  const messageId = req.body.messageId;
  if(!messageId){ res.status(400).json({error: 'messageId required'}); return; }

  const msgSnap = await admin.database().ref('/postman_messages/'+messageId).once('value');
  if(!msgSnap.exists()){ res.status(404).json({error: 'message not found'}); return; }

  const msg = msgSnap.val();
  const toKey = msg.toKey;

  const tokenSnap = await admin.database().ref('/postman_tokens/'+toKey).once('value');
  if(!tokenSnap.exists()){ res.status(200).json({sent: 0, reason: 'no tokens'}); return; }

  const tokens = Object.keys(tokenSnap.val());
  let sent = 0;
  
  for(const token of tokens){
    try{
      await admin.messaging().send({
        token: token,
        notification: { 
          title: "📬 مِداد", 
          body: msg.toName ? "وصلتك رسالة يا " + msg.toName + "!" : "وصلتك رسالة جديدة!"
        }
      });
      sent++;
    }catch(err){
      console.log("Token error, removing:", token, err.message);
      // حذف الـ token القديم تلقائياً
      await admin.database().ref('/postman_tokens/'+toKey+'/'+token).remove();
    }
  }
  
  res.status(200).json({sent: sent, total: tokens.length});
});
