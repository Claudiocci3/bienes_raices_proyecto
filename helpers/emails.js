import nodemailer from 'nodemailer'



const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6d22b0af1ebfb5",
          pass: "77e1fcaa2a937b"
        }
      });

      const { email, nombre, token } = datos
      //enviar email
      await transport.sendMail({
        from: 'bienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en bienes raices',
        text: 'confirma tu cuenta hno',
        html: `
            <p>Hola ${nombre}, por favor confirma tu cuenta</p>
            <p>Tu cuenta esta lista bro apreta click en el siguiente link
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a> </p>

            <p>Si no creaste esta cuenta ignora el mensaje</p>
        `
      })
}

export {
    emailRegistro
}