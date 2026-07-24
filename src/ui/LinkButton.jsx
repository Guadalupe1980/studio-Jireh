import { Link } from "react-router-dom";

const variants = {
  primary: "bg-rose-800 text-white hover:bg-rose-900",

  outline:
    "border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white",
};

function LinkButton({
  to,
  href,
  children,
  newTab = false,
  variant = "primary",
  className = "",
}) {
  const styles = `
    flex
    items-center
    justify-center
    gap-2
    rounded-lg
    transition
    duration-300
    ${variants[variant]}
    ${className}
  `;

  //children representa todo lo que escribes entre la etiqueta de apertura y cierre
  // Navegación interna
  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }

  // Navegación externa
  if (href) {
    return (
      <a
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={styles}
      >
        {children}
      </a>
    );
  }

  return null;
}

export default LinkButton;
