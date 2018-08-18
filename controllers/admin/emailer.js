// Envia un correo al mail especificado.
// to -> Destinatario del correo
// subject -> Asunto del correo
// text -> Cuerpo del correo
function sendMail (context, to, subject, text) {
  return context.$axios.$post('private/email',
    {
      to,
      subject,
      text
    })
    .then(response => {
      // Log no mas por ahora...
      console.log(response.data)
    }).catch(errors => {
      // Log no mas por ahora...
      console.log(errors)
    })
}

export default {
  sendMail
}
