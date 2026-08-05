function FloatingWhatsApp() {
  const phoneNumber = "529142797596";

  //Mensaje automático
  const message = encodeURIComponent(
    "Hola, quiero recibir información sobre los servicios de Estudio de Belleza Jireh.",
  );

  //Construcción del enlace
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
      className="
        fixed bottom-5 right-5 z-50
        flex h-14 w-14 items-center justify-center
        rounded-full bg-green-500 text-white
        shadow-lg transition duration-300
        hover:scale-110 hover:bg-green-600
        focus:outline-none focus:ring-4 focus:ring-green-200
        md:bottom-7 md:right-7 md:h-16 md:w-16
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-8 w-8 md:h-9 md:w-9"
        aria-hidden="true"
      >
        <path d="M19.11 17.44c-.29-.15-1.72-.85-1.98-.95-.27-.1-.46-.15-.66.15-.19.29-.75.95-.92 1.14-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.37-.02-.51-.08-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.2 3.03c.15.19 2.06 3.15 5 4.42.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.27.17-1.39-.07-.12-.27-.19-.56-.34Z" />

        <path d="M16.03 3.2c-7.05 0-12.78 5.67-12.78 12.65 0 2.23.59 4.41 1.7 6.32L3.15 28.8l6.82-1.78a12.9 12.9 0 0 0 6.06 1.53c7.05 0 12.78-5.67 12.78-12.65S23.08 3.2 16.03 3.2Zm0 23.22c-1.88 0-3.72-.5-5.33-1.45l-.38-.22-4.05 1.06 1.08-3.93-.25-.4a10.45 10.45 0 0 1-1.61-5.63c0-5.81 4.73-10.53 10.54-10.53s10.54 4.72 10.54 10.53-4.73 10.57-10.54 10.57Z" />
      </svg>

      {/* Efecto de pulso */}
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-400 opacity-30" />
    </a>
  );
}

export default FloatingWhatsApp;
