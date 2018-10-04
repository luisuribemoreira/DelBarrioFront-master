// Envia un correo al mail especificado.
// to -> Destinatario del correo
// subject -> Asunto del correo
// text -> Cuerpo del correo
function sendMail (context, to, subject, text) {
  return context.$axios.$post('/email',
    {
      to,
      subject,
      text
    })
    .then(response => {
      context.$notify.success('Correo enviado correctamente.')
    }).catch(errors => {
      context.$notify.danger('Ha ocurrido un error inesperado enviando su correo.')
    })
}

export default {
  sendMail
}
